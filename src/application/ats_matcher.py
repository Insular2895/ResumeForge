from __future__ import annotations

from collections import Counter
from dataclasses import asdict, dataclass
import re
import unicodedata

# ATS platform scoring model adapted from sunnypatell/ats-screener (MIT License).
# Source: https://github.com/sunnypatell/ats-screener
# We keep the platform weights/strategies, but use this project's French keyword
# extraction so scores stay useful for local French job descriptions.


ATS_STOPWORDS = {
    "a", "an", "and", "as", "be", "by", "for", "from", "in", "is", "of", "or",
    "our", "that", "the", "this", "to", "with", "your",
    "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "du", "elle", "en",
    "est", "et", "il", "la", "le", "les", "leur", "leurs", "nous", "par",
    "pas", "plus", "pour", "sur", "un", "une", "vous", "vos",
    "candidat", "candidats", "description", "emploi", "entreprise", "h", "f",
    "job", "mission", "missions", "poste", "profil", "recherche", "role",
    "appreciee", "ainsi", "alenta", "autres", "cdd", "contribuant", "dynamique",
    "equipe", "elancourt", "efficacement", "non", "notre", "obligatoire",
    "nbsp", "opportunite", "prealable", "responsabilites", "salaire", "votre",
    "mois", "temps", "plein", "type", "lieu", "horaires", "avantages",
    "quotidien", "charenton", "pont", "ivry", "seine", "conflans",
    "sainte", "honorine", "acompte", "paie", "cergy", "artus",
    "assistant", "responsable", "pole", "sein", "aurez", "principales",
    "assurer", "mettre", "jour", "destines", "tiers",
    "via", "validees", "controler", "corriger", "puis",
}

IMPORTANT_TERMS = {
    "adv", "administration des ventes", "assistant commercial", "commercial",
    "commande", "commandes", "client", "clients", "crm", "erp", "m3", "export",
    "facturation", "gestion", "import", "incoterms", "international",
    "logistique", "pack office", "relation client", "reporting", "sap",
    "service client", "stock", "supply chain", "transport",
    "microsoft office", "google workspace", "word", "powerpoint", "excel",
    "documents administratifs", "donnees clients", "étiquette téléphonique",
    "etiquette telephonique", "publicite", "publicitaire", "campagnes publicitaires",
    "relations clients", "support client",
    "gestion des commandes", "suivi des commandes", "commandes via sap",
    "commandes via sage", "sage", "edi", "referentiel", "référentiel",
    "centrales d achats", "centrales d'achats", "fabricants", "litiges",
    "penalites", "pénalités", "livraison", "livraisons", "stocks",
    "ruptures de stocks", "b to b", "anglais", "support administratif",
    "demandes clients", "cahiers des charges", "amelioration continue",
    "amélioration continue", "conditions contractuelles", "b to b",
    "logiciel sage", "stocks produits finis", "gestion des penalites",
    "gestion des pénalités",
    "gestion administrative", "administratif", "organisation", "rigueur",
    "communication", "autonomie", "travail en equipe", "priorites",
    "satisfaction client", "portefeuille clients", "suivi client",
    "relation clients", "litige", "retours", "preparation", "production",
    "qualite", "delais", "approvisionnement", "cout", "consultations",
    "tarifs", "remises", "paiements", "encours", "syntheses", "kpi",
    "tableaux de bord", "analyse", "budget", "budgets", "reporting",
    "negociation", "contrats", "contrat", "transport", "affretement",
    "anglais professionnel", "pack office", "word", "power point",
    "powerpoint", "google sheets", "google docs", "logiciel", "sage",
    "relationnel", "sens du service", "grande distribution", "b2b",
    "commerciale", "commerciales", "technique", "techniques",
    "financieres", "financières", "export", "import",
    "saisie des commandes", "traitement des commandes",
    "controle des commandes", "contrôle des commandes",
    "suivi de facturation", "coordination interne",
    "coordination logistique", "transport international",
    "documents douaniers", "formalites douanieres", "formalités douanières",
    "commercial invoice", "packing list", "devis", "relance",
    "pipeline commercial", "prospection", "fidelisation", "fidélisation",
    "analyse des besoins", "gestion de portefeuille",
}


@dataclass(frozen=True)
class AtsAnalysis:
    score: int
    matched_keywords: list[str]
    missing_keywords: list[str]
    priority_keywords: list[str]
    injectable_keywords: list[str]
    transferable_keywords: list[str]
    suggestions: list[str]
    platform_scores: list[dict]
    score_source: str
    job_reference_enrichment: dict


ATS_PROFILES = [
    {
        "name": "Workday",
        "vendor": "Workday, Inc.",
        "strategy": "exact",
        "passing_score": 70,
        "weights": {
            "formatting": 0.25,
            "keyword": 0.30,
            "sections": 0.15,
            "experience": 0.15,
            "education": 0.10,
            "quantification": 0.05,
        },
    },
    {
        "name": "Taleo",
        "vendor": "Oracle Corporation",
        "strategy": "exact",
        "passing_score": 65,
        "weights": {
            "formatting": 0.20,
            "keyword": 0.35,
            "sections": 0.15,
            "experience": 0.15,
            "education": 0.10,
            "quantification": 0.05,
        },
    },
    {
        "name": "SuccessFactors",
        "vendor": "SAP SE",
        "strategy": "exact",
        "passing_score": 65,
        "weights": {
            "formatting": 0.25,
            "keyword": 0.25,
            "sections": 0.20,
            "experience": 0.15,
            "education": 0.10,
            "quantification": 0.05,
        },
    },
    {
        "name": "iCIMS",
        "vendor": "iCIMS, Inc.",
        "strategy": "fuzzy",
        "passing_score": 60,
        "weights": {
            "formatting": 0.15,
            "keyword": 0.30,
            "sections": 0.15,
            "experience": 0.20,
            "education": 0.10,
            "quantification": 0.10,
        },
    },
    {
        "name": "Greenhouse",
        "vendor": "Greenhouse Software",
        "strategy": "semantic",
        "passing_score": 55,
        "weights": {
            "formatting": 0.10,
            "keyword": 0.25,
            "sections": 0.10,
            "experience": 0.25,
            "education": 0.10,
            "quantification": 0.20,
        },
    },
    {
        "name": "Lever",
        "vendor": "Lever",
        "strategy": "semantic",
        "passing_score": 50,
        "weights": {
            "formatting": 0.08,
            "keyword": 0.22,
            "sections": 0.10,
            "experience": 0.30,
            "education": 0.10,
            "quantification": 0.20,
        },
    },
]


TRANSFERABLE_TERMS = {
    "microsoft office",
    "google workspace",
    "word",
    "powerpoint",
    "excel",
    "pack office",
    "erp",
    "sap",
    "m3",
    "crm",
    "service client",
    "support client",
    "relations clients",
    "campagnes publicitaires",
    "documents administratifs",
    "donnees clients",
    "étiquette téléphonique",
    "etiquette telephonique",
    "sage",
    "edi",
    "referentiel",
    "référentiel",
    "centrales d achats",
    "centrales d'achats",
    "fabricants",
    "litiges",
    "penalites",
    "pénalités",
    "livraison",
    "livraisons",
    "stocks",
    "facturation",
    "demandes clients",
    "support administratif",
    "anglais",
    "cahiers des charges",
    "amélioration continue",
    "amelioration continue",
    "conditions contractuelles",
    "b to b",
    "logiciel sage",
    "stocks produits finis",
    "gestion des penalites",
    "gestion des pénalités",
    "gestion administrative",
    "organisation",
    "rigueur",
    "communication",
    "autonomie",
    "travail en equipe",
    "priorites",
    "satisfaction client",
    "portefeuille clients",
    "suivi client",
    "relation clients",
    "litige",
    "retours",
    "preparation",
    "production",
    "qualite",
    "delais",
    "approvisionnement",
    "cout",
    "consultations",
    "tarifs",
    "remises",
    "paiements",
    "encours",
    "syntheses",
    "kpi",
    "tableaux de bord",
    "analyse",
    "budget",
    "budgets",
    "reporting",
    "negociation",
    "contrats",
    "contrat",
    "affretement",
    "b2b",
    "technique",
    "techniques",
    "financieres",
    "financières",
    "saisie des commandes",
    "traitement des commandes",
    "controle des commandes",
    "contrôle des commandes",
    "suivi de facturation",
    "coordination interne",
    "coordination logistique",
    "transport international",
    "documents douaniers",
    "formalites douanieres",
    "formalités douanières",
    "commercial invoice",
    "packing list",
    "devis",
    "relance",
    "pipeline commercial",
    "prospection",
    "fidelisation",
    "fidélisation",
    "analyse des besoins",
    "gestion de portefeuille",
}

BASE_EDUCATION_ATS_TEXT = (
    "École Supérieure de Publicité ESP Paris 16. "
    "Bachelor III Chef de Projet, graduation Oct. 2025. "
    "Langues : Français, Anglais niveau C1 autonome."
)

TERM_ALIASES = {
    "microsoft office": ["word", "powerpoint", "excel", "pack office"],
    "pack office": ["word", "powerpoint", "power point", "excel", "microsoft office"],
    "microsoft powerpoint": ["powerpoint", "power point"],
    "powerpoint": ["power point"],
    "power point": ["powerpoint"],
    "google workspace": ["google workspace", "google docs", "google sheets", "gmail"],
    "service client": ["support client", "relation client", "relations clients"],
    "support client": ["service client", "relation client", "relations clients"],
    "donnees clients": ["dossiers clients", "fichiers clients", "bases de donnees clients"],
    "documents administratifs": ["documentation administrative", "dossiers administratifs"],
    "erp": ["sap", "m3", "navision", "sage", "oracle"],
    "sap": ["erp", "m3"],
    "m3": ["erp", "sap"],
    "sage": ["erp"],
    "logiciel sage": ["sage", "erp"],
    "edi": ["echanges de donnees", "echanges de donnees informatisees"],
    "referentiel": ["articles clients fabricants logistique", "base articles"],
    "référentiel": ["articles clients fabricants logistique", "base articles"],
    "centrales d achats": ["centrales", "centrales d achats"],
    "centrales d'achats": ["centrales", "centrales d achats"],
    "demandes clients": ["demandes client", "reponses clients"],
    "campagnes publicitaires": ["campagnes de publicite", "campagnes ooh", "publicite"],
    "stocks": ["gestion des stocks", "stock produits finis", "stocks produits finis"],
    "stocks produits finis": ["gestion des stocks", "stocks"],
    "ruptures de stocks": ["gestion des stocks", "stocks"],
    "pénalités": ["penalites", "gestion des penalites", "gestion des litiges"],
    "penalites": ["pénalités", "gestion des penalites", "gestion des litiges"],
    "commandes via sap": ["sap", "gestion des commandes"],
    "gestion des commandes": ["suivi des commandes", "commandes"],
    "livraison": ["livraisons", "suivi des livraisons"],
    "cahiers des charges": ["cahier des charges", "consultations"],
    "amélioration continue": ["amelioration continue", "optimisation des processus"],
    "conditions contractuelles": ["contrats", "accords commerciaux"],
    "b to b": ["b2b", "commercial b to b"],
    "travail en equipe": ["collaboration", "equipe"],
    "priorites": ["sens des priorites", "priorisation"],
    "satisfaction client": ["service client", "relation client"],
    "portefeuille clients": ["clients", "gestion de portefeuille"],
    "suivi client": ["relation client", "service client"],
    "relation clients": ["relation client", "service client"],
    "litige": ["litiges", "gestion des litiges"],
    "retours": ["retours marchandises", "retours clients"],
    "qualite": ["qualité", "controle qualite", "contrôle qualité"],
    "delais": ["délais", "livraisons"],
    "cout": ["coût", "couts", "coûts"],
    "consultations": ["cahiers des charges"],
    "tarifs": ["fichiers tarif", "prix"],
    "remises": ["conditions de remises"],
    "paiements": ["conditions de paiement"],
    "encours": ["en-cours", "validation des en-cours"],
    "syntheses": ["synthèses", "reporting"],
    "tableaux de bord": ["reporting", "kpi"],
    "budget": ["budgets", "investissements"],
    "negociation": ["négociation", "accords commerciaux"],
    "contrat": ["contrats", "conditions contractuelles"],
    "contrats": ["contrat", "conditions contractuelles"],
    "affretement": ["affrètement", "transport"],
    "saisie des commandes": ["gestion des commandes", "traitement des commandes"],
    "traitement des commandes": ["gestion des commandes", "suivi des commandes"],
    "controle des commandes": ["contrôle des commandes", "gestion des commandes"],
    "contrôle des commandes": ["controle des commandes", "gestion des commandes"],
    "suivi de facturation": ["facturation"],
    "coordination logistique": ["logistique", "transport", "livraisons"],
    "transport international": ["transport", "international", "import export"],
    "documents douaniers": ["formalites douanieres", "formalités douanières", "export"],
    "formalites douanieres": ["documents douaniers", "formalités douanières"],
    "formalités douanières": ["documents douaniers", "formalites douanieres"],
    "devis": ["offres commerciales", "propositions commerciales"],
    "relance": ["relance client", "relance commerciale"],
    "pipeline commercial": ["pipeline", "crm"],
    "fidelisation": ["fidélisation", "relation client"],
    "fidélisation": ["fidelisation", "relation client"],
    "analyse des besoins": ["besoins clients", "demandes clients"],
    "gestion de portefeuille": ["portefeuille clients"],
}


REFERENCE_ROLE_PROFILES = {
    "adv": {
        "label": "Administration des ventes / ADV",
        "signals": [
            "adv",
            "administration des ventes",
            "assistant adv",
            "gestionnaire adv",
            "assistant commercial export",
            "assistant commercial",
        ],
        "terms": [
            "administration des ventes",
            "gestion des commandes",
            "saisie des commandes",
            "traitement des commandes",
            "controle des commandes",
            "suivi des commandes",
            "facturation",
            "suivi de facturation",
            "suivi des livraisons",
            "service client",
            "relation client",
            "portefeuille clients",
            "litiges",
            "retours",
            "référentiel",
            "erp",
            "pack office",
            "excel",
            "reporting",
            "coordination interne",
            "coordination logistique",
            "stocks",
            "delais",
            "qualite",
            "b to b",
            "support administratif",
            "incoterms",
            "import",
            "export",
            "transport international",
            "documents douaniers",
        ],
    },
    "commercial": {
        "label": "Commercial / relation client",
        "signals": [
            "commercial",
            "business developer",
            "charge de clientele",
            "chargé de clientèle",
            "conseiller commercial",
            "account manager",
        ],
        "terms": [
            "relation client",
            "service client",
            "crm",
            "portefeuille clients",
            "analyse des besoins",
            "devis",
            "relance",
            "pipeline commercial",
            "prospection",
            "negociation",
            "contrats",
            "fidelisation",
            "reporting",
            "kpi",
            "pack office",
            "excel",
        ],
    },
    "support_client": {
        "label": "Support client / administratif",
        "signals": [
            "support client",
            "service client",
            "assistant administratif",
            "chargé administratif",
            "charge administratif",
            "customer service",
        ],
        "terms": [
            "demandes clients",
            "support client",
            "service client",
            "relation client",
            "documents administratifs",
            "gestion administrative",
            "litiges",
            "retours",
            "satisfaction client",
            "reporting",
            "pack office",
            "excel",
            "priorites",
            "organisation",
            "communication",
        ],
    },
    "finance": {
        "label": "Finance / analyse",
        "signals": [
            "finance",
            "analyste financier",
            "assistant financier",
            "contrôle de gestion",
            "controle de gestion",
            "budget",
        ],
        "terms": [
            "analyse",
            "budget",
            "reporting",
            "tableaux de bord",
            "kpi",
            "contrats",
            "paiements",
            "encours",
            "negociation",
            "excel",
            "pack office",
        ],
    },
    "marketing": {
        "label": "Marketing / campagnes",
        "signals": [
            "marketing",
            "campagne",
            "publicite",
            "publicitaire",
            "acquisition",
            "crm marketing",
        ],
        "terms": [
            "campagnes publicitaires",
            "crm",
            "reporting",
            "analyse",
            "budget",
            "kpi",
            "coordination interne",
            "relation clients",
            "pack office",
            "excel",
        ],
    },
    "projet": {
        "label": "Projet / coordination",
        "signals": [
            "chef de projet",
            "chargé de projet",
            "charge de projet",
            "project",
            "pmo",
            "coordination",
        ],
        "terms": [
            "coordination interne",
            "cahiers des charges",
            "amélioration continue",
            "reporting",
            "kpi",
            "priorites",
            "qualite",
            "delais",
            "communication",
            "tableaux de bord",
        ],
    },
}


def normalize_ats_text(value: str) -> str:
    text = unicodedata.normalize("NFKD", str(value or "").casefold())
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"[^a-z0-9+#./% -]+", " ", text)
    text = re.sub(r"(?<!\d)\.(?!\d)", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _contains_term(text: str, term: str) -> bool:
    terms = [normalize_ats_text(term), *TERM_ALIASES.get(normalize_ats_text(term), [])]
    for candidate in terms:
        escaped = re.escape(normalize_ats_text(candidate))
        if not escaped:
            continue
        if re.search(rf"(?<![a-z0-9+#]){escaped}(?![a-z0-9+#])", text):
            return True
    return False


def _contains_exact_term(text: str, term: str) -> bool:
    escaped = re.escape(normalize_ats_text(term))
    if not escaped:
        return False
    return bool(re.search(rf"(?<![a-z0-9+#]){escaped}(?![a-z0-9+#])", text))


def _contains_semantic_term(text: str, term: str) -> bool:
    if _contains_term(text, term):
        return True
    term_norm = normalize_ats_text(term)
    words = [word for word in term_norm.split() if len(word) >= 4 and word not in ATS_STOPWORDS]
    if not words:
        return False
    return all(word in text for word in words[:3])


def _detect_reference_role(job_text: str) -> tuple[str, dict] | tuple[None, None]:
    normalized = normalize_ats_text(job_text)
    for role, profile in REFERENCE_ROLE_PROFILES.items():
        if any(_contains_term(normalized, signal) for signal in profile["signals"]):
            return role, profile
    return None, None


def _looks_like_sparse_job_text(job_text: str, keywords: list[str]) -> bool:
    normalized = normalize_ats_text(job_text)
    words = re.findall(r"[a-z0-9+#.]{3,}", normalized)
    domain_words = [word for word in words if word not in ATS_STOPWORDS and not word.isdigit()]
    line_count = len([line for line in job_text.splitlines() if line.strip()])

    return (
        len(domain_words) < 25
        or len(keywords) < 8
        or (line_count <= 4 and len(domain_words) < 60 and len(keywords) < 12)
    )


def _dedupe_terms(terms: list[str]) -> list[str]:
    seen: set[str] = set()
    unique: list[str] = []
    for term in terms:
        key = normalize_ats_text(term)
        if not key or key in seen:
            continue
        seen.add(key)
        unique.append(term)
    return unique


def build_job_reference_context(job_text: str, keyword_limit: int = 35) -> dict:
    """Enrich sparse job ads with credible reference vocabulary for the detected role."""
    original_keywords = extract_ats_keywords(job_text, limit=keyword_limit)
    role, profile = _detect_reference_role(job_text)
    sparse = _looks_like_sparse_job_text(job_text, original_keywords)

    if not role or not profile or not sparse:
        return {
            "used": False,
            "role": role or "",
            "label": profile.get("label", "") if profile else "",
            "reason": "",
            "terms": [],
            "original_keyword_count": len(original_keywords),
            "enriched_text": job_text,
        }

    terms = _dedupe_terms(profile["terms"])[:32]
    enriched_text = (
        f"{job_text}\n\n"
        f"Vocabulaire métier de référence pour une offre courte "
        f"({profile['label']}) : {', '.join(terms)}."
    )
    return {
        "used": True,
        "role": role,
        "label": profile["label"],
        "reason": "offre courte ou peu détaillée, enrichie avec un vocabulaire métier plausible",
        "terms": terms,
        "original_keyword_count": len(original_keywords),
        "enriched_text": enriched_text,
    }


def _extract_phrases(text: str) -> list[str]:
    phrases: list[str] = []

    for raw_line in text.splitlines():
        normalized = normalize_ats_text(raw_line)
        if not normalized:
            continue
        for size in (3, 2):
            pattern = r"[a-z0-9+#.]{3,}(?:\s+[a-z0-9+#.]{3,}){" + str(size - 1) + r"}"
            for match in re.findall(pattern, normalized):
                words = match.split()
                if any(word in ATS_STOPWORDS for word in words):
                    continue
                if not _looks_like_domain_phrase(" ".join(words)):
                    continue
                if len(" ".join(words)) <= 45:
                    phrases.append(" ".join(words))

    return phrases


def _looks_like_domain_phrase(phrase: str) -> bool:
    key = normalize_ats_text(phrase)
    if key in IMPORTANT_TERMS:
        return True
    return any(" " in term and term in key for term in IMPORTANT_TERMS)


def _is_useful_keyword(candidate: str) -> bool:
    key = normalize_ats_text(candidate)
    if not key or key in ATS_STOPWORDS:
        return False
    if key in IMPORTANT_TERMS:
        return True
    words = key.split()
    if any(word in ATS_STOPWORDS for word in words):
        return False
    if len(words) > 1 and not any(term in key for term in IMPORTANT_TERMS):
        return False
    if len(words) == 1 and key not in IMPORTANT_TERMS and key not in TRANSFERABLE_TERMS:
        return False
    if len(words) == 1 and len(key) < 4 and key not in {"adv", "crm", "sap", "m3", "edi"}:
        return False
    noisy_fragments = [
        "profil", "salaire", "opportunite", "equipe dynamique", "non obligatoire",
        "votre", "responsabilites", "cdd", "nbsp", "transport quotidien",
    ]
    noisy_combinations = [
        "powerpoint excel google",
        "word powerpoint",
        "excel google",
        "service client customer",
        "microsoft office word",
    ]
    if key in noisy_combinations:
        return False
    return not any(fragment in key for fragment in noisy_fragments)


def extract_ats_keywords(job_text: str, limit: int = 35) -> list[str]:
    normalized = normalize_ats_text(job_text)
    candidates: list[str] = []

    exact_terms = []
    for term in IMPORTANT_TERMS:
        escaped = re.escape(normalize_ats_text(term))
        if not escaped:
            continue
        match = re.search(rf"(?<![a-z0-9+#]){escaped}(?![a-z0-9+#])", normalized)
        if match:
            exact_terms.append((match.start(), -len(normalize_ats_text(term)), term))

    candidates.extend(term for _, _, term in sorted(exact_terms))

    candidates.extend(_extract_phrases(job_text))

    words = [
        word
        for word in re.findall(r"[a-z0-9+#.]{3,}", normalized)
        if word not in ATS_STOPWORDS and not word.isdigit()
    ]
    candidates.extend(word for word, _ in Counter(words).most_common(80))

    seen: set[str] = set()
    unique: list[str] = []
    for candidate in candidates:
        key = normalize_ats_text(candidate)
        if not _is_useful_keyword(candidate) or key in seen:
            continue
        seen.add(key)
        unique.append(candidate)
        if len(unique) >= limit:
            break

    return unique


def _score_keyword_strategy(cv_norm: str, keywords: list[str], strategy: str) -> dict:
    matched = []
    synonym_matched = []
    missing = []

    for keyword in keywords:
        if strategy == "exact":
            if _contains_exact_term(cv_norm, keyword):
                matched.append(keyword)
            else:
                missing.append(keyword)
            continue

        if _contains_exact_term(cv_norm, keyword):
            matched.append(keyword)
        elif _contains_term(cv_norm, keyword):
            synonym_matched.append(keyword)
        elif strategy == "semantic" and _contains_semantic_term(cv_norm, keyword):
            synonym_matched.append(keyword)
        else:
            missing.append(keyword)

    total = max(len(keywords), 1)
    effective = len(matched) + len(synonym_matched) * 0.8
    return {
        "score": round(min(100, (effective / total) * 100)),
        "matched": matched,
        "missing": missing,
        "synonym_matched": synonym_matched,
    }


def _score_formatting(cv_text: str) -> dict:
    words = re.findall(r"\b[\wÀ-ÿ+#.-]+\b", cv_text)
    word_count = len(words)
    deductions = 0
    issues = []

    if word_count < 150:
        deductions += 8
        issues.append("CV potentiellement trop court pour certains parseurs ATS")
    elif word_count > 1500:
        deductions += 3
        issues.append("CV potentiellement trop long")

    special_ratio = len(re.findall(r"[^\w\s.,;:!?@#$%&*()\-+=/\\'\"À-ÿ]", cv_text)) / max(
        len(cv_text), 1
    )
    if special_ratio > 0.06:
        deductions += 6
        issues.append("Trop de caractères spéciaux détectés")

    return {"score": max(0, min(100, 100 - deductions)), "issues": issues, "word_count": word_count}


def _score_sections(cv_norm: str) -> dict:
    aliases = {
        "contact": ["contact", "email", "telephone", "phone", "linkedin"],
        "experience": ["experience", "experiences", "expériences", "blurry", "orion"],
        "education": ["education", "éducation", "formation", "bachelor", "ecole", "école"],
        "skills": ["skills", "competences", "compétences", "competences techniques"],
    }
    present = [
        section
        for section, terms in aliases.items()
        if any(normalize_ats_text(term) in cv_norm for term in terms)
    ]
    if "contact" not in present and (
        "@" in cv_norm or re.search(r"\b(?:\+33|0)\s?\d(?:[\s.-]?\d{2}){4}\b", cv_norm)
    ):
        present.append("contact")
    missing = [section for section in aliases if section not in present]
    return {"score": round((len(present) / len(aliases)) * 100), "present": present, "missing": missing}


ACTION_VERBS = {
    "administre", "administrer", "analyse", "analyser", "analysé", "assure", "assurer",
    "assuré", "coordonne", "coordonner", "coordonné", "contribue", "contribuer",
    "contribué", "controle", "controler", "contrôler", "contrôlé", "developpe",
    "developper", "développer", "développé", "gere", "gerer", "gérer", "géré",
    "pilote", "piloter", "piloté", "produit", "produire", "realise", "realiser",
    "réaliser", "réalisé", "structure", "structurer", "structuré", "suis", "suivre",
    "suivi", "supervise", "superviser", "supervisé", "traite", "traiter", "traité",
    "negocie", "negocier", "négocier", "négocié",
    "administration", "analyse", "coordination", "contribution", "controle",
    "contrôle", "developpement", "développement", "fiabilisation", "gestion",
    "optimisation", "pilotage", "structuration", "suivi", "traitement",
    "negociation", "négociation",
    "managed", "coordinated", "analyzed", "delivered", "improved", "led", "optimized",
}


def _experience_lines(cv_text: str) -> list[str]:
    lines = []
    ignored = {
        "education", "éducation", "certifications", "experiences", "expériences",
        "competences et interets", "compétences et intérêts", "langues",
    }
    for line in cv_text.splitlines():
        line = line.strip(" -*•\t")
        line_norm = normalize_ats_text(line)
        if line_norm in ignored:
            continue
        first = line_norm.split(" ")[0] if line_norm else ""
        has_action_signal = first in ACTION_VERBS
        has_sentence_signal = len(line.split()) >= 7 and any(
            marker in line_norm
            for marker in [
                "gestion", "coordination", "suivi", "reporting", "commandes",
                "clients", "flux", "budget", "qualite", "delais", "contrats",
            ]
        )
        if len(line) >= 35 and (has_action_signal or has_sentence_signal):
            lines.append(line)
    if lines:
        return lines
    return [part.strip() for part in re.split(r"(?<=[.!?])\s+", cv_text) if len(part.strip()) >= 35]


def _score_experience(cv_text: str) -> dict:
    bullets = _experience_lines(cv_text)
    if not bullets:
        return {
            "score": 0,
            "quantified_bullets": 0,
            "total_bullets": 0,
            "action_verb_count": 0,
        }

    quantified = 0
    action_verbs = 0
    for bullet in bullets:
        if re.search(r"\d+%|€\s?\d|[\d,]+\s?(?:€|k€)|\d+\s*(?:x|fois)|\d+\s*(?:pays|clients|produits|commandes)", bullet, re.I):
            quantified += 1
        first = normalize_ats_text(bullet).split(" ")[0]
        if first in ACTION_VERBS:
            action_verbs += 1

    total = len(bullets)
    quant_score = min(1, (quantified / total) / 0.4) * 40
    action_score = min(1, (action_verbs / total) / 0.7) * 30
    bullet_score = 30 if total >= 8 else 25 if total >= 5 else 20 if total >= 3 else 10
    return {
        "score": round(min(100, quant_score + action_score + bullet_score)),
        "quantified_bullets": quantified,
        "total_bullets": total,
        "action_verb_count": action_verbs,
    }


def _score_education(cv_norm: str) -> dict:
    score = 20
    notes = []
    if any(term in cv_norm for term in ["bachelor", "bac+2", "bac 2", "master", "licence"]):
        score += 35
    else:
        notes.append("Diplôme peu visible")
    if any(term in cv_norm for term in ["ecole", "école", "universite", "université", "esp"]):
        score += 25
    if re.search(r"\b(19|20)\d{2}\b", cv_norm):
        score += 20
    return {"score": min(100, score), "notes": notes}


def _score_platforms(cv_text: str, job_text: str, keywords: list[str]) -> list[dict]:
    cv_norm = normalize_ats_text(cv_text)
    formatting = _score_formatting(cv_text)
    sections = _score_sections(cv_norm)
    experience = _score_experience(cv_text)
    education = _score_education(cv_norm)
    quantification = (
        round((experience["quantified_bullets"] / experience["total_bullets"]) * 100)
        if experience["total_bullets"]
        else 0
    )

    results = []
    for profile in ATS_PROFILES:
        keyword = _score_keyword_strategy(cv_norm, keywords, profile["strategy"])
        weights = profile["weights"]
        weighted = (
            formatting["score"] * weights["formatting"]
            + keyword["score"] * weights["keyword"]
            + sections["score"] * weights["sections"]
            + experience["score"] * weights["experience"]
            + education["score"] * weights["education"]
            + quantification * weights["quantification"]
        )
        overall = max(0, min(100, round(weighted)))
        suggestions = []
        if keyword["missing"]:
            suggestions.append(
                f"{profile['name']} : ajouter/reformuler les mots-clés manquants : "
                + ", ".join(keyword["missing"][:5])
            )
        for issue in formatting["issues"][:2]:
            suggestions.append(f"{profile['name']} : {issue}")
        if sections["missing"]:
            suggestions.append(f"{profile['name']} : sections à rendre plus visibles : {', '.join(sections['missing'])}")

        results.append(
            {
                "system": profile["name"],
                "vendor": profile["vendor"],
                "overall_score": overall,
                "passes_filter": overall >= profile["passing_score"],
                "keyword_strategy": profile["strategy"],
                "breakdown": {
                    "formatting": formatting["score"],
                    "keyword_match": keyword["score"],
                    "sections": sections["score"],
                    "experience": experience["score"],
                    "education": education["score"],
                    "quantification": quantification,
                },
                "matched_keywords": keyword["matched"][:20],
                "missing_keywords": keyword["missing"][:20],
                "synonym_matched": keyword["synonym_matched"][:20],
                "suggestions": suggestions[:4],
            }
        )
    return results


def analyze_ats_match(
    cv_text: str,
    job_text: str,
    keyword_limit: int = 35,
    evidence_text: str = "",
) -> dict:
    job_reference_context = build_job_reference_context(job_text, keyword_limit=keyword_limit)
    scoring_job_text = job_reference_context.get("enriched_text") or job_text
    keywords = extract_ats_keywords(scoring_job_text, limit=keyword_limit)
    cv_norm = normalize_ats_text(cv_text)
    evidence_norm = normalize_ats_text(evidence_text or cv_text)

    matched = [keyword for keyword in keywords if _contains_term(cv_norm, keyword)]
    missing = [keyword for keyword in keywords if keyword not in matched]
    priority_missing_candidates = [
        keyword
        for keyword in missing
        if keyword in IMPORTANT_TERMS or len(keyword.split()) > 1
    ]
    injectable = [
        keyword
        for keyword in priority_missing_candidates
        if _contains_term(evidence_norm, keyword)
    ][:10]
    transferable = [
        keyword
        for keyword in priority_missing_candidates
        if keyword not in injectable and _is_transferable_keyword(keyword)
    ][:10]
    priority_missing = priority_missing_candidates[:10]

    platform_scores = _score_platforms(cv_text, scoring_job_text, keywords)
    platform_average = round(
        sum(result["overall_score"] for result in platform_scores) / max(len(platform_scores), 1)
    )

    suggestions = [
        f"Ajouter ou reformuler un bullet autour de : {keyword}"
        for keyword in (injectable + transferable)[:8]
    ]
    if job_reference_context.get("used"):
        reference_terms = ", ".join(job_reference_context.get("terms", [])[:8])
        suggestions.insert(
            0,
            "Offre peu détaillée : intégrer le vocabulaire métier de référence dans les expériences : "
            + reference_terms,
        )
    for platform in platform_scores:
        for suggestion in platform["suggestions"]:
            if suggestion not in suggestions:
                suggestions.append(suggestion)
            if len(suggestions) >= 10:
                break
        if len(suggestions) >= 10:
            break

    return asdict(
        AtsAnalysis(
            score=max(0, min(100, platform_average)),
            matched_keywords=matched[:20],
            missing_keywords=missing[:20],
            priority_keywords=priority_missing,
            injectable_keywords=injectable,
            transferable_keywords=transferable,
            suggestions=suggestions,
            platform_scores=platform_scores,
            score_source="sunnypatell/ats-screener platform-profile model adapted to French ADV keywords",
            job_reference_enrichment={
                key: value
                for key, value in job_reference_context.items()
                if key != "enriched_text"
            },
        )
    )


def _is_transferable_keyword(keyword: str) -> bool:
    key = normalize_ats_text(keyword)
    if key in TRANSFERABLE_TERMS:
        return True
    return any(term in key for term in TRANSFERABLE_TERMS)


def build_resume_ats_text(
    *,
    experiences: list[dict],
    leadership: list[dict],
    certifications: list[str],
    technical_skills: list[str],
) -> str:
    parts: list[str] = []
    parts.extend(["Contact", "Expériences", "Éducation", "Compétences"])
    parts.append(BASE_EDUCATION_ATS_TEXT)

    for experience in experiences:
        parts.extend(
            [
                experience.get("company", ""),
                experience.get("position", ""),
                " ".join(experience.get("bullets", [])),
            ]
        )
    for item in leadership:
        parts.extend([item.get("org", ""), item.get("role", ""), " ".join(item.get("bullets", []))])
    parts.extend(certifications)
    parts.extend(technical_skills)

    return "\n".join(part for part in parts if part)
