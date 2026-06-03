from __future__ import annotations

import re


def sanitize_letter_result(letter_result: dict, cv_markdown: str) -> dict:
    """Normalize common model slips before deterministic validation."""
    sanitized = dict(letter_result)
    final_letter = str(sanitized.get("final_letter", "") or "")
    final_letter = _replace_mastery_phrasing(final_letter)
    final_letter = _replace_absent_tool_claims(final_letter, sanitized, cv_markdown)
    sanitized["final_letter"] = final_letter.strip()
    sanitized["cv_technical_terms_reused"] = _filter_absent_terms(
        sanitized.get("cv_technical_terms_reused", []),
        cv_markdown,
    )
    return sanitized


def _replace_mastery_phrasing(text: str) -> str:
    replacements = [
        (r"\bma\s+ma[îi]trise\s+des\s+outils\b", "mon utilisation des outils"),
        (r"\bma\s+ma[îi]trise\s+de\b", "mon utilisation de"),
        (r"\bma\s+ma[îi]trise\b", "ma pratique"),
        (r"\bma[îi]trise\s+technique\b", "pratique technique"),
        (r"\bma[îi]trise\s+des\s+flux\b", "pratique des flux"),
        (r"\bma[îi]trise\b", "pratique"),
        (r"\bma[îi]triser\b", "utiliser"),
    ]
    cleaned = text
    for pattern, replacement in replacements:
        cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
    return cleaned


def _replace_absent_tool_claims(text: str, letter_result: dict, cv_markdown: str) -> str:
    cleaned = text
    cv_lower = cv_markdown.casefold()
    for term in letter_result.get("cv_technical_terms_reused", []) or []:
        term_text = str(term).strip()
        if not term_text or term_text.casefold() in cv_lower:
            continue
        if not _looks_like_tool(term_text):
            continue
        replacement = _tool_replacement(term_text, cv_lower)
        cleaned = re.sub(re.escape(term_text), replacement, cleaned, flags=re.IGNORECASE)
    return cleaned


def _filter_absent_terms(terms, cv_markdown: str) -> list[str]:
    cv_lower = cv_markdown.casefold()
    kept = []
    for term in terms or []:
        term_text = str(term).strip()
        if not term_text:
            continue
        if term_text.casefold() in cv_lower:
            kept.append(term_text)
    return kept


def _looks_like_tool(term: str) -> bool:
    return bool(re.search(r"\b(SAP|EWM|ERP|Sage|Salesforce|Pennylane|Excel|Power\s?BI)\b", term, flags=re.IGNORECASE))


def _tool_replacement(term: str, cv_lower: str) -> str:
    if "sap" in term.casefold() and "sap" in cv_lower:
        return "SAP"
    if "erp" in cv_lower:
        return "ERP"
    return "outils internes"
