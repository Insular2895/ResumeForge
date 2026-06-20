from pathlib import Path
from datetime import datetime
import json
import os
import re
import unicodedata

import pandas as pd

from src.render.docx_template import DocxTemplateRenderer
from src.llm.cv_enhancer import improve_full_cv_with_gemini, translate_cv_lists_to_english
from src.application.document_language import detect_document_language, cv_static_replacements
from src.application.ats_matcher import (
    analyze_ats_match,
    build_job_reference_context,
    build_resume_ats_text,
)
from src.letter.french_proofreader import (
    apply_known_french_corrections,
    check_french_text,
    enforce_french_docx,
)
from src.web.prompt_overrides import is_override_active
from src.application.career_translation import resolve_target_domain
from src.application.experience_memory import attach_memory_to_experiences


# ============================================================
# PATHS
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[1]

MASTER_PROFILE_PATH = ROOT_DIR / "data" / "reference" / "master_profile.xlsx"
BASE_CV_TEMPLATE_PATH = ROOT_DIR / "templates" / "base_cv.docx"
OUTPUT_DIR = ROOT_DIR / "data" / "output"
CV_OUTPUT_DIR = OUTPUT_DIR / "cv"
ATS_ACCEPTABLE_SCORE = 70

POSSIBLE_JOB_PATHS = [
    ROOT_DIR / "data" / "input" / "job_description.txt",
    ROOT_DIR / "data" / "input" / "job.txt",
    ROOT_DIR / "job_description.txt",
    ROOT_DIR / "job.txt",
]


def ats_match_status(score, threshold=ATS_ACCEPTABLE_SCORE):
    if score is None:
        return "unknown"
    try:
        return "acceptable" if int(score) >= threshold else "needs_rework"
    except (TypeError, ValueError):
        return "unknown"


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


def clean_detected_job_title(value):
    title = safe_str(value)
    if not title:
        return "Poste cible"

    title = apply_known_french_corrections(title)
    title = re.sub(r"(?i)\s*[-–—]?\s*job\s*post\s*$", "", title).strip()
    title = re.sub(r"(?i)\bcharg[ée]\(e\)", "Chargé", title)
    title = re.sub(r"(?i)\bassistant\(e\)", "Assistant", title)
    title = re.sub(r"(?i)\s*[-–—]?\s*\(?\s*[hf]\s*/\s*[hf]\s*\)?\s*$", "", title).strip()
    title = re.sub(r"\s*/\s*", " / ", title)
    title = re.sub(r"\s*[-–—]\s*", " - ", title)
    title = re.sub(r"\s+", " ", title).strip(" -")
    return title or "Poste cible"


def format_year_or_date(value):
    value = safe_str(value)

    if not value:
        return ""
    if re.fullmatch(r"(?:19|20)\d{2}\.0", value):
        return value[:-2]

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
        "experiences": pd.DataFrame(attach_memory_to_experiences(MASTER_PROFILE_PATH)),
        "experience_memory": get_sheet_case_insensitive(excel, "experience_memory"),
        "leadership": get_sheet_case_insensitive(excel, "leadership"),
        "certifications": get_sheet_case_insensitive(excel, "certifications"),
        "skills": get_sheet_case_insensitive(excel, "skills"),
        "skills_by_target": get_sheet_case_insensitive(excel, "skills_by_target"),
        "claim_rules": get_sheet_case_insensitive(excel, "claim_rules"),
        "job_families": get_sheet_case_insensitive(excel, "job_families"),
        "settings": get_sheet_case_insensitive(excel, "settings"),
    }

    return workbook


# ============================================================
# JOB PARSER SIMPLE
# ============================================================

def extract_company(job_text):
    lines = [l.strip() for l in job_text.splitlines() if l.strip()]

    staffing_client = extract_staffing_client_company(job_text)
    if staffing_client:
        return staffing_client

    header_company = extract_company_from_job_board_header(lines)
    if header_company:
        return header_company

    employer_patterns = [
        r"(?i)\bpour\s+l['’]entreprise\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,50})\b",
        r"(?i)\bnous\s+sommes\s+l['’]entreprise\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,50})\b",
        r"(?i)\bl['’]entreprise\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,50})\s+(?:recherche|recrute|est|exerce|conçoit|concoit|développe|developpe)\b",
    ]

    for pattern in employer_patterns:
        match = re.search(pattern, job_text)
        if match:
            company = clean_detected_company(match.group(1))
            if 2 <= len(company) <= 40:
                return company

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
        r"(?i)wanted\s+for\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,50})\b",
        r"(?i)\bchez\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,50})\b",
        r"([A-Z][A-Z0-9&.\- ]{2,})\s+(?:exerce|est|recherche|conçoit|concoit|développe|developpe)\b",
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
                candidate = clean_detected_company(match.group(1))
                if candidate.lower() not in stop and 2 <= len(candidate) <= 40:
                    return candidate

    # Cas Ipsen si le nom est présent dans le texte sans structure claire
    if "ipsen" in normalize_text(job_text):
        return "Ipsen"

    return "Entreprise"


def extract_staffing_client_company(job_text):
    text_norm = normalize_text(job_text)
    staffing_markers = [
        "adecco",
        "spera recrutement",
        "page personnel",
        "actual talent",
        "artus interim",
        "recrutement",
        "interim",
        "intérim",
    ]
    if not any(marker in text_norm for marker in staffing_markers):
        return ""

    known_clients = {
        "stellantis": "Stellantis",
        "stelentis": "Stellantis",
        "stellentis": "Stellantis",
    }
    for marker, display in known_clients.items():
        if marker in text_norm:
            return display

    patterns = [
        r"(?i)\b(?:adecco|cabinet|agence)\s+recrute\s+pour\s+son\s+client\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,60})\b",
        r"(?i)\bpour\s+son\s+client\s+([A-Z][A-Za-z0-9À-ÿ'&.\- ]{1,60})\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, job_text)
        if match:
            candidate = clean_detected_company(match.group(1))
            if 2 <= len(candidate) <= 45:
                return candidate
    return ""


def extract_company_from_job_board_header(lines):
    for line in lines[:8]:
        wanted = re.search(r"(?i)^wanted\s+for\s+(.+)$", line)
        if wanted:
            candidate = clean_detected_company(wanted.group(1))
            if looks_like_header_company(candidate):
                return candidate

    for index, line in enumerate(lines[:8]):
        cleaned = clean_detected_company(line)
        title = clean_detected_job_title(cleaned)
        if index in {1, 2} and "&" in cleaned and looks_like_header_company(cleaned):
            return cleaned
        if looks_like_real_job_title(title):
            continue
        if looks_like_header_company(cleaned):
            return cleaned

    return ""


def looks_like_header_company(value):
    company = safe_str(value)
    if not company:
        return False

    lowered = normalize_text(company)
    forbidden = [
        "details de l emploi",
        "correspondance entre ce poste",
        "salaire",
        "type de poste",
        "lieu",
        "job post",
        "cdi",
        "temps plein",
        "teletravail",
        "a repondu",
        "pour l entreprise",
        "nous sommes l entreprise",
        "de 30",
        "de 32",
        "par an",
    ]
    if any(fragment in lowered for fragment in forbidden):
        return False
    if re.search(r"\d{2,3}\s?000|€|\([0-9]{2}\)", company):
        return False
    if re.match(r"^\d{5}\s+\D", company):
        return False
    if len(company.split()) > 5:
        return False
    return bool(re.search(r"[A-Za-zÀ-ÿ]{2,}", company))


def clean_detected_company(value):
    company = safe_str(value)
    company = re.sub(r"(?i)\s*[-–—]?\s*job\s*post\s*$", "", company).strip()
    company = re.split(
        r"(?i)\s*,|\s+pour\s+|\s+recherche\s+|\s+recrute\s+|\s+est\s+|\s+exerce\s+|\s+sp[ée]cialis[ée]e?\s+",
        company,
        maxsplit=1,
    )[0]
    company = re.sub(r"\s+", " ", company).strip(" -:|•")
    if company.isupper() and len(company) > 3:
        company = company.title()
    return company


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
        "administration des ventes",
        "administration",
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
                title = clean_detected_job_title(match.group(1))
                title = re.sub(r"\s*\([^)]*\)", "", title).strip()
                if looks_like_real_job_title(title):
                    return title

    for line in lines[:25]:
        cleaned = clean_detected_job_title(re.sub(r"\s*\([^)]*\)", "", line).strip())
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
        "kpis_verified",
        "validated_memory",
    ]

    values = []

    for col in columns:
        if col in row.index:
            values.append(safe_str(row[col]))

    for i in range(1, 11):
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

    high_signal_domain_terms = {
        "fruits": 30,
        "legumes": 30,
        "rungis": 35,
        "agroalimentaire": 25,
    }
    for term, weight in high_signal_domain_terms.items():
        if term in job_text and term in searchable:
            score += weight

    company = normalize_text(get_value(row, ["company", "organisation", "organization"], ""))
    flags = _context_flags(job_text)

    if company == "blurry":
        if any(w in job_text for w in ["adv", "order", "commande", "customer service", "service client", "client service"]):
            score += 45
        if any(w in job_text for w in ["adv", "import", "export", "logistics", "supply", "operations", "international"]):
            score += 55
        if flags["retail"]:
            score += 45
        if flags["marketing"]:
            score += 62
            if any(w in job_text for w in ["publicite", "ads", "advertising", "media", "achat media", "campagne"]):
                score += 35
        if flags["tech"]:
            score += 70
        if flags["commercial"]:
            score += 18
        if flags["project"]:
            score += 28

    if company == "adventis":
        if flags["finance"]:
            score += 55
            if any(w in job_text for w in ["banque", "banking", "credit", "solvabilite", "portefeuille clients", "clientele professionnels"]):
                score += 45
        if flags["marketing"]:
            score += 58
            if any(w in job_text for w in ["publicite", "ads", "advertising", "media", "achat media", "campagne"]):
                score += 45
        if flags["commercial"]:
            score += 35
        if flags["project"]:
            score += 28
        if flags["retail"]:
            score -= 25

    if company == "orion trading":
        if flags["finance"]:
            score += 30
        if flags["supply"]:
            score += 10
        if flags["marketing"]:
            score += 55
        if "publicite" in job_text or "media" in job_text or "achat media" in job_text:
            score += 55
        if flags["retail"]:
            score += 65

    if company == "weplugworld":
        if flags["marketing"]:
            score += 18
        if flags["tech"]:
            score += 65
        if flags["commercial"]:
            score += 12
        if flags["retail"]:
            score -= 12
        if flags["finance"] and any(w in job_text for w in ["banque", "banking", "credit", "solvabilite", "clientele professionnels"]):
            score -= 35

    if company == "minero":
        if flags["retail"]:
            score += 55
        if flags["commercial"]:
            score += 18
        if flags["supply"]:
            score += 2
        if any(w in job_text for w in ["procurement", "purchasing", "achats", "sourcing"]):
            score += 25
        if any(w in job_text for w in ["adv", "customer service", "service client"]):
            score -= 35

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

    for i in range(1, 11):
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
        explicit_sap_context = any(w in job_text for w in ["sap", "erp", "ewm", "s/4hana", "s4hana", "4hana"])

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
                "banque",
                "banking",
                "solvabilite",
                "risk",
                "risque",
                "portfolio",
                "portefeuille",
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
            if explicit_sap_context:
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

            if not finance_context and ("risk" in combined or "portfolio" in combined):
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
                base += 180

            if "financial" in combined or "finance" in combined:
                base += 70

            if "geneva" in combined or "university of geneva" in combined:
                base += 120

            if not explicit_sap_context and "sap" in combined:
                base -= 80
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


def _contains_any(text, terms):
    return any(term in text for term in terms)


def _skill_key(skill):
    return normalize_text(skill).replace(" d ", " ").replace(" l ", " ")


def _split_skill_list(raw):
    return [part.strip() for part in re.split(r"\s*\|\s*|\n|;", safe_str(raw)) if part.strip()]


def _row_text(row, columns):
    return " ".join(get_value(row, [column], "") for column in columns)


def _target_profile_extra_score(target_name, job_text):
    target = normalize_text(target_name)
    score = 0

    if "banque" in target or "banking" in target:
        if _contains_any(job_text, [
            "banque", "banking", "charge de clientele", "conseiller clientele",
            "clientele professionnels", "professionnels", "portefeuille clients",
            "solvabilite", "credit", "risque", "conformite", "banque-assurances",
        ]):
            score += 80

    if "finance / risk" in target or "finance operations" in target:
        if _contains_any(job_text, [
            "finance", "financial", "risk", "risque", "credit", "solvabilite",
            "financement", "portfolio", "portefeuille", "due diligence",
            "cash-flow", "marge", "rentabilite",
        ]):
            score += 55

    if "commercial" in target or "business development" in target:
        if _contains_any(job_text, [
            "commercial", "vente", "prospection", "business development",
            "pipeline", "crm", "negociation", "fidelisation", "client",
            "relation client", "account management",
        ]):
            score += 45

    if "retail" in target or "vente conseil" in target:
        if _contains_any(job_text, [
            "retail", "magasin", "vendeur", "conseiller de vente", "vente conseil",
            "rayon", "encaissement", "client magasin", "decathlon", "sport",
        ]):
            score += 85

    if "supply" in target or "adv" in target or "import-export" in target:
        if _contains_any(job_text, [
            "adv", "import", "export", "supply", "logistique", "stock",
            "transport", "incoterms", "sap", "commande", "livraison",
        ]):
            score += 65

    if "publicite" in target or "achat media" in target or "advertising" in target:
        if _contains_any(job_text, [
            "publicite", "media", "advertising", "paid", "campaign", "campagne",
            "ooh", "achat media", "marketing", "roas", "cpm", "cpc", "cac",
        ]):
            score += 70

    if "tech" in target or "product ops" in target or "digital project" in target:
        if _contains_any(job_text, [
            "google", "tech", "product", "produit", "metrics", "uat",
            "requirements", "automation", "documentation", "webflow", "figma",
            "sql", "python", "data", "analytics", "app", "application",
            "automatisation", "no-code", "nocode",
        ]):
            score += 65

    if "projet" in target or "pmo" in target or "project" in target:
        if _contains_any(job_text, [
            "chef de projet", "project", "pmo", "coordination", "roadmap",
            "planning", "jalons", "livrables", "stakeholder", "recette",
        ]):
            score += 45

    return score


def select_target_profiles(skills_by_target_df, parsed_job, max_profiles=2):
    if skills_by_target_df is None or getattr(skills_by_target_df, "empty", True):
        return []

    job_text = parsed_job["normalized_text"]
    scored = []

    for _, row in skills_by_target_df.iterrows():
        target_name = get_value(row, ["target_profile"], "")
        if not target_name:
            continue

        searchable = normalize_text(
            _row_text(
                row,
                [
                    "target_profile",
                    "CV_positioning",
                    "top_skills_8_to_10",
                    "secondary_skills",
                    "best_experience_angle",
                    "keywords_ATS",
                ],
            )
        )
        score = _target_profile_extra_score(target_name, job_text)

        for keyword in parsed_job["keywords"]:
            if keyword and keyword in searchable:
                score += 4

        for term in _split_skill_list(get_value(row, ["keywords_ATS"], "")):
            term_norm = normalize_text(term)
            if term_norm and term_norm in job_text:
                score += 12

        if score > 0:
            scored.append((score, row))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [row for score, row in scored[:max_profiles] if score >= 20]


def target_profile_skills(skills_by_target_df, parsed_job, max_skills=10):
    selected = []
    for row in select_target_profiles(skills_by_target_df, parsed_job, max_profiles=2):
        for column in ["top_skills_8_to_10", "secondary_skills"]:
            for skill in _split_skill_list(get_value(row, [column], "")):
                if skill not in selected:
                    selected.append(skill)
                if len(selected) >= max_skills:
                    return selected
    return selected


def _context_flags(job_text):
    return {
        "supply": _contains_any(job_text, [
            "adv", "import", "export", "supply", "chain", "warehouse", "transport",
            "procurement", "stock", "inventory", "logistics", "delivery", "trade",
            "sap", "slas", "order", "customer service", "supply chain",
        ]),
        "data": _contains_any(job_text, [
            "data", "analyst", "analytics", "dashboard", "reporting", "kpi",
            "sql", "python", "power bi", "forecast", "forecasting", "bi",
        ]),
        "marketing": _contains_any(job_text, [
            "marketing", "media", "ads", "crm", "campaign", "acquisition",
            "seo", "sea", "paid", "roas", "cpm", "cpc", "cac", "publicite",
        ]),
        "web": _contains_any(job_text, [
            "webflow", "figma", "website", "site web", " ux ", " ui ", "frontend",
            "backend", "developer", "developpeur",
        ]),
        "tech": _contains_any(job_text, [
            "google", "tech", "product", "produit", "app", "application",
            "software", "logiciel", "automation", "automatisation", "no-code",
            "nocode", "api", "requirements", "metrics", "uat", "frontend",
            "backend", "developer", "developpeur", "data", "analytics",
        ]),
        "finance": _contains_any(job_text, [
            "finance", "financial", "risk", "risque", "credit", "solvabilite",
            "financement", "portfolio", "portefeuille", "banque", "banking",
            "due diligence", "cash-flow", "marge", "rentabilite",
        ]),
        "commercial": _contains_any(job_text, [
            "commercial", "vente", "prospection", "pipeline", "crm",
            "negociation", "fidelisation", "client", "relation client",
            "account management", "business development",
        ]),
        "retail": _contains_any(job_text, [
            "retail", "magasin", "vendeur", "conseiller de vente", "rayon",
            "encaissement", "decathlon", "sport", "vente conseil",
        ]),
        "project": _contains_any(job_text, [
            "chef de projet", "project", "pmo", "coordination", "roadmap",
            "planning", "jalons", "livrables", "stakeholder", "recette",
        ]),
    }


def _is_office_context(job_text):
    return _contains_any(job_text, [
        "microsoft office",
        "pack office",
        "google workspace",
        "word",
        "powerpoint",
        "excel",
        "outils bureautiques",
        "bureautique",
    ])


def erp_skills_for_job(job_text):
    skills = []
    if _contains_any(job_text, ["erp", "sap", "m3", "navision", "sage", "oracle"]):
        skills.append("ERP")
    if _contains_any(job_text, ["sap", "s/4hana", "s4hana"]):
        skills.append("SAP")
    if _contains_any(job_text, ["m3"]):
        skills.append("M3")
    if _contains_any(job_text, ["sage", "logiciel sage"]):
        skills.append("Logiciel Sage")
    if _contains_any(job_text, ["navision", "dynamics"]):
        skills.append("Navision")
    if _contains_any(job_text, ["oracle erp", "oracle"]):
        skills.append("Oracle ERP")
    return skills


def is_skill_allowed_for_job(skill, job_text):
    skill_norm = normalize_text(skill)
    flags = _context_flags(job_text)
    office_context = _is_office_context(job_text)

    web_marketing_terms = [
        "meta_ads",
        "meta ads",
        "google ads",
        "paid media",
        "media buying",
        "seo",
        "sea",
        "mailchimp",
        "email marketing",
        "crm marketing",
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

    if flags["supply"] and not flags["marketing"] and not flags["web"]:
        if any(blocked in skill_norm for blocked in web_marketing_terms):
            return False

    if office_context and flags["commercial"] and not flags["web"]:
        if any(blocked in skill_norm for blocked in [
            "webflow", "figma", "client-first", "client first", "landing page",
            "seo", "sea", "ux", "ui", "frontend", "backend",
            "requirements", "recueil des besoins", "acceptance", "criteres d acceptation",
            "uat", "roadmap", "jalons", "documentation technique", "passation",
            "optimisation site web", "automatisation",
        ]):
            return False

    if flags["finance"] and not flags["marketing"] and not flags["web"]:
        if any(blocked in skill_norm for blocked in web_marketing_terms):
            return False
        if any(blocked in skill_norm for blocked in [
            "webflow", "figma", "seo", "sea", "mailchimp", "landing page",
            "paid media", "achat media", "media buying", "meta", "google ads",
            "sap ewm", "s/4hana", "supply chain", "gestion import",
            "gestion export", "incoterms", "transport", "stock",
        ]):
            return False

    if flags["retail"] and not flags["finance"]:
        if any(blocked in skill_norm for blocked in [
            "modelisation financiere", "due diligence", "structuration de financements",
            "sap ewm", "s/4hana", "python", "sql", "webflow",
        ]):
            return False

    data_tools = [
        "sql",
        "python",
        "looker",
        "power bi",
        "dashboard",
        "business intelligence",
    ]

    if any(tool in skill_norm for tool in data_tools) and not flags["data"]:
        return False

    return True


def select_technical_skills(
    skills_df,
    selected_experiences,
    parsed_job,
    max_skills=12,
    skills_by_target_df=None,
    claim_rules_df=None,
):
    job_text = parsed_job["normalized_text"]

    candidates = []
    target_skills = target_profile_skills(skills_by_target_df, parsed_job, max_skills=12)

    flags = _context_flags(job_text)
    supply_context = flags["supply"]
    data_context = flags["data"]
    marketing_context = flags["marketing"]
    web_context = flags["web"]
    finance_context = flags["finance"]
    commercial_context = flags["commercial"]
    retail_context = flags["retail"]
    project_context = flags["project"]
    office_context = _is_office_context(job_text)

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

            if finance_context:
                finance_boosts = {
                    "analyse financiere": 60,
                    "financial analysis": 60,
                    "solvabilite": 58,
                    "credit risk": 56,
                    "analyse du risque": 55,
                    "risk": 40,
                    "due diligence": 52,
                    "portefeuille client": 50,
                    "portfolio": 44,
                    "structuration de financements": 54,
                    "financing": 42,
                    "modelisation financiere": 50,
                    "scenario": 38,
                    "reporting": 34,
                    "tableaux de bord": 34,
                    "crm": 32,
                    "negociation commerciale": 36,
                    "payment terms": 34,
                    "garanties": 32,
                }

                for word, weight in finance_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if commercial_context:
                commercial_boosts = {
                    "crm": 44,
                    "vente conseil": 48,
                    "analyse des besoins": 46,
                    "discovery call": 42,
                    "sop": 38,
                    "appel": 32,
                    "cap soncas": 42,
                    "objections": 38,
                    "fidelisation": 40,
                    "negociation commerciale": 44,
                    "pipeline": 38,
                    "account management": 36,
                    "prospection": 36,
                    "relance": 34,
                }

                for word, weight in commercial_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if retail_context:
                retail_boosts = {
                    "vente conseil": 60,
                    "decouverte produit": 54,
                    "cap soncas": 45,
                    "objections": 42,
                    "fidelisation": 42,
                    "parcours client": 40,
                    "encaissement": 36,
                    "crm": 30,
                }

                for word, weight in retail_boosts.items():
                    if word in searchable or word in skill_norm:
                        score += weight

            if project_context:
                project_boosts = {
                    "roadmap": 48,
                    "jalons": 46,
                    "action item": 42,
                    "raci": 38,
                    "stakeholder": 44,
                    "recueil des besoins": 44,
                    "acceptance": 38,
                    "uat": 40,
                    "passation": 38,
                    "documentation": 34,
                    "risk register": 36,
                    "sop": 32,
                }

                for word, weight in project_boosts.items():
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

            if office_context:
                office_boosts = {
                    "excel": 95,
                    "microsoft excel": 95,
                    "spreadsheet": 82,
                    "sheets": 78,
                    "reporting": 70,
                    "tableaux de bord": 65,
                }
                for word, weight in office_boosts.items():
                    if word in searchable or word in skill_norm:
                        candidates.append((translate_skill(skill_name), score + weight))

    # 2. Skills depuis les expériences sélectionnées
    for row in selected_experiences:
        for col in [
            "tools_verified",
            "tools",
            "skills_verified",
            "skills",
            "skill_tags",
            "technical_skills",
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

                if finance_context:
                    if any(
                        w in skill_norm
                        for w in [
                            "financial",
                            "finance",
                            "risk",
                            "risque",
                            "portfolio",
                            "portefeuille",
                            "solvabilite",
                            "credit",
                            "due diligence",
                            "financing",
                            "payment",
                            "garanties",
                            "covenant",
                            "cash-flow",
                            "margin",
                            "marge",
                            "negociation",
                        ]
                    ):
                        score += 36

                if commercial_context:
                    if any(
                        w in skill_norm
                        for w in [
                            "crm",
                            "client",
                            "sales",
                            "commercial",
                            "prospecting",
                            "prospection",
                            "negociation",
                            "fidelisation",
                            "account",
                            "pipeline",
                            "relationship",
                        ]
                    ):
                        score += 28

                candidates.append((translate_skill(skill), score))

    # 3. Filtrage, traduction, déduplication
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
    preferred_ats_skills = []

    erp_preferred_skills = erp_skills_for_job(job_text)
    if erp_preferred_skills:
        for skill in erp_preferred_skills:
            if is_skill_allowed_for_job(skill, job_text):
                preferred_ats_skills.append(skill)

    if office_context:
        for skill in [
            "Microsoft Office",
            "Google Workspace",
            "Word",
            "PowerPoint",
            "Excel",
            "Documentation administrative",
            "Gestion de données clients",
            "Reporting",
            "Service client",
            "Support client",
            "Relations clients",
            "Étiquette téléphonique",
        ]:
            if is_skill_allowed_for_job(skill, job_text):
                preferred_ats_skills.append(skill)

    if _contains_any(job_text, ["publicite", "publicitaire", "campagne", "campagnes"]):
        for skill in ["Campagnes publicitaires", "Coordination commerciale"]:
            if is_skill_allowed_for_job(skill, job_text):
                preferred_ats_skills.append(skill)

    if supply_context:
        for skill in [
            "Gestion des commandes",
            "Suivi des commandes",
            "EDI",
            "Référentiel articles clients",
            "Gestion des litiges",
            "Facturation",
            "Suivi des livraisons",
            "Gestion des stocks",
        ]:
            if is_skill_allowed_for_job(skill, job_text):
                preferred_ats_skills.append(skill)

    if commercial_context:
        for skill in ["Service client", "Support client", "CRM", "Relance commerciale structurée"]:
            if is_skill_allowed_for_job(skill, job_text):
                preferred_ats_skills.append(skill)

    if target_skills:
        selected = []
        available = {_skill_key(skill): skill for skill, _ in ranked}
        for preferred in preferred_ats_skills:
            key = _skill_key(preferred)
            skill = available.get(key)
            if skill and skill not in selected:
                selected.append(skill)
            if len(selected) >= max_skills:
                return selected

        for preferred in target_skills:
            if not is_skill_allowed_for_job(preferred, job_text):
                continue
            key = _skill_key(preferred)
            skill = available.get(key)
            if skill and skill not in selected:
                selected.append(skill)
            if len(selected) >= max_skills:
                return selected

        for skill, _ in ranked:
            if skill not in selected:
                selected.append(skill)
            if len(selected) >= max_skills:
                return selected

    if supply_context and not data_context:
        preferred_supply_order = [
            *erp_skills_for_job(job_text),
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

            if len(selected) >= max_skills:
                break

        return selected

    selected = []

    for preferred in preferred_ats_skills:
        key = normalize_text(preferred)
        available = {normalize_text(skill): skill for skill, _ in ranked}
        if key in available and available[key] not in selected:
            selected.append(available[key])
        if len(selected) >= max_skills:
            return selected

    for skill, _ in ranked:
        if skill not in selected:
            selected.append(skill)

        if len(selected) >= max_skills:
            break

    return selected


ATS_SKILL_LABELS = {
    "logiciel sage": "Sage",
    "sage": "Sage",
    "sap": "SAP",
    "erp": "ERP",
    "edi": "EDI",
    "referentiel": "Référentiel articles clients",
    "référentiel": "Référentiel articles clients",
    "referentiel articles clients": "Référentiel articles clients",
    "stocks": "Gestion des stocks",
    "litiges": "Gestion des litiges",
    "livraison": "Suivi des livraisons",
    "livraisons": "Suivi des livraisons",
    "gestion des commandes": "Gestion des commandes",
    "suivi des commandes": "Suivi des commandes",
    "anglais": "Anglais professionnel",
    "facturation": "Facturation",
    "microsoft office": "Microsoft Office",
    "pack office": "Pack Office",
    "word": "Word",
    "powerpoint": "PowerPoint",
    "excel": "Excel",
    "service client": "Service client",
    "support client": "Support client",
    "relations clients": "Relations clients",
    "donnees clients": "Gestion de données clients",
    "documents administratifs": "Documentation administrative",
}


def boost_skills_with_ats_keywords(selected_skills, ats_analysis, job_text, max_skills=14):
    boosted = list(selected_skills)
    candidates = []
    for key in ["injectable_keywords"]:
        value = ats_analysis.get(key, [])
        if isinstance(value, list):
            candidates.extend(value)

    for keyword in candidates:
        keyword_norm = normalize_text(keyword)
        label = ATS_SKILL_LABELS.get(keyword_norm)
        if not label:
            continue
        if not label or not is_skill_allowed_for_job(label, job_text):
            continue
        if label not in boosted:
            boosted.append(label)
        if len(boosted) >= max_skills:
            break

    return boosted


SKILL_SECTION_EXCLUDED_TERMS = {
    "tco",
    "srm",
    "rfi rfq rfp",
    "matrice de kraljic",
    "single dual sourcing",
    "reduction des couts",
    "reduction du risque fournisseur",
    "amelioration des conditions contractuelles",
    "reduction des ruptures",
    "reduction des couts de stockage",
    "amelioration du taux de service",
    "amelioration de la rentabilite",
    "optimisation du cash flow",
    "reduction de l exposition au risque",
}

SKILL_SECTION_NOISY_PATTERNS = [
    "action item",
    "checklist",
    "procedure operatoire",
    "structuration des conditions",
    "risque de defaut",
    "analyse des couts complets",
    "registre des risques",
]


def _skill_label_for_cv(skill: str) -> str:
    return (
        safe_str(skill)
        .replace("Incoterms (FCA, CPT, DAP)", "Incoterms FCA/CPT/DAP")
        .replace("Incoterms FCA, CPT, DAP", "Incoterms FCA/CPT/DAP")
    )


def curate_technical_skills(skills, max_skills=6):
    selected = []
    seen = set()
    for raw_skill in skills or []:
        skill = _skill_label_for_cv(raw_skill)
        key = normalize_text(skill)
        if not skill or not key:
            continue
        if key in SKILL_SECTION_EXCLUDED_TERMS:
            continue
        if any(pattern in key for pattern in SKILL_SECTION_NOISY_PATTERNS):
            continue
        if key in seen:
            continue
        seen.add(key)
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

    facts_locked = get_value(row, ["evidence_strength"], "").casefold() == "user_validated"
    return {
        "experience_id": get_value(row, ["experience_id"], ""),
        "company": company,
        "position": position,
        "location": location,
        "dates": dates,
        "bullets": extract_truth_bullets(row, max_bullets=5 if facts_locked else 4),
        "validated_memory": get_value(row, ["validated_memory"], ""),
        "facts_locked": facts_locked,
        "rewrite_locked": False,
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

        "[[TECHNICAL_SKILLS]]": ", ".join(curate_technical_skills(technical_skills)),
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
    ats_initial=None,
    ats_final=None,
    document_language="fr",
):
    report = {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "mode": "local",
        "company_detected": parsed_job.get("company"),
        "job_title_detected": parsed_job.get("job_title"),
        "document_language": document_language,
        "keywords_detected": parsed_job.get("keywords", [])[:50],
        "output_docx": str(output_path),
        "selected_experiences": [],
        "selected_leadership": [],
        "selected_certifications": selected_certifications,
        "selected_technical_skills": selected_skills,
        "ats_initial": ats_initial or {},
        "ats_final": ats_final or {},
        "ats_score": (ats_final or {}).get("score"),
        "ats_acceptable_threshold": ATS_ACCEPTABLE_SCORE,
        "ats_match_status": ats_match_status((ats_final or {}).get("score")),
        "warnings": [],
    }
    if report["ats_match_status"] == "needs_rework":
        report["warnings"].append(
            f"ats_score_below_{ATS_ACCEPTABLE_SCORE}_needs_rework"
        )

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


def optimize_cv_with_ats_guard(
    *,
    selected_experiences,
    selected_leadership,
    selected_certifications,
    selected_skills,
    job_text,
    current_ats,
    document_language="fr",
    target_domain="",
):
    candidate_experiences, candidate_leadership = improve_full_cv_with_gemini(
        selected_experiences,
        selected_leadership,
        job_text,
        ats_analysis=current_ats,
        document_language=document_language,
        target_domain=target_domain,
    )
    candidate_text = build_resume_ats_text(
        experiences=candidate_experiences,
        leadership=candidate_leadership,
        certifications=selected_certifications,
        technical_skills=selected_skills,
    )
    candidate_ats = analyze_ats_match(candidate_text, job_text)
    if document_language == "en" or is_override_active("cv"):
        return candidate_experiences, candidate_leadership, candidate_ats
    if candidate_ats.get("score", 0) >= current_ats.get("score", 0):
        return candidate_experiences, candidate_leadership, candidate_ats

    print(
        "Passe Gemini ignorée : score ATS candidat "
        f"{candidate_ats.get('score')}% < score précédent {current_ats.get('score')}%."
    )
    return selected_experiences, selected_leadership, current_ats


# ============================================================
# MAIN
# ============================================================

def main():
    print("Lecture de la job description...")
    job_text = load_job_description()
    document_language = detect_document_language(job_text)
    requested_target_domain = os.getenv("RESUMEFORGE_TARGET_DOMAIN", "").strip()
    resolved_target_domain = resolve_target_domain(job_text, requested_target_domain)
    target_domain = resolved_target_domain["key"]
    print(f"Langue des documents : {document_language}")

    print("Chargement du master profile...")
    workbook = load_master_profile()

    experiences_df = workbook["experiences"]
    leadership_df = workbook["leadership"]
    certifications_df = workbook["certifications"]
    skills_df = workbook["skills"]
    skills_by_target_df = workbook.get("skills_by_target")
    claim_rules_df = workbook.get("claim_rules")

    print("Analyse de la job description...")
    parsed_job = parse_job(job_text)
    job_reference_context = build_job_reference_context(job_text)
    selection_job_text = job_reference_context.get("enriched_text") or job_text
    selection_parsed_job = dict(parsed_job)
    selection_parsed_job["keywords"] = extract_keywords(selection_job_text)
    selection_parsed_job["normalized_text"] = normalize_text(selection_job_text)
    if job_reference_context.get("used"):
        print(
            "Offre courte détectée : enrichissement métier "
            f"{job_reference_context.get('label')}."
        )

    print("Sélection des expériences...")
    selected_exp_rows = select_top_rows(experiences_df, selection_parsed_job, max_rows=2)
    selected_exp_rows = sorted(selected_exp_rows, key=get_row_year, reverse=True)
    selected_experiences = [format_experience(row) for row in selected_exp_rows]

    print("Sélection du leadership...")
    selected_lead_rows = select_top_rows(leadership_df, selection_parsed_job, max_rows=1)
    selected_leadership = [format_leadership(row) for row in selected_lead_rows]

    print("Sélection des certifications...")
    selected_certifications = select_certifications(certifications_df, selection_parsed_job, max_certs=2)

    print("Sélection des compétences techniques...")
    selected_skills = select_technical_skills(
        skills_df,
        selected_exp_rows,
        selection_parsed_job,
        max_skills=12,
        skills_by_target_df=skills_by_target_df,
        claim_rules_df=claim_rules_df,
    )
    initial_ats_text = build_resume_ats_text(
        experiences=selected_experiences,
        leadership=selected_leadership,
        certifications=selected_certifications,
        technical_skills=selected_skills,
    )
    ats_evidence_text = "\n".join(
        [
            initial_ats_text,
            "\n".join(row_search_text(row) for row in selected_exp_rows),
            "\n".join(row_search_text(row) for row in selected_lead_rows),
        ]
    )
    ats_initial = analyze_ats_match(initial_ats_text, job_text, evidence_text=ats_evidence_text)
    selected_skills = boost_skills_with_ats_keywords(
        selected_skills,
        ats_initial,
        selection_parsed_job["normalized_text"],
    )
    selected_skills = curate_technical_skills(selected_skills)
    initial_ats_text = build_resume_ats_text(
        experiences=selected_experiences,
        leadership=selected_leadership,
        certifications=selected_certifications,
        technical_skills=selected_skills,
    )
    ats_initial = analyze_ats_match(initial_ats_text, job_text, evidence_text=ats_evidence_text)

    print("Optimisation ATS + Gemini du CV complet...")
    selected_experiences, selected_leadership, ats_final = optimize_cv_with_ats_guard(
        selected_experiences=selected_experiences,
        selected_leadership=selected_leadership,
        selected_certifications=selected_certifications,
        selected_skills=selected_skills,
        job_text=job_text,
        current_ats=ats_initial,
        document_language=document_language,
        target_domain=target_domain,
    )

    if ats_final.get("score", 0) < ATS_ACCEPTABLE_SCORE:
        print("Deuxième passe ATS + Gemini du CV complet...")
        selected_experiences, selected_leadership, ats_final = optimize_cv_with_ats_guard(
            selected_experiences=selected_experiences,
            selected_leadership=selected_leadership,
            selected_certifications=selected_certifications,
            selected_skills=selected_skills,
            job_text=job_text,
            current_ats=ats_final,
            document_language=document_language,
            target_domain=target_domain,
        )

    if document_language == "en":
        selected_certifications, selected_skills = translate_cv_lists_to_english(
            selected_certifications,
            selected_skills,
        )
    else:
        selected_experiences = apply_known_french_corrections(selected_experiences)
        selected_leadership = apply_known_french_corrections(selected_leadership)
        selected_certifications = apply_known_french_corrections(selected_certifications)
        selected_skills = apply_known_french_corrections(selected_skills)

    cv_language_check = check_french_text(
        build_resume_ats_text(
            experiences=selected_experiences,
            leadership=selected_leadership,
            certifications=selected_certifications,
            technical_skills=selected_skills,
        ),
        allowed_terms=[
            selected_certifications,
            selected_skills,
            [
                experience.get("company", "")
                for experience in selected_experiences
            ],
            [
                leadership.get("org", "")
                for leadership in selected_leadership
            ],
        ],
    )
    if document_language == "fr" and cv_language_check["status"] != "success":
        details = "; ".join(
            f"{issue['text']} -> {issue['suggestion']}"
            for issue in cv_language_check["issues"]
        )
        raise RuntimeError(f"CV bloqué par le contrôle orthographique : {details}")

    replacements = build_replacements(
        selected_experiences,
        selected_leadership,
        selected_certifications,
        selected_skills,
    )
    replacements.update(cv_static_replacements(document_language))

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
    print(f"\nScore ATS initial : {ats_initial.get('score')}%")
    print(f"Score ATS final : {ats_final.get('score')}%")
    if ats_match_status(ats_final.get("score")) == "acceptable":
        print(f"Compatibilité ATS : acceptable ({ATS_ACCEPTABLE_SCORE}% à 100%).")
    else:
        print(f"Compatibilité ATS : à retravailler (< {ATS_ACCEPTABLE_SCORE}%).")

    print("\nConstruction du CV...")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CV_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    output_filename = build_output_filename(parsed_job)
    output_path = CV_OUTPUT_DIR / output_filename

    renderer = DocxTemplateRenderer(BASE_CV_TEMPLATE_PATH)
    renderer.render(replacements, output_path)

    if not output_path.exists():
        raise RuntimeError(f"Le fichier n'a pas été généré : {output_path}")

    if document_language == "fr":
        enforce_french_docx(
            output_path,
            artifact_label="CV",
            allowed_terms=[
                parsed_job,
                selected_certifications,
                selected_skills,
                [experience.get("company", "") for experience in selected_experiences],
                [leadership.get("org", "") for leadership in selected_leadership],
            ],
        )

    write_last_run_report(
        parsed_job=parsed_job,
        output_path=output_path,
        selected_exp_rows=selected_exp_rows,
        selected_experiences=selected_experiences,
        selected_lead_rows=selected_lead_rows,
        selected_leadership=selected_leadership,
        selected_certifications=selected_certifications,
        selected_skills=selected_skills,
        ats_initial=ats_initial,
        ats_final=ats_final,
        document_language=document_language,
    )

    print(f"CV généré : {output_path}")
    print(f"Rapport généré : {OUTPUT_DIR / 'last_run_report.json'}")


if __name__ == "__main__":
    main()
