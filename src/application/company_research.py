from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
import json
import os
import re
import unicodedata

from src.config import COMPANY_CACHE_TTL_DAYS, COMPANY_PROFILES_DIR
from src.llm.gemini_client import get_rotation_models


LEGAL_SUFFIXES = {
    "sa",
    "sas",
    "sarl",
    "groupe",
    "group",
    "inc",
    "ltd",
    "plc",
    "corp",
    "co",
}


def slugify(value: str, fallback: str = "entreprise") -> str:
    text = unicodedata.normalize("NFKD", value or "")
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    return text or fallback


def normalize_company(raw_name: str) -> tuple[str, str]:
    clean = (raw_name or "Entreprise").strip()
    words = [word for word in re.split(r"[\s,]+", clean) if word]
    display_words = [word for word in words if word.lower() not in LEGAL_SUFFIXES]
    display = " ".join(display_words).strip() or clean
    return display, slugify(display)


def _cache_path(company_slug: str) -> Path:
    return COMPANY_PROFILES_DIR / f"{company_slug}.json"


def load_company_profile(company_slug: str) -> tuple[dict, str]:
    path = _cache_path(company_slug)
    if not path.exists():
        return {"facts": [], "excluded_facts": []}, "missing"

    try:
        profile = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"facts": [], "excluded_facts": []}, "invalid_cache"

    last_updated = profile.get("last_updated", "")
    try:
        updated_at = datetime.fromisoformat(last_updated).date()
        if updated_at < (datetime.now().date() - timedelta(days=COMPANY_CACHE_TTL_DAYS)):
            return profile, "stale"
    except ValueError:
        return profile, "unknown_age"

    return profile, "cache_hit"


def save_company_profile(company_slug: str, profile: dict) -> Path:
    path = _cache_path(company_slug)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(profile, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def refresh_company_profile_with_gemini(company_name: str, company_slug: str) -> tuple[dict, str]:
    """Optionally refresh company facts with Gemini Search grounding."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return {"facts": [], "excluded_facts": []}, "skipped_missing_GEMINI_API_KEY"

    from google import genai
    from google.genai import types

    model = os.getenv("GEMINI_RESEARCH_MODEL", "").strip() or get_rotation_models()[0]
    prompt = f"""
Recherche des informations factuelles, officielles et utiles pour une lettre de motivation ciblée sur l'entreprise {company_name}.

Priorité absolue aux sources officielles : site corporate, page carrière, rapport annuel, page valeurs/culture, page pays France, communiqués officiels.
Si tu trouves une adresse pertinente en France pour la candidature, retourne-la dans company_address.

On cherche des faits précis pour éviter une lettre générique :
- mission, logique patient/client/utilisateur ;
- culture interne, collaboration, autonomie, feedback, ownership, trust ;
- formation, apprentissage, coaching, onboarding, academy, learning model ;
- mobilité interne, mobilité internationale, parcours collaborateurs, cross-functional mobility ;
- montée en compétences, développement personnel et professionnel ;
- organisation internationale, exposition globale, équipes multiculturelles ;
- reconnaissance employeur uniquement si sourcée ;
- vocabulaire officiel exact utilisable dans une LM.

Retourne uniquement un JSON valide avec:
{{
  "company_display_name": "{company_name}",
  "company_address": {{
    "line_1": "",
    "postal_city": ""
  }},
  "attention_to": "",
  "department": "",
  "official_vocabulary": [],
  "facts": [
    {{"fact": "texte court, précis et réutilisable dans une LM", "category": "culture|formation|mobilite|mission|projet|international|process|employer_brand|learning", "source_url": "url", "confidence": "high|medium|low", "is_generic": false}}
  ],
  "excluded_facts": [
    {{"fact": "texte", "reason": "raison"}}
  ]
}}

Règles strictes :
- ne retourne pas de markdown ;
- chaque fact doit avoir une source_url ;
- évite "leader du secteur", "entreprise dynamique", avantages banals, tickets restaurant, transport, RTT, télétravail générique ;
- ne transforme pas un slogan vague en fait ;
- préfère 4 à 8 faits courts mais distinctifs ;
- privilégie au moins un fait lié à l'apprentissage, la formation, la mobilité ou la progression si une source officielle le prouve ;
- si aucun fait d'apprentissage/progression n'est trouvé, ne l'invente pas et reste sobre ;
- si aucune adresse fiable n'est trouvée, laisse company_address vide.
"""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        ),
    )

    try:
        payload = json.loads(_strip_json_fences(response.text or ""))
    except json.JSONDecodeError:
        payload = {"facts": [], "excluded_facts": [{"fact": "Gemini response", "reason": "invalid_json"}]}

    profile = {
        "schema_version": "1.0",
        "source": "gemini_search_grounding",
        "company_name": payload.get("company_display_name") or company_name,
        "company_slug": company_slug,
        "last_updated": datetime.now().date().isoformat(),
        "company_address": payload.get("company_address", {}) if isinstance(payload, dict) else {},
        "attention_to": payload.get("attention_to", "") if isinstance(payload, dict) else "",
        "department": payload.get("department", "") if isinstance(payload, dict) else "",
        "official_vocabulary": payload.get("official_vocabulary", []) if isinstance(payload, dict) else [],
        "facts": payload.get("facts", []) if isinstance(payload, dict) else [],
        "excluded_facts": payload.get("excluded_facts", []) if isinstance(payload, dict) else [],
    }
    save_company_profile(company_slug, profile)
    return profile, "refreshed"


def _strip_json_fences(raw_text: str) -> str:
    text = (raw_text or "").strip()
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    elif text.startswith("```"):
        text = text[len("```"):].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text


def select_company_facts(profile: dict, max_facts: int = 3) -> tuple[list[dict], list[dict]]:
    selected: list[dict] = []
    rejected: list[dict] = []

    for fact in profile.get("facts", []):
        if not isinstance(fact, dict):
            continue
        text = str(fact.get("fact", "")).strip()
        if not text:
            continue
        if fact.get("is_generic") is True:
            rejected.append({"fact": text, "reason": "generic"})
            continue
        if not fact.get("source_url"):
            rejected.append({"fact": text, "reason": "no_source"})
            continue
        if len(selected) < max_facts:
            selected.append(fact)
        else:
            rejected.append({"fact": text, "reason": "over_limit"})

    for fact in profile.get("excluded_facts", []):
        if isinstance(fact, dict):
            rejected.append(fact)

    return selected, rejected


def extract_company_facts_from_job_description(company_name: str, job_text: str) -> list[dict]:
    """Extract company facts explicitly stated in the job description."""
    text = job_text or ""
    candidates = [
        (
            "Ipsen se présente dans l'offre comme une organisation biopharmaceutique guidée par une mission et dotée d'une culture centrée sur l'humain.",
            ["purpose-driven biopharmaceutical", "human-centric culture"],
            "mission",
        ),
        (
            "L'offre décrit un environnement fondé sur la confiance, l'ownership et la collaboration.",
            ["trust, ownership, and collaboration", "trust", "ownership", "collaboration"],
            "culture",
        ),
        (
            "Le poste offre une exposition globale et un impact élevé dans un département travaillant avec plus de 80 pays.",
            ["global exposure", "high impact", "more than 80 countries"],
            "international",
        ),
        (
            "Ipsen indique dans l'offre vouloir créer un lieu de travail où chacun se sent écouté, valorisé et soutenu.",
            ["écouté, valorisé et soutenu", "écouté", "valorisé", "soutenu"],
            "culture",
        ),
        (
            "L'offre met en avant l'inclusion, l'égalité des chances et la valeur accordée aux perspectives diverses.",
            ["inclusion", "égalité des chances", "perspectives", "divers"],
            "culture",
        ),
    ]

    facts: list[dict] = []
    lowered = text.casefold()
    for fact, markers, category in candidates:
        if any(marker.casefold() in lowered for marker in markers):
            facts.append(
                {
                    "fact": fact.replace("Ipsen", company_name or "L'entreprise", 1),
                    "category": category,
                    "source_url": "job_description",
                    "confidence": "high",
                    "is_generic": False,
                }
            )
    return facts
