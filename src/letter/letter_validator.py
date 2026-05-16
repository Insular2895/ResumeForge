from __future__ import annotations

from datetime import datetime
from difflib import SequenceMatcher
from pathlib import Path
import json
import re


BANNED_CLICHES = [
    "entreprise dynamique",
    "passionne depuis toujours",
    "leader inconteste",
    "votre prestigieuse entreprise",
    "je suis le candidat ideal",
]

BANAL_BENEFITS = [
    "tickets restaurant",
    "ticket restaurant",
    "remboursement transport",
    "rtt",
    "mutuelle",
    "teletravail",
    "télétravail",
]


def _normalize(text: str) -> str:
    return (text or "").casefold()


def _numbers(text: str) -> set[str]:
    matches = re.findall(r"\b\d+(?:[,.]\d+)?\s*(?:%|k|K|M|€|eur|EUR|ans?|mois|jours?)?\b", text or "")
    return {match.strip() for match in matches}


def _has_markdown(text: str) -> bool:
    return bool(re.search(r"(^|\n)\s{0,3}(#{1,6}\s|[-*]\s+|\d+\.\s+|>\s+|```)", text or ""))


def _contains_annotation(text: str) -> bool:
    return bool(re.search(r"\[[A-Z_]+:", text or ""))


def _contains_placeholder(text: str) -> bool:
    return "[[" in (text or "") or "]]" in (text or "")


def _words(text: str) -> list[str]:
    return re.findall(r"\b[\wÀ-ÿ+#./-]{2,}\b", text or "")


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, " ".join(_words(a.lower())), " ".join(_words(b.lower()))).ratio()


def validate_letter_result(
    letter_result: dict,
    application_context: dict,
    cv_markdown: str,
    lm_demo: str = "",
    validation_output_path: str | Path | None = None,
    failed_output_path: str | Path | None = None,
    lm_docx_path: str | Path | None = None,
) -> dict:
    errors: list[str] = []
    warnings: list[str] = []
    final_letter = str(letter_result.get("final_letter", "")).strip()

    company = str(application_context.get("company", "")).strip()
    job_title = str(application_context.get("job_title", "")).strip()
    allowed_numbers = set(application_context.get("allowed_numbers", [])) | _numbers(cv_markdown)
    selected_facts = application_context.get("selected_company_facts", [])[:3]
    excluded_facts = application_context.get("excluded_company_facts", [])

    if not final_letter:
        errors.append("missing_final_letter")
    word_count = len(_words(final_letter))
    if final_letter and not 120 <= word_count <= 420:
        errors.append(f"length_out_of_range: {word_count}_words")
    if _has_markdown(final_letter):
        errors.append("contains_markdown")
    if _contains_annotation(final_letter):
        errors.append("contains_demo_annotation")
    if _contains_placeholder(final_letter):
        errors.append("contains_placeholder")
    if company and company.casefold() not in final_letter.casefold():
        errors.append("company_not_mentioned")
    if job_title and not _job_title_is_mentioned(job_title, final_letter):
        errors.append("job_title_not_mentioned")

    invented_numbers = sorted(number for number in _numbers(final_letter) if number not in allowed_numbers)
    for number in invented_numbers:
        errors.append(f"invented_number: {number}")

    cv_lower = _normalize(cv_markdown)
    for experience in letter_result.get("cv_experiences_used", []):
        if experience and _normalize(str(experience)) not in cv_lower:
            errors.append(f"experience_absent_from_cv: {experience}")
    for tool in letter_result.get("cv_technical_terms_reused", []):
        if tool and _normalize(str(tool)) not in cv_lower:
            errors.append(f"tool_absent_from_cv: {tool}")

    allowed_fact_texts = [_normalize(fact.get("fact", "")) for fact in selected_facts if isinstance(fact, dict)]
    retained_facts = [str(fact) for fact in letter_result.get("facts_retained", [])]
    if len(retained_facts) > 3:
        errors.append("too_many_company_facts")
    for fact in retained_facts:
        fact_norm = _normalize(fact)
        if fact_norm and not any(fact_norm in allowed or allowed in fact_norm for allowed in allowed_fact_texts):
            errors.append(f"unauthorized_company_fact: {fact}")

    final_lower = _normalize(final_letter)
    for fact in excluded_facts:
        text = fact.get("fact", "") if isinstance(fact, dict) else str(fact)
        if text and _normalize(text) in final_lower:
            errors.append(f"excluded_company_fact_used: {text}")

    for benefit in BANAL_BENEFITS:
        if benefit in final_lower:
            errors.append(f"banal_benefit_used: {benefit}")
    for cliché in BANNED_CLICHES:
        if cliché in final_lower:
            errors.append(f"cliche_phrase: {cliché}")

    if lm_demo and _similarity(final_letter, lm_demo) > 0.72:
        errors.append("copies_demo_too_closely")

    quality_check = letter_result.get("quality_check", {})
    if isinstance(quality_check, dict):
        for key in [
            "uses_only_cv_profile",
            "uses_cv_markdown_as_source",
            "no_fake_numbers",
            "no_fake_experience",
            "no_fake_company_fact",
            "no_demo_annotations_in_final_letter",
        ]:
            if quality_check.get(key) is not True:
                errors.append(f"quality_check_failed: {key}")

    status = "success" if not errors else "failed"
    timestamp = datetime.now().isoformat(timespec="seconds")
    report = {
        "validation_status": status,
        "company": company,
        "job_title": job_title,
        "job_family": application_context.get("job_family", ""),
        "cv_docx_path": application_context.get("cv_docx_path", ""),
        "cv_markdown_path": application_context.get("cv_markdown_path", ""),
        "lm_docx_path": str(lm_docx_path) if status == "success" and lm_docx_path else None,
        "failed_output_path": str(failed_output_path) if status == "failed" and failed_output_path else None,
        "tracker_update_status": "pending",
        "company_research_status": application_context.get("company_research_status", ""),
        "used_company_facts": selected_facts,
        "excluded_company_facts": excluded_facts,
        "used_cv_experiences": letter_result.get("cv_experiences_used", []),
        "used_cv_terms": letter_result.get("cv_technical_terms_reused", []),
        "learning_angle_used": bool(letter_result.get("learning_angle_used", False)),
        "errors": errors,
        "warnings": warnings,
        "timestamp": timestamp,
    }

    if validation_output_path:
        path = Path(validation_output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    return report


def _job_title_is_mentioned(job_title: str, final_letter: str) -> bool:
    title_words = [word for word in _words(job_title.casefold()) if len(word) > 2]
    final = final_letter.casefold()
    if job_title.casefold() in final:
        return True
    if not title_words:
        return True
    matched = sum(1 for word in title_words if word in final)
    return matched >= max(1, min(3, len(title_words)))
