"""Index de preuves candidat construit exclusivement depuis des faits validés."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import re
from typing import Iterable

try:  # pandas reste optionnel pour les tests unitaires de ce module.
    import pandas as pd
except ImportError:  # pragma: no cover
    pd = None

from src.application.job_skill_extractor import normalize_skill_text


@dataclass(frozen=True)
class EvidenceItem:
    text: str
    source: str
    kind: str
    strength: int
    experience_id: str = ""

    @property
    def normalized_text(self) -> str:
        return normalize_skill_text(self.text)

    def to_dict(self) -> dict:
        return asdict(self)


def _clean(value) -> str:
    if value is None:
        return ""
    try:
        if pd is not None and pd.isna(value):
            return ""
    except (TypeError, ValueError):
        pass
    text = str(value).strip()
    return "" if text.casefold() in {"nan", "none", "nat"} else text


def _records(values) -> list[dict]:
    if values is None:
        return []
    if pd is not None and isinstance(values, pd.DataFrame):
        return values.to_dict(orient="records")
    if isinstance(values, dict):
        return [values]
    records = []
    for value in values:
        if pd is not None and isinstance(value, pd.Series):
            records.append(value.to_dict())
        elif isinstance(value, dict):
            records.append(value)
        else:
            records.append({"value": value})
    return records


def _split_structured(value: str) -> list[str]:
    return [part.strip() for part in re.split(r"[|;\n]+", _clean(value)) if part.strip()]


class CandidateEvidenceIndex:
    """Index en lecture seule avec provenance pour chaque signal."""

    def __init__(self, items: Iterable[EvidenceItem] = ()):
        deduped: dict[tuple[str, str, str], EvidenceItem] = {}
        for item in items:
            key = (item.normalized_text, item.source, item.experience_id)
            if item.normalized_text and (key not in deduped or item.strength > deduped[key].strength):
                deduped[key] = item
        self.items = tuple(deduped.values())

    def search(self, terms: Iterable[str]) -> list[EvidenceItem]:
        normalized_terms = [normalize_skill_text(term) for term in terms if normalize_skill_text(term)]
        matches = []
        for item in self.items:
            haystack = item.normalized_text
            if any(_contains_term(haystack, term) for term in normalized_terms):
                matches.append(item)
        return matches

    def to_dict(self) -> dict:
        return {"evidence": [item.to_dict() for item in self.items]}


def _contains_term(haystack: str, needle: str) -> bool:
    if not haystack or not needle:
        return False
    if len(needle) <= 4 and re.fullmatch(r"[a-z0-9+#./-]+", needle):
        return bool(re.search(rf"(?<![a-z0-9]){re.escape(needle)}(?![a-z0-9])", haystack))
    return needle in haystack


def build_candidate_evidence_index(
    experiences,
    certifications=None,
    formations=None,
    validated_memory=None,
) -> CandidateEvidenceIndex:
    """Construit l'index depuis les colonnes factuelles, jamais depuis la JD.

    Les anciennes feuilles ``skills`` et ``skills_by_target`` ne sont pas des
    entrées de cette fonction par conception.
    """

    items: list[EvidenceItem] = []
    for row in _records(experiences):
        experience_id = _clean(row.get("experience_id"))
        for column in ("company", "organisation", "job_title", "position_title", "role", "context"):
            text = _clean(row.get(column))
            if text:
                items.append(EvidenceItem(text, f"experiences.{column}", "context", 2, experience_id))

        for column in ("tools_verified", "skills_verified", "kpis_verified"):
            for text in _split_structured(row.get(column, "")):
                items.append(EvidenceItem(text, f"experiences.{column}", "verified", 4, experience_id))

        for index in range(1, 11):
            for column in (f"truth_bullet_{index}", f"bullet_{index}"):
                text = _clean(row.get(column))
                if text:
                    items.append(EvidenceItem(text, f"experiences.{column}", "usage", 3, experience_id))
                    break

        memory = _clean(row.get("validated_memory"))
        if memory:
            items.append(EvidenceItem(memory, "experiences.validated_memory", "validated_memory", 4, experience_id))

    for source_name, records in (("certifications", certifications), ("formations", formations)):
        for row in _records(records):
            text = " — ".join(
                part
                for part in (
                    _clean(row.get("cert_name") or row.get("certification_name") or row.get("name") or row.get("title") or row.get("value")),
                    _clean(row.get("issuer")),
                    _clean(row.get("notes")),
                )
                if part
            )
            if text:
                items.append(EvidenceItem(text, source_name, "training", 1))

    for row in _records(validated_memory):
        status = _clean(row.get("validation_status"))
        memory_status = _clean(row.get("memory_status")) or "active"
        if status and status != "user_validated":
            continue
        if memory_status == "archived":
            continue
        text = "\n".join(
            part
            for part in (_clean(row.get("free_text")), _clean(row.get("answers_json")), _clean(row.get("qa_pairs_json")))
            if part
        )
        if text:
            items.append(
                EvidenceItem(
                    text,
                    "experience_memory",
                    "validated_memory",
                    4,
                    _clean(row.get("experience_id")),
                )
            )

    return CandidateEvidenceIndex(items)


__all__ = ["CandidateEvidenceIndex", "EvidenceItem", "build_candidate_evidence_index"]
