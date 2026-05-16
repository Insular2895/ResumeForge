from src.application.application_tracker import TRACKER_FIELDS, update_application_tracker


def test_application_tracker_has_no_lm_markdown_path(tmp_path):
    assert "lm_md_path" not in TRACKER_FIELDS

    tracker_path = tmp_path / "applications.csv"
    row = update_application_tracker(
        {
            "timestamp": "2026-05-15T12:00:10",
            "company": "Ipsen",
            "job_title": "Coordinateur ADV Import-Export",
            "job_family": "operations_supply_chain",
            "cv_docx_path": "data/output/CV.docx",
            "cv_markdown_path": "data/output/CV.md",
            "lm_docx_path": "data/output/cover_letters/LM.docx",
            "validation_status": "success",
            "company_research_status": "cache_hit",
            "used_company_facts": [{}],
        },
        tracker_path=tracker_path,
    )

    content = tracker_path.read_text(encoding="utf-8")
    assert row["lm_docx_path"] == "data/output/cover_letters/LM.docx"
    assert "lm_md_path" not in content

