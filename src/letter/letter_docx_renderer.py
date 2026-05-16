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
    return {
        "[[LM_DATE]]": datetime.now().strftime("%d/%m/%Y"),
        "[[LM_COMPANY]]": application_context.get("company", ""),
        "[[LM_JOB_TITLE]]": application_context.get("job_title", ""),
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

