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
    text = re.sub(r"[^A-Za-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
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
            "Ce fichier est la source lisible a modifier dans VS Code. "
            "Les DOCX du pack ne se synchronisent pas automatiquement : "
            "apres modification ici, il faut regenerer un DOCX propre.",
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
    mode_label: str = "CV_LM",
    timestamp: str | None = None,
) -> Path:
    company_slug = _safe_name(company, "Entreprise")
    job_slug = _safe_name(job_title, "Poste")
    pack_dir = APPLICATION_PACKS_DIR / f"{company_slug}_{job_slug}"

    if pack_dir.exists():
        shutil.rmtree(pack_dir)

    pack_dir.mkdir(parents=True, exist_ok=True)

    stem = f"{company_slug}_{job_slug}"
    cv_source = Path(cv_path) if cv_path else None
    if cv_source and cv_source.exists() and cv_source.suffix.lower() == ".docx":
        _copy_if_exists(cv_source, pack_dir / f"CV_{stem}{cv_source.suffix.lower()}")

    cv_md = _ensure_cv_markdown(cv_source, cv_markdown)
    _copy_if_exists(lm_docx_path, pack_dir / f"LM_{stem}.docx")

    _write_text(
        pack_dir / "A_MODIFIER.md",
        _build_editable_source(
            company=company,
            job_title=job_title,
            cv_markdown=cv_md,
            final_letter=final_letter,
        ),
    )

    return pack_dir
