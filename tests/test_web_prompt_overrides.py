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


def test_effective_lm_instructions_prefers_override(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path / "config")
    default_path = tmp_path / "default.md"
    default_path.write_text("Instructions originales", encoding="utf-8")

    assert prompt_overrides.load_effective_lm_instructions(default_path) == "Instructions originales"

    prompt_overrides.save_override("lm", "Instructions personnalisées")

    assert prompt_overrides.load_effective_lm_instructions(default_path) == "Instructions personnalisées"


def test_append_cv_override_leaves_prompt_unchanged_without_override(tmp_path, monkeypatch):
    monkeypatch.setattr(prompt_overrides, "LOCAL_CONFIG_DIR", tmp_path)

    assert prompt_overrides.append_cv_override("Prompt principal") == "Prompt principal"

    prompt_overrides.save_override("cv", "Ne change jamais les chiffres.")

    effective = prompt_overrides.append_cv_override("Prompt principal")
    assert "Prompt principal" in effective
    assert "Ne change jamais les chiffres." in effective


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
        return '{"experiences": [], "leadership": []}'

    monkeypatch.setattr(cv_enhancer, "ask_gemini", fake_ask)

    cv_enhancer.improve_full_cv_with_gemini([], [], "Offre")

    assert captured["prompt"].endswith("CUSTOM")
