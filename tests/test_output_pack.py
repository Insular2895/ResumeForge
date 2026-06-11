from src.application.output_pack import create_application_pack


def test_application_pack_name_starts_with_company(tmp_path, monkeypatch):
    import src.application.output_pack as output_pack

    monkeypatch.setattr(output_pack, "APPLICATION_PACKS_DIR", tmp_path)

    cv_path = tmp_path / "source.docx"
    cv_path.write_bytes(b"fake-docx")

    pack_path = create_application_pack(
        company="Getraline",
        job_title="Chargé(e) de facturation / Assistant(e) ADV - H/F- job post",
        cv_path=cv_path,
        cv_markdown="CV markdown",
        timestamp="20260601_184859",
    )

    assert pack_path.name == "Getraline - Charge de facturation Assistant ADV - 20260601_184859"


def test_application_pack_name_can_start_with_ats_score(tmp_path, monkeypatch):
    import src.application.output_pack as output_pack

    monkeypatch.setattr(output_pack, "APPLICATION_PACKS_DIR", tmp_path)

    cv_path = tmp_path / "source.docx"
    cv_path.write_bytes(b"fake-docx")
    lm_path = tmp_path / "letter.docx"
    lm_path.write_bytes(b"fake-docx")

    pack_path = create_application_pack(
        company="Ipsen",
        job_title="Gestionnaire ADV",
        cv_path=cv_path,
        cv_markdown="CV markdown",
        lm_docx_path=lm_path,
        timestamp="20260604_104500",
        ats_score=99,
    )

    assert pack_path.name == "99% Ipsen - Gestionnaire ADV - 20260604_104500"
    assert (pack_path / "CV - Ipsen - Gestionnaire ADV.docx").exists()
    assert (pack_path / "LM - Ipsen - Gestionnaire ADV.docx").exists()
    assert not list(pack_path.glob("*99%*.docx"))
    assert sorted(path.suffix for path in pack_path.iterdir()) == [".docx", ".docx"]


def test_application_pack_does_not_copy_internal_files(tmp_path, monkeypatch):
    import src.application.output_pack as output_pack

    monkeypatch.setattr(output_pack, "APPLICATION_PACKS_DIR", tmp_path / "packs")
    cv_path = tmp_path / "source.docx"
    cv_path.write_bytes(b"cv")
    validation_path = tmp_path / "validation.json"
    validation_path.write_text("{}", encoding="utf-8")
    failed_path = tmp_path / "failed.txt"
    failed_path.write_text("failed", encoding="utf-8")

    pack_path = create_application_pack(
        company="stichd",
        job_title="Sales Support Representative",
        cv_path=cv_path,
        cv_markdown="internal markdown",
        validation_path=validation_path,
        failed_output_path=failed_path,
    )

    assert [path.name for path in pack_path.iterdir()] == [
        "CV - stichd - Sales Support Representative.docx"
    ]
