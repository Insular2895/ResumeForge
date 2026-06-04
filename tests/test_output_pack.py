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

    pack_path = create_application_pack(
        company="Ipsen",
        job_title="Gestionnaire ADV",
        cv_path=cv_path,
        cv_markdown="CV markdown",
        timestamp="20260604_104500",
        ats_score=99,
    )

    assert pack_path.name == "99% Ipsen - Gestionnaire ADV - 20260604_104500"
