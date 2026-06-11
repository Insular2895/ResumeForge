from __future__ import annotations

from pathlib import Path
import re
import shutil
import unicodedata

from src.application.document_to_markdown import docx_to_markdown
from src.config import APPLICATION_PACKS_DIR


def _safe_name(value: str, fallback: str = "candidature", max_length: int = 70) -> str:
    text = str(value or "").strip() or fallback
    text = unicodedata.normalize("NFKD", text)
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"(?i)\s*[-–—]?\s*job\s*post\s*$", "", text).strip()
    text = re.sub(r"(?i)\bcharge\(e\)", "Charge", text)
    text = re.sub(r"(?i)\bassistant\(e\)", "Assistant", text)
    text = re.sub(r"(?i)\s*[-–—]?\s*\(?\s*[hf]\s*/\s*[hf]\s*\)?\s*$", "", text).strip()
    text = re.sub(r"[^A-Za-z0-9]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if text.isupper() and len(text) > 3:
        text = text.title()
    return (text or fallback)[:max_length].strip("_")


def _copy_if_exists(source: str | Path | None, destination: Path) -> Path | None:
    if not source:
        return None
    source_path = Path(source)
    if not source_path.exists():
        return None
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_path, destination)
    return destination


def _write_text(path: Path, content: str) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text((content or "").strip() + "\n", encoding="utf-8")
    return path


def _ensure_cv_markdown(cv_path: str | Path | None, cv_markdown: str = "") -> str:
    if cv_markdown.strip():
        return cv_markdown.strip() + "\n"
    if not cv_path:
        return ""
    path = Path(cv_path)
    if not path.exists():
        return ""
    if path.suffix.lower() == ".docx":
        return docx_to_markdown(path)
    if path.suffix.lower() in {".md", ".txt"}:
        return path.read_text(encoding="utf-8", errors="ignore").strip() + "\n"
    return ""


def _build_editable_source(
    *,
    company: str,
    job_title: str,
    cv_markdown: str,
    final_letter: str,
) -> str:
    sections = [
        f"# {company} - {job_title}",
        "",
        "## CV",
        "",
        cv_markdown.strip() or "_CV non extrait dans ce pack._",
    ]
    if final_letter.strip():
        sections.extend(["", "## LM", "", final_letter.strip()])
    sections.extend(
        [
            "",
            "## Note",
            "",
            "Ce fichier est la source lisible à modifier dans VS Code. "
            "Les DOCX du pack ne se synchronisent pas automatiquement : "
            "après modification ici, il faut régénérer un DOCX propre.",
        ]
    )
    return "\n".join(sections).strip() + "\n"


def create_application_pack(
    *,
    company: str,
    job_title: str,
    cv_path: str | Path | None = None,
    cv_markdown: str = "",
    lm_docx_path: str | Path | None = None,
    final_letter: str = "",
    validation_path: str | Path | None = None,
    failed_output_path: str | Path | None = None,
    mode_label: str = "CV_LM",
    timestamp: str | None = None,
    ats_score: int | None = None,
) -> Path:
    company_slug = _safe_name(company, "Entreprise")
    job_slug = _safe_name(job_title, "Poste")
    score_prefix = ""
    if isinstance(ats_score, int):
        score_prefix = f"{max(0, min(100, ats_score))}% "
    document_stem = f"{company_slug} - {job_slug}"
    pack_stem = f"{score_prefix}{document_stem}"
    pack_name = f"{pack_stem} - {timestamp}" if timestamp else pack_stem
    pack_dir = APPLICATION_PACKS_DIR / pack_name

    if pack_dir.exists():
        suffix = 2
        while (APPLICATION_PACKS_DIR / f"{pack_name} ({suffix})").exists():
            suffix += 1
        pack_dir = APPLICATION_PACKS_DIR / f"{pack_name} ({suffix})"

    pack_dir.mkdir(parents=True, exist_ok=True)

    cv_source = Path(cv_path) if cv_path else None
    if cv_source and cv_source.exists() and cv_source.suffix.lower() == ".docx":
        _copy_if_exists(cv_source, pack_dir / f"CV - {document_stem}{cv_source.suffix.lower()}")

    _copy_if_exists(lm_docx_path, pack_dir / f"LM - {document_stem}.docx")

    return pack_dir
