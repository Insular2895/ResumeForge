from __future__ import annotations

from pathlib import Path
import json
import os

from src.application.domain_vocabulary import DOMAIN_VOCABULARY_DIR


DEFAULT_DOMAIN_MODEL = "gemini-3.1-flash-lite"


def build_domain_enrichment_prompt(job_description: str, existing_vocabulary: dict | None = None) -> str:
    existing_json = json.dumps(existing_vocabulary or {}, ensure_ascii=False, indent=2)
    return f"""Tu enrichis une base de vocabulaire métier pour ResumeForge.

Objectif:
- comprendre les actions explicites et implicites d'une fiche de poste ;
- produire des termes précis par vagues métier ;
- aider une lettre de motivation ATS sans inventer d'expertise candidat.

Entrées:
- fiche de poste ;
- vocabulaire existant éventuel.

Méthode obligatoire:
1. Identifier la famille métier principale.
2. Extraire les actions explicites de la JD: verbes, missions, processus, outils, documents, interlocuteurs.
3. Déduire les actions implicites du métier, mais seulement comme enjeux prudents.
4. Classer les termes en vagues:
   - vague 1: domaine large ;
   - vague 2: processus ;
   - vague 3: documents, outils, contraintes précises ;
   - vague 4: risques opérationnels ;
   - cross_domain_terms: termes transférables vers d'autres domaines.
5. Pour chaque terme précis, indiquer s'il est:
   - explicit_in_jd ;
   - implicit_in_domain ;
   - transferable.
6. Ajouter des formulations sûres:
   - "m'a exposé à..." ;
   - "m'a permis de développer des réflexes sur..." ;
   - "je comprends que ce poste demande..." ;
   - éviter toute survente.

Règles strictes:
- retourne uniquement un JSON valide ;
- ne crée pas de vérité candidat ;
- n'écris jamais qu'un candidat maîtrise un terme implicite ;
- privilégie les documents/outils/process précis quand ils existent ;
- pas de markdown.

Schéma JSON attendu:
{{
  "domain": "",
  "aliases": [],
  "waves": {{
    "1_domain_core": [],
    "2_processes": [],
    "3_documents_tools_constraints": [],
    "4_operational_risks": []
  }},
  "term_sources": {{
    "explicit_in_jd": [],
    "implicit_in_domain": [],
    "transferable": []
  }},
  "cross_domain_terms": {{}},
  "safe_formulations": [],
  "forbidden_overclaims": [],
  "usage_rules": []
}}

VOCABULAIRE_EXISTANT:
{existing_json}

JOB_DESCRIPTION:
{job_description}
"""


def enrich_domain_vocabulary_with_gemini(
    job_description: str,
    existing_vocabulary: dict | None = None,
    api_key: str | None = None,
    model: str | None = None,
) -> dict:
    api_key = (api_key or os.getenv("GEMINI_DOMAIN_API_KEY", "")).strip()
    if not api_key:
        raise RuntimeError("missing_GEMINI_DOMAIN_API_KEY")

    from google import genai

    selected_model = model or os.getenv("GEMINI_DOMAIN_MODEL", DEFAULT_DOMAIN_MODEL)
    prompt = build_domain_enrichment_prompt(job_description, existing_vocabulary)
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(model=selected_model, contents=prompt)
    return json.loads(_strip_json_fences(response.text or ""))


def save_domain_vocabulary(vocabulary: dict, output_dir: str | Path = DOMAIN_VOCABULARY_DIR) -> Path:
    domain = vocabulary.get("domain") or "unknown_domain"
    filename = f"{_slugify(domain)}.json"
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / filename
    path.write_text(json.dumps(vocabulary, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def _strip_json_fences(raw_text: str) -> str:
    text = (raw_text or "").strip()
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    elif text.startswith("```"):
        text = text[len("```"):].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text


def _slugify(value: str) -> str:
    return "".join(char.lower() if char.isalnum() else "_" for char in value).strip("_")

