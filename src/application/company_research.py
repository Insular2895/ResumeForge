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

    model = get_rotation_models()[0]
    prompt = f"""
Recherche des informations factuelles et officielles sur l'entreprise {company_name}.
Retourne uniquement un JSON valide avec:
{{
  "facts": [
    {{"fact": "texte court", "category": "culture|formation|mobilite|mission|projet|international|process", "source_url": "url", "confidence": "high|medium|low", "is_generic": false}}
  ],
  "excluded_facts": [
    {{"fact": "texte", "reason": "raison"}}
  ]
}}
Exclus les avantages banals, les blogs non officiels et les formules generiques.
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
        payload = json.loads((response.text or "").strip().removeprefix("```json").removesuffix("```").strip())
    except json.JSONDecodeError:
        payload = {"facts": [], "excluded_facts": [{"fact": "Gemini response", "reason": "invalid_json"}]}

    profile = {
        "schema_version": "1.0",
        "source": "gemini_search_grounding",
        "company_name": company_name,
        "company_slug": company_slug,
        "last_updated": datetime.now().date().isoformat(),
        "facts": payload.get("facts", []) if isinstance(payload, dict) else [],
        "excluded_facts": payload.get("excluded_facts", []) if isinstance(payload, dict) else [],
    }
    save_company_profile(company_slug, profile)
    return profile, "refreshed"


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
