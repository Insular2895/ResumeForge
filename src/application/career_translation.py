from __future__ import annotations

import json
import os
from pathlib import Path
import re
import unicodedata

from src.config import DATA_DIR, MASTER_PROFILE_PATH, TEMPLATES_DIR
from src.application.experience_memory import profile_evidence_text


DOMAIN_PATH = TEMPLATES_DIR / "career_translation" / "domains.json"
DYNAMIC_DOMAIN_DIR = DATA_DIR / "local_config" / "career_translation_domains"
COVERAGE_THRESHOLD = 45
LAYER_TARGETS = {"concepts": 2, "actions": 2, "objects": 2, "results": 1}


def _normalize(value: str) -> str:
    text = unicodedata.normalize("NFKD", str(value or "").casefold())
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"\bredui(?:re|t|s|te|tes|sent)\b", "reduction", text)
    text = re.sub(r"\bamelior(?:er|e|es|ent)\b", "amelioration", text)
    return re.sub(r"[^a-z0-9]+", " ", text).strip()


def load_career_domains() -> dict:
    return json.loads(DOMAIN_PATH.read_text(encoding="utf-8"))


def load_career_domain(domain: str) -> dict:
    domains = load_career_domains()
    key = str(domain or "").strip()
    if key in domains:
        return domains[key]
    dynamic_path = DYNAMIC_DOMAIN_DIR / f"{key}.json"
    if dynamic_path.exists():
        return json.loads(dynamic_path.read_text(encoding="utf-8"))
    raise ValueError(f"Domaine métier inconnu : {key or 'vide'}")


def infer_target_domain(job_text: str) -> str:
    normalized = _normalize(job_text)
    scores = {}
    for key, domain in load_career_domains().items():
        scores[key] = sum(
            3 if " " in _normalize(alias) else 1
            for alias in domain.get("aliases", [])
            if _normalize(alias) and _normalize(alias) in normalized
        )
    best = max(scores, key=scores.get)
    return best if scores[best] else ""


def build_dynamic_domain_prompt(job_description: str) -> str:
    return f"""Tu construis un modèle métier universel pour ResumeForge à partir d'une offre d'emploi.

Le métier peut appartenir à absolument n'importe quel domaine. Ne le force jamais
dans une taxonomie existante.

Règles:
- n'invente aucune vérité candidat ;
- modélise uniquement le métier décrit par l'offre ;
- retourne uniquement un JSON valide ;
- utilise un identifiant `domain` court en snake_case ;
- fournis exactement les quatre couches concepts, actions, objects, results ;
- les questions servent à vérifier l'expérience réelle du candidat ;
- chaque liste contient des termes précis, courts et utiles au recrutement.

Schéma:
{{
  "domain": "",
  "label": "",
  "aliases": [],
  "layers": {{
    "concepts": [],
    "actions": [],
    "objects": [],
    "results": []
  }},
  "evidence_signals": {{}},
  "questions": []
}}

OFFRE:
{job_description}
"""


def _slug(value: str) -> str:
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", _normalize(value))).strip("_")


def _validate_domain_model(model: dict) -> dict:
    if not isinstance(model, dict):
        raise ValueError("Le modèle métier généré est invalide.")
    layers = model.get("layers")
    if not isinstance(layers, dict) or set(layers) != set(LAYER_TARGETS):
        raise ValueError("Le modèle métier doit contenir concepts, actions, objects et results.")
    for name in LAYER_TARGETS:
        values = layers.get(name)
        if not isinstance(values, list) or not any(str(item).strip() for item in values):
            raise ValueError(f"La couche métier {name} est vide.")
        layers[name] = [str(item).strip() for item in values if str(item).strip()]
    label = str(model.get("label") or model.get("domain") or "Métier détecté").strip()
    domain = _slug(str(model.get("domain") or label)) or "metier_detecte"
    return {
        "domain": domain,
        "label": label,
        "aliases": [str(item).strip() for item in model.get("aliases", []) if str(item).strip()],
        "layers": layers,
        "evidence_signals": model.get("evidence_signals", {}) if isinstance(model.get("evidence_signals", {}), dict) else {},
        "questions": [str(item).strip() for item in model.get("questions", []) if str(item).strip()],
        "source": str(model.get("source") or "generated_from_job_description"),
    }


def generate_dynamic_domain(job_description: str) -> dict:
    if len(_normalize(job_description)) < 30:
        return _local_dynamic_domain(job_description)
    api_key = os.getenv("GEMINI_DOMAIN_API_KEY", "").strip()
    if api_key:
        from google import genai

        model_name = os.getenv("GEMINI_DOMAIN_MODEL", "gemini-3.1-flash-lite")
        response = genai.Client(api_key=api_key).models.generate_content(
            model=model_name,
            contents=build_dynamic_domain_prompt(job_description),
        )
        raw = str(response.text or "").strip()
        raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw)
        return _validate_domain_model(json.loads(raw))
    return _local_dynamic_domain(job_description)


def _local_dynamic_domain(job_description: str) -> dict:
    normalized = _normalize(job_description)
    words = [word for word in normalized.split() if len(word) > 4]
    unique = list(dict.fromkeys(words))
    label = next((line.strip() for line in str(job_description).splitlines() if line.strip()), "Métier détecté")
    concepts = unique[:6] or ["expertise métier"]
    actions = [word for word in unique if word.endswith(("er", "ir", "re"))][:5] or ["analyser", "coordonner"]
    objects = [word for word in unique if word not in actions][:6] or ["activité", "livrables"]
    return _validate_domain_model(
        {
            "domain": f"dynamic_{_slug(label)[:48]}",
            "label": label[:80],
            "aliases": [label],
            "layers": {
                "concepts": concepts,
                "actions": actions,
                "objects": objects,
                "results": ["atteinte des résultats attendus du poste"],
            },
            "questions": [
                "Quelles missions de cette offre avez-vous réellement réalisées ?",
                "Quels outils, livrables et résultats pouvez-vous expliquer en entretien ?",
            ],
            "source": "local_job_description_fallback",
        }
    )


def _cached_domains(cache_dir: str | Path) -> dict:
    cache = Path(cache_dir)
    if not cache.exists():
        return {}
    domains = {}
    for path in cache.glob("*.json"):
        try:
            model = _validate_domain_model(json.loads(path.read_text(encoding="utf-8")))
            domains[model["domain"]] = model
        except (ValueError, json.JSONDecodeError):
            continue
    return domains


def resolve_target_domain(
    job_text: str,
    requested_domain: str = "",
    *,
    cache_dir: str | Path = DYNAMIC_DOMAIN_DIR,
    generator=generate_dynamic_domain,
) -> dict:
    known = load_career_domains()
    if requested_domain:
        if requested_domain in known:
            return {"key": requested_domain, "model": known[requested_domain], "dynamic": False}
        cached = _cached_domains(cache_dir)
        if requested_domain in cached:
            return {"key": requested_domain, "model": cached[requested_domain], "dynamic": True}
    inferred = infer_target_domain(job_text)
    if inferred:
        return {"key": inferred, "model": known[inferred], "dynamic": False}
    normalized = _normalize(job_text)
    for key, model in _cached_domains(cache_dir).items():
        if any(_normalize(alias) in normalized for alias in model.get("aliases", []) if _normalize(alias)):
            return {"key": key, "model": model, "dynamic": True}
    model = _validate_domain_model(generator(job_text))
    cache = Path(cache_dir)
    cache.mkdir(parents=True, exist_ok=True)
    (cache / f"{model['domain']}.json").write_text(
        json.dumps(model, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return {"key": model["domain"], "model": model, "dynamic": True}


def _term_present(term: str, normalized_evidence: str, signals: dict | None = None) -> bool:
    normalized_term = _normalize(term)
    if normalized_term in normalized_evidence:
        return True
    for signal in (signals or {}).get(term, []):
        if _normalize(signal) in normalized_evidence:
            return True
    evidence_words = normalized_evidence.split()
    parts = [part for part in normalized_term.split() if len(part) > 3]
    return bool(parts) and all(
        any(word.startswith(part[:5]) or part.startswith(word[:5]) for word in evidence_words)
        for part in parts
    )


def assess_coverage(
    evidence_text: str,
    target_domain: str,
    threshold: int = COVERAGE_THRESHOLD,
    domain_model: dict | None = None,
) -> dict:
    domain = domain_model or load_career_domain(target_domain)
    normalized_evidence = _normalize(evidence_text)
    layers = {}
    signals = domain.get("evidence_signals", {})
    for layer_name, terms in domain["layers"].items():
        matched = [term for term in terms if _term_present(term, normalized_evidence, signals)]
        target = LAYER_TARGETS[layer_name]
        layers[layer_name] = {
            "score": min(100, round(len(matched) / target * 100)),
            "matched": matched,
            "missing": [term for term in terms if term not in matched],
            "minimum_met": len(matched) >= 1,
        }
    overall_score = round(sum(layer["score"] for layer in layers.values()) / len(layers))
    layer_minimums_met = all(layer["minimum_met"] for layer in layers.values())
    return {
        "target_domain": target_domain,
        "target_label": domain["label"],
        "overall_score": overall_score,
        "threshold": threshold,
        "status": "ready" if overall_score >= threshold and layer_minimums_met else "enrichment_required",
        "layers": layers,
        "questions": domain.get("questions", []) if overall_score < threshold or not layer_minimums_met else [],
    }


def assess_all_domains(evidence_text: str, threshold: int = COVERAGE_THRESHOLD) -> dict:
    return {
        domain: assess_coverage(evidence_text, domain, threshold)
        for domain in load_career_domains()
    }


def build_translation_context(evidence_text: str, target_domain: str, domain_model: dict | None = None) -> dict:
    assessment = assess_coverage(evidence_text, target_domain, domain_model=domain_model)
    supported = []
    unsupported = []
    for layer in assessment["layers"].values():
        supported.extend(layer["matched"])
        unsupported.extend(layer["missing"])
    return {
        **assessment,
        "supported_terms": list(dict.fromkeys(supported)),
        "unsupported_terms": list(dict.fromkeys(unsupported)),
        "credibility_rule": (
            "Ne jamais inventer une responsabilité. Utiliser uniquement les termes "
            "soutenus par une preuve réelle, validée et explicable en entretien."
        ),
    }


def assess_profile_for_job(job_text: str, target_domain: str = "", master_path=MASTER_PROFILE_PATH) -> dict:
    resolved = resolve_target_domain(job_text, target_domain)
    assessment = assess_coverage(
        profile_evidence_text(master_path),
        resolved["key"],
        domain_model=resolved["model"],
    )
    assessment["dynamic_domain"] = resolved["dynamic"]
    return assessment
