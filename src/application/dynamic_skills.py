"""Déduction des compétences par intersection annonce ↔ preuves candidat."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import re
from typing import Iterable

from src.application.candidate_evidence import CandidateEvidenceIndex, EvidenceItem
from src.application.job_skill_extractor import normalize_skill_text


LEVEL_ORDER = {
    "unsupported": 0,
    "basic": 1,
    "intermediate": 2,
    "proficient": 3,
    "advanced": 4,
    "expert": 5,
}


EVIDENCE_ALIASES = {
    "Excel": ("excel", "tableau croise dynamique", "tableaux croises dynamiques", "tcd", "vba", "macro"),
    "SAP": ("sap", "s/4hana", "s4hana", "4hana", "sap easy access", "ewm"),
    "ERP": ("erp",),
    "Power BI": ("power bi",),
    "SQL": ("sql",),
    "Python": ("python",),
    "Tableau": ("tableau software", "tableau desktop", "tableau prep"),
    "Salesforce": ("salesforce",),
    "Google Analytics": ("google analytics", "ga4"),
    "Meta Ads": ("meta ads", "meta_ads_manager"),
    "Google Ads": ("google ads", "google_ads"),
    "Jira": ("jira",),
    "Notion": ("notion",),
}


@dataclass(frozen=True)
class SkillMatch:
    canonical_skill: str
    display_label: str
    category: str
    expected_level: str | None
    candidate_level: str
    match_status: str
    score: float
    evidence: tuple[dict, ...]
    job_wording: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class DynamicSkillsResult:
    labels: tuple[str, ...]
    matches: tuple[SkillMatch, ...]
    unsupported: tuple[dict, ...]
    character_budget: int
    characters_used: int

    def to_dict(self) -> dict:
        return {
            "labels": list(self.labels),
            "matches": [match.to_dict() for match in self.matches],
            "unsupported": list(self.unsupported),
            "character_budget": self.character_budget,
            "characters_used": self.characters_used,
        }


def evidence_for_requirement(requirement: dict, index: CandidateEvidenceIndex) -> list[EvidenceItem]:
    canonical = str(requirement.get("canonical_skill") or "").strip()
    terms = list(requirement.get("evidence_terms") or [])
    terms.extend(EVIDENCE_ALIASES.get(canonical, ()))
    return index.search(terms)


def infer_candidate_skill_level(requirement: dict, evidence: Iterable[EvidenceItem | dict]) -> str:
    items = [_as_evidence_item(item) for item in evidence]
    items = [item for item in items if item is not None]
    if not items:
        return "unsupported"

    text = normalize_skill_text(" ".join(item.text for item in items))
    canonical = str(requirement.get("canonical_skill") or "")
    usage_items = [item for item in items if item.kind in {"usage", "verified", "validated_memory"}]

    if re.search(r"\b(?:expert|expertise approfondie|referent)\b", text) and usage_items:
        return "expert"

    advanced_signals = (
        "avance",
        "fonctions avancees",
        "fonctions complexes",
        "automatisation",
        "macro",
        "vba",
        "tableau croise dynamique",
        "tcd",
    )
    advanced_hits = {signal for signal in advanced_signals if signal in text}
    if usage_items and (
        len(advanced_hits) >= 2
        or (canonical == "Excel" and ({"vba", "macro"} & advanced_hits) and len(advanced_hits) >= 1)
    ):
        return "advanced"

    if usage_items and re.search(r"\b(?:autonome|quotidien|regulier|pilotage|supervision|responsable)\b", text):
        return "proficient"
    if len({item.experience_id or item.source for item in usage_items}) >= 2:
        return "proficient"
    if usage_items:
        return "intermediate"
    return "basic"


def classify_level_match(expected_level: str | None, candidate_level: str) -> str:
    if candidate_level == "unsupported":
        return "unsupported"
    if not expected_level:
        return "exact_match"
    expected = LEVEL_ORDER.get(expected_level, 0)
    candidate = LEVEL_ORDER.get(candidate_level, 0)
    if candidate == expected:
        return "exact_match"
    if candidate > expected:
        return "candidate_above_requirement"
    if candidate > 0:
        return "partial_match" if candidate + 1 >= expected else "insufficient_evidence"
    return "unsupported"


def _format_skill_label(canonical: str, candidate_level: str, expected_level: str | None) -> str:
    # Un niveau n'est rendu visible que si un signal fort le démontre. Les
    # niveaux prudents restent disponibles dans le report de diagnostic.
    if candidate_level == "expert" and expected_level == "expert":
        return f"{canonical} expert"
    if candidate_level == "advanced" and expected_level in {"advanced", "expert"}:
        return f"{canonical} avancé"
    return canonical


def _score(requirement: dict, evidence: list[EvidenceItem], candidate_level: str, status: str) -> float:
    importance = {"required": 32, "preferred": 22, "mentioned": 14}.get(
        str(requirement.get("importance") or "mentioned"), 14
    )
    frequency = min(5, int(requirement.get("frequency") or 1)) * 3
    title = 16 if requirement.get("title_relevance") else 0
    evidence_score = min(24, sum(max(1, item.strength) for item in evidence) * 2)
    level_score = {
        "exact_match": 12,
        "candidate_above_requirement": 11,
        "partial_match": 7,
        "insufficient_evidence": 2,
    }.get(status, 0)
    uncertainty_penalty = 8 if candidate_level == "basic" and requirement.get("expected_level") in {"advanced", "expert"} else 0
    return float(importance + frequency + title + evidence_score + level_score - uncertainty_penalty)


def derive_dynamic_skills(
    requirements: Iterable[dict],
    evidence_index: CandidateEvidenceIndex,
    *,
    character_budget: int = 260,
) -> DynamicSkillsResult:
    """Classe et budgète les seules compétences soutenues par des preuves."""

    supported: list[SkillMatch] = []
    unsupported: list[dict] = []
    seen = set()
    for requirement in requirements:
        canonical = str(requirement.get("canonical_skill") or "").strip()
        key = normalize_skill_text(canonical)
        if not key or key in seen:
            continue
        seen.add(key)
        evidence = evidence_for_requirement(requirement, evidence_index)
        candidate_level = infer_candidate_skill_level(requirement, evidence)
        match_status = classify_level_match(requirement.get("expected_level"), candidate_level)
        if candidate_level == "unsupported":
            unsupported.append(
                {
                    "canonical_skill": canonical,
                    "job_wording": requirement.get("job_wording", ""),
                    "reason": "no_candidate_evidence",
                }
            )
            continue
        label = _format_skill_label(canonical, candidate_level, requirement.get("expected_level"))
        supported.append(
            SkillMatch(
                canonical_skill=canonical,
                display_label=label,
                category=str(requirement.get("category") or "technical_skill"),
                expected_level=requirement.get("expected_level"),
                candidate_level=candidate_level,
                match_status=match_status,
                score=_score(requirement, evidence, candidate_level, match_status),
                evidence=tuple(item.to_dict() for item in evidence[:6]),
                job_wording=str(requirement.get("job_wording") or ""),
            )
        )

    supported.sort(key=lambda match: (-match.score, len(match.display_label), match.display_label.casefold()))
    chosen: list[SkillMatch] = []
    used = 0
    for match in supported:
        cost = len(match.display_label) + (3 if chosen else 0)
        if chosen and used + cost > max(40, character_budget):
            continue
        chosen.append(match)
        used += cost

    return DynamicSkillsResult(
        labels=tuple(match.display_label for match in chosen),
        matches=tuple(chosen),
        unsupported=tuple(unsupported),
        character_budget=max(40, character_budget),
        characters_used=used,
    )


def _as_evidence_item(item: EvidenceItem | dict) -> EvidenceItem | None:
    if isinstance(item, EvidenceItem):
        return item
    if not isinstance(item, dict) or not str(item.get("text") or "").strip():
        return None
    return EvidenceItem(
        text=str(item.get("text")),
        source=str(item.get("source") or "unknown"),
        kind=str(item.get("kind") or "usage"),
        strength=int(item.get("strength") or 1),
        experience_id=str(item.get("experience_id") or ""),
    )


__all__ = [
    "DynamicSkillsResult",
    "SkillMatch",
    "classify_level_match",
    "derive_dynamic_skills",
    "evidence_for_requirement",
    "infer_candidate_skill_level",
]
