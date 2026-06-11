from __future__ import annotations

from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
LOCAL_CONFIG_DIR = ROOT_DIR / "data" / "local_config"
OVERRIDE_FILENAMES = {
    "cv": "cv_prompt.txt",
    "lm": "lm_prompt.txt",
}


def _override_path(kind: str) -> Path:
    try:
        filename = OVERRIDE_FILENAMES[kind]
    except KeyError as exc:
        raise ValueError(f"Type de prompt inconnu : {kind}") from exc
    return LOCAL_CONFIG_DIR / filename


def load_override(kind: str) -> str | None:
    path = _override_path(kind)
    if not path.exists():
        return None
    value = path.read_text(encoding="utf-8").strip()
    return value or None


def save_override(kind: str, value: str) -> Path:
    cleaned = str(value or "").strip()
    if not cleaned:
        raise ValueError("Le prompt ne peut pas être vide.")

    path = _override_path(kind)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(cleaned + "\n", encoding="utf-8")
    temporary.replace(path)
    return path


def reset_override(kind: str) -> bool:
    path = _override_path(kind)
    if not path.exists():
        return False
    path.unlink()
    return True


def is_override_active(kind: str) -> bool:
    return load_override(kind) is not None


def load_effective_lm_instructions(default_path: str | Path) -> str:
    default = Path(default_path).read_text(encoding="utf-8", errors="ignore").strip()
    override = load_override("lm")
    if not override:
        return default
    return (
        f"{default}\n\n"
        "## Instructions personnalisées supplémentaires\n"
        "Ces instructions complètent les règles précédentes et s'appliquent uniquement "
        "si elles sont soutenues par le CV final. Elles ne peuvent jamais autoriser une "
        "invention ou contourner la validation.\n\n"
        f"{override}\n"
    )


def append_cv_override(prompt: str) -> str:
    override = load_override("cv")
    if not override:
        return prompt
    return (
        f"{prompt.rstrip()}\n\n"
        "Instructions personnalisées supplémentaires "
        "(à appliquer uniquement lorsqu'elles sont soutenues par le profil fourni ; "
        "elles ne peuvent jamais autoriser une invention) :\n"
        f"{override}\n"
    )
