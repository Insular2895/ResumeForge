from copy import deepcopy

from src.llm import cv_enhancer


def test_gemini_payload_has_no_leadership_and_keeps_nominal_french(monkeypatch):
    captured = {}
    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)

    def fake_ask(prompt):
        captured["prompt"] = prompt
        return '{"experiences":[{"index":0,"position":"ADV","bullets":["Géré les commandes clients"]}]}'

    monkeypatch.setattr(cv_enhancer, "ask_gemini", fake_ask)
    result = cv_enhancer.improve_full_cv_with_gemini(
        [{"position": "ADV", "bullets": ["Géré les commandes clients"]}],
        "Gestionnaire ADV",
    )
    assert '"leadership"' not in captured["prompt"]
    assert result[0]["bullets"] == ["Gestion des commandes clients"]


def test_gemini_rewrite_that_drops_numbers_or_tools_falls_back_per_bullet(monkeypatch):
    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)
    monkeypatch.setattr(
        cv_enhancer,
        "ask_gemini",
        lambda prompt: '{"experiences":[{"index":0,"bullets":["Gestion de nombreuses commandes."]}]}',
    )
    source = [{"position": "ADV", "bullets": ["Géré 300 commandes dans SAP."]}]
    result = cv_enhancer.improve_full_cv_with_gemini(source, "Gestionnaire ADV SAP")
    assert result[0]["bullets"] == ["Gestion de 300 commandes dans SAP."]


def test_gemini_invalid_json_uses_functional_fallback_without_mutating_source(monkeypatch):
    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)
    monkeypatch.setattr(cv_enhancer, "ask_gemini", lambda prompt: "not-json")
    source = [{"position": "ADV", "bullets": ["Créé un reporting mensuel"]}]
    snapshot = deepcopy(source)
    result = cv_enhancer.improve_full_cv_with_gemini(source, "Gestionnaire ADV")
    assert source == snapshot
    assert result[0]["bullets"] == ["Création d’un reporting mensuel"]
