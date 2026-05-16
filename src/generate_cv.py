from pathlib import Path
from datetime import datetime
import json
import re
import unicodedata

import pandas as pd

from src.render.docx_template import DocxTemplateRenderer
from src.llm.cv_enhancer import improve_full_cv_with_gemini


# ============================================================
# PATHS
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[1]

MASTER_PROFILE_PATH = ROOT_DIR / "data" / "reference" / "master_profile.xlsx"
BASE_CV_TEMPLATE_PATH = ROOT_DIR / "templates" / "base_cv.docx"
OUTPUT_DIR = ROOT_DIR / "data" / "output"
CV_OUTPUT_DIR = OUTPUT_DIR / "cv"

POSSIBLE_JOB_PATHS = [
    ROOT_DIR / "data" / "input" / "job_description.txt",
    ROOT_DIR / "data" / "input" / "job.txt",
    ROOT_DIR / "job_description.txt",
    ROOT_DIR / "job.txt",
]


# ============================================================
# UTILS
# ============================================================

def normalize_text(value):
    if value is None:
        return ""

    text = str(value).strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9€%+.#/\-\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def safe_str(value):
    if value is None:
        return ""

    try:
        if pd.isna(value):
            return ""
    except Exception:
        pass

    text = str(value).strip()

    if text.lower() in ["nan", "none", "nat"]:
        return ""

    return text


def get_value(row, possible_columns, default=""):
    if row is None:
        return default

    index_lower = {str(col).lower().strip(): col for col in row.index}

    for col in possible_columns:
        actual = index_lower.get(col.lower().strip())
        if actual is not None:
            value = safe_str(row[actual])
            if value:
                return value

    return default


def clean_filename_part(value, fallback, max_length=40):
    text = safe_str(value)

    if not text:
        text = fallback

    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^A-Za-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")

    if not text:
        text = fallback

    return text[:max_length].strip("_")


def format_year_or_date(value):
    value = safe_str(value)

    if not value:
        return ""

    # 2023-2026 / 2023 – 2026
    range_match = re.match(
        r"^(20\d{2}|19\d{2})\s*[-–]\s*(20\d{2}|19\d{2})$",
        value.strip(),
    )
    if range_match:
        return f"{range_match.group(1)} - {range_match.group(2)}"

    # 2026-04-07 00:00:00 -> 2026
    try:
        parsed = pd.to_datetime(value, errors="coerce")
        if not pd.isna(parsed):
            return str(parsed.year)
    except Exception:
        pass

    match = re.search(r"(20\d{2}|19\d{2})", value)
    if match and len(value) > 10 and "-" in value:
        return match.group(1)

    return value


def clean_dash_join(*parts):
    cleaned = [safe_str(p) for p in parts if safe_str(p)]

    if not cleaned:
        return ""

    return " - ".join(cleaned)


def split_multi_value(text):
    text = safe_str(text)

    if not text:
        return []

    parts = re.split(r"[|;,/\n]+", text)
    return [p.strip() for p in parts if p.strip()]


def load_job_description():
    for path in POSSIBLE_JOB_PATHS:
        if path.exists():
            return path.read_text(encoding="utf-8", errors="ignore")

    raise FileNotFoundError(
        "Aucune job description trouvée. Mets ton offre dans : "
        "data/input/job_description.txt"
    )


def get_sheet_case_insensitive(excel_file, wanted_name):
    sheet_map = {s.lower().strip(): s for s in excel_file.sheet_names}
    key = wanted_name.lower().strip()

    if key not in sheet_map:
        return pd.DataFrame()

    return pd.read_excel(excel_file, sheet_name=sheet_map[key])


def load_master_profile():
    if not MASTER_PROFILE_PATH.exists():
        raise FileNotFoundError(f"Master profile introuvable : {MASTER_PROFILE_PATH}")

    excel = pd.ExcelFile(MASTER_PROFILE_PATH)

    workbook = {
        "experiences": get_sheet_case_insensitive(excel, "experiences"),
        "leadership": get_sheet_case_insensitive(excel, "leadership"),
        "certifications": get_sheet_case_insensitive(excel, "certifications"),
        "skills": get_sheet_case_insensitive(excel, "skills"),
        "job_families": get_sheet_case_insensitive(excel, "job_families"),
        "settings": get_sheet_case_insensitive(excel, "settings"),
    }

    return workbook


# ============================================================
# JOB PARSER SIMPLE
# ============================================================

def extract_company(job_text):
    lines = [l.strip() for l in job_text.splitlines() if l.strip()]

    labeled_patterns = [
        r"company\s*[:\-]\s*(.+)",
        r"entreprise\s*[:\-]\s*(.+)",
        r"société\s*[:\-]\s*(.+)",
        r"employeur\s*[:\-]\s*(.+)",
        r"organization\s*[:\-]\s*(.+)",
    ]

    for line in lines[:30]:
        for pattern in labeled_patterns:
            match = re.search(pattern, line, flags=re.IGNORECASE)
            if match:
                company = match.group(1).strip()
                if 2 <= len(company) <= 60:
                    return company

    context_patterns = [
        r"(?:why\s+)?join\s+([A-Z][A-Za-z0-9\-&]+)",
        r"join\s+the\s+([A-Z][A-Za-z0-9\-&]+)\s+team",
        r"([A-Z][A-Za-z0-9\-&]{2,})\s+is\s+(?:looking|seeking|hiring|searching)",
        r"([A-Z][A-Za-z0-9\-&]{2,})\s+recherche",
        r"at\s+([A-Z][A-Za-z0-9\-&]{2,})\b",
    ]

    stop = {
        "the", "our", "this", "your", "team", "role", "position",
        "company", "organization", "groupe", "group", "france", "paris",
    }

    for line in lines[:80]:
        for pattern in context_patterns:
            match = re.search(pattern, line)
            if match:
                candidate = match.group(1).strip()
                if candidate.lower() not in stop and 2 <= len(candidate) <= 40:
                    return candidate

    # Cas Ipsen si le nom est présent dans le texte sans structure claire
    if "ipsen" in normalize_text(job_text):
        return "Ipsen"

    return "Entreprise"


def looks_like_real_job_title(line):
    line_clean = safe_str(line)

    if not line_clean:
        return False

    lowered = line_clean.lower()

    bad_fragments = [
        "department oversees",
        "individual team members",
        "typically managing",
        "countries",
        "responsibilities",
        "activities",
        "both upstream",
        "downstream",
        "about the role",
        "job description",
        "description du poste",
        "your responsibilities",
        "what you will do",
        "profile required",
        "candidate profile",
        "overview",
        "lorsque",
    ]

    if any(fragment in lowered for fragment in bad_fragments):
        return False

    if len(line_clean) > 75:
        return False

    if len(line_clean.split()) > 10:
        return False

    title_keywords = [
        "analyst",
        "assistant",
        "associate",
        "manager",
        "coordinator",
        "specialist",
        "consultant",
        "chef de projet",
        "chargé",
        "responsable",
        "acheteur",
        "commercial",
        "adv",
        "supply",
        "operations",
        "logistics",
        "procurement",
        "data",
        "business",
        "import",
        "export",
    ]

    return any(keyword in lowered for keyword in title_keywords)


def extract_job_title(job_text):
    lines = [l.strip() for l in job_text.splitlines() if l.strip()]

    patterns = [
        r"job title\s*[:\-]\s*(.+)",
        r"titre\s*[:\-]\s*(.+)",
        r"poste\s*[:\-]\s*(.+)",
        r"intitulé\s*[:\-]\s*(.+)",
        r"position\s*[:\-]\s*(.+)",
    ]

    for line in lines[:50]:
        for pattern in patterns:
            match = re.search(pattern, line, flags=re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                title = re.sub(r"\s*\([^)]*\)", "", title).strip()
                if looks_like_real_job_title(title):
                    return title

    for line in lines[:25]:
        cleaned = re.sub(r"\s*\([^)]*\)", "", line).strip()
        if looks_like_real_job_title(cleaned):
            return cleaned

    return "Poste cible"


def extract_keywords(job_text):
    text = normalize_text(job_text)

    stopwords = {
        "the", "and", "for", "with", "you", "your", "are", "our", "this", "that",
        "will", "dans", "avec", "pour", "sur", "les", "des", "une", "est", "nous",
        "vous", "vos", "aux", "du", "de", "la", "le", "un", "en", "et", "au",
        "as", "to", "of", "in", "a", "an", "is", "be", "or", "by", "from",
        "role", "poste", "description", "position", "year", "term", "contract",
    }

    words = re.findall(r"[a-z0-9+#.]+", text)
    words = [w for w in words if len(w) >= 3 and w not in stopwords]

    frequency = {}

    for word in words:
        frequency[word] = frequency.get(word, 0) + 1

    sorted_words = sorted(frequency.items(), key=lambda x: x[1], reverse=True)

    return [w for w, _ in sorted_words[:80]]


def parse_job(job_text):
    return {
        "company": extract_company(job_text),
        "job_title": extract_job_title(job_text),
        "keywords": extract_keywords(job_text),
        "raw_text": job_text,
        "normalized_text": normalize_text(job_text),
    }


# ============================================================
# SCORING
# ============================================================

def row_search_text(row):
    columns = [
        "company",
        "organisation",
        "organization",
        "role",
        "position_title",
        "job_title",
        "industry_tags",
        "job_family_tags",
        "tools_verified",
        "skills_verified",
        "skills_transferable",
        "skills_exposed",
        "kpis_verified",
        "notes",
    ]

    values = []

    for col in columns:
        if col in row.index:
            values.append(safe_str(row[col]))

    for i in range(1, 8):
        for col in [f"truth_bullet_{i}", f"bullet_{i}"]:
            if col in row.index:
                values.append(safe_str(row[col]))

    return normalize_text(" ".join(values))


def get_row_year(row):
    raw = get_value(
        row,
        ["date_end", "end_year", "year", "date", "dates", "date_range"],
        "",
    )

    years = re.findall(r"(20\d{2}|19\d{2})", safe_str(raw))

    if years:
        return max(int(y) for y in years)

    start = get_value(row, ["date_start", "start_year"], "")
    end = get_value(row, ["date_end", "end_year"], "")
    years = re.findall(r"(20\d{2}|19\d{2})", f"{start} {end}")

    if years:
        return max(int(y) for y in years)

    return 0


def score_row(row, parsed_job):
    job_text = parsed_job["normalized_text"]
    keywords = parsed_job["keywords"]
    searchable = row_search_text(row)

    if not searchable:
        return 0

    score = 0

    for keyword in keywords:
        if keyword in searchable:
            score += 3

    boosts = {
        "adv": 20,
        "import": 18,
        "export": 18,
        "international": 14,
        "supply": 16,
        "chain": 12,
        "logistics": 16,
        "warehouse": 14,
        "transport": 12,
        "procurement": 12,
        "purchasing": 10,
        "achats": 10,
        "operations": 14,
        "sap": 16,
        "ewm": 12,
        "stock": 12,
        "inventory": 12,
        "incoterms": 14,
        "forecast": 8,
        "data": 8,
        "analytics": 8,
        "finance": 7,
        "risk": 7,
        "media": 6,
        "marketing": 6,
    }

    for word, weight in boosts.items():
        if word in job_text and word in searchable:
            score += weight

    # Blurry est plus professionnel et plus proche ADV / opérations cross-border.
    company = normalize_text(get_value(row, ["company", "organisation", "organization"], ""))

    if company == "blurry":
        if any(w in job_text for w in ["adv", "import", "export", "logistics", "supply", "operations", "international"]):
            score += 35

    if company == "minero":
        if any(w in job_text for w in ["procurement", "purchasing", "achats", "sourcing"]):
            score += 25
        if any(w in job_text for w in ["adv", "customer service", "service client"]):
            score -= 10

    year = get_row_year(row)
    if year:
        score += max(0, year - 2020)

    return score


def select_top_rows(df, parsed_job, max_rows):
    if df.empty:
        return []

    df = df.copy()
    df["_score"] = df.apply(lambda row: score_row(row, parsed_job), axis=1)
    df["_sort_year"] = df.apply(get_row_year, axis=1)

    df = df.sort_values(by=["_score", "_sort_year"], ascending=[False, False])

    selected = df.head(max_rows)

    return [row for _, row in selected.iterrows()]


# ============================================================
# BULLETS
# ============================================================

def split_bullets(raw_value, max_bullets=4):
    text = safe_str(raw_value)

    if not text:
        return []

    text = text.replace("\r", "\n")

    if "\n" in text:
        parts = text.split("\n")
    elif "•" in text:
        parts = text.split("•")
    elif "|" in text:
        parts = text.split("|")
    elif ";" in text:
        parts = text.split(";")
    else:
        parts = [text]

    bullets = []

    for part in parts:
        bullet = safe_str(part)
        bullet = bullet.lstrip("•").lstrip("-").strip()

        if len(bullet) < 10:
            continue

        bullets.append(bullet)

    return bullets[:max_bullets]


def extract_truth_bullets(row, max_bullets=4):
    bullets = []

    for i in range(1, 8):
        value = get_value(row, [f"truth_bullet_{i}", f"bullet_{i}"], "")

        if value and len(value) > 5:
            bullets.append(value)

        if len(bullets) >= max_bullets:
            break

    if bullets:
        return bullets

    raw = get_value(
        row,
        ["truth_bullets", "bullets", "description", "evidence", "allowed"],
        "",
    )

    return split_bullets(raw, max_bullets=max_bullets)


# ============================================================
# CERTIFICATIONS
# ============================================================

def select_certifications(df, parsed_job, max_certs=2):
    if df.empty:
        return []

    job_text = parsed_job["normalized_text"]

    def cert_score(row):
        base = score_row(row, parsed_job)

        cert_name = normalize_text(
            get_value(
                row,
                [
                    "certification_name",
                    "certification",
                    "cert_name",
                    "name",
                    "title",
                    "skill_name",
                ],
                "",
            )
        )

        issuer = normalize_text(
            get_value(
                row,
                [
                    "issuer",
                    "organization",
                    "organisation",
                    "company",
                    "provider",
                    "school",
                    "entreprise",
                ],
                "",
            )
        )

        combined = f"{cert_name} {issuer}"

        supply_context = any(
            w in job_text
            for w in [
                "adv",
                "import",
                "export",
                "logistics",
                "warehouse",
                "transport",
                "supply",
                "procurement",
                "delivery",
                "trade",
                "sap",
                "inventory",
                "stock",
                "slas",
            ]
        )

        data_context = any(
            w in job_text
            for w in [
                "data",
                "analytics",
                "dashboard",
                "forecast",
                "forecasting",
                "sql",
                "python",
                "bi",
                "kpi",
                "reporting",
            ]
        )

        finance_context = any(
            w in job_text
            for w in [
                "finance",
                "risk",
                "portfolio",
                "investment",
                "credit",
                "covenant",
                "pricing",
                "financial",
                "modelling",
                "modeling",
            ]
        )

        marketing_context = any(
            w in job_text
            for w in [
                "marketing",
                "media",
                "ads",
                "campaign",
                "crm",
                "seo",
                "sea",
                "acquisition",
                "performance marketing",
            ]
        )

        if supply_context:
            if "sap supply" in combined or ("sap" in combined and "supply" in combined):
                base += 140

            if "rise" in combined and "sap" in combined:
                base += 130

            if "s/4hana" in combined or "s4hana" in combined or "4hana" in combined:
                base += 120

            if "sap" in combined:
                base += 90

            if "ewm" in combined:
                base += 80

            if "supply chain" in combined:
                base += 70

            if "forecast" in combined or "forecasting" in combined:
                base += 25

            if "risk" in combined or "portfolio" in combined:
                base -= 90

            if not marketing_context:
                if any(w in combined for w in ["marketing", "media", "ads", "seo", "sea", "crm"]):
                    base -= 70

        if data_context:
            if "forecast" in combined or "forecasting" in combined:
                base += 80

            if "data" in combined or "ibm" in combined:
                base += 70

            if "analytics" in combined or "dashboard" in combined:
                base += 60

        if finance_context:
            if "risk" in combined or "portfolio" in combined:
                base += 90

            if "financial" in combined or "finance" in combined:
                base += 70
        else:
            if "risk" in combined or "portfolio" in combined:
                base -= 60

        if marketing_context:
            if any(w in combined for w in ["marketing", "media", "ads", "seo", "sea", "crm"]):
                base += 80

        return base

    df = df.copy()
    df["_score"] = df.apply(cert_score, axis=1)
    df["_sort_year"] = df.apply(get_row_year, axis=1)
    df = df.sort_values(by=["_score", "_sort_year"], ascending=[False, False])

    selected = []
    seen = set()

    for _, row in df.iterrows():
        cert_name = get_value(
            row,
            [
                "certification_name",
                "certification",
                "cert_name",
                "name",
                "title",
                "skill_name",
            ],
            "",
        )

        issuer = get_value(
            row,
            [
                "issuer",
                "organization",
                "organisation",
                "company",
                "provider",
                "school",
                "entreprise",
            ],
            "",
        )

        if not cert_name and issuer:
            cert_name = issuer
            issuer = ""

        if not cert_name:
            continue

        line = clean_dash_join(cert_name, issuer)
        key = normalize_text(line)

        if not line or key in seen:
            continue

        seen.add(key)
        selected.append(line)

        if len(selected) >= max_certs:
            break

    return selected


# ============================================================
# TECHNICAL SKILLS
# ============================================================

SKILL_TRANSLATIONS = {
    "performance analysis": "Analyse de performance",
    "press release writing": "Rédaction de communiqués de presse",
    "project management": "Gestion de projet",
    "stakeholder management": "Gestion des parties prenantes",
    "operations management": "Gestion des opérations",
    "operational coordination": "Coordination opérationnelle",
    "reporting": "Reporting",
    "kpi monitoring": "Suivi des KPI",
    "export operations": "Gestion export",
    "import operations": "Gestion import",
    "procurement": "Achats / Procurement",
    "purchasing": "Achats",
    "inventory management": "Gestion des stocks",
    "stock management": "Gestion des stocks",
    "stock rotation management": "Gestion de la rotation des stocks",
    "supply chain coordination": "Coordination supply chain",
    "warehouse management": "Gestion d’entrepôt",
    "warehousing operations": "Opérations d’entrepôt",
    "transport coordination": "Coordination transport",
    "logistics coordination": "Coordination logistique",
    "cross-border operations": "Opérations cross-border",
    "process optimization": "Optimisation des processus",
    "business intelligence": "Business Intelligence",
    "dashboarding": "Dashboarding",
    "data analysis": "Analyse de données",
    "forecasting": "Prévision de la demande",
    "risk management": "Gestion des risques",
    "financial modeling": "Modélisation financière",
    "crm marketing": "CRM marketing",
    "email marketing": "Email marketing",
    "paid media": "Paid media",
    "media buying": "Achat média",
    "seo": "SEO",
    "sea": "SEA",
    "sql": "SQL",
    "python": "Python",
    "looker": "Looker",
    "power bi": "Power BI",
    "sap": "SAP",
    "sap ewm": "SAP EWM",
    "sap s/4hana": "SAP S/4HANA",
}


def translate_skill(skill):
    raw = safe_str(skill)
    key = normalize_text(raw)

    if key in SKILL_TRANSLATIONS:
        return SKILL_TRANSLATIONS[key]

    return raw


def is_skill_allowed_for_job(skill, job_text):
    skill_norm = normalize_text(skill)

    supply_context = any(
        w in job_text
        for w in [
            "adv",
            "import",
            "export",
            "logistics",
            "warehouse",
            "transport",
            "supply",
            "procurement",
            "stock",
            "inventory",
            "delivery",
            "trade",
            "sap",
            "slas",
            "order",
            "customer service",
            "supply chain",
        ]
    )

    data_context = any(
        w in job_text
        for w in [
            "data",
            "analytics",
            "dashboard",
            "reporting",
            "sql",
            "python",
            "bi",
            "kpi",
            "forecast",
            "forecasting",
            "analysis",
            "analyst",
        ]
    )

    marketing_context = any(
        w in job_text
        for w in [
            "marketing",
            "media",
            "ads",
            "crm",
            "campaign",
            "seo",
            "sea",
            "acquisition",
            "paid",
            "performance marketing",
            "content",
            "social media",
        ]
    )

    web_context = any(
        w in job_text
        for w in [
            "webflow",
            "figma",
            "website",
            "site web",
            "ux",
            "ui",
            "frontend",
            "backend",
            "developer",
            "developpeur",
        ]
    )

    blocked_for_supply = [
        "meta_ads",
        "meta ads",
        "google ads",
        "paid media",
        "media buying",
        "seo",
        "sea",
        "mailchimp",
        "email marketing",
        "crm",
        "figma",
        "webflow",
        "website",
        "website_management",
        "ux",
        "ui",
        "acquisition",
        "copywriting",
        "community management",
        "social media",
    ]

    if supply_context and not marketing_context and not web_context:
        if any(blocked in skill_norm for blocked in blocked_for_supply):
            return False

    data_tools = [
        "sql",
        "python",
        "looker",
        "power bi",
        "dashboard",
        "business intelligence",
    ]

    if any(tool in skill_norm for tool in data_tools) and not data_context:
        return False

    return True


def select_technical_skills(skills_df, selected_experiences, parsed_job, max_skills=8):
    job_text = parsed_job["normalized_text"]

    candidates = []

    supply_context = any(
        w in job_text
        for w in [
            "adv",
            "import",
            "export",
            "supply",
            "chain",
            "warehouse",
            "transport",
            "procurement",
            "stock",
            "inventory",
            "logistics",
            "delivery",
            "trade",
            "sap",
            "slas",
            "order",
            "customer service",
        ]
    )

    data_context = any(
        w in job_text
        for w in [
            "data",
            "analyst",
            "analytics",
            "dashboard",
            "reporting",
            "kpi",
            "sql",
            "python",
            "power bi",
            "forecast",
            "forecasting",
        ]
    )

    marketing_context = any(
        w in job_text
        for w in [
            "marketing",
            "media",
            "ads",
            "crm",
            "campaign",
            "acquisition",
            "seo",
            "sea",
            "paid",
        ]
    )

    web_context = any(
        w in job_text
        for w in [
            "webflow",
            "figma",
            "website",
            "site web",
            "ux",
            "ui",
            "frontend",
            "backend",
            "developer",
            "developpeur",
        ]
    )

    # 1. Skills depuis la feuille skills
    if not skills_df.empty:
        for _, row in skills_df.iterrows():
            skill_name = get_value(
                row,
                [
                    "skill_name",
                    "name",
                    "skill",
                    "competence",
                    "compétence",
                ],
                "",
            )

            if not skill_name:
                continue

            searchable = row_search_text(row)
            skill_norm = normalize_text(skill_name)

            score = 0

            for keyword in parsed_job["keywords"]:
                if keyword in searchable:
                    score += 3

            if skill_norm and skill_norm in job_text:
                score += 20

            if supply_context:
                supply_boosts = {
                    "sap": 45,
                    "sap ewm": 40,
                    "s/4hana": 38,
                    "s4hana": 38,
                    "4hana": 38,
                    "adv": 35,
                    "import": 34,
                    "export": 34,
                    "incoterms": 34,
                    "fca": 28,
                    "cpt": 28,
                    "dap": 28,
                    "logistics": 30,
                    "logistique": 30,
                    "warehouse": 28,
                    "entrepot": 28,
                    "transport": 26,
                    "delivery": 26,
                    "livraison": 26,
                    "supply": 32,
                    "procurement": 26,
                    "achats": 24,
                    "stock": 26,
                    "inventory": 26,
                    "order": 22,
                    "operations": 22,
                    "slas": 20,
                }

                for word, weight in supply_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if data_context:
                data_boosts = {
                    "sql": 35,
                    "python": 35,
                    "looker": 30,
                    "power bi": 30,
                    "dashboard": 30,
                    "reporting": 28,
                    "kpi": 28,
                    "forecast": 28,
                    "analytics": 25,
                    "analyse de donnees": 25,
                    "data": 25,
                }

                for word, weight in data_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if marketing_context:
                marketing_boosts = {
                    "meta ads": 35,
                    "google ads": 35,
                    "paid media": 32,
                    "media buying": 32,
                    "seo": 30,
                    "sea": 30,
                    "crm": 28,
                    "mailchimp": 25,
                    "email marketing": 25,
                    "acquisition": 25,
                    "campaign": 22,
                }

                for word, weight in marketing_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if web_context:
                web_boosts = {
                    "webflow": 35,
                    "figma": 32,
                    "ux": 28,
                    "ui": 28,
                    "frontend": 25,
                    "backend": 25,
                    "website": 25,
                    "site web": 25,
                }

                for word, weight in web_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if score > 0:
                candidates.append((translate_skill(skill_name), score))

    # 2. Skills depuis les expériences sélectionnées
    for row in selected_experiences:
        for col in [
            "tools_verified",
            "tools",
            "skills_verified",
            "skills",
            "skill_tags",
            "technical_skills",
            "skills_transferable",
            "skills_exposed",
        ]:
            raw = get_value(row, [col], "")

            for skill in split_multi_value(raw):
                skill_norm = normalize_text(skill)

                if not skill_norm:
                    continue

                score = 3

                if skill_norm in job_text:
                    score += 15

                if supply_context:
                    if any(
                        w in skill_norm
                        for w in [
                            "sap",
                            "ewm",
                            "s/4hana",
                            "s4hana",
                            "adv",
                            "import",
                            "export",
                            "incoterms",
                            "fca",
                            "cpt",
                            "dap",
                            "logistics",
                            "logistique",
                            "transport",
                            "warehouse",
                            "stock",
                            "inventory",
                            "supply",
                            "procurement",
                            "delivery",
                            "operations",
                        ]
                    ):
                        score += 30

                if data_context:
                    if any(
                        w in skill_norm
                        for w in [
                            "sql",
                            "python",
                            "looker",
                            "power bi",
                            "dashboard",
                            "reporting",
                            "kpi",
                            "data",
                            "analytics",
                            "forecast",
                        ]
                    ):
                        score += 28

                if marketing_context:
                    if any(
                        w in skill_norm
                        for w in [
                            "meta ads",
                            "google ads",
                            "paid media",
                            "media buying",
                            "seo",
                            "sea",
                            "crm",
                            "mailchimp",
                            "campaign",
                        ]
                    ):
                        score += 28

                candidates.append((translate_skill(skill), score))

    # 3. Fallback contextualisé propre
    fallback_by_context = []

    if supply_context:
        fallback_by_context += [
            "SAP",
            "SAP EWM",
            "SAP S/4HANA",
            "Gestion ADV",
            "Gestion export",
            "Gestion import",
            "Incoterms (FCA, CPT, DAP)",
            "Coordination logistique",
            "Coordination supply chain",
            "Gestion des stocks",
            "Suivi des livraisons",
            "Gestion des opérations",
            "Reporting opérationnel",
            "Suivi des KPI",
        ]

    if data_context:
        fallback_by_context += [
            "Excel",
            "SQL",
            "Python",
            "Looker",
            "Power BI",
            "Reporting",
            "Suivi des KPI",
            "Analyse de données",
            "Dashboarding",
            "Prévision de la demande",
        ]

    if marketing_context:
        fallback_by_context += [
            "Achat média",
            "Meta Ads",
            "Google Ads",
            "CRM marketing",
            "Email marketing",
            "SEO",
            "SEA",
            "Analyse de performance",
        ]

    if web_context:
        fallback_by_context += [
            "Webflow",
            "Figma",
            "UI/UX",
            "Automatisation backend",
            "Optimisation site web",
        ]

    for skill in fallback_by_context:
        candidates.append((skill, 10))

    # 4. Filtrage, traduction, déduplication
    score_by_skill = {}

    for skill, score in candidates:
        skill = safe_str(skill)

        if not skill:
            continue

        skill = translate_skill(skill)

        if not is_skill_allowed_for_job(skill, job_text):
            continue

        key = normalize_text(skill)

        if not key:
            continue

        if "_" in key and " " in key:
            continue

        if "meta_ads_manager" in key:
            continue

        if key not in score_by_skill or score > score_by_skill[key][1]:
            score_by_skill[key] = (skill, score)

    ranked = sorted(score_by_skill.values(), key=lambda x: x[1], reverse=True)

    if supply_context and not data_context:
        preferred_supply_order = [
            "SAP",
            "SAP EWM",
            "SAP S/4HANA",
            "Gestion ADV",
            "Gestion export",
            "Gestion import",
            "Incoterms (FCA, CPT, DAP)",
            "Coordination logistique",
            "Coordination supply chain",
            "Gestion des stocks",
            "Suivi des livraisons",
            "Gestion des opérations",
            "Reporting opérationnel",
        ]

        selected = []
        available = {normalize_text(skill): skill for skill, _ in ranked}

        for preferred in preferred_supply_order:
            key = normalize_text(preferred)
            if key in available and available[key] not in selected:
                selected.append(available[key])
            elif preferred not in selected:
                selected.append(preferred)

            if len(selected) >= max_skills:
                break

        return selected

    selected = []

    for skill, _ in ranked:
        if skill not in selected:
            selected.append(skill)

        if len(selected) >= max_skills:
            break

    return selected


# ============================================================
# FORMAT ROWS
# ============================================================

def format_experience(row):
    company = get_value(row, ["company", "organisation", "organization", "org", "entreprise"], "")
    position = get_value(row, ["position_title", "position", "title", "job_title", "role"], "")
    location = get_value(row, ["location", "city", "city_state", "lieu"], "")

    raw_dates = get_value(row, ["dates", "date", "year", "date_range"], "")
    dates = format_year_or_date(raw_dates) if raw_dates else ""

    if not dates:
        start = get_value(row, ["date_start", "start_year"], "")
        end = get_value(row, ["date_end", "end_year"], "")
        dates = clean_dash_join(format_year_or_date(start), format_year_or_date(end))

    return {
        "company": company,
        "position": position,
        "location": location,
        "dates": dates,
        "bullets": extract_truth_bullets(row, max_bullets=4),
    }


def format_leadership(row):
    org = get_value(row, ["organisation", "organization", "company", "org", "activity", "project"], "")
    role = get_value(row, ["role", "position_title", "position", "title"], "")
    location = get_value(row, ["city", "location", "city_state", "lieu"], "")

    raw_dates = get_value(row, ["year", "dates", "date", "date_range"], "")
    dates = format_year_or_date(raw_dates) if raw_dates else ""

    if not dates:
        start = get_value(row, ["date_start", "start_year"], "")
        end = get_value(row, ["date_end", "end_year"], "")
        dates = clean_dash_join(format_year_or_date(start), format_year_or_date(end))

    return {
        "org": org,
        "role": role,
        "location": location,
        "dates": dates,
        "bullets": extract_truth_bullets(row, max_bullets=2),
    }


# ============================================================
# OUTPUT
# ============================================================

def build_output_filename(parsed_job):
    company = parsed_job.get("company") or "Entreprise"
    title = parsed_job.get("job_title") or "Poste cible"

    title_clean = normalize_text(title)

    bad_fragments = [
        "department oversees",
        "individual team members",
        "typically managing",
        "countries",
        "responsibilities",
        "activities",
        "both upstream",
        "downstream",
    ]

    if (
        len(title_clean) > 70
        or title_clean.count(" ") > 8
        or any(fragment in title_clean for fragment in bad_fragments)
    ):
        title = "Poste cible"

    company = clean_filename_part(company, "Entreprise", max_length=28)
    title = clean_filename_part(title, "Poste_cible", max_length=38)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = f"CV_Lucas_Pertusa_{company}_{title}_{timestamp}.docx"

    if len(filename) > 115:
        filename = f"CV_Lucas_Pertusa_{company}_{timestamp}.docx"

    if len(filename) > 115:
        filename = f"CV_Lucas_Pertusa_{timestamp}.docx"

    return filename


def build_replacements(experiences, leadership, certifications, technical_skills):
    exp1 = experiences[0] if len(experiences) > 0 else {}
    exp2 = experiences[1] if len(experiences) > 1 else {}

    lead1 = leadership[0] if len(leadership) > 0 else {}

    replacements = {
        "[[CERTIFICATION_ENTRIES]]": "\n".join(certifications),

        "[[EXP_1_COMPAGNY]]": exp1.get("company", ""),
        "[[EXP_1_COMPANY]]": exp1.get("company", ""),
        "[[EXP_1_POSITION_TITLE]]": exp1.get("position", ""),
        "[[EXP_1_LOCATION]]": exp1.get("location", ""),
        "[[EXP_1_DATES]]": exp1.get("dates", ""),
        "[[EXP_1_BULLETS]]": exp1.get("bullets", []),

        "[[EXP_2_COMPAGNY]]": exp2.get("company", ""),
        "[[EXP_2_COMPANY]]": exp2.get("company", ""),
        "[[EXP_2_POSITION_TITLE]]": exp2.get("position", ""),
        "[[EXP_2_LOCATION]]": exp2.get("location", ""),
        "[[EXP_2_DATES]]": exp2.get("dates", ""),
        "[[EXP_2_BULLETS]]": exp2.get("bullets", []),

        "[[LEAD_1_ORG]]": lead1.get("org", ""),
        "[[LEAD_1_ROLE]]": lead1.get("role", ""),
        "[[LEAD_1_LOCATION]]": lead1.get("location", ""),
        "[[LEAD_1_DATES]]": lead1.get("dates", ""),
        "[[LEAD_1_BULLETS]]": lead1.get("bullets", []),

        "[[TECHNICAL_SKILLS]]": ", ".join(technical_skills),
    }

    return replacements


def write_last_run_report(
    parsed_job,
    output_path,
    selected_exp_rows,
    selected_experiences,
    selected_lead_rows,
    selected_leadership,
    selected_certifications,
    selected_skills,
):
    report = {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "mode": "local",
        "company_detected": parsed_job.get("company"),
        "job_title_detected": parsed_job.get("job_title"),
        "keywords_detected": parsed_job.get("keywords", [])[:50],
        "output_docx": str(output_path),
        "selected_experiences": [],
        "selected_leadership": [],
        "selected_certifications": selected_certifications,
        "selected_technical_skills": selected_skills,
        "warnings": [],
    }

    for row, exp in zip(selected_exp_rows, selected_experiences):
        report["selected_experiences"].append(
            {
                "company": exp.get("company"),
                "position_title": exp.get("position"),
                "location": exp.get("location"),
                "dates": exp.get("dates"),
                "score": float(row.get("_score", 0)) if "_score" in row.index else None,
                "reason_tags": split_multi_value(
                    get_value(row, ["job_family_tags", "industry_tags", "skills_verified"], "")
                )[:20],
            }
        )

    for row, lead in zip(selected_lead_rows, selected_leadership):
        report["selected_leadership"].append(
            {
                "organisation": lead.get("org"),
                "role": lead.get("role"),
                "location": lead.get("location"),
                "dates": lead.get("dates"),
                "score": float(row.get("_score", 0)) if "_score" in row.index else None,
            }
        )

    report_path = OUTPUT_DIR / "last_run_report.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# ============================================================
# MAIN
# ============================================================

def main():
    print("Lecture de la job description...")
    job_text = load_job_description()

    print("Chargement du master profile...")
    workbook = load_master_profile()

    experiences_df = workbook["experiences"]
    leadership_df = workbook["leadership"]
    certifications_df = workbook["certifications"]
    skills_df = workbook["skills"]

    print("Analyse de la job description...")
    parsed_job = parse_job(job_text)

    print("Sélection des expériences...")
    selected_exp_rows = select_top_rows(experiences_df, parsed_job, max_rows=2)
    selected_exp_rows = sorted(selected_exp_rows, key=get_row_year, reverse=True)
    selected_experiences = [format_experience(row) for row in selected_exp_rows]

    print("Sélection du leadership...")
    selected_lead_rows = select_top_rows(leadership_df, parsed_job, max_rows=1)
    selected_leadership = [format_leadership(row) for row in selected_lead_rows]

    print("Optimisation Gemini du CV complet...")
    selected_experiences, selected_leadership = improve_full_cv_with_gemini(
        selected_experiences,
        selected_leadership,
        job_text,
    )

    print("Sélection des certifications...")
    selected_certifications = select_certifications(certifications_df, parsed_job, max_certs=2)

    print("Sélection des compétences techniques...")
    selected_skills = select_technical_skills(
        skills_df,
        selected_exp_rows,
        parsed_job,
        max_skills=8,
    )

    replacements = build_replacements(
        selected_experiences,
        selected_leadership,
        selected_certifications,
        selected_skills,
    )

    print("\n--- Résumé génération ---")
    print(f"Entreprise détectée : {parsed_job.get('company')}")
    print(f"Poste détecté : {parsed_job.get('job_title')}")

    print("\nExpériences sélectionnées :")
    for exp in selected_experiences:
        print(f"- {exp.get('company')} | {exp.get('position')} | {exp.get('dates')}")
        print(f"  Bullets : {len(exp.get('bullets', []))}")

    print("\nLeadership sélectionné :")
    for lead in selected_leadership:
        print(f"- {lead.get('org')} | {lead.get('role')} | {lead.get('dates')}")
        print(f"  Bullets : {len(lead.get('bullets', []))}")

    print("\nCertifications sélectionnées :")
    for cert in selected_certifications:
        print(f"- {cert}")

    print("\nCompétences techniques sélectionnées :")
    print(", ".join(selected_skills))

    print("\nConstruction du CV...")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CV_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    output_filename = build_output_filename(parsed_job)
    output_path = CV_OUTPUT_DIR / output_filename

    renderer = DocxTemplateRenderer(BASE_CV_TEMPLATE_PATH)
    renderer.render(replacements, output_path)

    if not output_path.exists():
        raise RuntimeError(f"Le fichier n'a pas été généré : {output_path}")

    write_last_run_report(
        parsed_job=parsed_job,
        output_path=output_path,
        selected_exp_rows=selected_exp_rows,
        selected_experiences=selected_experiences,
        selected_lead_rows=selected_lead_rows,
        selected_leadership=selected_leadership,
        selected_certifications=selected_certifications,
        selected_skills=selected_skills,
    )

    print(f"CV généré : {output_path}")
    print(f"Rapport généré : {OUTPUT_DIR / 'last_run_report.json'}")


if __name__ == "__main__":
    main()
