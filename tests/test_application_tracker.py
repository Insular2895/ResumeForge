from src.application.application_tracker import (
    GOOGLE_SHEET_FIELDS,
    TRACKER_FIELDS,
    _ensure_csv_header,
    _ensure_google_sheet_headers,
    _row_values_for_headers,
    update_application_tracker,
)


class FakeWorksheet:
    def __init__(self, values, col_count=None):
        self.values = values
        self.col_count = col_count or max(len(row) for row in values)
        self.row_count = max(len(values), 1)
        self.resize_calls = []

    def get_all_values(self):
        return self.values

    def update(self, range_name, values):
        assert range_name == "A1"
        if len(values) == 1 and self.values:
            self.values[0] = values[0]
        else:
            self.values = values

    def resize(self, rows, cols):
        self.row_count = rows
        self.col_count = cols
        self.resize_calls.append((rows, cols))


def test_application_tracker_has_no_lm_markdown_path(tmp_path):
    assert "lm_md_path" not in TRACKER_FIELDS
    assert "cv_markdown_path" not in TRACKER_FIELDS
    assert "cv_markdown_path" not in GOOGLE_SHEET_FIELDS
    assert TRACKER_FIELDS[0] == "ats_match_percent"
    assert GOOGLE_SHEET_FIELDS[0] == "ats_match_percent"

    tracker_path = tmp_path / "applications.csv"
    row = update_application_tracker(
        {
            "timestamp": "2026-05-15T12:00:10",
            "company": "Ipsen",
            "job_title": "Coordinateur ADV Import-Export",
            "salary": "40 000 €",
            "location": "Noisiel (77)",
            "job_family": "operations_supply_chain",
            "cv_docx_path": "data/output/CV.docx",
            "lm_docx_path": "data/output/cover_letters/LM.docx",
            "ats_score": 82,
            "validation_status": "success",
            "selected_experiences": [{"company": "Blurry", "position_title": "ADV", "dates": "2024 - 2025"}],
            "selected_certifications": ["SAP"],
            "selected_technical_skills": ["Excel", "SAP"],
        },
        tracker_path=tracker_path,
    )

    content = tracker_path.read_text(encoding="utf-8")
    assert row["lm_docx_path"] == "data/output/cover_letters/LM.docx"
    assert row["ats_match_percent"] == "82"
    assert row["salary"] == "40 000 €"
    assert row["location"] == "Noisiel (77)"
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
    assert lines[1].split(",")[0] == ""
    assert lines[1].split(",")[1] == "2026-05-15T12:00:10"
    assert "De Neuville" in lines[-1]


def test_application_tracker_maps_application_fields_to_legacy_sheet_headers():
    row = {
        "ats_match_percent": "87",
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


def test_application_tracker_can_map_ats_percent_before_date():
    row = {
        "ats_match_percent": "91",
        "timestamp": "2026-05-16T23:52:09",
    }

    values = _row_values_for_headers(row, ["ats_match_percent", "created_at"])

    assert values == ["91", "2026-05-16T23:52:09"]


def test_application_tracker_drops_embedded_legacy_header(tmp_path):
    tracker_path = tmp_path / "applications.csv"
    tracker_path.write_text(
        ",".join(TRACKER_FIELDS)
        + "\n"
        + ",".join(TRACKER_FIELDS[1:])
        + "\n"
        + "2026-05-16T12:00:10,Ipsen,Coordinateur ADV\n",
        encoding="utf-8",
    )

    _ensure_csv_header(tracker_path)

    rows = tracker_path.read_text(encoding="utf-8").splitlines()
    assert rows[0].split(",") == TRACKER_FIELDS
    assert len(rows) == 2
    assert rows[1].split(",")[0] == ""
    assert rows[1].split(",")[1] == "2026-05-16T12:00:10"


def test_google_sheet_headers_migrate_legacy_rows_by_shifting_dates():
    worksheet = FakeWorksheet(
        [
            GOOGLE_SHEET_FIELDS[1:],
            ["2026-05-16T23:52:09", "Ipsen", "Coordinateur ADV"],
        ],
        col_count=len(GOOGLE_SHEET_FIELDS) - 1,
    )

    headers = _ensure_google_sheet_headers(worksheet)

    assert headers == GOOGLE_SHEET_FIELDS
    assert worksheet.values[0] == GOOGLE_SHEET_FIELDS
    assert worksheet.values[1][0] == ""
    assert worksheet.values[1][1] == "2026-05-16T23:52:09"
    assert worksheet.values[1][2] == "Ipsen"
    assert worksheet.col_count == len(GOOGLE_SHEET_FIELDS)


def test_google_sheet_headers_repair_malformed_current_rows():
    worksheet = FakeWorksheet(
        [
            GOOGLE_SHEET_FIELDS,
            GOOGLE_SHEET_FIELDS[1:],
            ["2026-05-16T23:52:09", "Ipsen", "Coordinateur ADV"],
            ["90", "2026-06-01T09:10:00", "Unik Co"],
        ],
        col_count=len(GOOGLE_SHEET_FIELDS),
    )

    _ensure_google_sheet_headers(worksheet)

    assert worksheet.values[1][0] == ""
    assert worksheet.values[1][1] == "2026-05-16T23:52:09"
    assert worksheet.values[1][2] == "Ipsen"
    assert worksheet.values[2][0] == "90"
    assert worksheet.values[2][1] == "2026-06-01T09:10:00"
