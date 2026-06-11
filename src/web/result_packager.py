from __future__ import annotations

from pathlib import Path
import re
import shutil
import unicodedata


def _safe_name(value: str, fallback: str) -> str:
    text = unicodedata.normalize("NFKD", str(value or fallback))
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"[^\w% -]+", " ", text, flags=re.ASCII)
    return re.sub(r"\s+", " ", text).strip() or fallback


def create_current_zip(
    pack_dir: str | Path,
    output_dir: str | Path,
    *,
    company: str,
    job_title: str,
    ats_score: int | None,
) -> Path:
    pack_path = Path(pack_dir)
    if not pack_path.is_dir():
        raise ValueError("Pack de candidature introuvable.")

    current_dir = Path(output_dir)
    current_dir.mkdir(parents=True, exist_ok=True)
    for existing in current_dir.glob("*.zip"):
        existing.unlink()

    prefix = f"{max(0, min(100, ats_score))}% " if isinstance(ats_score, int) else ""
    stem = f"{prefix}{_safe_name(company, 'Entreprise')} - {_safe_name(job_title, 'Poste')}"
    archive = shutil.make_archive(str(current_dir / stem), "zip", root_dir=pack_path)
    return Path(archive)
