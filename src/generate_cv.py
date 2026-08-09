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
from src.application.candidate_evidence import build_candidate_evidence_index
from src.application.dynamic_skills import derive_dynamic_skills
from src.application.french_nominalizer import nominalize_french_experiences
from src.application.job_skill_extractor import extract_job_skill_requirements
from src.letter.french_proofreader import (
    apply_known_french_corrections,
    check_french_text,
    enforce_french_docx,
)
from src.web.prompt_overrides import is_override_active
from src.application.career_translation import resolve_target_domain
from src.application.experience_memory import attach_memory_to_experiences
from src.render.cv_layout_guard import render_cv_one_page


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


def clean_detected_job_title(value, company="", location=""):
    title = safe_str(value)
    if not title:
        return "Poste cible"

    title = apply_known_french_corrections(title)
    title = re.sub(r"(?i)\s*[-–—]?\s*job\s*post\s*$", "", title).strip()
    title = re.sub(r"(?i)\bcharg[ée]\(e\)", "Chargé", title)
    title = re.sub(r"(?i)\bassistant\(e\)", "Assistant", title)
    title = re.sub(r"(?i)\s*\(?\s*(?:h\s*/\s*f|f\s*/\s*h)(?:\s*/\s*[xm])?\s*\)?", "", title).strip()
    title = re.sub(r"(?i)\s*[-–—|,/]?\s*(?:CDI|CDD|INT[ÉE]RIM|STAGE|ALTERNANCE)\b.*$", "", title).strip()
    title = re.sub(r"(?i)\s*[-–—|]?\s*(?:r[ée]f(?:[ée]rence)?\.?\s*[:#-]?\s*[A-Z0-9._/-]+)\s*$", "", title).strip()
    for suffix in (company, location):
        suffix = safe_str(suffix)
        if suffix:
            title = re.sub(rf"(?i)\s*[-–—|]\s*{re.escape(suffix)}\s*$", "", title).strip()
    title = re.sub(
        r"(?i)\s*[-–—|]\s*(?:Paris(?:\s+\d{1,2})?|Lyon|Marseille|Bordeaux|Lille|Nantes|Toulouse|Remote|France)\s*$",
        "",
        title,
    ).strip()
    title = re.sub(r"\s*/\s*", " / ", title)
    title = re.sub(r"\s*[-–—]\s*", " - ", title)
    title = re.sub(r"\s+", " ", title).strip(" -")
    return title or "Poste cible"


def build_cv_headline(parsed_job, document_language="fr"):
    """Construit le titre visible uniquement depuis l'intitulé de l'annonce."""

    del document_language
    title = clean_detected_job_title(
        parsed_job.get("job_title", ""),
        company=parsed_job.get("company", ""),
        location=parsed_job.get("location", ""),
    )
    return title.upper()


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
        "certifications": get_sheet_case_insensitive(excel, "certifications"),
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
        labeled = re.search(r"(?i)^(?:company|entreprise|société|employeur|organization)\s*[:\-]\s*(.+)$", line)
        if labeled:
            candidate = clean_detected_company(labeled.group(1))
            if looks_like_header_company(candidate):
                return candidate
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

    title_text = normalize_text(
        get_value(row, ["position_title", "job_title", "position", "role", "title"], "")
    )
    tags_text = normalize_text(
        " ".join(
            get_value(row, [column], "")
            for column in ("industry_tags", "job_family_tags", "skills_verified")
        )
    )
    tools_text = normalize_text(get_value(row, ["tools_verified"], ""))
    memory_text = normalize_text(get_value(row, ["validated_memory"], ""))
    bullet_text = normalize_text(
        " ".join(
            get_value(row, [f"truth_bullet_{index}", f"bullet_{index}"], "")
            for index in range(1, 11)
        )
    )

    score = 0.0
    useful_keywords = {
        normalize_text(keyword)
        for keyword in keywords
        if len(normalize_text(keyword)) >= 3
    }
    useful_keywords.update(
        token
        for token in normalize_text(parsed_job.get("job_title", "")).split()
        if len(token) >= 3
    )
    for keyword in useful_keywords:
        if keyword in title_text:
            score += 14
        if keyword in tools_text:
            score += 10
        if keyword in tags_text:
            score += 8
        if keyword in memory_text:
            score += 7
        if keyword in bullet_text:
            score += 5

    normalized_job_title = normalize_text(parsed_job.get("job_title", ""))
    if normalized_job_title and normalized_job_title in title_text:
        score += 28

    # Les concepts extraits de la JD apportent un signal sémantique prudent,
    # mais seulement lorsqu'un terme de preuve existe réellement dans la ligne.
    for requirement in extract_job_skill_requirements(
        parsed_job.get("job_title", ""),
        parsed_job.get("raw_text", "") or job_text,
    ):
        if any(normalize_text(term) in searchable for term in requirement.get("evidence_terms", [])):
            score += 9

    priority = safe_str(get_value(row, ["cv_priority"], ""))
    try:
        score += min(10, max(0, float(priority)))
    except ValueError:
        pass
    if normalize_text(get_value(row, ["evidence_strength"], "")) in {"high", "user_validated"}:
        score += 4

    year = get_row_year(row)
    if year:
        score += max(0, min(6, year - 2020))

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
                if "sap easy access" in combined:
                    base += 160

                if "sap supply" in combined or ("sap" in combined and "supply" in combined):
                    base += 140

                if "rise" in combined and "sap" in combined:
                    base += 95

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
        if float(row.get("_score", 0) or 0) <= 0:
            continue
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
# FORMAT ROWS
# ============================================================

def _select_relevant_bullets(row, parsed_job=None, max_bullets=4):
    candidates = extract_truth_bullets(row, max_bullets=10)
    if not parsed_job or len(candidates) <= max_bullets:
        return candidates[:max_bullets]
    job_terms = {
        term
        for term in parsed_job.get("keywords", [])
        if len(term) >= 3
    }
    normalized_job = parsed_job.get("normalized_text", "")

    def score(item):
        index, bullet = item
        normalized = normalize_text(bullet)
        overlap = sum(3 for term in job_terms if term in normalized)
        domain_overlap = sum(
            5
            for term in (
                "commande", "facturation", "sap", "erp", "excel", "reporting", "stock",
                "transport", "logistique", "import", "export", "budget", "finance", "risque",
                "projet", "planning", "client", "marketing", "campagne", "data",
            )
            if term in normalized_job and term in normalized
        )
        return overlap + domain_overlap - (index * 0.01)

    ranked = sorted(enumerate(candidates), key=score, reverse=True)[:max_bullets]
    ranked.sort(key=lambda item: item[0])
    return [bullet for _, bullet in ranked]


def _as_bool(value) -> bool:
    return normalize_text(safe_str(value)) in {"1", "true", "yes", "oui", "vrai"}


def format_experience(row, parsed_job=None, max_bullets=4):
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
    is_freelance = _as_bool(get_value(row, ["is_freelance"], ""))
    return {
        "experience_id": get_value(row, ["experience_id"], ""),
        "company": company,
        "position": position,
        "display_position": (
            f"{position} | Freelance" if is_freelance and position else ("Freelance" if is_freelance else position)
        ),
        "location": location,
        "dates": dates,
        "bullets": _select_relevant_bullets(row, parsed_job=parsed_job, max_bullets=max_bullets),
        "validated_memory": get_value(row, ["validated_memory"], ""),
        "facts_locked": facts_locked,
        "rewrite_locked": False,
        "is_freelance": is_freelance,
    }


def _refresh_experience_display_positions(experiences):
    for experience in experiences:
        position = safe_str(experience.get("position"))
        experience["display_position"] = (
            f"{position} | Freelance"
            if experience.get("is_freelance") and position
            else ("Freelance" if experience.get("is_freelance") else position)
        )
    return experiences


# ============================================================
# OUTPUT
# ============================================================

def build_dynamic_technical_skills(
    *,
    parsed_job,
    document_language,
    target_domain,
    experiences,
    certifications,
    experience_memory=None,
    character_budget=260,
):
    requirements = extract_job_skill_requirements(
        job_title=parsed_job.get("job_title", ""),
        job_description=parsed_job.get("raw_text", ""),
        document_language=document_language,
        target_domain=target_domain,
    )
    evidence_index = build_candidate_evidence_index(
        experiences=experiences,
        certifications=certifications,
        validated_memory=experience_memory,
    )
    result = derive_dynamic_skills(
        requirements,
        evidence_index,
        character_budget=character_budget,
    )
    return list(result.labels), result.to_dict()

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


def build_replacements(experiences, certifications, technical_skills, cv_headline=""):
    exp1 = experiences[0] if len(experiences) > 0 else {}
    exp2 = experiences[1] if len(experiences) > 1 else {}
    exp3 = experiences[2] if len(experiences) > 2 else {}

    replacements = {
        "[[CV_HEADLINE]]": cv_headline,
        "[[CERTIFICATION_ENTRIES]]": "\n".join(certifications),

        "[[EXP_1_COMPAGNY]]": exp1.get("company", ""),
        "[[EXP_1_COMPANY]]": exp1.get("company", ""),
        "[[EXP_1_POSITION_TITLE]]": exp1.get("display_position") or exp1.get("position", ""),
        "[[EXP_1_LOCATION]]": exp1.get("location", ""),
        "[[EXP_1_DATES]]": exp1.get("dates", ""),
        "[[EXP_1_BULLETS]]": exp1.get("bullets", []),

        "[[EXP_2_COMPAGNY]]": exp2.get("company", ""),
        "[[EXP_2_COMPANY]]": exp2.get("company", ""),
        "[[EXP_2_POSITION_TITLE]]": exp2.get("display_position") or exp2.get("position", ""),
        "[[EXP_2_LOCATION]]": exp2.get("location", ""),
        "[[EXP_2_DATES]]": exp2.get("dates", ""),
        "[[EXP_2_BULLETS]]": exp2.get("bullets", []),

        "[[EXP_3_COMPAGNY]]": exp3.get("company", ""),
        "[[EXP_3_COMPANY]]": exp3.get("company", ""),
        "[[EXP_3_POSITION_TITLE]]": exp3.get("display_position") or exp3.get("position", ""),
        "[[EXP_3_LOCATION]]": exp3.get("location", ""),
        "[[EXP_3_DATES]]": exp3.get("dates", ""),
        "[[EXP_3_BULLETS]]": exp3.get("bullets", []),

        "[[TECHNICAL_SKILLS]]": ", ".join(technical_skills),
    }

    return replacements


def write_last_run_report(
    parsed_job,
    cv_headline,
    output_path,
    selected_exp_rows,
    selected_experiences,
    selected_certifications,
    selected_skills,
    skill_diagnostics=None,
    layout_guard=None,
    ats_initial=None,
    ats_final=None,
    document_language="fr",
):
    report = {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "mode": "local",
        "company_detected": parsed_job.get("company"),
        "job_title_detected": parsed_job.get("job_title"),
        "cv_headline": cv_headline,
        "document_language": document_language,
        "keywords_detected": parsed_job.get("keywords", [])[:50],
        "output_docx": str(output_path),
        "selected_experiences": [],
        "selected_certifications": selected_certifications,
        "selected_technical_skills": selected_skills,
        "dynamic_skill_diagnostics": skill_diagnostics or {},
        "layout_guard": layout_guard or {},
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
                "bullets": exp.get("bullets", []),
                "is_freelance": bool(exp.get("is_freelance")),
                "score": float(row.get("_score", 0)) if "_score" in row.index else None,
                "reason_tags": split_multi_value(
                    get_value(row, ["job_family_tags", "industry_tags", "skills_verified"], "")
                )[:20],
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
    selected_certifications,
    selected_skills,
    cv_headline,
    job_text,
    current_ats,
    document_language="fr",
    target_domain="",
):
    candidate_experiences = improve_full_cv_with_gemini(
        selected_experiences,
        job_text,
        ats_analysis=current_ats,
        document_language=document_language,
        target_domain=target_domain,
    )
    candidate_text = build_resume_ats_text(
        experiences=candidate_experiences,
        certifications=selected_certifications,
        technical_skills=selected_skills,
        cv_headline=cv_headline,
    )
    candidate_ats = analyze_ats_match(candidate_text, job_text)
    if document_language == "en" or is_override_active("cv"):
        return candidate_experiences, candidate_ats
    if candidate_ats.get("score", 0) >= current_ats.get("score", 0):
        return candidate_experiences, candidate_ats

    print(
        "Passe Gemini ignorée : score ATS candidat "
        f"{candidate_ats.get('score')}% < score précédent {current_ats.get('score')}%."
    )
    return selected_experiences, current_ats


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
    certifications_df = workbook["certifications"]

    print("Analyse de la job description...")
    parsed_job = parse_job(job_text)
    cv_headline = build_cv_headline(parsed_job, document_language)
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
    selected_exp_rows = select_top_rows(experiences_df, selection_parsed_job, max_rows=3)
    selected_exp_rows = sorted(selected_exp_rows, key=get_row_year, reverse=True)
    selected_experiences = [
        format_experience(row, selection_parsed_job, max_bullets=(4, 4, 2)[index])
        for index, row in enumerate(selected_exp_rows)
    ]

    print("Sélection des certifications...")
    selected_certifications = select_certifications(certifications_df, parsed_job, max_certs=2)

    print("Déduction des compétences techniques depuis les preuves...")
    selected_skills, skill_diagnostics = build_dynamic_technical_skills(
        parsed_job=parsed_job,
        document_language=document_language,
        target_domain=target_domain,
        experiences=experiences_df,
        certifications=certifications_df,
        experience_memory=workbook.get("experience_memory"),
    )
    initial_ats_text = build_resume_ats_text(
        experiences=selected_experiences,
        certifications=selected_certifications,
        technical_skills=selected_skills,
        cv_headline=cv_headline,
    )
    ats_evidence_text = "\n".join(
        [
            initial_ats_text,
            "\n".join(row_search_text(row) for row in selected_exp_rows),
        ]
    )
    ats_initial = analyze_ats_match(initial_ats_text, job_text, evidence_text=ats_evidence_text)

    print("Optimisation ATS + Gemini du CV complet...")
    selected_experiences, ats_final = optimize_cv_with_ats_guard(
        selected_experiences=selected_experiences,
        selected_certifications=selected_certifications,
        selected_skills=selected_skills,
        cv_headline=cv_headline,
        job_text=job_text,
        current_ats=ats_initial,
        document_language=document_language,
        target_domain=target_domain,
    )

    if ats_final.get("score", 0) < ATS_ACCEPTABLE_SCORE:
        print("Deuxième passe ATS + Gemini du CV complet...")
        selected_experiences, ats_final = optimize_cv_with_ats_guard(
            selected_experiences=selected_experiences,
            selected_certifications=selected_certifications,
            selected_skills=selected_skills,
            cv_headline=cv_headline,
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
        selected_experiences = nominalize_french_experiences(selected_experiences)
        selected_certifications = apply_known_french_corrections(selected_certifications)
        selected_skills = apply_known_french_corrections(selected_skills)
    selected_experiences = _refresh_experience_display_positions(selected_experiences)

    cv_language_check = check_french_text(
        build_resume_ats_text(
            experiences=selected_experiences,
            certifications=selected_certifications,
            technical_skills=selected_skills,
            cv_headline=cv_headline,
        ),
        allowed_terms=[
            selected_certifications,
            selected_skills,
            [
                experience.get("company", "")
                for experience in selected_experiences
            ],
        ],
    )
    if document_language == "fr" and cv_language_check["status"] != "success":
        details = "; ".join(
            f"{issue['text']} -> {issue['suggestion']}"
            for issue in cv_language_check["issues"]
        )
        raise RuntimeError(f"CV bloqué par le contrôle orthographique : {details}")

    print("\n--- Résumé génération ---")
    print(f"Entreprise détectée : {parsed_job.get('company')}")
    print(f"Poste détecté : {parsed_job.get('job_title')}")
    print(f"Titre du CV : {cv_headline}")

    print("\nExpériences sélectionnées :")
    for exp in selected_experiences:
        print(f"- {exp.get('company')} | {exp.get('position')} | {exp.get('dates')}")
        print(f"  Bullets : {len(exp.get('bullets', []))}")

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
    static_replacements = cv_static_replacements(document_language)

    def replacement_factory(experiences, certifications, skills):
        replacements = build_replacements(
            experiences,
            certifications,
            skills,
            cv_headline=cv_headline,
        )
        replacements.update(static_replacements)
        return replacements

    layout_result = render_cv_one_page(
        renderer=renderer,
        output_path=output_path,
        replacement_factory=replacement_factory,
        experiences=selected_experiences,
        certifications=selected_certifications,
        technical_skills=selected_skills,
    )
    selected_experiences = list(layout_result.experiences)
    selected_skills = list(layout_result.technical_skills)
    ats_final = analyze_ats_match(
        build_resume_ats_text(
            experiences=selected_experiences,
            certifications=selected_certifications,
            technical_skills=selected_skills,
            cv_headline=cv_headline,
        ),
        job_text,
        evidence_text=ats_evidence_text,
    )

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
            ],
        )

    write_last_run_report(
        parsed_job=parsed_job,
        cv_headline=cv_headline,
        output_path=output_path,
        selected_exp_rows=selected_exp_rows,
        selected_experiences=selected_experiences,
        selected_certifications=selected_certifications,
        selected_skills=selected_skills,
        skill_diagnostics=skill_diagnostics,
        layout_guard=layout_result.to_dict(),
        ats_initial=ats_initial,
        ats_final=ats_final,
        document_language=document_language,
    )

    print(f"CV généré : {output_path}")
    print(f"Pagination : {layout_result.page_count} page ({layout_result.measurement_method})")
    print(f"Rapport généré : {OUTPUT_DIR / 'last_run_report.json'}")


if __name__ == "__main__":
    main()
