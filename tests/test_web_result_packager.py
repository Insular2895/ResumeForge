from pathlib import Path

from src.web.result_packager import create_current_zip


def test_create_current_zip_uses_ats_name_and_replaces_previous(tmp_path):
    pack = tmp_path / "source-pack"
    pack.mkdir()
    (pack / "CV.docx").write_bytes(b"cv")
    output = tmp_path / "current"
    output.mkdir()
    (output / "old.zip").write_bytes(b"old")

    result = create_current_zip(
        pack,
        output,
        company="Ipsen",
        job_title="Gestionnaire ADV",
        ats_score=87,
    )

    assert result.name == "87% Ipsen - Gestionnaire ADV.zip"
    assert result.exists()
    assert not (output / "old.zip").exists()


def test_create_current_zip_omits_missing_ats_score(tmp_path):
    pack = tmp_path / "source-pack"
    pack.mkdir()
    (pack / "LM.docx").write_bytes(b"lm")

    result = create_current_zip(
        pack,
        tmp_path / "current",
        company="Entreprise",
        job_title="Poste",
        ats_score=None,
    )

    assert result.name == "Entreprise - Poste.zip"
