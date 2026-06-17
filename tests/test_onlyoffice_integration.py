from pathlib import Path
import zipfile

from src.web import onlyoffice_integration


class FakeResponse:
    def __init__(self, content: bytes):
        self.content = content

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self):
        return self.content


def test_create_onlyoffice_session_copies_generated_docx(tmp_path):
    pack = tmp_path / "pack"
    pack.mkdir()
    (pack / "CV - Test.docx").write_bytes(b"cv-docx")
    (pack / "LM - Test.docx").write_bytes(b"lm-docx")

    session = onlyoffice_integration.create_onlyoffice_session(pack, tmp_path / "sessions")

    root = tmp_path / "sessions" / session["session_id"]
    assert (root / "CV_Lucas_Pertusa.docx").read_bytes() == b"cv-docx"
    assert (root / "Lettre_Motivation_Lucas_Pertusa.docx").read_bytes() == b"lm-docx"
    assert set(session["documents"]) == {"cv", "lm"}


def test_build_editor_config_points_to_docx_and_callback(tmp_path):
    pack = tmp_path / "pack"
    pack.mkdir()
    (pack / "CV - Test.docx").write_bytes(b"cv-docx")
    session = onlyoffice_integration.create_onlyoffice_session(pack, tmp_path / "sessions")

    config = onlyoffice_integration.build_document_config(
        session,
        "cv",
        app_base_url="http://host.docker.internal:8765",
    )

    assert config["type"] == "desktop"
    assert config["height"] == "820px"
    assert config["documentType"] == "word"
    assert config["document"]["fileType"] == "docx"
    assert config["document"]["url"].startswith("http://host.docker.internal:8765/onlyoffice/sessions/")
    assert config["editorConfig"]["callbackUrl"].endswith("/callback/cv")
    assert config["editorConfig"]["customization"]["forcesave"] is True
    assert config["editorConfig"]["customization"]["features"]["spellcheck"] is False
    assert config["editorConfig"]["plugins"]["disable"]
    assert "asc.{9DC93CDB-B576-4F0C-B55E-FCC9C48DD007}" in config["editorConfig"]["plugins"]["disable"]
    assert config["document"]["permissions"]["comment"] is False
    assert config["document"]["permissions"]["chat"] is False


def test_callback_saves_modified_docx_and_export_zip(tmp_path, monkeypatch):
    pack = tmp_path / "pack"
    pack.mkdir()
    (pack / "CV - Test.docx").write_bytes(b"cv-original")
    session = onlyoffice_integration.create_onlyoffice_session(pack, tmp_path / "sessions")

    monkeypatch.setattr(
        onlyoffice_integration.urllib.request,
        "urlopen",
        lambda url, timeout=60: FakeResponse(b"cv-edited"),
    )

    result = onlyoffice_integration.handle_callback(
        session["session_id"],
        "cv",
        {"status": 2, "url": "http://onlyoffice/download/docx"},
        session_root=tmp_path / "sessions",
    )
    zip_path = onlyoffice_integration.export_onlyoffice_zip(
        session["session_id"],
        tmp_path / "sessions",
        tmp_path / "exports",
    )

    assert result == {"error": 0}
    with zipfile.ZipFile(zip_path) as archive:
        assert archive.read("CV_Lucas_Pertusa.docx") == b"cv-edited"
