from __future__ import annotations

from datetime import datetime
from pathlib import Path
import json
import os

from dotenv import load_dotenv

from src.application.application_context_builder import build_application_context
from src.application.application_tracker import update_application_tracker
from src.application.company_research import (
    load_company_profile,
    normalize_company,
    refresh_company_profile_with_gemini,
    select_company_facts,
    slugify,
)
from src.application.cv_markdown_exporter import export_cv_markdown
from src.config import (
    APPLICATION_CONTEXT_PATH,
    BASE_COVER_LETTER_PATH,
    COVER_LETTERS_DIR,
    JOB_DESCRIPTION_PATH,
    LAST_RUN_REPORT_PATH,
    LETTER_RESULT_PATH,
    LM_DEMO_VALIDEE_MD_PATH,
    LM_INSTRUCTIONS_MD_PATH,
    LM_TEMPLATE_MD_PATH,
    OUTPUT_DIR,
)
from src.generate_cv import load_job_description, main as generate_cv, parse_job
from src.letter.letter_docx_renderer import render_letter_docx
from src.letter.letter_prompt_builder import build_letter_prompt
from src.letter.letter_result_parser import LetterResultParseError, parse_letter_result, save_letter_result
from src.letter.letter_validator import validate_letter_result
from src.letter.lm_generator import generate_letter_with_gemini


ROOT_DIR = Path(__file__).resolve().parent
ENV_PATH = ROOT_DIR / ".env"


def _read_json(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def _read_text(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8", errors="ignore")


def _write_json(path: str | Path, payload: dict) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def _artifact_stem(company: str, job_title: str, timestamp: str) -> str:
    return f"LM_{slugify(company)}_{slugify(job_title, 'poste_cible')}_{timestamp}"


def _write_skipped_report(application_context: dict, reason: str, validation_path: Path) -> dict:
    report = {
        "validation_status": "skipped",
        "reason": reason,
        "cv_generated": True,
        "company": application_context.get("company", ""),
        "job_title": application_context.get("job_title", ""),
        "job_family": application_context.get("job_family", ""),
        "cv_docx_path": application_context.get("cv_docx_path", ""),
        "cv_markdown_path": application_context.get("cv_markdown_path", ""),
        "lm_docx_path": None,
        "tracker_update_status": "pending",
        "company_research_status": application_context.get("company_research_status", ""),
        "used_company_facts": application_context.get("selected_company_facts", []),
        "excluded_company_facts": application_context.get("excluded_company_facts", []),
        "errors": [],
        "warnings": [reason],
        "timestamp": datetime.now().isoformat(timespec="seconds"),
    }
    _write_json(validation_path, report)
    return report


def _update_tracker_safely(validation_report: dict, validation_path: Path) -> dict:
    try:
        tracker_row = update_application_tracker(validation_report)
        validation_report["tracker_update_status"] = tracker_row.get("tracker_update_status", "success")
    except Exception as exc:
        validation_report["tracker_update_status"] = "warning_tracker_unavailable"
        validation_report.setdefault("warnings", []).append(f"tracker_unavailable: {exc}")

    _write_json(validation_path, validation_report)
    return validation_report


def main() -> None:
    load_dotenv(ENV_PATH)
    COVER_LETTERS_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 50)
    print("ETAPE 1 - Generation du CV")
    print("=" * 50)
    generate_cv()

    report = _read_json(LAST_RUN_REPORT_PATH)
    cv_docx_path = Path(report["output_docx"])
    if not cv_docx_path.exists():
        raise FileNotFoundError(f"CV DOCX genere introuvable : {cv_docx_path}")

    print()
    print("=" * 50)
    print("ETAPE 2 - Export CV Markdown")
    print("=" * 50)
    cv_markdown_path = export_cv_markdown(cv_docx_path, LAST_RUN_REPORT_PATH)
    cv_markdown = _read_text(cv_markdown_path)
    print(f"CV Markdown genere : {cv_markdown_path}")

    job_text = load_job_description() if JOB_DESCRIPTION_PATH.exists() else report.get("job_description", "")
    parsed_job = parse_job(job_text)
    if report.get("company_detected"):
        parsed_job["company"] = report["company_detected"]
    if report.get("job_title_detected"):
        parsed_job["job_title"] = report["job_title_detected"]

    company_name, company_slug = normalize_company(parsed_job.get("company", "Entreprise"))
    parsed_job["company"] = company_name

    print()
    print("=" * 50)
    print("ETAPE 3 - Contexte application et recherche entreprise")
    print("=" * 50)
    company_profile, company_research_status = load_company_profile(company_slug)
    if company_research_status in {"missing", "stale", "invalid_cache", "unknown_age"}:
        try:
            company_profile, company_research_status = refresh_company_profile_with_gemini(company_name, company_slug)
        except Exception as exc:
            company_research_status = f"research_unavailable: {exc}"
    selected_facts, rejected_facts = select_company_facts(company_profile)
    application_context = build_application_context(
        parsed_job=parsed_job,
        cv_docx_path=cv_docx_path,
        cv_markdown_path=cv_markdown_path,
        report=report,
        selected_company_facts=selected_facts,
        excluded_company_facts=rejected_facts,
        company_research_status=company_research_status,
        output_path=APPLICATION_CONTEXT_PATH,
    )
    print(f"application_context.json genere : {APPLICATION_CONTEXT_PATH}")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    artifact_stem = _artifact_stem(company_name, parsed_job.get("job_title", "Poste cible"), timestamp)
    validation_path = COVER_LETTERS_DIR / f"{artifact_stem}_validation.json"
    failed_output_path = COVER_LETTERS_DIR / f"LM_FAILED_{timestamp}.txt"
    lm_docx_path = COVER_LETTERS_DIR / f"{artifact_stem}.docx"

    if not os.getenv("GEMINI_LETTER_API_KEY", "").strip():
        print("GEMINI_LETTER_API_KEY absente - LM ignoree proprement.")
        validation_report = _write_skipped_report(application_context, "missing_GEMINI_LETTER_API_KEY", validation_path)
        _update_tracker_safely(validation_report, validation_path)
        print(f"Rapport validation : {validation_path}")
        return

    print()
    print("=" * 50)
    print("ETAPE 4 - Generation LM Gemini")
    print("=" * 50)
    prompt = build_letter_prompt(
        application_context=application_context,
        cv_markdown=cv_markdown,
        lm_instructions=_read_text(LM_INSTRUCTIONS_MD_PATH),
        lm_template=_read_text(LM_TEMPLATE_MD_PATH),
        lm_demo=_read_text(LM_DEMO_VALIDEE_MD_PATH),
    )
    raw_result = generate_letter_with_gemini(prompt)

    try:
        letter_result = parse_letter_result(raw_result)
        save_letter_result(letter_result, LETTER_RESULT_PATH)
    except LetterResultParseError as exc:
        failed_output_path.write_text(raw_result, encoding="utf-8")
        validation_report = {
            "validation_status": "failed",
            "errors": [str(exc)],
            "lm_docx_path": None,
            "failed_output_path": str(failed_output_path),
            "tracker_update_status": "skipped_validation_failed",
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "company": company_name,
            "job_title": parsed_job.get("job_title", ""),
            "cv_docx_path": str(cv_docx_path),
            "cv_markdown_path": str(cv_markdown_path),
        }
        _write_json(validation_path, validation_report)
        _update_tracker_safely(validation_report, validation_path)
        print(f"LM invalide : {validation_path}")
        return

    print()
    print("=" * 50)
    print("ETAPE 5 - Validation deterministe")
    print("=" * 50)
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
        validation_report["tracker_update_status"] = "skipped_validation_failed"
        _write_json(validation_path, validation_report)
        _update_tracker_safely(validation_report, validation_path)
        print(f"Validation echouee. Aucun DOCX LM final exporte : {validation_path}")
        return

    print()
    print("=" * 50)
    print("ETAPE 6 - Rendu DOCX LM")
    print("=" * 50)
    if not BASE_COVER_LETTER_PATH.exists():
        validation_report["validation_status"] = "skipped"
        validation_report["warnings"].append(
            "missing_base_cover_letter_docx: cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx"
        )
        validation_report["lm_docx_path"] = None
        _write_json(validation_path, validation_report)
        _update_tracker_safely(validation_report, validation_path)
        print("Template LM prive manquant. Voir instruction finale ci-dessous.")
        return

    render_letter_docx(application_context, letter_result["final_letter"], lm_docx_path)
    validation_report["lm_docx_path"] = str(lm_docx_path)
    _write_json(validation_path, validation_report)
    _update_tracker_safely(validation_report, validation_path)

    print(f"LM DOCX generee : {lm_docx_path}")
    print(f"Rapport validation : {validation_path}")


if __name__ == "__main__":
    main()
