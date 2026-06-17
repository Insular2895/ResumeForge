from src.application.career_translation import (
    assess_all_domains,
    assess_coverage,
    build_translation_context,
    build_dynamic_domain_prompt,
    infer_target_domain,
    load_career_domain,
    resolve_target_domain,
)


def test_domain_model_contains_the_four_translation_layers():
    domain = load_career_domain("procurement")

    assert domain["label"] == "Achats"
    assert set(domain["layers"]) == {"concepts", "actions", "objects", "results"}
    assert "TCO" in domain["layers"]["concepts"]
    assert "sourcer" in domain["layers"]["actions"]


def test_coverage_explains_matches_and_requests_enrichment_when_weak():
    assessment = assess_coverage(
        "Je négociais avec des fournisseurs et suivais les commandes.",
        "data_analytics",
    )

    assert assessment["status"] == "enrichment_required"
    assert assessment["overall_score"] < assessment["threshold"]
    assert assessment["layers"]["actions"]["score"] >= 0
    assert assessment["questions"]
    assert any("Excel" in question for question in assessment["questions"])


def test_coverage_is_ready_when_each_layer_has_real_evidence():
    assessment = assess_coverage(
        """
        J'ai sourcé et qualifié des fournisseurs, négocié des contrats et comparé
        le TCO des offres afin de réduire les coûts et le risque fournisseur.
        """,
        "procurement",
    )

    assert assessment["status"] == "ready"
    assert assessment["layers"]["concepts"]["matched"]
    assert assessment["layers"]["results"]["matched"]


def test_coverage_requires_a_minimum_in_every_layer_not_only_a_good_average():
    assessment = assess_coverage(
        "Sourcer qualifier sélectionner fournisseurs contrats offres coûts risques.",
        "procurement",
    )

    assert assessment["overall_score"] >= assessment["threshold"]
    assert assessment["status"] == "enrichment_required"
    assert assessment["layers"]["concepts"]["minimum_met"] is False
    assert assessment["layers"]["results"]["minimum_met"] is False


def test_translation_context_only_exposes_supported_terms():
    context = build_translation_context(
        "Gestion des stocks FIFO et coordination des expéditions import-export.",
        "supply_chain",
    )

    assert "FIFO" in context["supported_terms"]
    assert "import-export" in context["supported_terms"]
    assert "OTIF" not in context["supported_terms"]
    assert "OTIF" in context["unsupported_terms"]
    assert "Ne jamais inventer" in context["credibility_rule"]


def test_real_world_evidence_can_support_a_domain_concept_without_the_acronym():
    context = build_translation_context(
        "Gestion de partenaires fournisseurs et suivi de leur performance.",
        "procurement",
    )

    assert "SRM" in context["supported_terms"]
    assert "RFI/RFQ/RFP" in context["unsupported_terms"]


def test_assess_all_domains_returns_a_score_for_every_configured_domain():
    assessments = assess_all_domains("Gestion de fournisseurs, stocks et commandes.")

    assert "procurement" in assessments
    assert "supply_chain" in assessments
    assert all("overall_score" in assessment for assessment in assessments.values())


def test_infer_target_domain_from_job_text():
    assert infer_target_domain("Acheteur international et sourcing fournisseurs") == "procurement"
    assert infer_target_domain("Data Analyst SQL Power BI") == "data_analytics"


def test_unknown_job_does_not_fall_back_to_operations():
    assert infer_target_domain("Ingénieur acoustique spécialisé en vibrations ferroviaires") == ""


def test_dynamic_domain_prompt_requires_the_four_layers_and_credibility_controls():
    prompt = build_dynamic_domain_prompt("Ingénieur acoustique spécialisé en vibrations ferroviaires")

    assert '"concepts"' in prompt
    assert '"actions"' in prompt
    assert '"objects"' in prompt
    assert '"results"' in prompt
    assert "n'invente aucune vérité candidat" in prompt


def test_unknown_job_builds_and_caches_a_dynamic_domain(tmp_path):
    generated = {
        "domain": "acoustic_engineering",
        "label": "Ingénierie Acoustique",
        "aliases": ["ingénieur acoustique", "vibrations ferroviaires"],
        "layers": {
            "concepts": ["analyse vibratoire", "acoustique"],
            "actions": ["mesurer", "modéliser"],
            "objects": ["vibrations", "signaux"],
            "results": ["réduction du bruit"],
        },
        "questions": ["Quels outils de mesure acoustique utilisiez-vous ?"],
    }

    resolved = resolve_target_domain(
        "Ingénieur acoustique spécialisé en vibrations ferroviaires",
        cache_dir=tmp_path,
        generator=lambda job_text: generated,
    )
    cached = resolve_target_domain(
        "Ingénieur acoustique spécialisé en vibrations ferroviaires",
        cache_dir=tmp_path,
        generator=lambda job_text: (_ for _ in ()).throw(AssertionError("cache non utilisé")),
    )

    assert resolved["key"] == "acoustic_engineering"
    assert resolved["model"]["layers"]["objects"] == ["vibrations", "signaux"]
    assert cached == resolved
    assert (tmp_path / "acoustic_engineering.json").exists()
