from __future__ import annotations

from datetime import datetime
from pathlib import Path
import csv
import os

from dotenv import load_dotenv

from src.config import APPLICATION_TRACKER_CSV_PATH, BASE_DIR


TRACKER_FIELDS = [
    "timestamp",
    "company",
    "job_title",
    "salary",
    "location",
    "job_url",
    "job_family",
    "cv_docx_path",
    "lm_docx_path",
    "score",
    "selected_experiences",
    "selected_certifications",
    "selected_technical_skills",
    "validation_status",
    "tracker_update_status",
]

GOOGLE_SHEET_FIELDS = [
    "created_at",
    "company",
    "job_title",
    "salary",
    "location",
    "job_url",
    "cv_docx",
    "lm_docx",
    "job_family",
    "score",
    "selected_experiences",
    "selected_certifications",
    "selected_technical_skills",
    "status",
    "priority",
    "notes",
    "updated_at",
    "timestamp",
]

ENV_PATH = BASE_DIR / ".env"
SERVICE_ACCOUNT_PATH = BASE_DIR / "credentials" / "service_account.json"


def _read_csv_rows(tracker_path: Path) -> list[list[str]]:
    if not tracker_path.exists() or tracker_path.stat().st_size == 0:
        return []

    with tracker_path.open("r", newline="", encoding="utf-8") as file:
        return list(csv.reader(file))


def _ensure_csv_header(tracker_path: Path) -> None:
    rows = _read_csv_rows(tracker_path)
    if not rows:
        return

    if rows[0] == TRACKER_FIELDS:
        return

    with tracker_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(TRACKER_FIELDS)
        writer.writerows(rows)


def _number_to_column_letter(number: int) -> str:
    result = ""
    while number > 0:
        number, remainder = divmod(number - 1, 26)
        result = chr(65 + remainder) + result
    return result


def _safe_str(value) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if text.lower() in {"none", "nan", "nat"}:
        return ""
    return text


def _safe_join(value) -> str:
    if value is None:
        return ""

    if isinstance(value, str):
        return value.strip()

    if isinstance(value, list):
        cleaned_items = []
        for item in value:
            if isinstance(item, dict):
                company = _safe_str(
                    item.get("company")
                    or item.get("organisation")
                    or item.get("organization")
                    or item.get("org")
                )
                position = _safe_str(
                    item.get("position_title")
                    or item.get("position")
                    or item.get("role")
                    or item.get("title")
                )
                dates = _safe_str(item.get("dates") or item.get("year"))
                parts = [part for part in [company, position, dates] if part]
                cleaned_items.append(" - ".join(parts) if parts else _safe_str(item))
            else:
                item_text = _safe_str(item)
                if item_text:
                    cleaned_items.append(item_text)
        return " | ".join(item for item in cleaned_items if item)

    if isinstance(value, dict):
        return _safe_str(value)

    return _safe_str(value)


def _calculate_score(report: dict) -> str:
    if report.get("score") not in {None, ""}:
        return _safe_str(report.get("score"))

    raw_score = 0.0
    for experience in report.get("selected_experiences", []) or []:
        if isinstance(experience, dict):
            raw_score += float(experience.get("score", 0) or 0)

    for leadership in report.get("selected_leadership", []) or []:
        if isinstance(leadership, dict):
            raw_score += float(leadership.get("score", 0) or 0)

    certifications = report.get("selected_certifications", []) or []
    if isinstance(certifications, list):
        raw_score += len(certifications) * 25

    skills = report.get("selected_technical_skills", []) or []
    if isinstance(skills, list):
        raw_score += len(skills) * 10

    if raw_score <= 0:
        return ""
    return _safe_str(round(min((raw_score / 700) * 100, 100), 2))


def _ensure_google_sheet_headers(worksheet) -> list[str]:
    worksheet.update(range_name="A1", values=[GOOGLE_SHEET_FIELDS])
    if worksheet.col_count > len(GOOGLE_SHEET_FIELDS):
        worksheet.resize(rows=worksheet.row_count, cols=len(GOOGLE_SHEET_FIELDS))
    return GOOGLE_SHEET_FIELDS


def _tracker_value_for_header(row: dict, header: str) -> str:
    timestamp = row.get("timestamp", "")
    cv_docx_path = row.get("cv_docx_path", "")
    lm_docx_path = row.get("lm_docx_path", "")
    validation_status = row.get("validation_status", "")

    sheet_values = {
        "created_at": timestamp,
        "updated_at": timestamp,
        "cv_docx": cv_docx_path,
        "lm_docx": lm_docx_path,
        "cv_path": cv_docx_path,
        "cv_file": Path(cv_docx_path).name if cv_docx_path else "",
        "mode": "application_pipeline",
        "status": validation_status,
        "notes": f"LM DOCX: {lm_docx_path}" if lm_docx_path else "",
    }

    if header in row:
        return row.get(header, "")
    return sheet_values.get(header, "")


def _row_values_for_headers(row: dict, headers: list[str]) -> list[str]:
    return [_tracker_value_for_header(row, header) for header in headers]


def _append_row_to_google_sheets(row: dict) -> str | None:
    load_dotenv(ENV_PATH)
    sheet_id = os.getenv("GOOGLE_SHEET_ID", "").strip()
    sheet_tab = os.getenv("GOOGLE_SHEET_TAB", "applications").strip()

    if not sheet_id and not SERVICE_ACCOUNT_PATH.exists():
        return None
    if not sheet_id:
        return "google_sheets_skipped_missing_GOOGLE_SHEET_ID"
    if not SERVICE_ACCOUNT_PATH.exists():
        return "google_sheets_skipped_missing_service_account"

    try:
        import gspread
        from google.oauth2.service_account import Credentials

        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
        ]
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=scopes)
        client = gspread.authorize(credentials)
        spreadsheet = client.open_by_key(sheet_id)
        try:
            worksheet = spreadsheet.worksheet(sheet_tab)
        except gspread.WorksheetNotFound:
            worksheet = spreadsheet.add_worksheet(
                title=sheet_tab,
                rows=1000,
                cols=len(TRACKER_FIELDS),
            )

        headers = _ensure_google_sheet_headers(worksheet)

        worksheet.append_row(
            _row_values_for_headers(row, headers),
            value_input_option="USER_ENTERED",
        )
    except Exception as exc:
        return f"google_sheets_failed: {exc}"

    return "google_sheets_success"


def update_application_tracker(
    validation_report: dict,
    tracker_path: str | Path = APPLICATION_TRACKER_CSV_PATH,
    sync_google_sheets: bool | None = None,
) -> dict:
    """Append the application result to the local CSV tracker and Google Sheets when configured."""
    tracker_path = Path(tracker_path)
    tracker_path.parent.mkdir(parents=True, exist_ok=True)
    if sync_google_sheets is None:
        sync_google_sheets = tracker_path.resolve() == Path(APPLICATION_TRACKER_CSV_PATH).resolve()

    row = {
        "timestamp": validation_report.get("timestamp") or datetime.now().isoformat(timespec="seconds"),
        "company": validation_report.get("company", ""),
        "job_title": validation_report.get("job_title", ""),
        "salary": validation_report.get("salary", ""),
        "location": validation_report.get("location", ""),
        "job_url": validation_report.get("job_url", ""),
        "job_family": validation_report.get("job_family", ""),
        "cv_docx_path": validation_report.get("cv_docx_path", ""),
        "lm_docx_path": validation_report.get("lm_docx_path") or "",
        "score": _calculate_score(validation_report),
        "selected_experiences": _safe_join(validation_report.get("selected_experiences", [])),
        "selected_certifications": _safe_join(validation_report.get("selected_certifications", [])),
        "selected_technical_skills": _safe_join(validation_report.get("selected_technical_skills", [])),
        "validation_status": validation_report.get("validation_status", ""),
        "tracker_update_status": "success",
    }

    file_exists = tracker_path.exists()
    _ensure_csv_header(tracker_path)
    with tracker_path.open("a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=TRACKER_FIELDS)
        if not file_exists or tracker_path.stat().st_size == 0:
            writer.writeheader()
        writer.writerow(row)

    sheets_status = _append_row_to_google_sheets(row) if sync_google_sheets else None
    if sheets_status == "google_sheets_success":
        row["tracker_update_status"] = "success"
    elif sheets_status:
        row["tracker_update_status"] = "success_local_csv_google_sheets_warning"
        row["tracker_warning"] = sheets_status

    return row
