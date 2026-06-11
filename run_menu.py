from __future__ import annotations

import argparse
import json
import os
import re
import select
import shutil
import subprocess
import sys
from contextlib import redirect_stdout
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

import run_application
from src.application.application_context_builder import build_application_context
from src.application.company_research import (
    extract_company_facts_from_job_description,
    load_company_profile,
    normalize_company,
    refresh_company_profile_with_gemini,
    select_company_facts,
    slugify,
)
from src.application.document_to_markdown import docx_to_markdown
from src.application.output_pack import create_application_pack
from src.application.ats_matcher import analyze_ats_match
from src.config import (
    APPLICATION_CONTEXT_PATH,
    BASE_COVER_LETTER_PATH,
    COVER_LETTERS_DIR,
    INPUT_DIR,
    JOB_DESCRIPTION_PATH,
    LAST_RUN_REPORT_PATH,
    LETTER_RESULT_PATH,
    LM_DEMO_VALIDEE_MD_PATH,
    LM_INSTRUCTIONS_MD_PATH,
    LM_TEMPLATE_MD_PATH,
    OUTPUT_DIR,
)
from src.generate_cv import main as generate_cv, parse_job
from src.parsers.job_parser import parse_job_description
from src.letter.letter_docx_renderer import render_letter_docx
from src.letter.letter_prompt_builder import build_letter_prompt
from src.letter.letter_result_parser import LetterResultParseError, parse_letter_result, save_letter_result
from src.letter.letter_sanitizer import sanitize_letter_result
from src.letter.letter_validator import validate_letter_result
from src.letter.lm_generator import generate_letter_with_gemini
from src.web import prompt_overrides


ROOT_DIR = Path(__file__).resolve().parent
ENV_PATH = ROOT_DIR / ".env"
RUNTIME_INPUT_DIR = OUTPUT_DIR / "runtime_inputs"
REFERENCE_CV_EXTENSIONS = (".docx", ".md", ".txt")


def _read_text(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8", errors="ignore")


def _load_lm_instructions() -> str:
    return prompt_overrides.load_effective_lm_instructions(LM_INSTRUCTIONS_MD_PATH)


def _write_json(path: str | Path, payload: dict) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _clean_runtime_inputs() -> None:
    RUNTIME_INPUT_DIR.mkdir(parents=True, exist_ok=True)
    for path in RUNTIME_INPUT_DIR.iterdir():
        if path.is_file():
            path.unlink()


def _clean_job_description() -> None:
    if JOB_DESCRIPTION_PATH.exists():
        JOB_DESCRIPTION_PATH.unlink()


def _prompt_choice() -> str:
    print()
    print("ResumeForge")
    print("1 - Juste CV")
    print("2 - CV + LM")
    print("3 - LM seulement")
    print("q - Quitter")
    return input("> Choix : ").strip().lower()


def _prompt_multiline(label: str, required: bool = True) -> str:
    print()
    print(label)
    print("Colle l'offre puis appuie sur Entrée. Le collage multi-lignes est détecté automatiquement.")
    print("Entrée sans texte utilise le presse-papiers. FIN reste disponible en secours.")
    lines: list[str] = []
    while True:
        line = input()
        if not lines and not line.strip():
            clipboard_text = _read_clipboard_text()
            if clipboard_text:
                return clipboard_text
            if required:
                raise ValueError("Texte requis ou presse-papiers vide.")
            return ""
        if line.strip().upper() == "FIN":
            break
        lines.append(line)
        lines.extend(_read_buffered_stdin_tail())
        break
    text = "\n".join(lines).strip()
    if required and not text:
        raise ValueError("Texte requis.")
    return text


def _read_buffered_stdin_tail(timeout_seconds: float = 0.35) -> list[str]:
    lines: list[str] = []
    while _stdin_has_buffered_line(timeout_seconds):
        line = sys.stdin.readline()
        if line == "":
            break
        line = line.rstrip("\n")
        if line.strip().upper() == "FIN":
            break
        lines.append(line)
    return lines


def _stdin_has_buffered_line(timeout_seconds: float) -> bool:
    try:
        readable, _, _ = select.select([sys.stdin], [], [], timeout_seconds)
    except (OSError, ValueError):
        return False
    return bool(readable)


def _read_clipboard_text() -> str:
    try:
        result = subprocess.run(
            ["pbpaste"],
            check=False,
            capture_output=True,
            text=True,
            timeout=2,
        )
    except (OSError, subprocess.TimeoutExpired):
        return ""
    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def _write_job_description(job_text: str) -> None:
    JOB_DESCRIPTION_PATH.parent.mkdir(parents=True, exist_ok=True)
    JOB_DESCRIPTION_PATH.write_text(job_text.strip() + "\n", encoding="utf-8")


def _run_cv_only(quiet: bool) -> None:
    _clean_runtime_inputs()
    _clean_job_description()
    job_text = _prompt_multiline("Offre / job description pour le CV")
    _write_job_description(job_text)

    if quiet:
        with open(os.devnull, "w", encoding="utf-8") as devnull, redirect_stdout(devnull):
            generate_cv()
    else:
        generate_cv()

    report = json.loads(LAST_RUN_REPORT_PATH.read_text(encoding="utf-8"))
    cv_docx_path = Path(report.get("output_docx", ""))
    parsed_job = parse_job(job_text)
    company = report.get("company_detected") or parsed_job.get("company", "Entreprise")
    job_title = report.get("job_title_detected") or parsed_job.get("job_title", "Poste cible")
    pack_path = create_application_pack(
        company=company,
        job_title=job_title,
        cv_path=cv_docx_path,
        mode_label="CV",
        timestamp=datetime.now().strftime("%Y%m%d_%H%M%S"),
        ats_score=report.get("ats_score"),
    )
    print()
    print("CV généré.")
    print(f"CV DOCX : {report.get('output_docx')}")
    print(f"Pack candidature : {pack_path}")
    print(f"Report : {LAST_RUN_REPORT_PATH}")


def _run_cv_and_lm(quiet: bool) -> None:
    _clean_runtime_inputs()
    _clean_job_description()
    job_text = _prompt_multiline("Offre / job description pour le CV + la LM")
    _write_job_description(job_text)
    run_application.main(quiet=quiet)


def _copy_runtime_cv(source_path: Path) -> Path:
    if not source_path.exists():
        raise FileNotFoundError(f"CV introuvable : {source_path}")
    if source_path.suffix.lower() not in REFERENCE_CV_EXTENSIONS:
        raise ValueError("LM seulement supporte .docx, .md ou .txt. Convertis le PDF en DOCX avant.")
    destination = RUNTIME_INPUT_DIR / f"manual_cv{source_path.suffix.lower()}"
    shutil.copy2(source_path, destination)
    return destination


def _find_reference_cv() -> Path | None:
    for extension in REFERENCE_CV_EXTENSIONS:
        candidate = INPUT_DIR / f"reference_cv{extension}"
        if candidate.exists():
            return candidate
    return None


def _store_reference_cv(source_path: Path) -> Path:
    if not source_path.exists():
        raise FileNotFoundError(f"CV introuvable : {source_path}")
    if source_path.suffix.lower() not in REFERENCE_CV_EXTENSIONS:
        raise ValueError("CV de référence supporté : .docx, .md ou .txt. Convertis le PDF en DOCX avant.")

    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    for extension in REFERENCE_CV_EXTENSIONS:
        existing = INPUT_DIR / f"reference_cv{extension}"
        if existing.exists():
            existing.unlink()

    destination = INPUT_DIR / f"reference_cv{source_path.suffix.lower()}"
    shutil.copy2(source_path, destination)
    return destination


def _select_reference_cv() -> Path:
    existing = _find_reference_cv()
    if existing:
        print()
        print(f"CV de référence détecté : {existing}")
        answer = input("Entrée = utiliser ce CV | r = remplacer : ").strip().lower()
        if answer not in {"r", "replace", "remplacer"}:
            return existing

    raw_path = input("Chemin du CV de référence optimisé (.docx/.md/.txt) : ").strip().strip('"')
    if not raw_path:
        raise ValueError("Chemin du CV de référence requis.")
    return _store_reference_cv(Path(raw_path).expanduser())


def _cv_to_markdown(cv_path: Path) -> tuple[str, Path]:
    if cv_path.suffix.lower() == ".docx":
        markdown = docx_to_markdown(cv_path)
    else:
        markdown = _read_text(cv_path).strip() + "\n"

    output_path = RUNTIME_INPUT_DIR / "manual_cv.md"
    output_path.write_text(markdown, encoding="utf-8")
    return markdown, output_path


def _extract_target_from_cv(cv_markdown: str) -> tuple[str, str]:
    company = ""
    job_title = ""

    company_patterns = [
        r"Entreprise cible\s*:\s*(.+)",
        r"Entreprise\s*:\s*(.+)",
        r"Company\s*:\s*(.+)",
    ]
    title_patterns = [
        r"Poste cible\s*:\s*(.+)",
        r"Poste\s*:\s*(.+)",
        r"Job title\s*:\s*(.+)",
    ]

    for pattern in company_patterns:
        match = re.search(pattern, cv_markdown, flags=re.IGNORECASE)
        if match:
            company = match.group(1).strip(" -|")
            break

    for pattern in title_patterns:
        match = re.search(pattern, cv_markdown, flags=re.IGNORECASE)
        if match:
            job_title = match.group(1).strip(" -|")
            break

    return company, job_title


def _prompt_target_if_missing(company: str, job_title: str) -> tuple[str, str]:
    if not company:
        company = input("Entreprise cible introuvable dans le CV. Entreprise : ").strip() or "Entreprise"
    if not job_title:
        job_title = input("Poste cible introuvable dans le CV. Poste : ").strip() or "Poste cible"
    return company, job_title


def _make_report_from_cv(cv_markdown: str, company: str, job_title: str) -> dict:
    skills = []
    capture = False
    for line in cv_markdown.splitlines():
        cleaned = line.strip().lstrip("-• ").strip()
        lowered = cleaned.lower()
        if lowered.startswith(("compétences", "competences", "skills")):
            capture = True
            continue
        if capture and cleaned.startswith("#"):
            capture = False
        if capture and cleaned and len(cleaned) < 90:
            skills.append(cleaned)

    return {
        "company_detected": company,
        "job_title_detected": job_title,
        "selected_experiences": [],
        "selected_leadership": [],
        "selected_certifications": [],
        "selected_technical_skills": skills[:12],
    }


def _build_lm_only_context(
    cv_path: Path,
    cv_markdown: str,
    cv_markdown_path: Path,
    target_text: str = "",
) -> tuple[dict, str]:
    if target_text.strip():
        parsed_job = parse_job(target_text)
        parsed_details = parse_job_description(target_text)
        for key in ["salary", "location", "contract_type", "seniority", "job_family", "secondary_job_families"]:
            if parsed_details.get(key) and not parsed_job.get(key):
                parsed_job[key] = parsed_details[key]
        company = parsed_job.get("company", "")
        job_title = parsed_job.get("job_title", "")
    else:
        parsed_job = {}
        company, job_title = _extract_target_from_cv(cv_markdown)

    company, job_title = _prompt_target_if_missing(company, job_title)
    company_name, company_slug = normalize_company(company)

    job_text = target_text.strip() or f"Company: {company_name}\nJob title: {job_title}\n"
    if not parsed_job:
        parsed_job = parse_job(job_text)
    parsed_job["company"] = company_name
    parsed_job["job_title"] = job_title
    parsed_job["raw_text"] = job_text

    company_profile, company_research_status = load_company_profile(company_slug)
    if company_research_status in {"missing", "stale", "invalid_cache", "unknown_age"}:
        try:
            company_profile, company_research_status = refresh_company_profile_with_gemini(company_name, company_slug)
        except Exception as exc:
            company_research_status = f"research_unavailable: {exc}"

    selected_facts, rejected_facts = select_company_facts(company_profile)
    for fact in extract_company_facts_from_job_description(company_name, job_text):
        if len(selected_facts) >= 3:
            rejected_facts.append({"fact": fact["fact"], "reason": "over_limit"})
            continue
        if not any(existing.get("fact") == fact["fact"] for existing in selected_facts):
            selected_facts.append(fact)

    report = _make_report_from_cv(cv_markdown, company_name, job_title)
    ats_final = analyze_ats_match(cv_markdown, job_text) if target_text.strip() else {}
    report["ats_final"] = ats_final
    report["ats_score"] = ats_final.get("score")
    context = build_application_context(
        parsed_job=parsed_job,
        cv_docx_path=cv_path,
        cv_markdown_path=cv_markdown_path,
        report=report,
        selected_company_facts=selected_facts,
        excluded_company_facts=rejected_facts,
        company_research_status=company_research_status,
        output_path=APPLICATION_CONTEXT_PATH,
        company_profile=company_profile,
    )
    return context, company_slug


def _run_lm_only() -> None:
    _clean_runtime_inputs()
    _clean_job_description()

    cv_source_path = _select_reference_cv()
    cv_runtime_path = _copy_runtime_cv(cv_source_path)
    cv_markdown, cv_markdown_path = _cv_to_markdown(cv_runtime_path)
    target_text = _prompt_multiline(
        "Offre ou contexte cible pour la LM (optionnel)",
        required=False,
    )
    application_context, company_slug = _build_lm_only_context(
        cv_runtime_path,
        cv_markdown,
        cv_markdown_path,
        target_text=target_text,
    )

    if not os.getenv("GEMINI_LETTER_API_KEY", "").strip():
        raise RuntimeError("GEMINI_LETTER_API_KEY absente : impossible de générer la LM.")

    prompt = build_letter_prompt(
        application_context=application_context,
        cv_markdown=cv_markdown,
        lm_instructions=_load_lm_instructions(),
        lm_template=_read_text(LM_TEMPLATE_MD_PATH),
        lm_demo=_read_text(LM_DEMO_VALIDEE_MD_PATH),
    )
    raw_result = generate_letter_with_gemini(prompt)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    artifact_stem = (
        f"LM_{company_slug}_{slugify(application_context.get('job_title', 'poste_cible'), 'poste_cible')}_{timestamp}"
    )
    validation_path = COVER_LETTERS_DIR / f"{artifact_stem}_validation.json"
    failed_output_path = COVER_LETTERS_DIR / f"LM_FAILED_{timestamp}.txt"
    lm_docx_path = COVER_LETTERS_DIR / f"{artifact_stem}.docx"
    ats_score = application_context.get("ats_score")

    try:
        letter_result = parse_letter_result(raw_result)
        letter_result = sanitize_letter_result(letter_result, cv_markdown)
        save_letter_result(letter_result, LETTER_RESULT_PATH)
    except LetterResultParseError as exc:
        failed_output_path.write_text(raw_result, encoding="utf-8")
        validation_report = {
                "validation_status": "failed",
                "errors": [str(exc)],
                "failed_output_path": str(failed_output_path),
                "lm_docx_path": None,
                "company": application_context.get("company"),
                "job_title": application_context.get("job_title"),
                "cv_docx_path": str(cv_runtime_path),
                "cv_markdown_path": str(cv_markdown_path),
                "timestamp": datetime.now().isoformat(timespec="seconds"),
            }
        _write_json(validation_path, validation_report)
        pack_path = create_application_pack(
            company=application_context.get("company", "Entreprise"),
            job_title=application_context.get("job_title", "Poste cible"),
            cv_path=cv_runtime_path,
            cv_markdown=cv_markdown,
            final_letter=raw_result,
            validation_path=validation_path,
            failed_output_path=failed_output_path,
            mode_label="LM_REVIEW",
            timestamp=timestamp,
            ats_score=ats_score,
        )
        validation_report["application_pack_path"] = str(pack_path)
        _write_json(validation_path, validation_report)
        print(f"LM invalide : {validation_path}")
        print(f"Pack candidature : {pack_path}")
        return

    validation_report = validate_letter_result(
        letter_result=letter_result,
        application_context=application_context,
        cv_markdown=cv_markdown,
        lm_demo=_read_text(LM_DEMO_VALIDEE_MD_PATH),
        validation_output_path=validation_path,
        failed_output_path=failed_output_path,
        lm_docx_path=lm_docx_path,
    )

    if validation_report["validation_status"] != "success":
        failed_output_path.write_text(letter_result.get("final_letter", raw_result), encoding="utf-8")
        validation_report["failed_output_path"] = str(failed_output_path)
        validation_report["lm_docx_path"] = None
        _write_json(validation_path, validation_report)
        pack_path = create_application_pack(
            company=application_context.get("company", "Entreprise"),
            job_title=application_context.get("job_title", "Poste cible"),
            cv_path=cv_runtime_path,
            cv_markdown=cv_markdown,
            final_letter=letter_result.get("final_letter", raw_result),
            validation_path=validation_path,
            failed_output_path=failed_output_path,
            mode_label="LM_REVIEW",
            timestamp=timestamp,
            ats_score=ats_score,
        )
        validation_report["application_pack_path"] = str(pack_path)
        _write_json(validation_path, validation_report)
        print(f"LM à revoir : {validation_path}")
        print(f"Pack candidature : {pack_path}")
        return

    if not BASE_COVER_LETTER_PATH.exists():
        validation_report["validation_status"] = "skipped"
        validation_report.setdefault("warnings", []).append(
            "missing_base_cover_letter_docx: cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx"
        )
        validation_report["lm_docx_path"] = None
        _write_json(validation_path, validation_report)
        pack_path = create_application_pack(
            company=application_context.get("company", "Entreprise"),
            job_title=application_context.get("job_title", "Poste cible"),
            cv_path=cv_runtime_path,
            cv_markdown=cv_markdown,
            final_letter=letter_result["final_letter"],
            validation_path=validation_path,
            mode_label="LM_NO_DOCX",
            timestamp=timestamp,
            ats_score=ats_score,
        )
        validation_report["application_pack_path"] = str(pack_path)
        _write_json(validation_path, validation_report)
        print(f"LM validée mais DOCX non rendu : {validation_path}")
        print(f"Pack candidature : {pack_path}")
        return

    render_letter_docx(application_context, letter_result["final_letter"], lm_docx_path)
    validation_report["lm_docx_path"] = str(lm_docx_path)
    pack_path = create_application_pack(
        company=application_context.get("company", "Entreprise"),
        job_title=application_context.get("job_title", "Poste cible"),
        cv_path=cv_runtime_path,
        cv_markdown=cv_markdown,
        lm_docx_path=lm_docx_path,
        final_letter=letter_result["final_letter"],
        validation_path=validation_path,
        mode_label="LM",
        timestamp=timestamp,
        ats_score=ats_score,
    )
    validation_report["application_pack_path"] = str(pack_path)
    _write_json(validation_path, validation_report)

    print()
    print("LM générée.")
    print(f"LM DOCX : {lm_docx_path}")
    print(f"Pack candidature : {pack_path}")
    print(f"Validation JSON : {validation_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Menu terminal ResumeForge.")
    parser.add_argument("--quiet", action="store_true", help="Réduit les logs du mode CV.")
    args = parser.parse_args()

    load_dotenv(ENV_PATH)
    COVER_LETTERS_DIR.mkdir(parents=True, exist_ok=True)
    RUNTIME_INPUT_DIR.mkdir(parents=True, exist_ok=True)

    while True:
        choice = _prompt_choice()
        try:
            if choice in {"1", "cv"}:
                _run_cv_only(quiet=args.quiet)
                return
            if choice in {"2", "cv+lm", "cv lm"}:
                _run_cv_and_lm(quiet=args.quiet)
                return
            if choice in {"3", "lm"}:
                _run_lm_only()
                return
            if choice in {"q", "quit", "exit"}:
                return
            print("Choix invalide.")
        except Exception as exc:
            print()
            print(f"Erreur : {exc}")
            return


if __name__ == "__main__":
    main()
