from __future__ import annotations

import re


EXPLICIT_ENGLISH_PATTERNS = [
    r"\bcv\s*(?:must\s+be|should\s+be|in)\s+english\b",
    r"\bresume\s*(?:must\s+be|should\s+be|in)\s+english\b",
    r"\bsend(?:\s+in)?\s+(?:your\s+)?(?:cv|resume).{0,30}\bin\s+english\b",
    r"\bapplication\s+(?:must\s+be|should\s+be|in)\s+english\b",
]

ENGLISH_MARKERS = {
    "the", "and", "you", "your", "our", "we", "will", "with", "for", "job",
    "sales", "customer", "customers", "support", "manage", "order", "orders",
    "experience", "skills", "team", "business", "required", "responsible",
}
FRENCH_MARKERS = {
    "le", "la", "les", "des", "vous", "votre", "notre", "nous", "avec",
    "pour", "poste", "emploi", "commercial", "client", "clients", "gestion",
    "commandes", "expérience", "compétences", "équipe", "recherchons",
}


def detect_document_language(job_text: str) -> str:
    text = str(job_text or "")
    normalized = text.casefold()
    if any(re.search(pattern, normalized, flags=re.DOTALL) for pattern in EXPLICIT_ENGLISH_PATTERNS):
        return "en"

    words = re.findall(r"[a-zà-ÿ]+", normalized)
    english_score = sum(word in ENGLISH_MARKERS for word in words)
    french_score = sum(word in FRENCH_MARKERS for word in words)
    return "en" if english_score > french_score * 1.25 and english_score >= 5 else "fr"


def cv_static_replacements(language: str) -> dict[str, str]:
    if language != "en":
        return {}
    return {
        "Éducation": "Education",
        "FORMATIONS & CERTIFICATIONS": "TRAINING & CERTIFICATIONS",
        "Expériences": "Professional Experience",
        "Compétences & langues": "Skills & Languages",
        "Compétences techniques :": "Technical skills:",
        "Langues : Français, Anglais (niveau C1 : autonome)": (
            "Languages: French (native), English (C1: independent)"
        ),
        "Bachelor III - Chef de Projet  - Graduation Oct.2025": (
            "Bachelor's Degree - Project Management - Graduated October 2025"
        ),
    }
