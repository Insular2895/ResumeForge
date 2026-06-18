import zipfile

from docx import Document

from src.web.document_preview import (
    create_preview_session,
    export_final_zip,
    html_to_plain_text,
    _simple_pdf_bytes,
    load_preview_session,
)


def _docx(path, paragraphs):
    document = Document()
    for paragraph in paragraphs:
        document.add_paragraph(paragraph)
    document.save(path)


def test_create_preview_session_extracts_generated_cv_and_lm(tmp_path):
    pack = tmp_path / "pack"
    pack.mkdir()
    _docx(pack / "CV - Test.docx", ["Lucas Pertusa", "Expérience CV"])
    _docx(pack / "LM - Test.docx", ["Madame, Monsieur", "Motivation LM"])

    session = create_preview_session(pack, tmp_path / "previews")
    loaded = load_preview_session(session["preview_id"], tmp_path / "previews")

    assert loaded["cv_generated"].startswith("<")
    assert "Expérience CV" in loaded["cv_generated"]
    assert "Motivation LM" in loaded["lm_generated"]
    assert loaded["cv_edited"] == ""
    assert loaded["lm_edited"] == ""
    assert loaded["cv_is_dirty"] is False
    assert loaded["lm_is_dirty"] is False


def test_html_to_plain_text_keeps_basic_document_structure():
    html = "<h1>CV</h1><p>Intro</p><ul><li>Bullet 1</li><li>Bullet 2</li></ul>"

    assert html_to_plain_text(html) == "CV\n\nIntro\n\n- Bullet 1\n- Bullet 2"


def test_export_final_zip_uses_edited_only_when_dirty(tmp_path):
    preview_dir = tmp_path / "previews"
    pack = tmp_path / "pack"
    pack.mkdir()
    _docx(pack / "CV - Test.docx", ["CV généré"])
    _docx(pack / "LM - Test.docx", ["LM générée"])
    session = create_preview_session(pack, preview_dir)

    zip_path = export_final_zip(
        session["preview_id"],
        preview_dir,
        tmp_path / "exports",
        cv_edited="<p>CV édité</p>",
        cv_is_dirty=True,
        lm_edited="<p>LM éditée ignorée</p>",
        lm_is_dirty=False,
    )

    with zipfile.ZipFile(zip_path) as archive:
        names = sorted(archive.namelist())
        assert names == ["CV_Lucas_Pertusa.pdf", "Lettre_Motivation_Lucas_Pertusa.pdf"]
        cv_pdf = archive.read("CV_Lucas_Pertusa.pdf")
        lm_pdf = archive.read("Lettre_Motivation_Lucas_Pertusa.pdf")

    assert "CV édité".encode("latin-1") in cv_pdf
    assert "LM générée".encode("latin-1") in lm_pdf
    assert "LM éditée ignorée".encode("latin-1") not in lm_pdf


def test_pdf_export_uses_a4_document_layout():
    pdf = _simple_pdf_bytes("<p>Lucas PERTUSA</p><p>Paris · email</p><h2>Expérience</h2><p>Texte</p>")

    assert b"/MediaBox [0 0 595 842]" in pdf
    assert b"/Helvetica-Bold" in pdf
    assert b"Lucas PERTUSA" in pdf


def test_export_final_zip_keeps_pdf_as_primary_format(tmp_path):
    preview_dir = tmp_path / "previews"
    pack = tmp_path / "pack"
    pack.mkdir()
    _docx(pack / "CV - Test.docx", ["CV généré fidèle"])
    _docx(pack / "LM - Test.docx", ["LM générée fidèle"])
    session = create_preview_session(pack, preview_dir)

    zip_path = export_final_zip(
        session["preview_id"],
        preview_dir,
        tmp_path / "exports",
        cv_edited="<h1>CV TipTap</h1>",
        cv_is_dirty=True,
        lm_edited="<p>LM TipTap ignorée</p>",
        lm_is_dirty=False,
    )

    with zipfile.ZipFile(zip_path) as archive:
        names = sorted(archive.namelist())
        assert names == ["CV_Lucas_Pertusa.pdf", "Lettre_Motivation_Lucas_Pertusa.pdf"]
        assert b"CV TipTap" in archive.read("CV_Lucas_Pertusa.pdf")
        assert "LM générée fidèle".encode("latin-1") in archive.read("Lettre_Motivation_Lucas_Pertusa.pdf")
