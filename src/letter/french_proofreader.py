from __future__ import annotations

from difflib import SequenceMatcher
from pathlib import Path
import re
import tempfile
import unicodedata
from xml.etree import ElementTree
from zipfile import ZIP_DEFLATED, ZipFile


COMMON_TYPO_CORRECTIONS = {
    "devellopper": "développeur",
    "develloppeur": "développeur",
    "develloppement": "développement",
    "hortographe": "orthographe",
    "motivassion": "motivation",
    "ortographe": "orthographe",
    "portflio": "portfolio",
    "pubblicité": "publicité",
}

ALLOWED_PROFESSIONAL_TERMS = {
    "adv",
    "ats",
    "ecommerce",
    "erp",
    "fiabilisé",
    "fiabiliser",
    "impacte",
    "kpi",
    "reporting",
    "sap",
    "workspace",
}


def apply_known_french_corrections(value):
    if isinstance(value, dict):
        return {key: apply_known_french_corrections(item) for key, item in value.items()}
    if isinstance(value, list):
        return [apply_known_french_corrections(item) for item in value]
    if isinstance(value, tuple):
        return tuple(apply_known_french_corrections(item) for item in value)
    if not isinstance(value, str):
        return value

    corrected = _apply_safe_text_corrections(value)
    corrected = re.sub(r"[ \t]{2,}", " ", corrected)
    return corrected


def _apply_safe_text_corrections(value: str) -> str:
    corrected = value.replace("*", "")
    for typo, replacement in COMMON_TYPO_CORRECTIONS.items():
        corrected = re.sub(
            rf"\b{re.escape(typo)}\b",
            lambda match: _preserve_case(match.group(0), replacement),
            corrected,
            flags=re.IGNORECASE,
        )
    corrected = re.sub(r"\s+,", ",", corrected)
    return corrected


def check_french_text(text: str, allowed_terms=()) -> dict:
    issues = _known_typo_issues(text)
    issues.extend(_punctuation_issues(text))
    issues.extend(_dictionary_issues(text, allowed_terms))
    return {
        "status": "success" if not issues else "failed",
        "language": "fr",
        "issues": issues,
    }


def enforce_french_docx(
    docx_path: str | Path,
    *,
    artifact_label: str,
    allowed_terms=(),
) -> dict:
    path = Path(docx_path)
    _apply_safe_docx_corrections(path)
    report = check_french_text(_extract_docx_text(path), allowed_terms=allowed_terms)
    if report["status"] == "success":
        return report

    path.unlink(missing_ok=True)
    details = "; ".join(
        f"{issue['text']} -> {issue['suggestion']} ({issue['rule']})"
        for issue in report["issues"]
    )
    adjective = "bloquée" if artifact_label.casefold() == "lm" else "bloqué"
    raise RuntimeError(
        f"{artifact_label} {adjective} par le contrôle linguistique final : {details}"
    )


def _apply_safe_docx_corrections(path: Path) -> None:
    document_parts = re.compile(
        r"^word/(?:document|header\d+|footer\d+|footnotes|endnotes|comments)\.xml$"
    )
    with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as temporary:
        temporary_path = Path(temporary.name)

    try:
        with ZipFile(path) as source, ZipFile(temporary_path, "w", ZIP_DEFLATED) as destination:
            for info in source.infolist():
                content = source.read(info.filename)
                if document_parts.match(info.filename):
                    text = content.decode("utf-8")
                    content = _apply_safe_text_corrections(text).encode("utf-8")
                destination.writestr(info, content)
        temporary_path.replace(path)
    finally:
        temporary_path.unlink(missing_ok=True)


def _extract_docx_text(path: Path) -> str:
    document_parts = re.compile(
        r"^word/(?:document|header\d+|footer\d+|footnotes|endnotes|comments)\.xml$"
    )
    text_nodes: list[str] = []
    with ZipFile(path) as archive:
        for name in archive.namelist():
            if not document_parts.match(name):
                continue
            root = ElementTree.fromstring(archive.read(name))
            text_nodes.extend(
                node.text
                for node in root.iter()
                if node.tag.endswith("}t") and node.text
            )
    return "\n".join(text_nodes)


def _known_typo_issues(text: str) -> list[dict]:
    issues = []
    for match in re.finditer(r"[^\W\d_]+(?:['’-][^\W\d_]+)*", text or "", flags=re.UNICODE):
        for word in re.split(r"['’-]", match.group(0)):
            replacement = COMMON_TYPO_CORRECTIONS.get(_normalize_word(word))
            if replacement:
                issues.append(_issue(word, replacement, "known_typo"))
    return issues


def _punctuation_issues(text: str) -> list[dict]:
    issues = []
    if re.search(r"\s+,", text or ""):
        issues.append(_issue("espace avant virgule", "supprimer l'espace", "punctuation"))
    if re.search(r"([!?;,])\1{2,}", text or ""):
        issues.append(_issue("ponctuation répétée", "utiliser une ponctuation simple", "punctuation"))
    return issues


def _dictionary_issues(text: str, allowed_terms) -> list[dict]:
    try:
        from spellchecker import SpellChecker
    except ImportError:
        return [_issue("correcteur indisponible", "installer pyspellchecker", "checker_unavailable")]

    allowed = {_normalize_word(term) for term in ALLOWED_PROFESSIONAL_TERMS}
    allowed.update(_allowed_words(allowed_terms))
    spell = SpellChecker(language="fr", distance=1)
    issues = []
    seen = set()

    for match in re.finditer(r"[^\W\d_]+(?:['’-][^\W\d_]+)*", text or "", flags=re.UNICODE):
        original = match.group(0)
        word = _normalize_word(original)
        if len(word) < 4:
            continue
        if word in seen or word in allowed or word in spell:
            continue
        if original[:1].isupper() or original.isupper():
            continue
        correction = spell.correction(word)
        if not correction or correction == word:
            continue
        similarity = SequenceMatcher(None, word, correction).ratio()
        if similarity < 0.93:
            continue
        seen.add(word)
        issues.append(_issue(original, correction, "possible_spelling_error"))
    return issues


def _allowed_words(values) -> set[str]:
    if isinstance(values, dict):
        values = values.values()
    if isinstance(values, str):
        values = [values]

    words = set()
    for value in values or []:
        if isinstance(value, (dict, list, tuple, set)):
            words.update(_allowed_words(value))
            continue
        words.update(
            _normalize_word(word)
            for word in re.findall(r"[^\W\d_]+(?:['’-][^\W\d_]+)*", str(value), flags=re.UNICODE)
        )
    return words


def _normalize_word(word: str) -> str:
    normalized = unicodedata.normalize("NFKC", str(word or "")).casefold()
    return normalized.replace("’", "'").strip("'")


def _preserve_case(source: str, replacement: str) -> str:
    if source.isupper():
        return replacement.upper()
    if source[:1].isupper():
        return replacement[:1].upper() + replacement[1:]
    return replacement


def _issue(word: str, suggestion: str, rule: str) -> dict:
    return {"rule": rule, "text": word, "suggestion": suggestion}
