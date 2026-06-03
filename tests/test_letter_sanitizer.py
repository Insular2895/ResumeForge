from src.letter.letter_sanitizer import sanitize_letter_result
from src.letter.letter_validator import validate_letter_result


def test_sanitizer_replaces_mastery_and_absent_sap_ewm_claims():
    result = {
        "facts_retained": [],
        "cv_experiences_used": ["Blurry"],
        "cv_technical_terms_reused": ["SAP", "SAP EWM"],
        "learning_angle_used": True,
        "quality_check": {
            "uses_only_cv_profile": True,
            "uses_cv_markdown_as_source": True,
            "no_fake_numbers": True,
            "no_fake_experience": True,
            "no_fake_company_fact": True,
            "no_demo_annotations_in_final_letter": True,
        },
        "final_letter": "Ma maîtrise des outils SAP et SAP EWM soutient mon action chez Spera.",
    }

    sanitized = sanitize_letter_result(result, cv_markdown="Blurry\nSAP\n")

    assert "maîtrise" not in sanitized["final_letter"].casefold()
    assert "SAP EWM" not in sanitized["final_letter"]
    assert sanitized["cv_technical_terms_reused"] == ["SAP"]


def test_validator_accepts_letters_up_to_450_words():
    final_letter = " ".join(["Ipsen Coordinateur ADV Import-Export Blurry SAP"] * 70)
    result = {
        "facts_retained": [],
        "cv_experiences_used": ["Blurry"],
        "cv_technical_terms_reused": ["SAP"],
        "quality_check": {
            "uses_only_cv_profile": True,
            "uses_cv_markdown_as_source": True,
            "no_fake_numbers": True,
            "no_fake_experience": True,
            "no_fake_company_fact": True,
            "no_demo_annotations_in_final_letter": True,
        },
        "final_letter": final_letter,
    }
    context = {
        "company": "Ipsen",
        "job_title": "Coordinateur ADV Import-Export",
        "selected_company_facts": [],
        "excluded_company_facts": [],
        "allowed_numbers": [],
    }

    report = validate_letter_result(result, context, cv_markdown="Blurry\nSAP")

    assert report["validation_status"] == "success"
