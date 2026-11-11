"""Reformulation nominale prudente des bullets de CV en français."""

from __future__ import annotations

from copy import deepcopy
import re


# Le premier groupe est une forme verbale réellement observée en tête de
# bullet. Le deuxième est le nom d'action et le troisième sa préposition.
NOMINAL_RULES: tuple[tuple[str, str, str], ...] = (
    (r"mis(?:e|es|s)? en place", "Mise en place", "de"),
    (r"cr[ée][ée](?:e|s|es)?", "Création", "de"),
    (r"coordonn[ée](?:e|s|es)?", "Coordination", "de"),
    (r"g[ée]r[ée](?:e|s|es)?", "Gestion", "de"),
    (r"pilot[ée](?:e|s|es)?", "Pilotage", "de"),
    (r"n[ée]goci[ée](?:e|s|es)?", "Négociation", "de"),
    (r"r[ée]alis[ée](?:e|s|es)?", "Réalisation", "de"),
    (r"analys[ée](?:e|s|es)?", "Analyse", "de"),
    (r"structur[ée](?:e|s|es)?", "Structuration", "de"),
    (r"optimis[ée](?:e|s|es)?", "Optimisation", "de"),
    (r"trait[ée](?:e|s|es)?", "Traitement", "de"),
    (r"d[ée]velopp[ée](?:e|s|es)?", "Développement", "de"),
    (r"d[ée]ploy[ée](?:e|s|es)?", "Déploiement", "de"),
    (r"supervis[ée](?:e|s|es)?", "Supervision", "de"),
    (r"contr[oô]l[ée](?:e|s|es)?", "Contrôle", "de"),
    (r"pr[ée]par[ée](?:e|s|es)?", "Préparation", "de"),
    (r"organis[ée](?:e|s|es)?", "Organisation", "de"),
    (r"planifi[ée](?:e|s|es)?", "Planification", "de"),
    (r"automatis[ée](?:e|s|es)?", "Automatisation", "de"),
    (r"administr[ée](?:e|s|es)?", "Administration", "de"),
    (r"factur[ée](?:e|s|es)?", "Facturation", "de"),
    (r"relanc[ée](?:e|s|es)?", "Relance", "de"),
    (r"ordonn[ée](?:e|s|es)?", "Ordonnancement", "de"),
    (r"particip[ée](?:e|s|es)?", "Participation", "à"),
    (r"contribu[ée](?:e|s|es)?", "Contribution", "à"),
)


def _with_de(noun: str, remainder: str) -> str:
    substitutions = (
        (r"^d['’]\s*", "d’"),
        (r"^de\s+l['’]\s*", "de l’"),
        (r"^de\s+la\s+", "de la "),
        (r"^de\s+le\s+", "du "),
        (r"^de\s+les\s+", "des "),
        (r"^de\s+", "de "),
        (r"^un\s+", "d’un "),
        (r"^une\s+", "d’une "),
        (r"^des\s+", "de "),
        (r"^le\s+", "du "),
        (r"^la\s+", "de la "),
        (r"^l['’]\s*", "de l’"),
        (r"^les\s+", "des "),
    )
    for pattern, replacement in substitutions:
        if re.match(pattern, remainder, flags=re.IGNORECASE):
            return noun + " " + re.sub(pattern, replacement, remainder, count=1, flags=re.IGNORECASE)
    if not remainder:
        return noun
    return f"{noun} de {remainder}"


def _with_a(noun: str, remainder: str) -> str:
    if re.match(r"^(?:à|a)\s+", remainder, flags=re.IGNORECASE):
        return noun + " " + re.sub(r"^(?:à|a)\s+", "à ", remainder, count=1, flags=re.IGNORECASE)
    if re.match(r"^au\s+", remainder, flags=re.IGNORECASE):
        return f"{noun} {remainder}"
    if re.match(r"^aux\s+", remainder, flags=re.IGNORECASE):
        return f"{noun} {remainder}"
    return noun if not remainder else f"{noun} à {remainder}"


def nominalize_french_bullet(value: str) -> str:
    """Nominalise un verbe de tête connu et laisse tout autre texte intact."""

    original = str(value or "").strip().lstrip("•*- ").strip()
    if not original:
        return ""
    clauses = re.split(r"(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ])", original)
    if len(clauses) > 1:
        return " ".join(_nominalize_first_clause(clause) for clause in clauses)
    return _nominalize_first_clause(original)


def _nominalize_first_clause(original: str) -> str:
    for verb_pattern, noun, preposition in NOMINAL_RULES:
        match = re.match(rf"^(?:j['’]\s*)?{verb_pattern}\b[,:]?\s*", original, flags=re.IGNORECASE)
        if not match:
            continue
        remainder = original[match.end() :].strip()
        return _with_a(noun, remainder) if preposition == "à" else _with_de(noun, remainder)
    return original


def nominalize_french_experiences(experiences: list[dict]) -> list[dict]:
    normalized = deepcopy(experiences)
    for experience in normalized:
        experience["bullets"] = [
            nominalize_french_bullet(bullet)
            for bullet in experience.get("bullets", [])
            if str(bullet or "").strip()
        ]
    return normalized


__all__ = ["NOMINAL_RULES", "nominalize_french_bullet", "nominalize_french_experiences"]
