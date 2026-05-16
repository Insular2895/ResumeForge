from __future__ import annotations

from datetime import datetime
from pathlib import Path
import json
import re


def _read_text(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8", errors="ignore")


def _extract_numbers(text: str) -> list[str]:
    return sorted(set(re.findall(r"\b\d+(?:[,.]\d+)?\s*(?:%|k|K|M|€|eur|EUR|ans?|mois|jours?)?\b", text)))


def _extract_terms(cv_markdown: str, report: dict) -> list[str]:
    terms = set()
    for skill in report.get("selected_technical_skills", []):
        if skill:
            terms.add(str(skill).strip())
    for exp in report.get("selected_experiences", []):
        if isinstance(exp, dict):
            for key in ["company", "position_title"]:
                value = exp.get(key)
                if value:
                    terms.add(str(value).strip())
            for tag in exp.get("reason_tags", []):
                if tag:
                    terms.add(str(tag).strip())
    for match in re.findall(r"\b[A-Z][A-Za-z0-9+/#.-]{1,}\b", cv_markdown):
        if len(match) > 1:
            terms.add(match.strip())
    return sorted(terms)


def build_application_context(
    parsed_job: dict,
    cv_docx_path: str | Path,
    cv_markdown_path: str | Path,
    report: dict,
    selected_company_facts: list[dict],
    excluded_company_facts: list[dict],
    company_research_status: str,
    output_path: str | Path,
) -> dict:
    cv_markdown = _read_text(cv_markdown_path)
    job_description = parsed_job.get("raw_text", "")

    context = {
        "schema_version": "1.0",
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "company": parsed_job.get("company", "Entreprise"),
        "job_title": parsed_job.get("job_title", "Poste cible"),
        "job_family": _infer_job_family(parsed_job),
        "job_description": job_description,
        "job_keywords": parsed_job.get("keywords", [])[:80],
        "cv_docx_path": str(cv_docx_path),
        "cv_markdown_path": str(cv_markdown_path),
        "cv_markdown_sha_source": "final_personalized_cv",
        "selected_cv_experiences": report.get("selected_experiences", []),
        "selected_cv_leadership": report.get("selected_leadership", []),
        "selected_cv_certifications": report.get("selected_certifications", []),
        "selected_cv_technical_skills": report.get("selected_technical_skills", []),
        "allowed_cv_terms": _extract_terms(cv_markdown, report),
        "allowed_numbers": _extract_numbers(cv_markdown + "\n" + job_description),
        "selected_company_facts": selected_company_facts[:3],
        "excluded_company_facts": excluded_company_facts,
        "company_research_status": company_research_status,
        "validation_constraints": {
            "profile_source": "cv_markdown_only",
            "forbidden_profile_source": "master_profile.xlsx",
            "final_letter_format": "plain_text_for_docx",
            "max_company_facts": 3,
            "no_final_lm_markdown_export": True,
        },
    }

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(context, ensure_ascii=False, indent=2), encoding="utf-8")
    return context


def _infer_job_family(parsed_job: dict) -> str:
    text = " ".join([parsed_job.get("job_title", ""), " ".join(parsed_job.get("keywords", []))]).lower()
    if any(word in text for word in ["adv", "import", "export", "supply", "logistics", "stock"]):
        return "operations_supply_chain"
    if any(word in text for word in ["data", "analytics", "sql", "python", "bi"]):
        return "data"
    if any(word in text for word in ["marketing", "crm", "seo", "ads"]):
        return "marketing"
    return "general"

