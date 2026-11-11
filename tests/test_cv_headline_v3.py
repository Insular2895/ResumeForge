import pytest

from src.generate_cv import build_cv_headline


@pytest.mark.parametrize(
    ("source", "expected"),
    [
        ("Gestionnaire ADV Export H/F", "GESTIONNAIRE ADV EXPORT"),
        ("Assistant Commercial et ADV F/H - CDI", "ASSISTANT COMMERCIAL ET ADV"),
        ("Order Management Specialist", "ORDER MANAGEMENT SPECIALIST"),
        ("Coordinateur Supply Chain H/F - Paris", "COORDINATEUR SUPPLY CHAIN"),
        ("Chargé de production eZyness F/H", "CHARGÉ DE PRODUCTION EZYNESS"),
    ],
)
def test_cv_headline_uses_the_exact_cleaned_job_title(source, expected):
    assert build_cv_headline({"job_title": source}) == expected


def test_cv_headline_never_promotes_the_hierarchy_level():
    assert build_cv_headline({"job_title": "Assistant ADV"}) == "ASSISTANT ADV"
