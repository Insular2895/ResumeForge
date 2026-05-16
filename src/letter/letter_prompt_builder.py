import json


STRICT_JSON_SCHEMA = {
    "company_identified": "",
    "sources_used": [],
    "facts_retained": [],
    "facts_excluded": [],
    "job_family": "",
    "useful_job_vocabulary": [],
    "cv_experiences_used": [],
    "cv_technical_terms_reused": [],
    "transferable_skills_linked": [],
    "education_used": [],
    "learning_angle_used": True,
    "final_letter": "",
    "quality_check": {
        "uses_only_cv_profile": True,
        "uses_cv_markdown_as_source": True,
        "no_fake_numbers": True,
        "no_fake_experience": True,
        "no_fake_company_fact": True,
        "tone_professional": True,
        "not_generic": True,
        "no_demo_annotations_in_final_letter": True,
    },
}


def build_letter_prompt(
    application_context: dict,
    cv_markdown: str,
    lm_instructions: str,
    lm_template: str,
    lm_demo: str,
) -> str:
    """Build the strict Gemini prompt for cover letter generation."""
    context_json = json.dumps(application_context, ensure_ascii=False, indent=2)
    schema_json = json.dumps(STRICT_JSON_SCHEMA, ensure_ascii=False, indent=2)

    return f"""Tu generes une lettre de motivation en francais pour ResumeForge.

CONTRAINTE ABSOLUE:
- Retourne uniquement un objet JSON valide.
- N'ajoute aucun markdown autour du JSON.
- `final_letter` doit etre du texte brut pret a injecter dans un DOCX.
- N'exporte jamais de lettre finale en Markdown.
- Ne lis et n'utilise jamais master_profile.xlsx.
- La seule source profil autorisee est le CV Markdown final fourni ci-dessous.
- application_context.json controle toutes les affirmations autorisees.

INTERDICTIONS DANS final_letter:
- markdown
- bullet points
- annotations comme [ROLE:], [VALEUR:], [CV_PROOF:]
- placeholders comme [[...]]
- phrases cliches
- avantages banals
- invention d'elements non autorises

JSON STRICT A RETOURNER:
{schema_json}

APPLICATION_CONTEXT_JSON:
{context_json}

CV FINAL MARKDOWN:
{cv_markdown}

LM_INSTRUCTIONS_MD:
{lm_instructions}

LM_TEMPLATE_MD:
{lm_template}

LM_DEMO_VALIDEE_MD:
{lm_demo}
"""

