import src.generate_cv as generate_cv


def test_english_cv_keeps_translated_candidate_even_if_ats_score_drops(monkeypatch):
    translated_experiences = [{"position": "Sales Analyst", "bullets": ["Managed orders"]}]
    translated_leadership = [{"role": "International Reseller", "bullets": ["Managed sales"]}]

    monkeypatch.setattr(
        generate_cv,
        "improve_full_cv_with_gemini",
        lambda *args, **kwargs: (translated_experiences, translated_leadership),
    )
    monkeypatch.setattr(generate_cv, "analyze_ats_match", lambda *args, **kwargs: {"score": 79})

    experiences, leadership, ats = generate_cv.optimize_cv_with_ats_guard(
        selected_experiences=[{"position": "Analyste", "bullets": ["Gestion"]}],
        selected_leadership=[{"role": "Revendeur", "bullets": ["Vente"]}],
        selected_certifications=[],
        selected_skills=[],
        job_text="English job",
        current_ats={"score": 83},
        document_language="en",
    )

    assert experiences == translated_experiences
    assert leadership == translated_leadership
    assert ats == {"score": 79}


def test_custom_cv_instructions_keep_candidate_even_if_ats_score_drops(monkeypatch):
    tailored_experiences = [{"position": "Acheteur", "bullets": ["Approvisionnement à Rungis"]}]
    tailored_leadership = []

    monkeypatch.setattr(
        generate_cv,
        "improve_full_cv_with_gemini",
        lambda *args, **kwargs: (tailored_experiences, tailored_leadership),
    )
    monkeypatch.setattr(generate_cv, "analyze_ats_match", lambda *args, **kwargs: {"score": 79})
    monkeypatch.setattr(generate_cv, "is_override_active", lambda kind: kind == "cv")

    experiences, leadership, ats = generate_cv.optimize_cv_with_ats_guard(
        selected_experiences=[{"position": "Acheteur", "bullets": ["Achats"]}],
        selected_leadership=[],
        selected_certifications=[],
        selected_skills=[],
        job_text="Acheteur fruits et légumes",
        current_ats={"score": 83},
        document_language="fr",
    )

    assert experiences == tailored_experiences
    assert leadership == tailored_leadership
    assert ats == {"score": 79}
