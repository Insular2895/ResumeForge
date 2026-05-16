from __future__ import annotations

from pathlib import Path
import json

from src.config import TEMPLATES_DIR


DOMAIN_VOCABULARY_DIR = TEMPLATES_DIR / "domain_vocabulary"


def load_domain_vocabulary(job_family: str) -> dict:
    domain = _map_job_family_to_domain(job_family)
    path = DOMAIN_VOCABULARY_DIR / f"{domain}.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _map_job_family_to_domain(job_family: str) -> str:
    value = (job_family or "").lower()
    if value in {"operations_supply_chain", "supply_chain", "operations"}:
        return "supply_chain"
    if value in {"retail_operations", "retail", "customer_service"}:
        return "retail_operations"
    return value or "general"
