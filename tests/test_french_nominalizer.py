import pytest

from src.application.french_nominalizer import nominalize_french_bullet


@pytest.mark.parametrize(
    ("source", "expected"),
    [
        ("Créé un tableau de suivi des commandes", "Création d’un tableau de suivi des commandes"),
        ("Piloté les expéditions internationales", "Pilotage des expéditions internationales"),
        ("Géré les commandes clients", "Gestion des commandes clients"),
        ("Coordonné les prestataires", "Coordination des prestataires"),
        ("Mis en place un reporting mensuel", "Mise en place d’un reporting mensuel"),
        ("Analysé les écarts budgétaires", "Analyse des écarts budgétaires"),
    ],
)
def test_nominalization_is_grammatical(source, expected):
    assert nominalize_french_bullet(source) == expected


def test_nominalization_preserves_numbers_and_tools():
    result = nominalize_french_bullet("Créé un reporting Excel avec 300 commandes sur SAP")
    assert result == "Création d’un reporting Excel avec 300 commandes sur SAP"


def test_already_nominal_bullet_is_unchanged():
    source = "Gestion des commandes clients et suivi des litiges"
    assert nominalize_french_bullet(source) == source


def test_second_sentence_is_nominalized_too():
    source = "Piloté les expéditions internationales. Supervisé les opérations via SAP."
    assert nominalize_french_bullet(source) == (
        "Pilotage des expéditions internationales. Supervision des opérations via SAP."
    )
