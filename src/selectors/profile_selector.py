import re


# =========================
# Helpers généraux
# =========================

def _normalize_text(value):
    value = "" if value is None else str(value)
    value = value.replace("\xa0", " ")
    value = value.replace("’", "'")
    value = value.replace("–", "-")
    value = value.replace("—", "-")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def _low(value):
    return _normalize_text(value).lower()


def _safe_get(row, key, default=""):
    try:
        value = row.get(key, default)
    except Exception:
        return default

    if value is None:
        return default

    if str(value).lower() == "nan":
        return default

    return value


def _row_to_dict(row):
    try:
        return row.to_dict()
    except Exception:
        return dict(row)


def _clean_display_value(value):
    value = _normalize_text(value)

    if not value:
        return ""

    if value.lower() in ["nan", "none", "null"]:
        return ""

    return value


def _split_cell_values(value):
    value = _normalize_text(value)

    if not value:
        return []

    parts = re.split(r"[|,;/]", value)
    return [_normalize_text(part) for part in parts if _normalize_text(part)]


def _parse_year(value):
    value = _normalize_text(value)

    if not value:
        return 0

    years = re.findall(r"(20\d{2}|19\d{2})", value)

    if not years:
        return 0

    return max(int(year) for year in years)


def _sort_rows_by_recent(rows):
    return sorted(
        rows,
        key=lambda row: (
            _parse_year(_safe_get(row, "date_end"))
            or _parse_year(_safe_get(row, "dates"))
            or _parse_year(_safe_get(row, "date"))
            or _parse_year(_safe_get(row, "year"))
            or _parse_year(_safe_get(row, "years"))
            or _parse_year(_safe_get(row, "period"))
            or _parse_year(_safe_get(row, "periode"))
        ),
        reverse=True,
    )


def _get_first_existing(row, keys, default=""):
    for key in keys:
        value = _safe_get(row, key, "")

        if _normalize_text(value):
            return value

    return default


def _extract_keywords(text):
    text_low = _low(text)

    words = re.findall(r"[a-zA-ZÀ-ÿ0-9\+\#]{3,}", text_low)

    stopwords = {
        "les", "des", "une", "est", "sont", "avec", "pour", "dans", "sur",
        "vous", "nous", "notre", "votre", "aux", "the", "and", "for", "with",
        "that", "this", "are", "job", "poste", "profil", "mission", "missions",
        "recherche", "candidat", "candidate", "équipe", "entreprise"
    }

    return [word for word in words if word not in stopwords]


def _score_text_against_job(candidate_text, job_text):
    candidate_low = _low(candidate_text)
    job_low = _low(job_text)

    if not candidate_low or not job_low:
        return 0

    job_keywords = _extract_keywords(job_text)

    score = 0

    for keyword in job_keywords:
        if keyword in candidate_low:
            score += 2

    important_phrases = [
        "supply chain",
        "logistique",
        "stock",
        "stocks",
        "forecast",
        "prévision",
        "dashboard",
        "reporting",
        "kpi",
        "sql",
        "python",
        "power bi",
        "looker",
        "sap",
        "sap ewm",
        "erp",
        "marketing",
        "acquisition",
        "meta ads",
        "google ads",
        "crm",
        "seo",
        "sea",
        "finance",
        "risque",
        "risk",
        "opérations",
        "operations",
        "processus",
        "coordination",
        "gestion de projet",
        "stakeholder",
        "parties prenantes",
        "procurement",
        "achats",
        "approvisionnement",
        "import",
        "export",
        "incoterms",
        "fca",
        "cpt",
        "dap",
        "transport",
        "warehouse",
        "entrepôt",
    ]

    for phrase in important_phrases:
        if phrase in job_low and phrase in candidate_low:
            score += 8

    return score


def _format_cert_date(value):
    value = _normalize_text(value)

    if not value:
        return ""

    if "00:00:00" in value:
        value = value.split(" ")[0]

    match = re.search(r"(20\d{2}|19\d{2})[-/](\d{1,2})[-/](\d{1,2})", value)

    if match:
        year, month, day = match.groups()
        return f"{day.zfill(2)}/{month.zfill(2)}/{year}"

    match_year = re.search(r"(20\d{2}|19\d{2})", value)

    if match_year:
        return match_year.group(1)

    return value


# =========================
# Getters expériences
# =========================

def _get_company(row):
    return _clean_display_value(
        _get_first_existing(
            row,
            [
                "company",
                "organisation",
                "organization",
                "company_name",
                "employer",
                "entreprise",
                "org",
            ],
            ""
        )
    )


def _get_position(row):
    return _clean_display_value(
        _get_first_existing(
            row,
            [
                "position_title",
                "job_title",
                "title",
                "role",
                "poste",
                "position",
            ],
            ""
        )
    )


def _get_location(row):
    return _clean_display_value(
        _get_first_existing(
            row,
            [
                "location",
                "city_state",
                "city",
                "city_state_remote",
                "city_state_or_remote",
                "ville",
                "lieu",
            ],
            ""
        )
    )


def _get_dates(row):
    return _clean_display_value(
        _get_first_existing(
            row,
            [
                "dates",
                "date",
                "year",
                "years",
                "period",
                "periode",
                "date_range",
                "start_end",
                "duration",
                "période",
            ],
            ""
        )
    )


# =========================
# Sélection expériences
# =========================

def select_top_experiences(experiences_df, job_text, max_items=2):
    if experiences_df is None or getattr(experiences_df, "empty", True):
        return []

    scored = []

    for _, row in experiences_df.iterrows():
        row_dict = _row_to_dict(row)

        text_parts = [
            _get_company(row_dict),
            _get_position(row_dict),
            _get_location(row_dict),
            _get_dates(row_dict),
            _safe_get(row_dict, "industry_tags"),
            _safe_get(row_dict, "job_family_tags"),
            _safe_get(row_dict, "truth_bullets"),
            _safe_get(row_dict, "bullets"),
            _safe_get(row_dict, "selected_bullets"),
            _safe_get(row_dict, "tools_verified"),
            _safe_get(row_dict, "skills_verified"),
            _safe_get(row_dict, "kpis_verified"),
            _safe_get(row_dict, "evidence"),
        ]

        candidate_text = " ".join(_normalize_text(x) for x in text_parts)
        score = _score_text_against_job(candidate_text, job_text)

        recent_year = (
            _parse_year(_safe_get(row_dict, "date_end"))
            or _parse_year(_get_dates(row_dict))
        )

        if recent_year:
            score += min(max(recent_year - 2020, 0), 8)

        scored.append(
            {
                "row": row_dict,
                "score": score,
                "recent_year": recent_year,
            }
        )

    scored = sorted(
        scored,
        key=lambda item: (item["score"], item["recent_year"]),
        reverse=True,
    )

    selected = [item["row"] for item in scored[:max_items]]

    return _sort_rows_by_recent(selected)


# =========================
# Sélection leadership
# =========================

def select_top_leadership(leadership_df, job_text, max_items=1):
    if leadership_df is None or getattr(leadership_df, "empty", True):
        return []

    scored = []

    for _, row in leadership_df.iterrows():
        row_dict = _row_to_dict(row)

        text_parts = [
            _safe_get(row_dict, "organization"),
            _safe_get(row_dict, "organisation"),
            _safe_get(row_dict, "org"),
            _safe_get(row_dict, "project_name"),
            _safe_get(row_dict, "company"),
            _safe_get(row_dict, "entreprise"),
            _safe_get(row_dict, "name"),
            _safe_get(row_dict, "role"),
            _safe_get(row_dict, "title"),
            _safe_get(row_dict, "position_title"),
            _safe_get(row_dict, "job_title"),
            _safe_get(row_dict, "activity_title"),
            _get_location(row_dict),
            _get_dates(row_dict),
            _safe_get(row_dict, "bullets"),
            _safe_get(row_dict, "truth_bullets"),
            _safe_get(row_dict, "selected_bullets"),
            _safe_get(row_dict, "skills_verified"),
            _safe_get(row_dict, "industry_tags"),
            _safe_get(row_dict, "job_family_tags"),
        ]

        candidate_text = " ".join(_normalize_text(x) for x in text_parts)
        score = _score_text_against_job(candidate_text, job_text)

        recent_year = _parse_year(_get_dates(row_dict))

        if recent_year:
            score += min(max(recent_year - 2020, 0), 8)

        scored.append(
            {
                "row": row_dict,
                "score": score,
                "recent_year": recent_year,
            }
        )

    scored = sorted(
        scored,
        key=lambda item: (item["score"], item["recent_year"]),
        reverse=True,
    )

    selected = [item["row"] for item in scored[:max_items]]

    return _sort_rows_by_recent(selected)


# =========================
# Certifications
# =========================

def _get_cert_name(cert):
    return _clean_display_value(
        _get_first_existing(
            cert,
            [
                "certification_name",
                "cert_name",
                "name",
                "title",
                "certification",
                "formation",
                "course_name",
                "course",
                "program",
            ],
            ""
        )
    )


def _get_cert_issuer(cert):
    return _clean_display_value(
        _get_first_existing(
            cert,
            [
                "issuer",
                "provider",
                "organization",
                "organisation",
                "company",
                "school",
                "platform",
                "institution",
            ],
            ""
        )
    )


def _get_cert_date(cert):
    return _format_cert_date(
        _get_first_existing(
            cert,
            [
                "date",
                "year",
                "issued_date",
                "completion_date",
                "obtained_date",
                "période",
                "periode",
            ],
            ""
        )
    )


def select_certifications(certifications_df, job_text, max_items=2):
    if certifications_df is None or getattr(certifications_df, "empty", True):
        return []

    scored = []
    job_low = _low(job_text)

    for _, row in certifications_df.iterrows():
        row_dict = _row_to_dict(row)

        name = _get_cert_name(row_dict)
        issuer = _get_cert_issuer(row_dict)
        date = _get_cert_date(row_dict)

        if not name:
            continue

        text_parts = [
            name,
            issuer,
            date,
            _safe_get(row_dict, "skill_family"),
            _safe_get(row_dict, "category"),
            _safe_get(row_dict, "notes"),
            _safe_get(row_dict, "skills"),
        ]

        candidate_text = " ".join(_normalize_text(x) for x in text_parts)
        cert_low = _low(candidate_text)

        score = _score_text_against_job(candidate_text, job_text)

        if "sap" in job_low and "sap" in cert_low:
            score += 25

        if (
            "data" in job_low
            or "analytics" in job_low
            or "sql" in job_low
            or "python" in job_low
            or "dashboard" in job_low
        ) and (
            "data" in cert_low
            or "analytics" in cert_low
            or "ibm" in cert_low
            or "sql" in cert_low
            or "python" in cert_low
        ):
            score += 18

        if (
            "risk" in job_low
            or "risque" in job_low
            or "finance" in job_low
        ) and (
            "risk" in cert_low
            or "risque" in cert_low
            or "finance" in cert_low
            or "geneva" in cert_low
        ):
            score += 18

        recent_year = _parse_year(date)

        if recent_year:
            score += min(max(recent_year - 2020, 0), 5)

        if score > 0:
            scored.append(
                {
                    "row": row_dict,
                    "score": score,
                    "recent_year": recent_year,
                }
            )

    scored = sorted(
        scored,
        key=lambda item: (item["score"], item["recent_year"]),
        reverse=True,
    )

    return [item["row"] for item in scored[:max_items]]


# =========================
# Compétences techniques
# =========================

TECHNICAL_SKILL_TRANSLATIONS = {
    "ROAS analysis": "Analyse du ROAS",
    "CRM marketing": "CRM marketing",
    "Segmentation": "Segmentation client",
    "Press release writing": "Rédaction de communiqués de presse",
    "Community activation": "Activation communautaire",
    "OOH communication": "Communication OOH",
    "Project management": "Gestion de projet",
    "Stakeholder management": "Gestion des parties prenantes",
    "Operations management": "Gestion des opérations",
    "Operational coordination": "Coordination opérationnelle",
    "Reporting": "Reporting",
    "KPI monitoring": "Suivi des KPI",
    "Performance analysis": "Analyse de performance",
    "Demand forecasting": "Prévision de la demande",
    "Inventory management": "Gestion des stocks",
    "Supply chain coordination": "Coordination supply chain",
    "Import export operations": "Gestion import-export",
    "Export operations": "Gestion export",
    "Import operations": "Gestion import",
    "Procurement": "Achats / Procurement",
    "Process optimization": "Optimisation des processus",
    "Dashboarding": "Création de dashboards",
    "Data visualization": "Visualisation de données",
    "Financial modeling": "Modélisation financière",
    "Risk management": "Gestion du risque",
    "SQL": "SQL",
    "Python": "Python",
    "Excel": "Excel",
    "Power BI": "Power BI",
    "Looker": "Looker",
    "SAP": "SAP",
    "SAP EWM": "SAP EWM",
    "ERP": "ERP",
    "Webflow": "Webflow",
    "Figma": "Figma",
    "n8n": "n8n",
    "N8n": "n8n",
    "Make": "Make",
    "Mailchimp": "Mailchimp",
    "Mailchimps": "Mailchimp",
    "Meta Ads": "Meta Ads",
    "Google Ads": "Google Ads",
    "SEO": "SEO",
    "SEA": "SEA",
    "Notion": "Notion",
    "Incoterms": "Incoterms (FCA, CPT, DAP)",
    "Incoterms FCA CPT DAP": "Incoterms (FCA, CPT, DAP)",
}


JOB_FAMILY_SKILL_RULES = {
    "supply_chain": {
        "required_terms": [
            "supply", "chain", "logistique", "stock", "inventory", "warehouse",
            "entrepôt", "sap", "erp", "ewm", "import", "export", "transport",
            "flux", "forecast", "prévision", "demand", "procurement", "achat",
            "achats", "approvisionnement", "incoterms", "fca", "cpt", "dap",
            "douane", "customs", "fret", "container", "conteneur"
        ],
        "preferred_skills": [
            "SAP", "SAP EWM", "ERP", "Excel", "Power BI", "Looker", "SQL",
            "Gestion des stocks", "Prévision de la demande", "Coordination supply chain",
            "Gestion import-export", "Gestion export", "Gestion import",
            "Achats / Procurement", "Incoterms (FCA, CPT, DAP)",
            "Optimisation des processus", "Reporting", "Suivi des KPI"
        ],
        "blocked_terms": [
            "ooh", "press", "communiqué", "community", "roas", "meta ads",
            "google ads", "seo", "sea", "paid media"
        ],
    },
    "operations": {
        "required_terms": [
            "operations", "opérations", "process", "processus", "workflow",
            "coordination", "kpi", "reporting", "performance", "optimisation",
            "qualité", "pilotage"
        ],
        "preferred_skills": [
            "Excel", "Power BI", "Looker", "SQL", "Reporting", "Suivi des KPI",
            "Analyse de performance", "Gestion des opérations",
            "Coordination opérationnelle", "Optimisation des processus",
            "Gestion de projet"
        ],
        "blocked_terms": [
            "ooh", "press", "communiqué", "community"
        ],
    },
    "data_analytics": {
        "required_terms": [
            "data", "analytics", "analyse", "analyst", "dashboard", "reporting",
            "sql", "python", "looker", "power bi", "tableau", "kpi",
            "visualisation", "modélisation", "forecast"
        ],
        "preferred_skills": [
            "Python", "SQL", "Excel", "Power BI", "Looker", "Reporting",
            "Suivi des KPI", "Analyse de performance", "Création de dashboards",
            "Visualisation de données", "Prévision de la demande"
        ],
        "blocked_terms": [
            "ooh", "press", "communiqué", "community"
        ],
    },
    "digital_marketing": {
        "required_terms": [
            "marketing", "acquisition", "ads", "meta", "google", "seo", "sea",
            "crm", "roas", "campagne", "campaign", "emailing", "segmentation",
            "growth", "paid media", "media buying"
        ],
        "preferred_skills": [
            "Analyse du ROAS", "CRM marketing", "Segmentation client",
            "Meta Ads", "Google Ads", "SEO", "SEA", "Mailchimp",
            "Analyse de performance", "Reporting", "Suivi des KPI"
        ],
        "blocked_terms": [
            "sap ewm", "warehouse", "incoterms"
        ],
    },
    "project_management": {
        "required_terms": [
            "chef de projet", "project", "planning", "roadmap", "coordination",
            "stakeholder", "parties prenantes", "delivery", "organisation",
            "gestion de projet"
        ],
        "preferred_skills": [
            "Gestion de projet", "Gestion des parties prenantes", "Notion",
            "Figma", "Excel", "Reporting", "Coordination opérationnelle",
            "Suivi des KPI"
        ],
        "blocked_terms": [],
    },
    "finance": {
        "required_terms": [
            "finance", "risk", "risque", "budget", "rentabilité", "marge",
            "modélisation", "forecast", "financement", "covenant", "p&l",
            "profitability", "margin"
        ],
        "preferred_skills": [
            "Excel", "Analyse de performance", "Reporting", "Suivi des KPI",
            "Modélisation financière", "Gestion du risque", "Power BI", "SQL"
        ],
        "blocked_terms": [
            "ooh", "community", "press"
        ],
    },
}


def _skill_output_name(skill_name):
    skill_name = _normalize_text(skill_name)
    return TECHNICAL_SKILL_TRANSLATIONS.get(skill_name, skill_name)


def _detect_job_family_from_text(job_text):
    job_low = _low(job_text)

    scores = {}

    for family, config in JOB_FAMILY_SKILL_RULES.items():
        score = 0

        for term in config.get("required_terms", []):
            term_low = term.lower()

            if term_low in job_low:
                score += 3 if " " in term_low else 1

        scores[family] = score

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    if not ranked or ranked[0][1] == 0:
        return "general", scores

    return ranked[0][0], scores


def _score_skill_for_job(row, job_text, main_family):
    job_low = _low(job_text)

    skill_name = _normalize_text(_safe_get(row, "skill_name"))
    skill_family = _low(_safe_get(row, "skill_family"))
    aliases = _split_cell_values(_safe_get(row, "aliases"))
    notes = _low(_safe_get(row, "notes"))
    skill_type = _low(_safe_get(row, "type"))
    proof_level = _low(_safe_get(row, "proof_level_default"))

    output_skill = _skill_output_name(skill_name)
    output_skill_low = output_skill.lower()
    skill_name_low = skill_name.lower()

    searchable_terms = [skill_name_low, output_skill_low]
    searchable_terms.extend([alias.lower() for alias in aliases if alias])

    score = 0

    for term in searchable_terms:
        if not term:
            continue

        if term in job_low:
            score += 12 if " " in term else 7

    family_config = JOB_FAMILY_SKILL_RULES.get(main_family, {})

    preferred_skills = [x.lower() for x in family_config.get("preferred_skills", [])]
    blocked_terms = [x.lower() for x in family_config.get("blocked_terms", [])]
    required_terms = [x.lower() for x in family_config.get("required_terms", [])]

    if output_skill_low in preferred_skills or skill_name_low in preferred_skills:
        score += 8

    for preferred in preferred_skills:
        if preferred in output_skill_low or preferred in skill_name_low:
            score += 5

    if skill_family:
        family_variants = [
            main_family,
            main_family.replace("_", " "),
            main_family.replace("_", ""),
        ]

        if any(variant in skill_family for variant in family_variants):
            score += 6

    if any(term in skill_family or term in notes for term in required_terms):
        score += 4

    if proof_level == "verified":
        score += 3
    elif proof_level == "transferable":
        score += 2
    elif proof_level == "exposed":
        score += 1

    if skill_type in ["tool", "technical", "hard_skill", "software"]:
        score += 2

    for blocked in blocked_terms:
        if blocked in output_skill_low or blocked in skill_name_low or blocked in notes:
            score -= 12

    return score


def _fallback_skills_for_family(main_family):
    fallback = {
        "supply_chain": [
            "Excel", "SAP", "SAP EWM", "ERP", "Power BI", "Looker",
            "Gestion des stocks", "Coordination supply chain",
            "Prévision de la demande", "Incoterms (FCA, CPT, DAP)"
        ],
        "operations": [
            "Excel", "Reporting", "Suivi des KPI", "Analyse de performance",
            "Gestion des opérations", "Coordination opérationnelle",
            "Optimisation des processus"
        ],
        "data_analytics": [
            "Excel", "SQL", "Python", "Power BI", "Looker",
            "Reporting", "Suivi des KPI", "Analyse de performance"
        ],
        "digital_marketing": [
            "Meta Ads", "Google Ads", "SEO", "SEA", "CRM marketing",
            "Analyse du ROAS", "Segmentation client", "Reporting"
        ],
        "project_management": [
            "Gestion de projet", "Gestion des parties prenantes", "Notion",
            "Figma", "Excel", "Coordination opérationnelle", "Reporting"
        ],
        "finance": [
            "Excel", "Modélisation financière", "Gestion du risque",
            "Analyse de performance", "Reporting", "Suivi des KPI"
        ],
        "general": [
            "Excel", "Gestion de projet", "Reporting", "Suivi des KPI",
            "Analyse de performance", "Coordination opérationnelle"
        ],
    }

    return fallback.get(main_family, fallback["general"])


def select_technical_skills(skills_df, job_text, max_items=8):
    main_family, _ = _detect_job_family_from_text(job_text)

    if skills_df is None or getattr(skills_df, "empty", True):
        return _fallback_skills_for_family(main_family)[:max_items]

    scored_skills = []

    for _, row in skills_df.iterrows():
        row_dict = _row_to_dict(row)

        skill_name = _normalize_text(_safe_get(row_dict, "skill_name"))

        if not skill_name:
            continue

        output_name = _skill_output_name(skill_name)
        score = _score_skill_for_job(row_dict, job_text, main_family)

        if score <= 0:
            continue

        scored_skills.append(
            {
                "skill": output_name,
                "score": score,
                "raw_skill": skill_name,
            }
        )

    scored_skills = sorted(
        scored_skills,
        key=lambda item: item["score"],
        reverse=True,
    )

    selected = []
    seen = set()

    for item in scored_skills:
        skill = item["skill"].strip()
        skill_key = skill.lower()

        if not skill:
            continue

        if skill_key in seen:
            continue

        selected.append(skill)
        seen.add(skill_key)

        if len(selected) >= max_items:
            break

    if len(selected) < min(5, max_items):
        for fallback_skill in _fallback_skills_for_family(main_family):
            fallback_key = fallback_skill.lower()

            if fallback_key not in seen:
                selected.append(fallback_skill)
                seen.add(fallback_key)

            if len(selected) >= max_items:
                break

    return selected[:max_items]


# =========================
# Bullets
# =========================

def _extract_bullets_from_row(row, max_bullets=4):
    raw = (
        _safe_get(row, "selected_bullets")
        or _safe_get(row, "truth_bullets")
        or _safe_get(row, "bullets")
        or _safe_get(row, "description")
    )

    raw = str(raw or "").strip()

    if not raw:
        return []

    parts = re.split(r"\n|•|;(?=\s*[A-ZÀ-ÿ])", raw)

    bullets = []

    for part in parts:
        cleaned = _normalize_text(part)
        cleaned = re.sub(r"^[\-\•\*\·\s]+", "", cleaned)
        cleaned = cleaned.strip()

        if cleaned:
            bullets.append(cleaned)

    cleaned_bullets = []

    for bullet in bullets:
        if bullet not in cleaned_bullets:
            cleaned_bullets.append(bullet)

    return cleaned_bullets[:max_bullets]


def _format_bullets_for_placeholder(bullets):
    clean_bullets = []

    for bullet in bullets:
        bullet = _normalize_text(bullet)
        bullet = re.sub(r"^[\-\•\*\·\s]+", "", bullet)

        if bullet:
            clean_bullets.append(bullet)

    return "\n".join(clean_bullets)


# =========================
# Replacements DOCX
# =========================

def _build_experience_replacements(experiences):
    replacements = {}

    for index in range(1, 4):
        row = experiences[index - 1] if index <= len(experiences) else {}

        company = _get_company(row)
        title = _get_position(row)
        location = _get_location(row)
        dates = _get_dates(row)

        bullets = _extract_bullets_from_row(row, max_bullets=4)

        replacements[f"[[EXP_{index}_COMPANY]]"] = company
        replacements[f"[[EXP_{index}_COMPAGNY]]"] = company
        replacements[f"[[EXP_{index}_ORGANIZATION]]"] = company

        replacements[f"[[EXP_{index}_POSITION_TITLE]]"] = title
        replacements[f"[[EXP_{index}_JOB_TITLE]]"] = title
        replacements[f"[[EXP_{index}_ROLE]]"] = title

        replacements[f"[[EXP_{index}_LOCATION]]"] = location
        replacements[f"[[EXP_{index}_CITY]]"] = location

        replacements[f"[[EXP_{index}_DATES]]"] = dates
        replacements[f"[[EXP_{index}_YEAR]]"] = dates

        replacements[f"[[EXP_{index}_BULLETS]]"] = _format_bullets_for_placeholder(bullets)

    return replacements


def _build_leadership_replacements(leadership_items):
    replacements = {}

    for index in range(1, 3):
        row = leadership_items[index - 1] if index <= len(leadership_items) else {}

        org = _clean_display_value(
            _get_first_existing(
                row,
                [
                    "organization",
                    "organisation",
                    "org",
                    "project_name",
                    "company",
                    "entreprise",
                    "name",
                ],
                ""
            )
        )

        role = _clean_display_value(
            _get_first_existing(
                row,
                [
                    "role",
                    "title",
                    "position_title",
                    "job_title",
                    "poste",
                    "activity_title",
                ],
                ""
            )
        )

        location = _get_location(row)
        dates = _get_dates(row)

        bullets = _extract_bullets_from_row(row, max_bullets=2)

        replacements[f"[[LEAD_{index}_ORG]]"] = org
        replacements[f"[[LEAD_{index}_ORGANIZATION]]"] = org
        replacements[f"[[LEAD_{index}_TITLE]]"] = role
        replacements[f"[[LEAD_{index}_ROLE]]"] = role
        replacements[f"[[LEAD_{index}_LOCATION]]"] = location
        replacements[f"[[LEAD_{index}_CITY]]"] = location
        replacements[f"[[LEAD_{index}_DATES]]"] = dates
        replacements[f"[[LEAD_{index}_YEAR]]"] = dates
        replacements[f"[[LEAD_{index}_BULLETS]]"] = _format_bullets_for_placeholder(bullets)

    return replacements


def _build_certification_text(certs):
    lines = []

    for cert in certs:
        name = _get_cert_name(cert)
        issuer = _get_cert_issuer(cert)
        date = _get_cert_date(cert)

        if not name:
            continue

        if issuer and date:
            line = f"{name} - {issuer} - {date}"
        elif issuer:
            line = f"{name} - {issuer}"
        elif date:
            line = f"{name} - {date}"
        else:
            line = name

        line = _normalize_text(line)
        line = re.sub(r"\s+-\s+$", "", line)

        if line:
            lines.append(line)

    return "\n".join(lines)


def build_replacements_from_selection(
    experiences,
    leadership_items,
    certs,
    technical_skills,
    job_text=None,
):
    replacements = {}

    replacements.update(_build_experience_replacements(experiences or []))
    replacements.update(_build_leadership_replacements(leadership_items or []))

    certification_text = _build_certification_text(certs or [])
    replacements["[[CERTIFICATION_ENTRIES]]"] = certification_text
    replacements["[[CERTIFICATIONS]]"] = certification_text
    replacements["[[CERTS]]"] = certification_text

    technical_skills = technical_skills or []
    technical_skills_text = ", ".join(
        [_normalize_text(skill) for skill in technical_skills if _normalize_text(skill)]
    )

    replacements["[[TECHNICAL_SKILLS]]"] = technical_skills_text
    replacements["[[SKILLS_TECHNICAL]]"] = technical_skills_text

    return replacements
