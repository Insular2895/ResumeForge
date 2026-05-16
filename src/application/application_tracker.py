from __future__ import annotations

from datetime import datetime
from pathlib import Path
import csv

from src.config import APPLICATION_TRACKER_CSV_PATH


TRACKER_FIELDS = [
    "timestamp",
    "company",
    "job_title",
    "job_family",
    "cv_docx_path",
    "cv_markdown_path",
    "lm_docx_path",
    "validation_status",
    "company_research_status",
    "selected_company_facts_count",
    "tracker_update_status",
]


def update_application_tracker(
    validation_report: dict,
    tracker_path: str | Path = APPLICATION_TRACKER_CSV_PATH,
) -> dict:
    """Append the application result to a local CSV tracker."""
    tracker_path = Path(tracker_path)
    tracker_path.parent.mkdir(parents=True, exist_ok=True)

    row = {
        "timestamp": validation_report.get("timestamp") or datetime.now().isoformat(timespec="seconds"),
        "company": validation_report.get("company", ""),
        "job_title": validation_report.get("job_title", ""),
        "job_family": validation_report.get("job_family", ""),
        "cv_docx_path": validation_report.get("cv_docx_path", ""),
        "cv_markdown_path": validation_report.get("cv_markdown_path", ""),
        "lm_docx_path": validation_report.get("lm_docx_path") or "",
        "validation_status": validation_report.get("validation_status", ""),
        "company_research_status": validation_report.get("company_research_status", ""),
        "selected_company_facts_count": str(len(validation_report.get("used_company_facts", []))),
        "tracker_update_status": "success",
    }

    file_exists = tracker_path.exists()
    with tracker_path.open("a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=TRACKER_FIELDS)
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)

    return row

