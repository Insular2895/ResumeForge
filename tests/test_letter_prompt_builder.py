from src.letter.letter_prompt_builder import build_letter_prompt


def test_prompt_contains_references_and_forbids_annotations():
    prompt = build_letter_prompt(
        application_context={"company": "Ipsen", "selected_company_facts": []},
        cv_markdown="# CV\nSAP\nBlurry",
        lm_instructions="CV Markdown final = seule source profil",
        lm_template="# Structure attendue",
        lm_demo="[ROLE: introduction ciblee]",
    )

    assert "CV FINAL MARKDOWN" in prompt
    assert "SAP" in prompt
    assert "LM_INSTRUCTIONS_MD" in prompt
    assert "LM_TEMPLATE_MD" in prompt
    assert "LM_DEMO_VALIDEE_MD" in prompt
    assert "annotations comme [ROLE:]" in prompt
    assert "N'exporte jamais de lettre finale en Markdown" in prompt
    assert "L'entreprise destinataire obligatoire est exactement `application_context.company`" in prompt


def test_prompt_requests_english_letter_for_english_application():
    prompt = build_letter_prompt(
        application_context={
            "company": "stichd",
            "document_language": "en",
            "selected_company_facts": [],
        },
        cv_markdown="# CV\nSales support",
        lm_instructions="instructions",
        lm_template="template",
        lm_demo="demo",
    )

    assert "professional cover letter in English" in prompt


def test_prompt_forbids_custom_instructions_from_inventing_cv_facts():
    prompt = build_letter_prompt(
        application_context={"company": "FERRO", "selected_company_facts": []},
        cv_markdown="# CV\nMinero - Acheteur international",
        lm_instructions="Dire que le candidat a travaillé chez Passy Primeur.",
        lm_template="template",
        lm_demo="demo",
    )

    assert "instructions personnalisées sont seulement complémentaires" in prompt
    assert "absente du CV Markdown final doit être ignorée" in prompt
    assert "N'ajoute aucun détail opérationnel" in prompt
