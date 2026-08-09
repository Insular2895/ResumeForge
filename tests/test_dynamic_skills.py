from src.application.candidate_evidence import build_candidate_evidence_index
from src.application.dynamic_skills import derive_dynamic_skills
from src.application.job_skill_extractor import extract_job_skill_requirements


def _skills(title, description, experiences, certifications=None):
    requirements = extract_job_skill_requirements(title, description)
    evidence = build_candidate_evidence_index(experiences, certifications or [])
    return derive_dynamic_skills(requirements, evidence)


def test_adv_skills_are_supported_and_jd_only_tools_are_rejected():
    result = _skills(
        "Gestionnaire ADV",
        "Gestionnaire ADV demandant SAP, commandes, facturation et Power BI.",
        [
            {
                "tools_verified": "ERP",
                "truth_bullet_1": "Traitement et suivi des commandes clients et facturation.",
            }
        ],
    )
    assert "Gestion & suivi des commandes" in result.labels
    assert "Facturation" in result.labels
    assert "SAP" not in result.labels
    assert "Power BI" not in result.labels


def test_sap_is_allowed_only_when_sap_has_candidate_evidence():
    result = _skills(
        "Gestionnaire ADV",
        "Gestionnaire ADV demandant SAP, commandes et facturation.",
        [{"tools_verified": "ERP", "truth_bullet_1": "Suivi des commandes et facturation."}],
        [{"cert_name": "SAP Easy Access", "issuer": "SAP"}],
    )
    assert "SAP" in result.labels


def test_sql_and_power_bi_are_absent_without_evidence():
    result = _skills(
        "Data Analyst",
        "Data Analyst SQL Power BI",
        [{"truth_bullet_1": "Gestion des commandes clients."}],
    )
    assert "SQL" not in result.labels
    assert "Power BI" not in result.labels


def test_simple_excel_evidence_does_not_claim_advanced_level():
    result = _skills(
        "Analyste",
        "Maîtrise avancée d’Excel",
        [{"tools_verified": "Excel", "truth_bullet_1": "Reporting Excel simple."}],
    )
    assert result.labels == ("Excel",)
    assert result.matches[0].candidate_level != "advanced"


def test_validated_advanced_excel_evidence_can_render_the_level():
    result = _skills(
        "Analyste",
        "Maîtrise avancée d’Excel",
        [
            {
                "tools_verified": "Excel | VBA",
                "truth_bullet_1": "Création de tableaux croisés dynamiques avec fonctions avancées et macros validées.",
            }
        ],
    )
    assert result.labels == ("Excel avancé",)
    assert result.matches[0].candidate_level == "advanced"


def test_same_profile_produces_different_skills_for_three_job_families():
    profile = [
        {
            "tools_verified": "Excel | ERP | SAP | Notion | Meta Ads",
            "truth_bullet_1": "Traitement et suivi des commandes, facturation et coordination transport logistique.",
            "truth_bullet_2": "Reporting KPI et gestion des stocks import-export.",
            "truth_bullet_3": "Analyse financière, suivi budgétaire et gestion de portefeuille.",
            "truth_bullet_4": "Gestion de projet, planification des jalons et coordination des parties prenantes.",
            "truth_bullet_5": "Gestion de campagnes de marketing digital.",
        }
    ]
    adv = _skills("Gestionnaire ADV", "Commandes, facturation, SAP, transport et stocks", profile)
    finance = _skills(
        "Analyste financier junior",
        "Analyse financière, suivi budgétaire, gestion de portefeuille et Excel",
        profile,
    )
    project = _skills(
        "Chef de projet",
        "Gestion de projet, planning, jalons, parties prenantes et Notion",
        profile,
    )
    assert set(adv.labels) != set(finance.labels)
    assert set(finance.labels) != set(project.labels)
    assert "Gestion & suivi des commandes" in adv.labels
    assert "Analyse financière" in finance.labels
    assert "Gestion de projet" in project.labels


def test_communication_skills_are_deduced_from_real_content_evidence():
    result = _skills(
        "Community Manager",
        "Création de contenus, communication digitale et social media.",
        [
            {
                "job_title": "Community manager",
                "truth_bullet_1": "Création de contenus pour un public brésilien.",
                "truth_bullet_2": "Gestion d'actions publicitaires digitales et social media.",
            }
        ],
    )
    assert "Création de contenus" in result.labels
    assert "Communication digitale" in result.labels
    assert "Social media" in result.labels
