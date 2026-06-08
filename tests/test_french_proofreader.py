from src.letter.french_proofreader import (
    apply_known_french_corrections,
    check_french_text,
)


def test_known_cv_typos_are_corrected_before_rendering():
    content = {
        "role": "Devellopper web",
        "certifications": ["Portflio and risk management"],
    }

    corrected = apply_known_french_corrections(content)

    assert corrected["role"] == "Développeur web"
    assert corrected["certifications"] == ["Portfolio and risk management"]


def test_french_checker_rejects_clear_spelling_error():
    report = check_french_text(
        "Cette lettre ne doit contenir aucune faute d'ortographe.",
    )

    assert report["status"] == "failed"
    assert any(issue["suggestion"] == "orthographe" for issue in report["issues"])


def test_french_checker_allows_professional_terms_and_proper_names():
    report = check_french_text(
        "Cuisinella recherche un profil ADV capable de produire un reporting fiable.",
    )

    assert report["status"] == "success"


def test_french_checker_allows_ellipsis_but_rejects_repeated_exclamation():
    assert check_french_text("Organisation, suivi, coordination...")["status"] == "success"
    assert check_french_text("Organisation impeccable!!!")["status"] == "failed"
