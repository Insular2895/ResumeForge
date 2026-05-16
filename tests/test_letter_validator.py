from pathlib import Path

from src.letter.letter_validator import validate_letter_result


def _context():
    return {
        "company": "Ipsen",
        "job_title": "Coordinateur ADV Import-Export",
        "job_family": "operations_supply_chain",
        "cv_docx_path": "data/output/CV.docx",
        "cv_markdown_path": "data/output/CV.md",
        "allowed_numbers": ["12"],
        "selected_company_facts": [
            {"fact": "Ipsen developpe des traitements avec une logique patient.", "source_url": "https://ipsen.com"}
        ],
        "excluded_company_facts": [{"fact": "tickets restaurant", "reason": "banal"}],
    }


def _valid_result():
    return {
        "facts_retained": ["Ipsen developpe des traitements avec une logique patient."],
        "cv_experiences_used": ["Blurry"],
        "cv_technical_terms_reused": ["SAP"],
        "learning_angle_used": True,
        "quality_check": {
            "uses_only_cv_profile": True,
            "uses_cv_markdown_as_source": True,
            "no_fake_numbers": True,
            "no_fake_experience": True,
            "no_fake_company_fact": True,
            "no_demo_annotations_in_final_letter": True,
        },
        "final_letter": (
            "Je souhaite vous proposer ma candidature au poste de Coordinateur ADV Import-Export chez Ipsen. "
            "Mon parcours chez Blurry m'a amene a travailler sur la coordination de flux, le suivi de commandes "
            "et l'utilisation de SAP dans un environnement operationnel. Cette experience m'a appris a structurer "
            "les informations, a suivre les priorites et a communiquer avec plusieurs interlocuteurs pour garder "
            "un niveau fiable d'execution. Ipsen developpe des traitements avec une logique patient, ce qui donne "
            "un cadre concret a mon envie de progresser dans des operations exigeantes. Je souhaite rejoindre une "
            "equipe ou mon sens du suivi, ma rigueur et ma capacite d'apprentissage peuvent contribuer rapidement, "
            "tout en construisant une progression durable sur les sujets ADV et import-export. Je serais disponible "
            "pour echanger afin de vous presenter plus en detail ma motivation et la maniere dont mon profil peut "
            "repondre aux besoins du poste."
        ),
    }


def test_validator_accepts_valid_letter(tmp_path):
    report = validate_letter_result(
        _valid_result(),
        _context(),
        cv_markdown="Blurry\nSAP\n12 partenaires",
        validation_output_path=tmp_path / "validation.json",
    )

    assert report["validation_status"] == "success"
    assert Path(tmp_path / "validation.json").exists()


def test_validator_rejects_inventions_and_markdown():
    result = _valid_result()
    result["final_letter"] = "- [ROLE: test] Ipsen Coordinateur ADV Import-Export 500000 tickets restaurant"
    result["cv_technical_terms_reused"] = ["Salesforce"]
    result["facts_retained"] = ["Ipsen a annonce une actualite non autorisee."]

    report = validate_letter_result(result, _context(), cv_markdown="Blurry\nSAP\n12 partenaires")

    assert report["validation_status"] == "failed"
    assert "contains_markdown" in report["errors"]
    assert "contains_demo_annotation" in report["errors"]
    assert "invented_number: 500000" in report["errors"]
    assert "tool_absent_from_cv: Salesforce" in report["errors"]
    assert any(error.startswith("unauthorized_company_fact") for error in report["errors"])

