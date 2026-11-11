from pathlib import Path

import pytest

from src.web import prompt_overrides


def test_prompt_override_round_trip_and_reset(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path)

    saved = prompt_overrides.save_override("cv", "Reste factuel.")

    assert saved == tmp_path / "cv_prompt.txt"
    assert prompt_overrides.load_override("cv") == "Reste factuel."
    assert prompt_overrides.reset_override("cv") is True
    assert prompt_overrides.load_override("cv") is None


def test_prompt_override_rejects_empty_value(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path)

    with pytest.raises(ValueError, match="vide"):
        prompt_overrides.save_override("lm", "   ")


def test_effective_lm_instructions_appends_override_to_default_rules(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path / "config")
    default_path = tmp_path / "default.md"
    default_path.write_text("Instructions originales", encoding="utf-8")

    assert prompt_overrides.load_effective_lm_instructions(default_path) == "Instructions originales"

    prompt_overrides.save_override("lm", "Instructions personnalisées")

    effective = prompt_overrides.load_effective_lm_instructions(default_path)
    assert "Instructions originales" in effective
    assert "Instructions personnalisées" in effective
    assert "uniquement si elles sont soutenues par le CV final" in effective


def test_append_cv_override_leaves_prompt_unchanged_without_override(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path)

    assert prompt_overrides.append_cv_override("Prompt principal") == "Prompt principal"

    prompt_overrides.save_override("cv", "Ne change jamais les chiffres.")

    effective = prompt_overrides.append_cv_override("Prompt principal")
    assert "Prompt principal" in effective
    assert "Ne change jamais les chiffres." in effective
    assert "ne peuvent jamais autoriser une invention" in effective


def test_override_is_active_only_for_non_empty_saved_prompt(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path)

    assert prompt_overrides.is_override_active("cv") is False

    prompt_overrides.save_override("cv", "Mettre en avant Rungis.")

    assert prompt_overrides.is_override_active("cv") is True


def test_cli_lm_loaders_use_effective_override(monkeypatch):
    import run_application
    import run_menu

    monkeypatch.setattr(
        prompt_overrides,
        "load_effective_lm_instructions",
        lambda path: "Instructions effectives",
    )

    assert run_application._load_lm_instructions() == "Instructions effectives"
    assert run_menu._load_lm_instructions() == "Instructions effectives"


def test_cv_enhancer_applies_custom_override_before_gemini(monkeypatch):
    from src.llm import cv_enhancer

    captured = {}
    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)
    monkeypatch.setattr(cv_enhancer, "append_cv_override", lambda prompt: prompt + "\nCUSTOM")

    def fake_ask(prompt):
        captured["prompt"] = prompt
        return '{"experiences": []}'

    monkeypatch.setattr(cv_enhancer, "ask_gemini", fake_ask)

    cv_enhancer.improve_full_cv_with_gemini([], "Offre")

    assert captured["prompt"].endswith("CUSTOM")


def test_cv_enhancer_uses_supported_translation_terms_and_forbids_unsupported(monkeypatch):
    from src.llm import cv_enhancer

    captured = {}
    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)
    monkeypatch.setattr(
        cv_enhancer,
        "ask_gemini",
        lambda prompt: captured.setdefault("prompt", prompt) or '{"experiences": []}',
    )

    cv_enhancer.improve_full_cv_with_gemini(
        [{"company": "Minero", "position": "Acheteur", "bullets": ["Sourcing et négociation fournisseurs."]}],
        "Acheteur international",
    )

    assert '"target_domain": "procurement"' in captured["prompt"]
    assert '"supported_terms"' in captured["prompt"]
    assert "Les termes non soutenus sont interdits" in captured["prompt"]


def test_cv_enhancer_uses_the_domain_resolved_by_the_web_flow(monkeypatch):
    from src.llm import cv_enhancer

    captured = {}
    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)
    monkeypatch.setattr(
        cv_enhancer,
        "resolve_target_domain",
        lambda job_text, requested_domain="": captured.setdefault(
            "resolved",
            {
                "key": requested_domain,
                "model": {
                    "label": "Acoustique",
                    "layers": {"concepts": ["acoustique"], "actions": ["mesurer"], "objects": ["signaux"], "results": ["réduction du bruit"]},
                    "questions": [],
                },
            },
        ),
    )
    monkeypatch.setattr(cv_enhancer, "ask_gemini", lambda prompt: '{"experiences": []}')

    cv_enhancer.improve_full_cv_with_gemini([], "Offre générique", target_domain="acoustic_engineering")

    assert captured["resolved"]["key"] == "acoustic_engineering"


def test_cv_enhancer_can_translate_user_validated_facts_without_changing_the_source(monkeypatch):
    from src.llm import cv_enhancer

    monkeypatch.setattr(cv_enhancer, "is_gemini_enabled", lambda: True)
    monkeypatch.setattr(
        cv_enhancer,
        "ask_gemini",
        lambda prompt: (
            '{"experiences":[{"index":0,"position":"Acheteur / Vendeur",'
            '"bullets":["Approvisionnement quotidien et gestion des stocks."]}]'
            '}'
        ),
    )
    source = [
        {
            "company": "Passy Primeur",
            "position": "Primeur sur les marchés",
            "bullets": ["Participation à l'approvisionnement auprès de fournisseurs à Rungis."],
            "facts_locked": True,
            "rewrite_locked": False,
        }
    ]

    experiences = cv_enhancer.improve_full_cv_with_gemini(source, "Acheteur fruits et légumes")

    assert source[0]["bullets"] == ["Participation à l'approvisionnement auprès de fournisseurs à Rungis."]
    assert experiences[0]["bullets"] == ["Approvisionnement quotidien et gestion des stocks."]
