import csv

from openpyxl import Workbook, load_workbook

from src.application.candidate_evidence import build_candidate_evidence_index
from src.application.dynamic_skills import derive_dynamic_skills
from src.web import client_imports


def _master_profile(path):
    workbook = Workbook()
    experiences = workbook.active
    experiences.title = "experiences"
    experiences.append(["experience_id", "company", "job_title", "truth_bullet_1"])
    experiences.append(["exp_1", "Acme", "Analyste", "Reporting hebdomadaire."])
    workbook.save(path)
    return path


def test_tracker_import_previews_french_columns_then_merges_atomically(tmp_path):
    source = tmp_path / "suivi.csv"
    source.write_text(
        "date_candidature;entreprise;poste;statut;priorité;notes\n"
        "2026-11-10;Acme;Data Analyst;Entretien;Haute;Relancer vendredi\n",
        encoding="utf-8",
    )
    staging = tmp_path / "staging"
    tracker = tmp_path / "applications.csv"
    backups = tmp_path / "backups"

    preview = client_imports.prepare_tracker_import(
        source,
        source_filename="suivi_client.csv",
        staging_dir=staging,
    )

    assert preview["can_confirm"] is True
    assert preview["row_count"] == 1
    assert preview["preview_rows"][0]["company"] == "Acme"
    assert preview["preview_rows"][0]["priority"] == "Haute"

    result = client_imports.confirm_tracker_import(
        preview["token"],
        tracker_path=tracker,
        staging_dir=staging,
        backup_dir=backups,
    )

    assert result == {
        "inserted": 1,
        "updated": 0,
        "total": 1,
        "mode": "merge",
        "filename": "suivi_client.csv",
    }
    dashboard = client_imports.tracker_dashboard(tracker)
    assert dashboard["total"] == 1
    assert dashboard["rows"][0]["status"] == "Entretien"

    updated_source = tmp_path / "suivi_update.csv"
    updated_source.write_text(
        "entreprise,poste,statut,notes\nAcme,Data Analyst,Offre reçue,Package à vérifier\n",
        encoding="utf-8",
    )
    updated_preview = client_imports.prepare_tracker_import(
        updated_source,
        staging_dir=staging,
    )
    updated = client_imports.confirm_tracker_import(
        updated_preview["token"],
        tracker_path=tracker,
        staging_dir=staging,
        backup_dir=backups,
    )

    assert updated["inserted"] == 0
    assert updated["updated"] == 1
    assert client_imports.tracker_dashboard(tracker)["rows"][0]["status"] == "Offre reçue"
    assert len(list(backups.glob("applications_before_import_*.csv"))) == 1


def test_tracker_import_reports_row_errors_without_staging_confirmation(tmp_path):
    source = tmp_path / "invalid.csv"
    source.write_text("entreprise,poste\nAcme,\n", encoding="utf-8")

    preview = client_imports.prepare_tracker_import(source, staging_dir=tmp_path / "staging")

    assert preview["can_confirm"] is False
    assert preview["token"] == ""
    assert "Ligne 2" in preview["errors"][0]


def test_tracker_export_neutralizes_excel_formulas(tmp_path):
    tracker = tmp_path / "applications.csv"
    with tracker.open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=client_imports.TRACKER_FIELDS)
        writer.writeheader()
        writer.writerow({"company": "=2+2", "job_title": "Analyste"})

    exported = client_imports.export_tracker_xlsx(tracker, export_dir=tmp_path / "exports")
    workbook = load_workbook(exported, data_only=False)

    assert workbook["applications"]["C2"].value == "'=2+2"


def test_tracker_dashboard_exposes_only_http_links(tmp_path):
    tracker = tmp_path / "applications.csv"
    with tracker.open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=client_imports.TRACKER_FIELDS)
        writer.writeheader()
        writer.writerow({"company": "Acme", "job_title": "Analyste", "job_url": "javascript:alert(1)"})

    row = client_imports.tracker_dashboard(tracker)["rows"][0]

    assert row["job_url"] == "javascript:alert(1)"
    assert row["safe_job_url"] == ""


def test_skills_import_adds_validated_evidence_and_ignores_duplicates(tmp_path):
    master = _master_profile(tmp_path / "master.xlsx")
    source = tmp_path / "skills.csv"
    source.write_text(
        "skill_name,category,experience_id,evidence_text,level,aliases,notes\n"
        "SQL,outil,exp_1,Création de requêtes SQL pour le reporting,autonome,,Validé avec le client\n",
        encoding="utf-8",
    )
    staging = tmp_path / "staging"
    backups = tmp_path / "backups"

    preview = client_imports.prepare_skills_import(
        source,
        source_filename="competences_client.csv",
        master_path=master,
        staging_dir=staging,
    )
    assert preview["can_confirm"] is True
    assert preview["preview_rows"][0]["level"] == "proficient"

    first = client_imports.confirm_skills_import(
        preview["token"],
        master_path=master,
        staging_dir=staging,
        backup_dir=backups,
    )
    assert first["inserted"] == 1
    assert first["total"] == 1

    workbook = load_workbook(master, data_only=True)
    sheet = workbook["validated_skills"]
    headers = [cell.value for cell in sheet[1]]
    record = dict(zip(headers, next(sheet.iter_rows(min_row=2, values_only=True))))
    assert record["validation_status"] == "user_validated"

    evidence = build_candidate_evidence_index([], validated_skills=[record])
    result = derive_dynamic_skills(
        [
            {
                "canonical_skill": "SQL",
                "evidence_terms": ["sql"],
                "importance": "required",
                "frequency": 1,
                "category": "tool",
                "job_wording": "SQL",
            }
        ],
        evidence,
    )
    assert result.labels == ("SQL",)
    assert result.matches[0].evidence[0]["source"] == "validated_skills"
    assert result.matches[0].candidate_level == "proficient"

    duplicate_preview = client_imports.prepare_skills_import(
        source,
        master_path=master,
        staging_dir=staging,
    )
    duplicate = client_imports.confirm_skills_import(
        duplicate_preview["token"],
        master_path=master,
        staging_dir=staging,
        backup_dir=backups,
    )
    assert duplicate["inserted"] == 0
    assert duplicate["skipped"] == 1
    assert duplicate["total"] == 1


def test_skills_import_rejects_unknown_experience_id(tmp_path):
    master = _master_profile(tmp_path / "master.xlsx")
    source = tmp_path / "skills.csv"
    source.write_text(
        "skill_name,category,experience_id,evidence_text\n"
        "Excel,outil,missing,Tableaux croisés dynamiques\n",
        encoding="utf-8",
    )

    preview = client_imports.prepare_skills_import(
        source,
        master_path=master,
        staging_dir=tmp_path / "staging",
    )

    assert preview["can_confirm"] is False
    assert "experience_id inconnu" in preview["errors"][0]


def test_downloadable_templates_have_expected_sheets_and_headers(tmp_path):
    tracker = client_imports.create_tracker_template(export_dir=tmp_path)
    skills = client_imports.create_skills_template(export_dir=tmp_path)

    tracker_workbook = load_workbook(tracker, read_only=True)
    skills_workbook = load_workbook(skills, read_only=True)
    assert tracker_workbook.sheetnames == ["applications", "instructions"]
    assert skills_workbook.sheetnames == ["validated_skills", "instructions"]
    assert [cell.value for cell in skills_workbook["validated_skills"][1]] == list(
        client_imports.SKILL_IMPORT_FIELDS
    )
