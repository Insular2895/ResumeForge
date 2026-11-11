"""Imports clients sûrs pour le tracker et les compétences validées."""

from __future__ import annotations

from collections import Counter
from datetime import date, datetime, timedelta
from pathlib import Path
import csv
import hashlib
import json
import os
import re
import secrets
import shutil
import tempfile
import unicodedata
from urllib.parse import urlparse

from openpyxl import Workbook, load_workbook
from openpyxl.worksheet.datavalidation import DataValidation

from src.application.application_tracker import TRACKER_FIELDS, _migrate_tracker_rows
from src.config import APPLICATION_TRACKER_CSV_PATH, MASTER_PROFILE_PATH, OUTPUT_DIR


MAX_UPLOAD_BYTES = 10 * 1024 * 1024
MAX_IMPORT_ROWS = 5_000
PREVIEW_TTL = timedelta(hours=2)
STAGING_DIR = OUTPUT_DIR / "web_imports"
EXPORT_DIR = OUTPUT_DIR / "web_exports"
BACKUP_DIR = OUTPUT_DIR / "backups" / "client_imports"

TRACKER_REQUIRED_FIELDS = ("company", "job_title")
TRACKER_ALIASES = {
    "ats_match_percent": {"ats_match_percent", "ats", "score_ats", "compatibilite_ats"},
    "timestamp": {"timestamp", "date", "date_candidature", "created_at", "date_creation"},
    "company": {"company", "entreprise", "societe", "organisation", "organization"},
    "job_title": {"job_title", "poste", "intitule", "intitule_poste", "titre_poste"},
    "salary": {"salary", "salaire", "remuneration"},
    "location": {"location", "lieu", "localisation", "ville"},
    "job_url": {"job_url", "url", "lien", "lien_offre", "url_offre"},
    "job_family": {"job_family", "famille_metier", "metier"},
    "cv_docx_path": {"cv_docx_path", "cv_docx", "chemin_cv", "cv"},
    "lm_docx_path": {"lm_docx_path", "lm_docx", "chemin_lm", "lettre_motivation"},
    "score": {"score", "score_global"},
    "selected_experiences": {"selected_experiences", "experiences_selectionnees"},
    "selected_certifications": {"selected_certifications", "certifications_selectionnees"},
    "selected_technical_skills": {
        "selected_technical_skills",
        "competences",
        "competences_selectionnees",
    },
    "validation_status": {"validation_status", "statut_validation"},
    "tracker_update_status": {"tracker_update_status", "statut_import"},
    "status": {"status", "statut", "etat", "etape"},
    "priority": {"priority", "priorite"},
    "notes": {"notes", "note", "commentaire", "commentaires"},
    "updated_at": {"updated_at", "date_mise_a_jour", "maj"},
}

SKILL_IMPORT_FIELDS = (
    "skill_name",
    "category",
    "experience_id",
    "evidence_text",
    "level",
    "aliases",
    "notes",
)
SKILL_STORAGE_FIELDS = (
    "skill_id",
    *SKILL_IMPORT_FIELDS,
    "created_at",
    "source",
    "source_file",
    "validation_status",
    "skill_status",
    "content_hash",
)
SKILL_ALIASES = {
    "skill_name": {"skill_name", "competence", "nom_competence", "outil"},
    "category": {"category", "categorie", "type"},
    "experience_id": {"experience_id", "id_experience", "experience"},
    "evidence_text": {"evidence_text", "preuve", "preuve_factuelle", "fait_verifie", "description"},
    "level": {"level", "niveau"},
    "aliases": {"aliases", "alias", "synonymes"},
    "notes": {"notes", "note", "commentaire"},
}
SKILL_CATEGORIES = {
    "outil": "tool",
    "tool": "tool",
    "competence": "skill",
    "skill": "skill",
    "kpi": "kpi",
    "connaissance": "knowledge",
    "knowledge": "knowledge",
}
SKILL_LEVELS = {
    "": "",
    "debutant": "basic",
    "basic": "basic",
    "intermediaire": "intermediate",
    "intermediate": "intermediate",
    "autonome": "proficient",
    "proficient": "proficient",
    "avance": "advanced",
    "advanced": "advanced",
    "expert": "expert",
}


def _clean(value) -> str:
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.isoformat(timespec="seconds")
    if isinstance(value, date):
        return value.isoformat()
    text = str(value).strip()
    return "" if text.casefold() in {"none", "nan", "nat"} else text


def _normalized(value: str) -> str:
    text = unicodedata.normalize("NFKD", _clean(value))
    text = "".join(character for character in text if not unicodedata.combining(character))
    text = re.sub(r"[^a-zA-Z0-9]+", "_", text.casefold()).strip("_")
    return text


def _safe_filename(value: str) -> str:
    name = Path(value or "import").name
    return re.sub(r"[^A-Za-z0-9._-]+", "_", name)[:120] or "import"


def _validate_source(path: Path, allowed_extensions: tuple[str, ...]) -> None:
    if not path.exists() or not path.is_file():
        raise ValueError("Fichier importé introuvable.")
    if path.suffix.casefold() not in allowed_extensions:
        raise ValueError(f"Format invalide. Formats acceptés : {', '.join(allowed_extensions)}")
    size = path.stat().st_size
    if size == 0:
        raise ValueError("Le fichier importé est vide.")
    if size > MAX_UPLOAD_BYTES:
        raise ValueError("Le fichier dépasse la limite de 10 Mo.")


def _sheet_for_import(workbook, preferred_names: tuple[str, ...]):
    normalized = {_normalized(sheet.title): sheet for sheet in workbook.worksheets}
    for name in preferred_names:
        if _normalized(name) in normalized:
            return normalized[_normalized(name)]
    return workbook.active


def _read_tabular(path: Path, *, preferred_sheets: tuple[str, ...]) -> tuple[list[str], list[list[str]], str]:
    if path.suffix.casefold() == ".csv":
        try:
            with path.open("r", encoding="utf-8-sig", newline="") as source:
                sample = source.read(4096)
                source.seek(0)
                try:
                    dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
                except csv.Error:
                    dialect = csv.excel
                values = []
                for index, row in enumerate(csv.reader(source, dialect)):
                    if index > MAX_IMPORT_ROWS + 1:
                        raise ValueError(f"L'import est limité à {MAX_IMPORT_ROWS} lignes.")
                    values.append(row)
        except UnicodeDecodeError as exc:
            raise ValueError("Le CSV doit être encodé en UTF-8. Sinon, exporte-le au format .xlsx.") from exc
        sheet_name = "CSV"
    else:
        try:
            workbook = load_workbook(path, read_only=True, data_only=True)
        except Exception as exc:
            raise ValueError("Le classeur Excel est invalide ou illisible.") from exc
        try:
            sheet = _sheet_for_import(workbook, preferred_sheets)
            values = []
            for index, row in enumerate(sheet.iter_rows(values_only=True)):
                if index > MAX_IMPORT_ROWS + 1:
                    raise ValueError(f"L'import est limité à {MAX_IMPORT_ROWS} lignes.")
                values.append([_clean(cell) for cell in row])
            sheet_name = sheet.title
        finally:
            workbook.close()

    values = [row for row in values if any(_clean(cell) for cell in row)]
    if not values:
        raise ValueError("Le fichier ne contient aucune ligne exploitable.")
    if len(values) - 1 > MAX_IMPORT_ROWS:
        raise ValueError(f"L'import est limité à {MAX_IMPORT_ROWS} lignes.")
    headers = [_normalized(value) for value in values[0]]
    if not any(headers):
        raise ValueError("La première ligne doit contenir les noms de colonnes.")
    return headers, [[_clean(cell) for cell in row] for row in values[1:]], sheet_name


def _column_mapping(headers: list[str], aliases: dict[str, set[str]]) -> tuple[dict[str, int], list[str]]:
    mapping: dict[str, int] = {}
    recognized_indexes: set[int] = set()
    for canonical, accepted in aliases.items():
        for index, header in enumerate(headers):
            if header in accepted:
                mapping.setdefault(canonical, index)
                recognized_indexes.add(index)
                break
    ignored = [header for index, header in enumerate(headers) if header and index not in recognized_indexes]
    return mapping, ignored


def _row_value(row: list[str], mapping: dict[str, int], field: str) -> str:
    index = mapping.get(field)
    return _clean(row[index]) if index is not None and index < len(row) else ""


def _cleanup_staging(staging_dir: Path) -> None:
    if not staging_dir.exists():
        return
    cutoff = datetime.now().timestamp() - PREVIEW_TTL.total_seconds()
    for candidate in staging_dir.glob("*.json"):
        try:
            if candidate.stat().st_mtime < cutoff:
                candidate.unlink(missing_ok=True)
        except OSError:
            continue


def _stage(kind: str, payload: dict, staging_dir: Path = STAGING_DIR) -> str:
    staging_dir.mkdir(parents=True, exist_ok=True)
    _cleanup_staging(staging_dir)
    token = secrets.token_urlsafe(24)
    document = {
        "kind": kind,
        "created_at": datetime.now().isoformat(timespec="seconds"),
        **payload,
    }
    target = staging_dir / f"{kind}_{token}.json"
    target.write_text(json.dumps(document, ensure_ascii=False, indent=2), encoding="utf-8")
    return token


def _unstage(kind: str, token: str, staging_dir: Path = STAGING_DIR) -> tuple[dict, Path]:
    if not re.fullmatch(r"[A-Za-z0-9_-]{20,80}", token or ""):
        raise ValueError("Aperçu d'import invalide.")
    target = staging_dir / f"{kind}_{token}.json"
    if not target.exists():
        raise ValueError("Cet aperçu d'import n'existe plus. Recommence l'import.")
    try:
        payload = json.loads(target.read_text(encoding="utf-8"))
        created_at = datetime.fromisoformat(payload["created_at"])
    except (KeyError, ValueError, json.JSONDecodeError) as exc:
        raise ValueError("Aperçu d'import invalide.") from exc
    if datetime.now() - created_at > PREVIEW_TTL:
        target.unlink(missing_ok=True)
        raise ValueError("Cet aperçu a expiré. Recommence l'import.")
    if payload.get("kind") != kind:
        raise ValueError("Type d'import invalide.")
    return payload, target


def _tracker_key(row: dict) -> tuple[str, ...]:
    url = _normalized(row.get("job_url", ""))
    if url:
        return ("url", url)
    return (
        "job",
        _normalized(row.get("company", "")),
        _normalized(row.get("job_title", "")),
    )


def _safe_http_url(value: str) -> str:
    url = _clean(value)
    try:
        parsed = urlparse(url)
    except ValueError:
        return ""
    return url if parsed.scheme in {"http", "https"} and bool(parsed.netloc) else ""


def _normalized_tracker_row(row: dict) -> dict[str, str]:
    return {field: _clean(row.get(field, "")) for field in TRACKER_FIELDS}


def _read_tracker_rows(path: str | Path = APPLICATION_TRACKER_CSV_PATH) -> list[dict[str, str]]:
    tracker_path = Path(path)
    if not tracker_path.exists() or tracker_path.stat().st_size == 0:
        return []
    with tracker_path.open("r", encoding="utf-8", newline="") as source:
        values = list(csv.reader(source))
    migrated = _migrate_tracker_rows(values)
    normalized_values = migrated if migrated is not None else values
    if not normalized_values:
        return []
    headers = normalized_values[0]
    return [
        _normalized_tracker_row(dict(zip(headers, row)))
        for row in normalized_values[1:]
        if any(_clean(value) for value in row)
    ]


def prepare_tracker_import(
    source: str | Path,
    *,
    source_filename: str = "",
    staging_dir: Path = STAGING_DIR,
) -> dict:
    path = Path(source)
    _validate_source(path, (".xlsx", ".csv"))
    headers, rows, sheet_name = _read_tabular(
        path,
        preferred_sheets=("applications", "applications_tracker", "candidatures", "suivi"),
    )
    mapping, ignored = _column_mapping(headers, TRACKER_ALIASES)
    missing_columns = [field for field in TRACKER_REQUIRED_FIELDS if field not in mapping]
    if missing_columns:
        labels = ", ".join(missing_columns)
        raise ValueError(f"Colonnes obligatoires manquantes : {labels}.")

    imported: list[dict[str, str]] = []
    errors: list[str] = []
    now = datetime.now().isoformat(timespec="seconds")
    for line_number, values in enumerate(rows, start=2):
        if not any(values):
            continue
        item = {field: _row_value(values, mapping, field) for field in TRACKER_FIELDS}
        missing_values = [field for field in TRACKER_REQUIRED_FIELDS if not item[field]]
        if missing_values:
            errors.append(f"Ligne {line_number} : {', '.join(missing_values)} manquant(s).")
            continue
        item["tracker_update_status"] = item["tracker_update_status"] or "imported"
        item["updated_at"] = item["updated_at"] or item["timestamp"] or now
        imported.append(item)

    if not imported and not errors:
        errors.append("Aucune candidature exploitable n'a été trouvée.")
    preview = {
        "kind": "tracker",
        "filename": _safe_filename(source_filename or path.name),
        "sheet_name": sheet_name,
        "row_count": len(imported),
        "ignored_columns": ignored,
        "errors": errors,
        "preview_rows": imported[:8],
        "can_confirm": bool(imported) and not errors,
        "token": "",
    }
    if preview["can_confirm"]:
        preview["token"] = _stage(
            "tracker",
            {"filename": preview["filename"], "rows": imported},
            staging_dir,
        )
    return preview


def _backup(path: Path, label: str, backup_dir: Path = BACKUP_DIR) -> Path | None:
    if not path.exists():
        return None
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    destination = backup_dir / f"{label}_{timestamp}{path.suffix}"
    shutil.copy2(path, destination)
    return destination


def _write_tracker_rows(rows: list[dict[str, str]], tracker_path: Path) -> None:
    tracker_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        dir=tracker_path.parent,
        suffix=".csv",
        mode="w",
        encoding="utf-8",
        newline="",
        delete=False,
    ) as temporary:
        temporary_path = Path(temporary.name)
        writer = csv.DictWriter(temporary, fieldnames=TRACKER_FIELDS)
        writer.writeheader()
        writer.writerows(_normalized_tracker_row(row) for row in rows)
    try:
        os.replace(temporary_path, tracker_path)
    finally:
        temporary_path.unlink(missing_ok=True)


def confirm_tracker_import(
    token: str,
    *,
    mode: str = "merge",
    tracker_path: str | Path = APPLICATION_TRACKER_CSV_PATH,
    staging_dir: Path = STAGING_DIR,
    backup_dir: Path = BACKUP_DIR,
) -> dict:
    if mode not in {"merge", "replace"}:
        raise ValueError("Mode d'import invalide.")
    payload, staged_path = _unstage("tracker", token, staging_dir)
    incoming = [_normalized_tracker_row(row) for row in payload.get("rows", [])]
    if not incoming:
        raise ValueError("L'aperçu ne contient aucune candidature à importer.")
    target = Path(tracker_path)
    existing = [] if mode == "replace" else _read_tracker_rows(target)
    merged = list(existing)
    positions = {_tracker_key(row): index for index, row in enumerate(merged)}
    inserted = 0
    updated = 0
    for row in incoming:
        key = _tracker_key(row)
        if mode == "merge" and key in positions:
            index = positions[key]
            current = dict(merged[index])
            current.update({field: value for field, value in row.items() if value})
            merged[index] = _normalized_tracker_row(current)
            updated += 1
        else:
            positions[key] = len(merged)
            merged.append(row)
            inserted += 1

    _backup(target, "applications_before_import", backup_dir)
    _write_tracker_rows(merged, target)
    staged_path.unlink(missing_ok=True)
    return {
        "inserted": inserted,
        "updated": updated,
        "total": len(merged),
        "mode": mode,
        "filename": payload.get("filename", ""),
    }


def tracker_dashboard(
    tracker_path: str | Path = APPLICATION_TRACKER_CSV_PATH,
    *,
    limit: int = 100,
) -> dict:
    raw_rows = _read_tracker_rows(tracker_path)
    collapsed: dict[tuple[str, ...], dict[str, str]] = {}
    for row in raw_rows:
        key = _tracker_key(row)
        if key in collapsed:
            current = collapsed[key]
            current.update({field: value for field, value in row.items() if value})
        else:
            collapsed[key] = dict(row)
    rows = list(collapsed.values())
    rows.sort(key=lambda item: item.get("updated_at") or item.get("timestamp") or "", reverse=True)
    for row in rows:
        row["display_status"] = row.get("status") or (
            "Dossier généré" if row.get("validation_status") == "success" else "Sans statut"
        )
        row["safe_job_url"] = _safe_http_url(row.get("job_url", ""))
    statuses = Counter(row["display_status"] for row in rows)
    return {
        "rows": rows[: max(1, limit)],
        "total": len(rows),
        "raw_total": len(raw_rows),
        "statuses": dict(statuses.most_common()),
        "last_update": (rows[0].get("updated_at") or rows[0].get("timestamp")) if rows else "",
    }


def _excel_safe(value: str) -> str:
    text = _clean(value)
    return f"'{text}" if text.startswith(("=", "+", "-", "@")) else text


def export_tracker_xlsx(
    tracker_path: str | Path = APPLICATION_TRACKER_CSV_PATH,
    *,
    export_dir: Path = EXPORT_DIR,
) -> Path:
    rows = _read_tracker_rows(tracker_path)
    export_dir.mkdir(parents=True, exist_ok=True)
    target = export_dir / "suivi_candidatures.xlsx"
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "applications"
    sheet.append(TRACKER_FIELDS)
    for row in rows:
        sheet.append([_excel_safe(row.get(field, "")) for field in TRACKER_FIELDS])
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    workbook.save(target)
    workbook.close()
    return target


def create_tracker_template(*, export_dir: Path = EXPORT_DIR) -> Path:
    export_dir.mkdir(parents=True, exist_ok=True)
    target = export_dir / "modele_suivi_candidatures.xlsx"
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "applications"
    import_fields = [
        "date_candidature",
        "entreprise",
        "poste",
        "statut",
        "priorite",
        "localisation",
        "lien_offre",
        "score_ats",
        "notes",
    ]
    sheet.append(import_fields)
    sheet.freeze_panes = "A2"
    instructions = workbook.create_sheet("instructions")
    instructions.append(["Règle", "Valeur"])
    instructions.append(["Colonnes obligatoires", "entreprise, poste"])
    instructions.append(["Formats acceptés à l'import", ".xlsx ou .csv"])
    instructions.append(["Comportement", "Aperçu puis fusion après confirmation"])
    workbook.save(target)
    workbook.close()
    return target


def _experience_ids(master_path: Path) -> set[str]:
    if not master_path.exists():
        raise ValueError("Ajoute d'abord le profil Excel maître dans Paramétrage client.")
    try:
        workbook = load_workbook(master_path, read_only=True, data_only=True)
    except Exception as exc:
        raise ValueError("Le profil Excel maître est invalide.") from exc
    try:
        if "experiences" not in workbook.sheetnames:
            return set()
        sheet = workbook["experiences"]
        headers = [_normalized(cell.value) for cell in sheet[1]]
        if "experience_id" not in headers:
            return set()
        index = headers.index("experience_id")
        return {
            _clean(row[index])
            for row in sheet.iter_rows(min_row=2, values_only=True)
            if index < len(row) and _clean(row[index])
        }
    finally:
        workbook.close()


def prepare_skills_import(
    source: str | Path,
    *,
    source_filename: str = "",
    master_path: str | Path = MASTER_PROFILE_PATH,
    staging_dir: Path = STAGING_DIR,
) -> dict:
    path = Path(source)
    _validate_source(path, (".xlsx", ".csv"))
    headers, rows, sheet_name = _read_tabular(
        path,
        preferred_sheets=("validated_skills", "skills", "competences"),
    )
    mapping, ignored = _column_mapping(headers, SKILL_ALIASES)
    required = [field for field in ("skill_name", "evidence_text") if field not in mapping]
    if required:
        raise ValueError(f"Colonnes obligatoires manquantes : {', '.join(required)}.")
    known_experiences = _experience_ids(Path(master_path))
    imported: list[dict[str, str]] = []
    errors: list[str] = []
    warnings: list[str] = []
    now = datetime.now().isoformat(timespec="seconds")
    filename = _safe_filename(source_filename or path.name)
    for line_number, values in enumerate(rows, start=2):
        if not any(values):
            continue
        raw = {field: _row_value(values, mapping, field) for field in SKILL_IMPORT_FIELDS}
        if not raw["skill_name"] or not raw["evidence_text"]:
            errors.append(f"Ligne {line_number} : compétence et preuve factuelle sont obligatoires.")
            continue
        experience_id = raw["experience_id"]
        if experience_id and experience_id not in known_experiences:
            errors.append(f"Ligne {line_number} : experience_id inconnu ({experience_id}).")
            continue
        category_key = _normalized(raw["category"] or "skill")
        if category_key not in SKILL_CATEGORIES:
            errors.append(f"Ligne {line_number} : catégorie inconnue ({raw['category']}).")
            continue
        level_key = _normalized(raw["level"])
        if level_key not in SKILL_LEVELS:
            errors.append(f"Ligne {line_number} : niveau inconnu ({raw['level']}).")
            continue
        if not experience_id:
            warnings.append(f"Ligne {line_number} : compétence non rattachée à une expérience.")
        digest_source = "|".join(
            [_normalized(raw["skill_name"]), experience_id, _normalized(raw["evidence_text"])]
        )
        content_hash = hashlib.sha256(digest_source.encode("utf-8")).hexdigest()
        imported.append(
            {
                "skill_id": f"skill_{content_hash[:16]}",
                **raw,
                "category": SKILL_CATEGORIES[category_key],
                "level": SKILL_LEVELS[level_key],
                "created_at": now,
                "source": "web_import",
                "source_file": filename,
                "validation_status": "user_validated",
                "skill_status": "active",
                "content_hash": content_hash,
            }
        )
    if not imported and not errors:
        errors.append("Aucune compétence exploitable n'a été trouvée.")
    preview = {
        "kind": "skills",
        "filename": filename,
        "sheet_name": sheet_name,
        "row_count": len(imported),
        "ignored_columns": ignored,
        "errors": errors,
        "warnings": warnings,
        "preview_rows": imported[:8],
        "can_confirm": bool(imported) and not errors,
        "token": "",
    }
    if preview["can_confirm"]:
        preview["token"] = _stage(
            "skills",
            {"filename": filename, "rows": imported},
            staging_dir,
        )
    return preview


def _ensure_skill_sheet(workbook):
    if "validated_skills" not in workbook.sheetnames:
        sheet = workbook.create_sheet("validated_skills")
        sheet.append(SKILL_STORAGE_FIELDS)
        return sheet
    sheet = workbook["validated_skills"]
    existing = [_clean(cell.value) for cell in sheet[1]]
    for field in SKILL_STORAGE_FIELDS:
        if field not in existing:
            sheet.cell(row=1, column=sheet.max_column + 1, value=field)
            existing.append(field)
    return sheet


def _save_workbook_atomic(workbook, target: Path) -> None:
    with tempfile.NamedTemporaryFile(dir=target.parent, suffix=".xlsx", delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        workbook.save(temporary_path)
        os.replace(temporary_path, target)
    finally:
        temporary_path.unlink(missing_ok=True)


def confirm_skills_import(
    token: str,
    *,
    master_path: str | Path = MASTER_PROFILE_PATH,
    staging_dir: Path = STAGING_DIR,
    backup_dir: Path = BACKUP_DIR,
) -> dict:
    payload, staged_path = _unstage("skills", token, staging_dir)
    if not payload.get("rows"):
        raise ValueError("L'aperçu ne contient aucune compétence à importer.")
    target = Path(master_path)
    if not target.exists():
        raise ValueError("Le profil Excel maître est introuvable.")
    workbook = load_workbook(target)
    sheet = _ensure_skill_sheet(workbook)
    headers = [_clean(cell.value) for cell in sheet[1]]
    hash_column = headers.index("content_hash")
    existing_hashes = {
        _clean(row[hash_column])
        for row in sheet.iter_rows(min_row=2, values_only=True)
        if hash_column < len(row) and _clean(row[hash_column])
    }
    inserted = 0
    skipped = 0
    for item in payload.get("rows", []):
        if item.get("content_hash") in existing_hashes:
            skipped += 1
            continue
        sheet.append([_clean(item.get(field, "")) for field in headers])
        existing_hashes.add(item.get("content_hash", ""))
        inserted += 1
    if inserted:
        _backup(target, "master_profile_before_skills", backup_dir)
        _save_workbook_atomic(workbook, target)
    workbook.close()
    staged_path.unlink(missing_ok=True)
    return {
        "inserted": inserted,
        "skipped": skipped,
        "total": validated_skills_status(target)["total"],
        "filename": payload.get("filename", ""),
    }


def validated_skills_status(master_path: str | Path = MASTER_PROFILE_PATH) -> dict:
    target = Path(master_path)
    if not target.exists():
        return {"total": 0, "last_update": "", "ready": False}
    try:
        workbook = load_workbook(target, read_only=True, data_only=True)
    except Exception:
        return {"total": 0, "last_update": "", "ready": False}
    try:
        if "validated_skills" not in workbook.sheetnames:
            return {"total": 0, "last_update": "", "ready": True}
        sheet = workbook["validated_skills"]
        headers = [_clean(cell.value) for cell in sheet[1]]
        records = [dict(zip(headers, values)) for values in sheet.iter_rows(min_row=2, values_only=True)]
        active = [
            record
            for record in records
            if _clean(record.get("validation_status")) == "user_validated"
            and _clean(record.get("skill_status") or "active") == "active"
        ]
        updates = [_clean(record.get("created_at")) for record in active if _clean(record.get("created_at"))]
        return {"total": len(active), "last_update": max(updates, default=""), "ready": True}
    finally:
        workbook.close()


def create_skills_template(*, export_dir: Path = EXPORT_DIR) -> Path:
    export_dir.mkdir(parents=True, exist_ok=True)
    target = export_dir / "modele_competences_normalise.xlsx"
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "validated_skills"
    sheet.append(SKILL_IMPORT_FIELDS)
    sheet.freeze_panes = "A2"
    category_validation = DataValidation(type="list", formula1='"outil,competence,kpi,connaissance"')
    level_validation = DataValidation(type="list", formula1='"debutant,intermediaire,autonome,avance,expert"')
    sheet.add_data_validation(category_validation)
    sheet.add_data_validation(level_validation)
    category_validation.add("B2:B1000")
    level_validation.add("E2:E1000")
    instructions = workbook.create_sheet("instructions")
    instructions.append(["Colonne", "Règle"])
    instructions.append(["skill_name", "Obligatoire : nom canonique de la compétence"])
    instructions.append(["category", "outil, competence, kpi ou connaissance"])
    instructions.append(["experience_id", "Identifiant d'une expérience du profil maître, si applicable"])
    instructions.append(["evidence_text", "Obligatoire : fait concret et vérifiable"])
    instructions.append(["level", "Facultatif : debutant, intermediaire, autonome, avance ou expert"])
    instructions.append(["aliases", "Facultatif : synonymes séparés par |"])
    instructions.append(["notes", "Facultatif"])
    workbook.save(target)
    workbook.close()
    return target


__all__ = [
    "MAX_UPLOAD_BYTES",
    "SKILL_IMPORT_FIELDS",
    "SKILL_STORAGE_FIELDS",
    "confirm_skills_import",
    "confirm_tracker_import",
    "create_skills_template",
    "create_tracker_template",
    "export_tracker_xlsx",
    "prepare_skills_import",
    "prepare_tracker_import",
    "tracker_dashboard",
    "validated_skills_status",
]
