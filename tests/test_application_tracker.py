from src.application.application_tracker import (
    GOOGLE_SHEET_FIELDS,
    TRACKER_FIELDS,
    _row_values_for_headers,
    update_application_tracker,
)


def test_application_tracker_has_no_lm_markdown_path(tmp_path):
    assert "lm_md_path" not in TRACKER_FIELDS
    assert "cv_markdown_path" not in TRACKER_FIELDS
    assert "cv_markdown_path" not in GOOGLE_SHEET_FIELDS

    tracker_path = tmp_path / "applications.csv"
    row = update_application_tracker(
        {
            "timestamp": "2026-05-15T12:00:10",
            "company": "Ipsen",
            "job_title": "Coordinateur ADV Import-Export",
            "job_family": "operations_supply_chain",
            "cv_docx_path": "data/output/CV.docx",
            "lm_docx_path": "data/output/cover_letters/LM.docx",
            "validation_status": "success",
            "selected_experiences": [{"company": "Blurry", "position_title": "ADV", "dates": "2024 - 2025"}],
            "selected_certifications": ["SAP"],
            "selected_technical_skills": ["Excel", "SAP"],
        },
        tracker_path=tracker_path,
    )

    content = tracker_path.read_text(encoding="utf-8")
    assert row["lm_docx_path"] == "data/output/cover_letters/LM.docx"
    assert "lm_md_path" not in content
    assert "cv_markdown_path" not in content
    assert row["selected_experiences"] == "Blurry - ADV - 2024 - 2025"
    assert row["selected_certifications"] == "SAP"
    assert row["selected_technical_skills"] == "Excel | SAP"


def test_application_tracker_repairs_missing_header(tmp_path):
    tracker_path = tmp_path / "applications.csv"
    tracker_path.write_text(
        "2026-05-15T12:00:10,Ipsen,Coordinateur ADV Import-Export\n",
        encoding="utf-8",
    )

    update_application_tracker(
        {
            "timestamp": "2026-05-16T12:00:10",
            "company": "De Neuville",
            "job_title": "Responsable ADV",
            "job_family": "retail_operations",
            "validation_status": "success",
        },
        tracker_path=tracker_path,
    )

    lines = tracker_path.read_text(encoding="utf-8").splitlines()
    assert lines[0].split(",") == TRACKER_FIELDS
    assert "De Neuville" in lines[-1]


def test_application_tracker_maps_application_fields_to_legacy_sheet_headers():
    row = {
        "timestamp": "2026-05-16T23:52:09",
        "company": "De Neuville",
        "job_title": "Responsable ADV",
        "cv_docx_path": "data/output/CV_De_Neuville.docx",
        "lm_docx_path": "data/output/cover_letters/LM_De_Neuville.docx",
        "validation_status": "success",
    }

    values = _row_values_for_headers(
        row,
        ["created_at", "company", "job_title", "cv_docx", "lm_docx", "notes", "status"],
    )

    assert values == [
        "2026-05-16T23:52:09",
        "De Neuville",
        "Responsable ADV",
        "data/output/CV_De_Neuville.docx",
        "data/output/cover_letters/LM_De_Neuville.docx",
        "LM DOCX: data/output/cover_letters/LM_De_Neuville.docx",
        "success",
    ]
