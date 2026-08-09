import pandas as pd

import src.generate_cv as generate_cv


def test_exact_food_market_evidence_outranks_generic_retail_experience():
    job = generate_cv.parse_job(
        "Acheteur fruits et légumes à Rungis. Gestion fournisseurs, achats, stocks et prix."
    )
    exact_domain = pd.Series(
        {
            "company": "Passy Primeur",
            "job_title": "Primeur sur les marchés",
            "industry_tags": "fruits_legumes | agroalimentaire | rungis",
            "job_family_tags": "achats | approvisionnement | retail",
            "truth_bullet_1": "Approvisionnement en fruits et légumes auprès de fournisseurs à Rungis.",
        }
    )
    generic_retail = pd.Series(
        {
            "company": "Orion trading",
            "job_title": "Acheteur médias junior",
            "industry_tags": "retail | advertising",
            "job_family_tags": "achats | supply",
            "truth_bullet_1": "Suivi d'achats et de budgets.",
        }
    )

    assert generate_cv.score_row(exact_domain, job) > generate_cv.score_row(generic_retail, job)


def test_procurement_experience_outranks_media_buying_for_non_media_supply_job():
    job = generate_cv.parse_job(
        "Acheteur fruits et légumes. Sourcing fournisseurs, négociation, logistique et stocks."
    )
    procurement = pd.Series(
        {
            "company": "Minero",
            "job_title": "Acheteur international",
            "industry_tags": "ecommerce | consumer_goods",
            "job_family_tags": "procurement | achats | logistics",
            "skills_verified": "product_sourcing | supplier_negotiation | inventory_management",
            "truth_bullet_1": "Sourcing fournisseurs, négociation des achats et coordination logistique.",
        }
    )
    media_buying = pd.Series(
        {
            "company": "Orion trading",
            "job_title": "Acheteur médias junior",
            "industry_tags": "advertising | media",
            "job_family_tags": "paid_media | media_sales",
            "truth_bullet_1": "Achat média et suivi de budgets publicitaires.",
        }
    )

    assert generate_cv.score_row(procurement, job) > generate_cv.score_row(media_buying, job)


def test_user_validated_experience_respects_v3_four_bullet_limit():
    row = pd.Series(
        {
            "company": "Passy Primeur",
            "job_title": "Primeur sur les marchés",
            "evidence_strength": "user_validated",
            **{f"truth_bullet_{index}": f"Preuve professionnelle complète numéro {index}." for index in range(1, 6)},
        }
    )

    experience = generate_cv.format_experience(row)

    assert experience["facts_locked"] is True
    assert experience["rewrite_locked"] is False
    assert len(experience["bullets"]) == 4


def test_validated_memory_participates_in_experience_selection():
    job = generate_cv.parse_job("Data Analyst reporting Excel")
    with_memory = pd.Series(
        {
            "company": "Blurry",
            "job_title": "ADV",
            "truth_bullet_1": "Gestion des commandes.",
            "validated_memory": "Création de reportings Excel.",
        }
    )
    without_memory = pd.Series(
        {
            "company": "Autre",
            "job_title": "ADV",
            "truth_bullet_1": "Gestion des commandes.",
        }
    )

    assert generate_cv.score_row(with_memory, job) > generate_cv.score_row(without_memory, job)


def test_unverified_exposed_skills_do_not_influence_experience_selection():
    job = generate_cv.parse_job("Ingénieur cybersécurité")
    exposed = pd.Series(
        {
            "company": "Même entreprise",
            "job_title": "Même poste",
            "truth_bullet_1": "Gestion des commandes.",
            "skills_exposed": "cybersécurité",
            "skills_transferable": "cybersécurité",
            "notes": "pentest non validé",
        }
    )
    clean = pd.Series(
        {
            "company": "Même entreprise",
            "job_title": "Même poste",
            "truth_bullet_1": "Gestion des commandes.",
        }
    )

    assert generate_cv.score_row(exposed, job) == generate_cv.score_row(clean, job)


def test_replacements_use_dynamic_character_budget_without_fixed_six_skill_cap():
    skills = [
        "SAP",
        "Gestion des stocks",
        "Coordination supply chain",
        "Action item tracker",
        "Checklist de contrôle qualité",
        "Structuration des conditions de paiement",
        "Incoterms (FCA, CPT, DAP)",
        "Analyse des coûts complets",
        "Procédure opératoire standard",
        "SAP EWM",
        "Amélioration continue",
        "Analyse du risque de défaut client",
    ]

    replacements = generate_cv.build_replacements([], [], skills, "ACHETEUR INTERNATIONAL")
    rendered = replacements["[[TECHNICAL_SKILLS]]"]

    assert all(skill in rendered for skill in skills)
    assert replacements["[[CV_HEADLINE]]"] == "ACHETEUR INTERNATIONAL"


def test_excel_year_numbers_do_not_render_with_decimal_suffix():
    assert generate_cv.format_year_or_date("2022.0") == "2022"
