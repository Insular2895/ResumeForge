"""Extraction déterministe et ouverte des exigences techniques d'une offre.

Le module ne décide jamais qu'un candidat possède une compétence. Il décrit
uniquement ce que l'annonce demande. La confrontation aux preuves est réalisée
dans :mod:`src.application.dynamic_skills`.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
import re
import unicodedata


VALID_CATEGORIES = {
    "tool",
    "software",
    "process",
    "methodology",
    "technical_skill",
    "regulation",
    "language",
    "domain_knowledge",
    "operational_skill",
}


@dataclass(frozen=True)
class JobSkillRequirement:
    canonical_skill: str
    job_wording: str
    category: str
    importance: str
    expected_level: str | None
    evidence_terms: tuple[str, ...]
    frequency: int = 1
    title_relevance: bool = False

    def to_dict(self) -> dict:
        return asdict(self)


def normalize_skill_text(value: str) -> str:
    text = unicodedata.normalize("NFKD", str(value or "").casefold())
    text = "".join(character for character in text if not unicodedata.combining(character))
    text = text.replace("’", "'")
    return re.sub(r"[^a-z0-9+#./' -]+", " ", text).strip()


# Ce graphe compact décrit des équivalences linguistiques vérifiables. Il ne
# contient ni profil cible ni catalogue de compétences candidat.
CONCEPT_PATTERNS: tuple[dict, ...] = (
    {
        "canonical": "Gestion & suivi des commandes",
        "category": "operational_skill",
        "patterns": (r"\bcommandes?\b", r"\border management\b"),
        "evidence": ("commande", "commandes", "order management", "suivi des commandes"),
    },
    {
        "canonical": "Facturation",
        "category": "process",
        "patterns": (r"\bfacturation\b", r"\bfactures?\b", r"\bbilling\b"),
        "evidence": ("facturation", "facture", "billing"),
    },
    {
        "canonical": "Import-export",
        "category": "domain_knowledge",
        "patterns": (r"\bimport(?:ation)?\b", r"\bexport(?:ation)?\b", r"\bcross[- ]border\b"),
        "evidence": ("import", "export", "international", "cross border"),
    },
    {
        "canonical": "Incoterms",
        "category": "regulation",
        "patterns": (r"\bincoterms?\b", r"\b(?:fca|cpt|dap|ddp|exw|fob|cif)\b"),
        "evidence": ("incoterms", "fca", "cpt", "dap", "ddp", "exw", "fob", "cif"),
    },
    {
        "canonical": "Coordination transport & logistique",
        "category": "operational_skill",
        "patterns": (r"\btransport(?:eurs?)?\b", r"\blogistiqu\w*\b", r"\bfreight\b", r"\bexpeditions?\b"),
        "evidence": ("transport", "logistique", "freight", "expedition", "livraison"),
    },
    {
        "canonical": "Stocks & approvisionnements",
        "category": "operational_skill",
        "patterns": (r"\bstocks?\b", r"\binventory\b", r"\bapprovisionnement\w*\b", r"\bprocurement\b"),
        "evidence": ("stock", "inventory", "approvisionnement", "procurement", "sourcing"),
    },
    {
        "canonical": "Reporting/KPI",
        "category": "technical_skill",
        "patterns": (r"\breporting\b", r"\bkpis?\b", r"\bindicateurs?\b", r"\btableaux? de bord\b"),
        "evidence": ("reporting", "kpi", "indicateur", "tableau de bord", "rapport"),
    },
    {
        "canonical": "Gestion des litiges & retours",
        "category": "process",
        "patterns": (r"\blitiges?\b", r"\bretours?\b", r"\bdisputes?\b", r"\bclaims?\b"),
        "evidence": ("litige", "retour", "dispute", "reclamation"),
    },
    {
        "canonical": "Relation client",
        "category": "operational_skill",
        "patterns": (r"\brelation client\b", r"\bservice client\b", r"\bcustomer (?:service|support|relationship)\b"),
        "evidence": ("relation client", "service client", "support client", "customer service"),
    },
    {
        "canonical": "Analyse financière",
        "category": "technical_skill",
        "patterns": (r"\banalyse financiere\b", r"\bfinancial analysis\b", r"\banalyse d[' ]investissement\w*\b"),
        "evidence": ("analyse financiere", "financial analysis", "investissement", "modelisation financiere"),
    },
    {
        "canonical": "Gestion de portefeuille",
        "category": "technical_skill",
        "patterns": (r"\bgestion de portefeuille\b", r"\bportfolio management\b", r"\bportefeuille clients?\b"),
        "evidence": ("gestion de portefeuille", "portfolio management", "portefeuille client"),
    },
    {
        "canonical": "Suivi budgétaire",
        "category": "technical_skill",
        "patterns": (r"\bsuivi budgetaire\b", r"\bbudget(?:aire|ing)?\b", r"\bbudget tracking\b"),
        "evidence": ("budget", "budgetaire", "allocation budgetaire", "investissement"),
    },
    {
        "canonical": "Gestion de projet",
        "category": "methodology",
        "patterns": (r"\bgestion de projet\b", r"\bchef de projet\b", r"\bproject management\b", r"\bpmo\b"),
        "evidence": ("projet", "project", "planning", "jalon", "parties prenantes", "stakeholder"),
    },
    {
        "canonical": "Planification & suivi des jalons",
        "category": "methodology",
        "patterns": (r"\bplanification\b", r"\bplanning\b", r"\bjalons?\b", r"\bmilestones?\b"),
        "evidence": ("planification", "planning", "jalon", "milestone", "calendrier"),
    },
    {
        "canonical": "Coordination des parties prenantes",
        "category": "operational_skill",
        "patterns": (r"\bparties prenantes\b", r"\bstakeholders?\b", r"\bcoordination (?:d[' ]equipes?|transverse)\b"),
        "evidence": ("parties prenantes", "stakeholder", "coordination", "partenaire"),
    },
    {
        "canonical": "Analyse de données",
        "category": "technical_skill",
        "patterns": (r"\banalyse de donnees\b", r"\bdata analysis\b", r"\banalytics\b"),
        "evidence": ("analyse de donnees", "data analysis", "analytics", "pipeline data"),
    },
    {
        "canonical": "Marketing digital",
        "category": "domain_knowledge",
        "patterns": (r"\bmarketing digital\b", r"\bdigital marketing\b", r"\bacquisition\b"),
        "evidence": ("marketing digital", "digital marketing", "acquisition", "campagne"),
    },
    {
        "canonical": "Gestion de campagnes",
        "category": "operational_skill",
        "patterns": (r"\bgestion de campagnes?\b", r"\bcampaign management\b", r"\bcampagnes? publicitaires?\b"),
        "evidence": ("campagne", "campaign", "ads", "publicitaire"),
    },
    {
        "canonical": "Communication digitale",
        "category": "domain_knowledge",
        "patterns": (r"\bcommunication digitale\b", r"\bdigital communication\b", r"\bcommunication numerique\b"),
        "evidence": (
            "communication digitale",
            "communication numerique",
            "publicitaire digitale",
            "publicitaires digitales",
            "visibilite digitale",
        ),
    },
    {
        "canonical": "Social media",
        "category": "operational_skill",
        "patterns": (r"\bsocial media\b", r"\breseaux sociaux\b", r"\bcommunity management\b", r"\bcommunity manager\b"),
        "evidence": ("social media", "reseaux sociaux", "community manager", "contenus", "audience"),
    },
    {
        "canonical": "Création de contenus",
        "category": "operational_skill",
        "patterns": (r"\bcreation de contenus?\b", r"\bproduction de contenus?\b", r"\bcontent creation\b"),
        "evidence": ("creation de contenu", "production de contenu", "contenus", "content"),
    },
)


TOOL_PATTERNS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("Excel", (r"\bexcel\b", r"\btableaux? croises? dynamiques?\b", r"\btcd\b", r"\bvba\b")),
    ("SAP", (r"\bsap\b", r"\bs/4\s*hana\b", r"\b4hana\b")),
    ("ERP", (r"\berp\b",)),
    ("Power BI", (r"\bpower\s*bi\b",)),
    ("SQL", (r"\bsql\b",)),
    ("Python", (r"\bpython\b",)),
    ("Tableau", (r"\btableau\b(?!x? de bord)\b",)),
    ("Salesforce", (r"\bsalesforce\b",)),
    ("Google Analytics", (r"\bgoogle analytics\b", r"\bga4\b")),
    ("Meta Ads", (r"\bmeta ads\b",)),
    ("Google Ads", (r"\bgoogle ads\b",)),
    ("Jira", (r"\bjira\b",)),
    ("Notion", (r"\bnotion\b",)),
)


LEVEL_PATTERNS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("expert", (r"\bexpert(?:e|ise)?\b", r"\bniveau expert\b")),
    ("advanced", (r"\bmaitrise avancee\b", r"\badvanced\b", r"\bfonctions? complexes?\b")),
    ("proficient", (r"\bbonne maitrise\b", r"\bmaitrise\b", r"\bautonome\b", r"\bproficien\w*\b")),
    ("intermediate", (r"\bbonne connaissance\b", r"\bintermediaire\b", r"\bintermediate\b")),
    ("basic", (r"\bnotions?\b", r"\bconnaissance\b", r"\bdebutant\b", r"\bbasic\b")),
)


def detect_expected_level(context: str) -> str | None:
    normalized = normalize_skill_text(context)
    for level, patterns in LEVEL_PATTERNS:
        if any(re.search(pattern, normalized) for pattern in patterns):
            return level
    return None


def _importance(context: str) -> str:
    text = normalize_skill_text(context)
    if re.search(r"\b(?:exige|requis|obligatoire|imperatif|indispensable|must|required)\b", text):
        return "required"
    if re.search(r"\b(?:souhaite|apprecie|atout|idealement|nice to have|preferred)\b", text):
        return "preferred"
    return "mentioned"


def _sentence_for_match(text: str, start: int, end: int) -> str:
    left = max(text.rfind("\n", 0, start), text.rfind(".", 0, start), text.rfind(";", 0, start))
    right_candidates = [position for delimiter in ("\n", ".", ";") if (position := text.find(delimiter, end)) >= 0]
    right = min(right_candidates) if right_candidates else len(text)
    return text[left + 1 : right].strip()


def _requirement_from_matches(
    *,
    canonical: str,
    category: str,
    patterns: tuple[str, ...],
    evidence_terms: tuple[str, ...],
    job_title: str,
    job_description: str,
) -> JobSkillRequirement | None:
    normalized_body = normalize_skill_text(job_description)
    normalized_title = normalize_skill_text(job_title)
    matches = [match for pattern in patterns for match in re.finditer(pattern, normalized_body)]
    title_relevance = any(re.search(pattern, normalized_title) for pattern in patterns)
    if not matches and not title_relevance:
        return None
    context = _sentence_for_match(normalized_body, matches[0].start(), matches[0].end()) if matches else normalized_title
    return JobSkillRequirement(
        canonical_skill=canonical,
        job_wording=context or canonical,
        category=category if category in VALID_CATEGORIES else "technical_skill",
        importance=_importance(context),
        expected_level=detect_expected_level(context),
        evidence_terms=tuple(dict.fromkeys(normalize_skill_text(term) for term in evidence_terms if term)),
        frequency=max(1, len(matches)),
        title_relevance=title_relevance,
    )


def extract_job_skill_requirements(
    job_title: str,
    job_description: str,
    document_language: str = "fr",
    target_domain: str = "",
) -> list[dict]:
    """Retourne les exigences de l'annonce, sans les confondre avec des preuves.

    ``document_language`` et ``target_domain`` font partie du contrat public et
    permettent d'enrichir ultérieurement l'extracteur. Le fallback local reste
    volontairement déterministe et ne dépend d'aucun profil métier fermé.
    """

    del document_language, target_domain
    requirements: list[JobSkillRequirement] = []

    for canonical, patterns in TOOL_PATTERNS:
        requirement = _requirement_from_matches(
            canonical=canonical,
            category="software" if canonical not in {"Excel", "SQL", "Python"} else "tool",
            patterns=patterns,
            evidence_terms=(canonical, *patterns),
            job_title=job_title,
            job_description=job_description,
        )
        if requirement:
            # Les regex servent à l'extraction, jamais au matching des preuves.
            requirement = JobSkillRequirement(
                **{**requirement.to_dict(), "evidence_terms": (normalize_skill_text(canonical),)}
            )
            requirements.append(requirement)

    for concept in CONCEPT_PATTERNS:
        requirement = _requirement_from_matches(
            canonical=concept["canonical"],
            category=concept["category"],
            patterns=concept["patterns"],
            evidence_terms=concept["evidence"],
            job_title=job_title,
            job_description=job_description,
        )
        if requirement:
            requirements.append(requirement)

    return [requirement.to_dict() for requirement in requirements]


__all__ = [
    "JobSkillRequirement",
    "VALID_CATEGORIES",
    "detect_expected_level",
    "extract_job_skill_requirements",
    "normalize_skill_text",
]
