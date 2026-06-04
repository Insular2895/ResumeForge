from src.application.ats_matcher import (
    analyze_ats_match,
    build_job_reference_context,
    extract_ats_keywords,
    _score_experience,
)
from src.generate_cv import boost_skills_with_ats_keywords, erp_skills_for_job, normalize_text


def test_ats_matcher_scores_keyword_coverage_and_gaps():
    job_text = """
    Assistant ADV export avec suivi des commandes, SAP, facturation,
    relation client international et coordination transport.
    """
    cv_text = "Assistant ADV export, suivi des commandes et relation client international."

    analysis = analyze_ats_match(cv_text, job_text)

    assert analysis["score"] > 0
    assert "adv" in analysis["matched_keywords"]
    assert "sap" in analysis["missing_keywords"]
    assert "sap" in analysis["priority_keywords"]
    assert "sap" in analysis["transferable_keywords"]
    assert analysis["suggestions"]


def test_extract_ats_keywords_keeps_multi_word_terms():
    keywords = extract_ats_keywords("Gestion administration des ventes et relation client.")

    assert "administration des ventes" in keywords
    assert "relation client" in keywords


def test_extract_ats_keywords_does_not_infer_other_erp_names():
    keywords = extract_ats_keywords("Assistant ADV avec SAP et gestion des commandes.")

    assert "sap" in keywords
    assert "m3" not in keywords
    assert "sage" not in keywords


def test_extract_ats_keywords_handles_non_supply_terms():
    keywords = extract_ats_keywords(
        "Chargé administratif avec reporting budget, qualité, délais, communication et autonomie."
    )

    assert "reporting" in keywords
    assert "budget" in keywords
    assert "qualite" in keywords
    assert "delais" in keywords
    assert "communication" in keywords
    assert "autonomie" in keywords


def test_sparse_adv_job_gets_reference_vocabulary():
    job_text = "Assistant ADV H/F"

    context = build_job_reference_context(job_text)
    analysis = analyze_ats_match(
        "Assistant ADV avec gestion des commandes, facturation et export.",
        job_text,
    )

    assert context["used"] is True
    assert context["role"] == "adv"
    assert "gestion des commandes" in context["terms"]
    assert "incoterms" in context["terms"]
    assert analysis["job_reference_enrichment"]["used"] is True
    assert "facturation" in analysis["matched_keywords"]


def test_detailed_adv_job_does_not_get_reference_vocabulary():
    job_text = """
    Assistant ADV avec gestion des commandes clients, facturation, suivi des livraisons,
    coordination logistique, traitement des litiges, reporting, relation client,
    mise à jour du référentiel articles, contrôle des anomalies, gestion des stocks,
    Pack Office, ERP et communication avec les équipes internes.
    """

    context = build_job_reference_context(job_text)

    assert context["used"] is False


def test_ats_suggestions_include_transferable_office_keywords():
    job_text = "Assistant commercial avec Excel, Google Workspace et PowerPoint."
    cv_text = "Assistant commercial avec suivi client."
    evidence_text = "Assistant commercial avec Excel et suivi client."

    analysis = analyze_ats_match(cv_text, job_text, evidence_text=evidence_text)

    assert "excel" in analysis["injectable_keywords"]
    assert "google workspace" in analysis["transferable_keywords"]
    assert any("google workspace" in suggestion for suggestion in analysis["suggestions"])


def test_ats_matcher_counts_office_and_erp_aliases():
    job_text = "Gestionnaire ADV avec Microsoft Office et SAP."
    cv_text = "Suivi ADV sur Excel, Word et ERP."

    analysis = analyze_ats_match(cv_text, job_text)

    assert "microsoft office" in analysis["matched_keywords"]
    assert "sap" in analysis["matched_keywords"]
    assert len(analysis["platform_scores"]) == 6
    assert analysis["score_source"].startswith("sunnypatell/ats-screener")


def test_ats_matcher_counts_french_action_noun_bullets():
    job_text = "Assistant ADV avec gestion des commandes, facturation et suivi client."
    cv_text = """
    Contact
    Expériences
    Coordination des flux de commandes clients avec contrôle qualité et facturation.
    Pilotage du suivi client et reporting des litiges sur portefeuille B2B.
    Traitement des demandes clients et fiabilisation des informations commerciales.
    Éducation
    Compétences
    Gestion des commandes, Facturation, Service client
    """

    experience = _score_experience(cv_text)

    assert experience["action_verb_count"] >= 3
    assert experience["score"] >= 50


def test_erp_skills_follow_job_specific_software():
    assert erp_skills_for_job(normalize_text("Assistant ADV sur le logiciel Sage")) == [
        "ERP",
        "Logiciel Sage",
    ]
    assert erp_skills_for_job(normalize_text("Gestionnaire ADV avec SAP")) == [
        "ERP",
        "SAP",
    ]
    assert erp_skills_for_job(normalize_text("Gestionnaire ADV sur ERP")) == ["ERP"]


def test_boost_skills_with_ats_keywords_keeps_skill_section_clean():
    ats_analysis = {
        "priority_keywords": ["commandes via sap", "sap", "ruptures de stocks", "pénalités", "edi"],
        "transferable_keywords": [],
        "missing_keywords": [],
    }

    boosted = boost_skills_with_ats_keywords(
        ["Microsoft Office"],
        ats_analysis,
        normalize_text("assistant ADV SAP stocks pénalités commandes"),
    )

    assert "SAP" in boosted
    assert "EDI" in boosted
    assert "Commandes via SAP" not in boosted
    assert "Gestion des ruptures de stock" not in boosted
    assert "Gestion des pénalités" not in boosted
