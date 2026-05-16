import re
from collections import Counter


STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "de", "du", "d", "en", "et", "ou",
    "à", "au", "aux", "pour", "par", "avec", "sur", "dans", "est", "sont",
    "vous", "nous", "votre", "notre", "vos", "nos", "ce", "cette", "ces",
    "the", "and", "or", "of", "to", "in", "for", "with", "on", "at", "is",
    "are", "you", "your", "our", "we", "a", "an"
}


JOB_FAMILY_RULES = {
    "supply_chain": [
        "supply chain", "logistique", "approvisionnement", "stock", "stocks",
        "inventory", "warehouse", "transport", "import", "export", "flux",
        "erp", "sap", "ewm", "prévision", "forecast", "demand planning",
        "planification", "procurement", "achat", "achats", "fournisseur"
    ],
    "operations": [
        "operations", "opérations", "process", "processus", "coordination",
        "pilotage", "workflow", "optimisation", "qualité", "kpi", "reporting",
        "performance opérationnelle", "amélioration continue"
    ],
    "data_analytics": [
        "data", "analytics", "analyse", "analyst", "dashboard", "reporting",
        "sql", "python", "looker", "power bi", "tableau", "kpi", "modélisation",
        "forecast", "prévision", "visualisation"
    ],
    "digital_marketing": [
        "marketing", "acquisition", "paid media", "meta ads", "google ads",
        "seo", "sea", "crm", "roas", "campagne", "campaign", "ads",
        "growth", "performance marketing", "emailing", "segmentation"
    ],
    "sales_customer": [
        "sales", "vente", "commercial", "business development", "prospection",
        "client", "customer", "retail", "support", "négociation", "crm"
    ],
    "project_management": [
        "chef de projet", "project manager", "project management", "planning",
        "coordination projet", "roadmap", "delivery", "stakeholder",
        "parties prenantes", "organisation"
    ],
    "finance": [
        "finance", "financial", "risque", "risk", "modélisation financière",
        "budget", "forecast financier", "p&l", "rentabilité", "marge",
        "financement", "covenant"
    ],
}


SENIORITY_RULES = {
    "internship": ["stage", "stagiaire", "intern", "internship", "alternance", "apprenticeship"],
    "junior": ["junior", "assistant", "entry level", "débutant"],
    "mid": ["confirmé", "middle", "chargé", "analyst", "analyste", "specialist", "spécialiste"],
    "senior": ["senior", "lead", "manager", "responsable", "head of", "director", "directeur"]
}


CONTRACT_RULES = {
    "stage": ["stage", "stagiaire", "internship", "intern"],
    "alternance": ["alternance", "apprentissage", "apprenticeship"],
    "cdi": ["cdi", "permanent", "temps plein", "full-time", "full time"],
    "cdd": ["cdd", "fixed term", "contrat à durée déterminée"],
    "freelance": ["freelance", "indépendant", "contractor"]
}


def normalize_text(text: str) -> str:
    if text is None:
        return ""

    text = str(text)
    text = text.replace("\xa0", " ")
    text = text.replace("–", "-")
    text = text.replace("—", "-")
    text = text.replace("’", "'")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def clean_value(value: str) -> str:
    value = normalize_text(value)
    value = re.sub(r"^[\-\:\|\•\s]+", "", value)
    value = re.sub(r"[\-\:\|\•\s]+$", "", value)
    return value.strip()


def get_lines(text: str):
    raw_lines = str(text).replace("\r", "\n").split("\n")
    lines = []
    for line in raw_lines:
        cleaned = clean_value(line)
        if cleaned:
            lines.append(cleaned)
    return lines


def extract_labeled_value(text: str, labels):
    lines = str(text or "").replace("\r", "\n").split("\n")
    for label in labels:
        pattern = rf"(?im)^\s*{re.escape(label)}\s*[:\-]\s*(.+?)\s*$"
        match = re.search(pattern, text)
        if match:
            return clean_value(match.group(1))

        for index, line in enumerate(lines):
            if clean_value(line).casefold() == label.casefold():
                for next_line in lines[index + 1:index + 5]:
                    value = clean_value(next_line)
                    if value and value != "&nbsp;":
                        return value
    return ""


def looks_like_job_title(line: str) -> bool:
    line_low = line.lower()

    title_keywords = [
        "analyst", "analyste", "assistant", "chef de projet", "project manager",
        "manager", "specialist", "spécialiste", "coordinateur", "coordinator",
        "responsable", "consultant", "chargé", "charge", "business developer",
        "operations", "supply chain", "marketing", "growth", "data", "sales",
        "vendeur", "conseiller", "retail", "alternance", "stage"
    ]

    return any(keyword in line_low for keyword in title_keywords)


def looks_like_company(line: str) -> bool:
    if not line:
        return False

    line_low = line.lower()

    forbidden = [
        "description", "mission", "missions", "profil", "responsabilités",
        "responsabilites", "compétences", "competences", "about", "job",
        "offre", "poste", "location", "localisation", "salaire", "contrat"
    ]

    if any(word in line_low for word in forbidden):
        return False

    if len(line.split()) > 5:
        return False

    if looks_like_job_title(line):
        return False

    return True


def extract_title_company_from_first_lines(text: str):
    lines = get_lines(text)
    top_lines = lines[:8]

    job_title = ""
    company = ""

    labeled_title = extract_labeled_value(
        text,
        ["Poste", "Intitulé du poste", "Titre du poste", "Job title", "Title", "Role"]
    )
    labeled_company = extract_labeled_value(
        text,
        ["Entreprise", "Société", "Company", "Organisation", "Organization", "Employeur"]
    )

    if labeled_title:
        job_title = labeled_title

    if labeled_company:
        company = labeled_company

    if job_title and company:
        return job_title, company

    for line in top_lines:
        if " - " in line:
            left, right = [clean_value(x) for x in line.split(" - ", 1)]

            if looks_like_job_title(left) and not job_title:
                job_title = left
                if not company and looks_like_company(right):
                    company = right
                return job_title, company

            if looks_like_job_title(right) and not job_title:
                job_title = right
                if not company and looks_like_company(left):
                    company = left
                return job_title, company

        if " | " in line:
            parts = [clean_value(x) for x in line.split(" | ")]
            for part in parts:
                if looks_like_job_title(part) and not job_title:
                    job_title = part
                elif looks_like_company(part) and not company:
                    company = part

    if not job_title:
        for line in top_lines:
            if looks_like_job_title(line):
                job_title = line
                break

    if not company:
        for line in top_lines:
            if line != job_title and looks_like_company(line):
                company = line
                break

    return clean_value(job_title), clean_value(company)


def extract_location(text: str):
    labeled_location = extract_labeled_value(
        text,
        ["Localisation", "Lieu", "Location", "Ville", "City"]
    )

    if labeled_location:
        return labeled_location

    location_patterns = [
        r"(?i)(Paris(?:\s?\d{1,2})?)",
        r"(?i)(Boulogne-Billancourt)",
        r"(?i)(Neuilly-sur-Seine)",
        r"(?i)(Levallois-Perret)",
        r"(?i)(La Défense)",
        r"(?i)(Île-de-France|Ile-de-France)",
        r"(?i)(Lyon|Marseille|Lille|Bordeaux|Nantes|Toulouse|Nice)",
        r"(?i)(remote|télétravail|hybride|hybrid)"
    ]

    found = []
    for pattern in location_patterns:
        for match in re.findall(pattern, text):
            value = clean_value(match)
            if value and value not in found:
                found.append(value)

    return ", ".join(found[:3])


def extract_salary(text: str):
    labeled_salary = extract_labeled_value(
        text,
        ["Salaire", "Rémunération", "Compensation", "Salary", "Package"]
    )

    if labeled_salary:
        return labeled_salary

    patterns = [
        r"(?i)(\d{2,3}\s?k\s?€\s?(?:-\s?\d{2,3}\s?k\s?€)?)",
        r"(?i)(\d{2,3}\s?000\s?€\s?(?:-\s?\d{2,3}\s?000\s?€)?)",
        r"(?i)(\d{3,5}\s?€\s?(?:brut|net|mensuel|mois)?)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return clean_value(match.group(1))

    return ""


def detect_contract_type(text: str):
    text_low = text.lower()

    for contract, terms in CONTRACT_RULES.items():
        if any(term in text_low for term in terms):
            return contract

    return ""


def detect_seniority(text: str):
    text_low = text.lower()

    scores = {}
    for seniority, terms in SENIORITY_RULES.items():
        scores[seniority] = sum(1 for term in terms if term in text_low)

    best = max(scores, key=scores.get)

    if scores[best] == 0:
        return ""

    return best


def detect_job_family(text: str):
    text_low = text.lower()

    scores = {}
    for family, terms in JOB_FAMILY_RULES.items():
        score = 0
        for term in terms:
            if term in text_low:
                if " " in term:
                    score += 3
                else:
                    score += 1
        scores[family] = score

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    main_family = ranked[0][0] if ranked and ranked[0][1] > 0 else ""
    secondary_families = [family for family, score in ranked[1:4] if score > 0]

    return main_family, secondary_families, scores


def extract_keywords(text: str, max_keywords: int = 40):
    text_low = normalize_text(text).lower()

    phrase_candidates = []
    for family_terms in JOB_FAMILY_RULES.values():
        for term in family_terms:
            if term in text_low and term not in phrase_candidates:
                phrase_candidates.append(term)

    words = re.findall(r"[a-zA-ZÀ-ÿ0-9\+\#]{3,}", text_low)
    words = [word for word in words if word not in STOPWORDS]

    counter = Counter(words)
    frequent_words = [word for word, _ in counter.most_common(max_keywords)]

    keywords = []

    for phrase in phrase_candidates:
        if phrase not in keywords:
            keywords.append(phrase)

    for word in frequent_words:
        if word not in keywords:
            keywords.append(word)

    return keywords[:max_keywords]


def parse_job_description(job_description: str) -> dict:
    text = normalize_text(job_description)
    raw_text = str(job_description or "")

    job_title, company = extract_title_company_from_first_lines(raw_text)

    location = extract_location(raw_text)
    salary = extract_salary(raw_text)
    contract_type = detect_contract_type(raw_text)
    seniority = detect_seniority(raw_text)
    job_family, secondary_job_families, job_family_scores = detect_job_family(raw_text)
    keywords = extract_keywords(raw_text)

    if not job_title:
        job_title = "Poste cible"

    if not company:
        company = "Entreprise"

    return {
        "company": company,
        "job_title": job_title,
        "location": location,
        "salary": salary,
        "contract_type": contract_type,
        "seniority": seniority,
        "job_family": job_family,
        "secondary_job_families": secondary_job_families,
        "job_family_scores": job_family_scores,
        "keywords": keywords,
        "raw_text": raw_text,
    }
