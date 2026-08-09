from pathlib import Path
from datetime import datetime
import json
import math
import pandas as pd


def safe_str(value):
    """
    Convertit proprement une valeur Excel / pandas / None en string exploitable.
    """
    if value is None:
        return ""

    try:
        if pd.isna(value):
            return ""
    except Exception:
        pass

    text = str(value).strip()

    if text.lower() in ["nan", "none", "nat"]:
        return ""

    return text


def safe_number(value, default=0):
    """
    Convertit proprement un score en nombre.
    """
    if value is None:
        return default

    try:
        if pd.isna(value):
            return default
    except Exception:
        pass

    try:
        number = float(value)
        if math.isnan(number):
            return default
        return round(number, 2)
    except Exception:
        return default


def get_row_value(row, possible_columns, default=""):
    """
    Récupère une valeur depuis une ligne pandas, même si les colonnes ont des noms variables.
    """
    if row is None:
        return default

    if not hasattr(row, "index"):
        return default

    index_lower = {str(col).lower().strip(): col for col in row.index}

    for col in possible_columns:
        actual_col = index_lower.get(str(col).lower().strip())
        if actual_col is not None:
            value = safe_str(row[actual_col])
            if value:
                return value

    return default


def split_tags(value):
    """
    Transforme une cellule Excel avec tags séparés en liste propre.
    """
    text = safe_str(value)

    if not text:
        return []

    separators = ["|", ";", ",", "\n"]

    parts = [text]

    for sep in separators:
        new_parts = []
        for part in parts:
            new_parts.extend(part.split(sep))
        parts = new_parts

    cleaned = []
    for part in parts:
        item = part.strip()
        if item and item not in cleaned:
            cleaned.append(item)

    return cleaned


def row_to_experience_report(row):
    """
    Convertit une expérience sélectionnée en objet JSON de diagnostic.
    """
    company = get_row_value(
        row,
        ["company", "organisation", "organization", "entreprise", "company_name"],
    )

    position = get_row_value(
        row,
        ["position_title", "job_title", "title", "role", "poste"],
    )

    location = get_row_value(
        row,
        ["location", "city", "city_state", "lieu", "localisation"],
    )

    dates = get_row_value(
        row,
        ["dates", "year", "period", "période", "date_start", "date_end"],
    )

    score = safe_number(get_row_value(row, ["_score", "score", "matching_score"], 0))

    reasons = []

    for col in [
        "industry_tags",
        "job_family_tags",
        "skills_verified",
        "skills_transferable",
        "tools_verified",
        "kpis_verified",
    ]:
        value = get_row_value(row, [col])
        if value:
            reasons.extend(split_tags(value))

    return {
        "company": company,
        "position_title": position,
        "location": location,
        "dates": dates,
        "score": score,
        "reason_tags": reasons[:20],
    }


def build_warnings(
    parsed_job,
    selected_experiences,
    selected_certifications,
    technical_skills,
    output_path,
):
    """
    Crée des alertes simples pour comprendre ce qui manque dans la génération.
    """
    warnings = []

    company = safe_str(parsed_job.get("company", ""))
    job_title = safe_str(parsed_job.get("job_title", ""))

    if not company or company.lower() == "entreprise":
        warnings.append("Entreprise non détectée clairement. Fallback utilisé.")

    if not job_title or job_title.lower() in ["poste cible", ""]:
        warnings.append("Intitulé de poste non détecté clairement. Fallback utilisé.")

    if not selected_experiences:
        warnings.append("Aucune expérience sélectionnée.")

    if len(selected_experiences) > 3:
        warnings.append("Plus de 3 expériences sélectionnées. Vérifier la règle max_experiences.")

    if len(selected_certifications) > 2:
        warnings.append("Plus de 2 certifications sélectionnées. Vérifier la règle max_certifications.")

    if not technical_skills:
        warnings.append("Aucune compétence technique sélectionnée.")

    if len(" | ".join(technical_skills)) > 320:
        warnings.append("Le budget de caractères des compétences techniques est dépassé.")

    if output_path and not Path(output_path).exists():
        warnings.append("Le chemin de sortie DOCX est indiqué mais le fichier n'existe pas.")

    return warnings


def write_run_report(
    parsed_job,
    selected_experiences,
    selected_certifications,
    technical_skills,
    output_path,
    output_dir,
    mode="local",
    cv_headline="",
):
    """
    Écrit le diagnostic de génération dans :
    data/output/last_run_report.json
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    report_path = output_dir / "last_run_report.json"

    report = {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "mode": mode,
        "company_detected": safe_str(parsed_job.get("company", "")),
        "job_title_detected": safe_str(parsed_job.get("job_title", "")),
        "cv_headline": safe_str(cv_headline),
        "keywords_detected": parsed_job.get("keywords", [])[:50],
        "output_docx": str(output_path) if output_path else "",
        "selected_experiences": [
            row_to_experience_report(row) for row in selected_experiences
        ],
        "selected_certifications": [
            safe_str(cert) for cert in selected_certifications
        ],
        "selected_technical_skills": [
            safe_str(skill) for skill in technical_skills
        ],
        "warnings": build_warnings(
            parsed_job=parsed_job,
            selected_experiences=selected_experiences,
            selected_certifications=selected_certifications,
            technical_skills=technical_skills,
            output_path=output_path,
        ),
    }

    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return report_path

