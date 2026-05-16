from __future__ import annotations

from datetime import datetime
from pathlib import Path

from src.config import BASE_COVER_LETTER_PATH
from src.render.docx_template import DocxTemplateRenderer


def build_letter_replacements(
    application_context: dict,
    final_letter: str,
    signature: str = "Lucas Pertusa",
) -> dict:
    company_address = application_context.get("company_address", {})
    candidate = application_context.get("candidate", {})
    return {
        "[[CANDIDATE_FULL_NAME]]": candidate.get("full_name", "Mr Lucas PERTUSA"),
        "[[CANDIDATE_ADDRESS_LINE_1]]": candidate.get("address_line_1", "1 Place des Bannes"),
        "[[CANDIDATE_ADDRESS_LINE_2]]": candidate.get("address_line_2", "27710 St Georges Motel"),
        "[[CANDIDATE_PHONE]]": candidate.get("phone", "07.66.40.32.00"),
        "[[CANDIDATE_EMAIL]]": candidate.get("email", "lucaspertusa.pro@gmail.com"),
        "[[LM_DATE]]": datetime.now().strftime("%d/%m/%Y"),
        "[[LM_COMPANY]]": application_context.get("company", ""),
        "[[LM_COMPANY_ADDRESS_LINE_1]]": company_address.get("line_1", ""),
        "[[LM_COMPANY_POSTAL_CITY]]": company_address.get("postal_city", ""),
        "[[LM_ATTENTION_TO]]": application_context.get("attention_to", "des ressources humaines"),
        "[[LM_DEPARTMENT]]": application_context.get("department", ""),
        "[[LM_JOB_TITLE]]": application_context.get("job_title", ""),
        "[[LM_SALUTATION]]": application_context.get("salutation", "Madame, Monsieur"),
        "[[LM_FINAL_LETTER]]": final_letter.strip(),
        "[[LM_SIGNATURE]]": signature,
        "[[LM_OBJECT]]": f"Candidature au poste de {application_context.get('job_title', '')}",
        "[[LM_CITY]]": "Paris",
        "[[LM_RECIPIENT]]": "Madame, Monsieur",
    }


def render_letter_docx(
    application_context: dict,
    final_letter: str,
    output_path: str | Path,
    template_path: str | Path = BASE_COVER_LETTER_PATH,
) -> Path:
    template_path = Path(template_path)
    if not template_path.exists():
        raise FileNotFoundError(
            "Template LM prive introuvable. Cree-le avec: "
            "cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx"
        )

    renderer = DocxTemplateRenderer(template_path)
    replacements = build_letter_replacements(application_context, final_letter)
    return renderer.render(replacements, output_path)
