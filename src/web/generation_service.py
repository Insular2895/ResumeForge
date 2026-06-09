from __future__ import annotations

from dataclasses import dataclass
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import threading
import time
from typing import Callable

from dotenv import load_dotenv

from src.web.reference_manager import get_reference_statuses
from src.web.result_packager import create_current_zip


VALID_MODES = {"cv", "cv_lm", "lm_only"}
MODE_REFERENCES = {
    "cv": (("master_profile", "Profil Excel maître"), ("cv_template", "Template CV")),
    "cv_lm": (
        ("master_profile", "Profil Excel maître"),
        ("cv_template", "Template CV"),
        ("lm_template", "Template LM"),
    ),
    "lm_only": (("reference_cv", "CV de référence"), ("lm_template", "Template LM")),
}


class GenerationError(RuntimeError):
    pass


class GenerationBusyError(GenerationError):
    pass


@dataclass(frozen=True)
class GenerationResult:
    mode: str
    company: str
    job_title: str
    ats_score: int | None
    pack_dir: Path
    zip_path: Path
    files: tuple[str, ...]
    warnings: tuple[str, ...] = ()


def build_menu_input(mode: str, job_text: str) -> str:
    cleaned = str(job_text or "").strip()
    choices = {
        "cv": f"1\n{cleaned}\nFIN\n",
        "cv_lm": f"2\n{cleaned}\nFIN\n",
        "lm_only": f"3\n\n{cleaned}\nFIN\n",
    }
    try:
        return choices[mode]
    except KeyError as exc:
        raise GenerationError("Mode de génération invalide.") from exc


def validate_mode_request(
    mode: str,
    job_text: str,
    statuses: dict[str, dict],
    environment: dict[str, str],
) -> None:
    if mode not in VALID_MODES:
        raise GenerationError("Mode de génération invalide.")
    if not str(job_text or "").strip():
        raise GenerationError("Colle une offre ou un contexte avant de lancer la génération.")

    for key, label in MODE_REFERENCES[mode]:
        if not statuses.get(key, {}).get("ready"):
            raise GenerationError(f"{label} manquant ou invalide.")

    if mode in {"cv_lm", "lm_only"} and not str(environment.get("GEMINI_LETTER_API_KEY", "")).strip():
        raise GenerationError("Clé Gemini LM manquante dans le fichier .env.")


def verify_application_pack(mode: str, pack_dir: str | Path) -> dict:
    pack = Path(pack_dir)
    if not pack.is_dir():
        raise GenerationError("Aucun pack de candidature n'a été produit.")

    cv_files = sorted(path for path in pack.glob("CV*.docx") if path.is_file())
    lm_files = sorted(path for path in pack.glob("LM*.docx") if path.is_file())
    validation_path = pack / "validation.json"
    validation: dict = {}
    if validation_path.exists():
        try:
            validation = json.loads(validation_path.read_text(encoding="utf-8"))
        except Exception as exc:
            raise GenerationError("Le rapport de validation produit est illisible.") from exc

    if not cv_files:
        raise GenerationError("Le CV attendu n'a pas été généré.")
    if mode in {"cv_lm", "lm_only"}:
        if validation.get("validation_status") == "failed":
            errors = [str(item) for item in validation.get("errors", []) if str(item).strip()]
            details = "; ".join(errors[:5]) or "motif non détaillé"
            raise GenerationError(f"La LM n'a pas passé la validation : {details}")
        if not lm_files:
            raise GenerationError("La LM attendue n'a pas été générée.")
        if validation.get("validation_status") != "success":
            raise GenerationError("La LM n'a pas passé la validation.")

    return {
        "cv_files": cv_files,
        "lm_files": lm_files,
        "validation": validation,
        "all_files": sorted(path for path in pack.iterdir() if path.is_file()),
    }


def _pack_metadata(pack: Path, verification: dict) -> tuple[str, str, int | None, tuple[str, ...]]:
    validation = verification["validation"]
    company = str(validation.get("company") or "").strip()
    job_title = str(validation.get("job_title") or "").strip()
    ats_score = validation.get("ats_score")
    if not isinstance(ats_score, int):
        ats_score = None

    name = pack.name
    chunks = name.split(" - ")
    first = chunks[0] if chunks else ""
    if first[:3].rstrip("%").isdigit() and "% " in first:
        score_text, first = first.split("% ", 1)
        if ats_score is None:
            ats_score = int(score_text)
    if not company:
        company = first or "Entreprise"
    if not job_title:
        job_title = chunks[1] if len(chunks) > 1 else "Poste"

    warnings = tuple(str(item) for item in validation.get("warnings", []) if str(item).strip())
    return company, job_title, ats_score, warnings


class GenerationService:
    _run_lock = threading.Lock()

    def __init__(
        self,
        *,
        project_root: str | Path,
        packs_dir: str | Path,
        current_result_dir: str | Path,
        runner: Callable[..., subprocess.CompletedProcess] = subprocess.run,
    ) -> None:
        self.project_root = Path(project_root)
        self.packs_dir = Path(packs_dir)
        self.current_result_dir = Path(current_result_dir)
        self.runner = runner
        self.reference_status_provider = get_reference_statuses

    def _latest_pack_after(self, started_at: float) -> Path:
        candidates = [
            path
            for path in self.packs_dir.glob("*")
            if path.is_dir() and path.stat().st_mtime >= started_at - 1
        ]
        if not candidates:
            raise GenerationError("La commande s'est terminée sans produire de nouveau pack.")
        return max(candidates, key=lambda path: path.stat().st_mtime)

    @staticmethod
    def _runner_error(completed: subprocess.CompletedProcess) -> str:
        output = "\n".join(
            part.strip()
            for part in [str(completed.stdout or ""), str(completed.stderr or "")]
            if part and str(part).strip()
        )
        matches = re.findall(r"(?m)^Erreur\s*:\s*(.+)$", output)
        if matches:
            return matches[-1].strip()
        if completed.returncode != 0:
            return "La génération a échoué. Consulte le terminal local pour le diagnostic."
        return ""

    def run(self, mode: str, job_text: str) -> GenerationResult:
        load_dotenv(self.project_root / ".env")
        validate_mode_request(mode, job_text, self.reference_status_provider(), dict(os.environ))

        if not self._run_lock.acquire(blocking=False):
            raise GenerationBusyError("Une génération web est déjà en cours.")

        try:
            self.packs_dir.mkdir(parents=True, exist_ok=True)
            started_at = time.time()
            completed = self.runner(
                args=[sys.executable, "run_menu.py", "--quiet"],
                cwd=self.project_root,
                input=build_menu_input(mode, job_text),
                text=True,
                capture_output=True,
                timeout=900,
                check=False,
            )
            runner_error = self._runner_error(completed)
            if runner_error:
                raise GenerationError(runner_error)

            pack = self._latest_pack_after(started_at)
            verification = verify_application_pack(mode, pack)
            company, job_title, ats_score, warnings = _pack_metadata(pack, verification)
            zip_path = create_current_zip(
                pack,
                self.current_result_dir,
                company=company,
                job_title=job_title,
                ats_score=ats_score,
            )
            return GenerationResult(
                mode=mode,
                company=company,
                job_title=job_title,
                ats_score=ats_score,
                pack_dir=pack,
                zip_path=zip_path,
                files=tuple(path.name for path in verification["all_files"]),
                warnings=warnings,
            )
        except subprocess.TimeoutExpired as exc:
            raise GenerationError("La génération a dépassé la durée maximale autorisée.") from exc
        finally:
            self._run_lock.release()
