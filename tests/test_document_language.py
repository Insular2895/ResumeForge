from src.application.document_language import detect_document_language


def test_explicit_english_cv_request_wins_over_french_job_board_text():
    text = """
    Détails de l'emploi
    Description du poste
    The Job: Manage orders and support key accounts.
    If interested, send in your CV (in English).
    """

    assert detect_document_language(text) == "en"


def test_predominantly_english_job_is_english():
    text = """
    We are looking for a Sales Support Representative.
    You will manage customer orders, forecasts, deliveries, and reporting.
    Strong written and verbal English communication is required.
    """

    assert detect_document_language(text) == "en"


def test_french_job_remains_french():
    text = """
    Nous recherchons un assistant commercial.
    Vous assurez le suivi des commandes, la relation client et les livraisons.
    Une bonne maîtrise du français est requise.
    """

    assert detect_document_language(text) == "fr"
