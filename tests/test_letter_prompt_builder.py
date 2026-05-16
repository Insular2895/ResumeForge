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

