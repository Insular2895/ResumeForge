from pathlib import Path

import run_application


def test_lm_generation_failure_still_creates_cv_pack(tmp_path, monkeypatch):
    validation_path = tmp_path / "validation.json"
    cv_path = tmp_path / "source.docx"
    cv_path.write_bytes(b"fake-docx")
    cv_markdown_path = tmp_path / "source.md"
    cv_markdown_path.write_text("CV markdown", encoding="utf-8")
    pack_path = tmp_path / "78% Cuisinella - Assistant Administratif Et Commercial"

    monkeypatch.setattr(run_application, "create_application_pack", lambda **kwargs: pack_path)
    monkeypatch.setattr(
        run_application,
        "_update_tracker_safely",
        lambda report, path: report,
    )
    monkeypatch.setattr(run_application, "_print_summary", lambda *args: None)

    report = run_application._handle_lm_generation_failure(
        error=RuntimeError("429 RESOURCE_EXHAUSTED"),
        application_context={
            "company": "Cuisinella",
            "job_title": "Assistant Administratif Et Commercial",
            "ats_score": 78,
            "cv_docx_path": str(cv_path),
            "cv_markdown_path": str(cv_markdown_path),
        },
        company_name="Cuisinella",
        job_title="Assistant Administratif Et Commercial",
        cv_docx_path=cv_path,
        cv_markdown="CV markdown",
        cv_markdown_path=cv_markdown_path,
        validation_path=validation_path,
        timestamp="20260605_144733",
        ats_score=78,
    )

    assert report["validation_status"] == "skipped"
    assert report["lm_docx_path"] is None
    assert report["application_pack_path"] == str(pack_path)
    assert report["errors"] == ["429 RESOURCE_EXHAUSTED"]
    assert validation_path.exists()
