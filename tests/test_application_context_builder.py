from src.application import application_context_builder


def test_application_context_exposes_dynamic_translation_bounded_by_final_cv(tmp_path, monkeypatch):
    cv_markdown = tmp_path / "cv.md"
    cv_markdown.write_text("Mesure de signaux et analyse acoustique.", encoding="utf-8")
    cv_docx = tmp_path / "cv.docx"
    cv_docx.write_bytes(b"docx")
    model = {
        "label": "Ingénierie acoustique",
        "layers": {
            "concepts": ["analyse acoustique"],
            "actions": ["mesurer"],
            "objects": ["signaux"],
            "results": ["réduction du bruit"],
        },
        "questions": [],
    }
    captured = {}
    monkeypatch.setenv("RESUMEFORGE_TARGET_DOMAIN", "acoustic_engineering")
    monkeypatch.setattr(
        application_context_builder,
        "resolve_target_domain",
        lambda job_text, requested_domain="": captured.setdefault(
            "resolved",
            {"key": requested_domain, "model": model, "dynamic": True},
        ),
    )

    context = application_context_builder.build_application_context(
        {"raw_text": "Ingénieur acoustique", "company": "A", "job_title": "Ingénieur", "keywords": []},
        cv_docx,
        cv_markdown,
        {},
        [],
        [],
        "not_requested",
        tmp_path / "context.json",
    )

    assert context["career_translation_domain"] == "acoustic_engineering"
    assert captured["resolved"]["key"] == "acoustic_engineering"
    assert "analyse acoustique" in context["career_translation_context"]["supported_terms"]
    assert "réduction du bruit" in context["career_translation_context"]["unsupported_terms"]
