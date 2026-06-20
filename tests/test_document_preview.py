import json
import zipfile
import base64

from docx import Document

from src.web.document_preview import (
    create_preview_session,
    export_final_zip,
    extract_editable_blocks,
    html_to_plain_text,
    _docx_to_html,
    render_editable_blocks,
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


def test_load_preview_session_backfills_missing_cv_photo_from_pack(tmp_path):
    pack = tmp_path / "pack"
    pack.mkdir()
    image_path = tmp_path / "photo.png"
    image_path.write_bytes(
        base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=")
    )
    document = Document()
    document.add_picture(str(image_path))
    document.add_paragraph("Lucas PERTUSA")
    document.save(pack / "CV - Test.docx")
    _docx(pack / "LM - Test.docx", ["LM générée"])
    session = create_preview_session(pack, tmp_path / "previews")
    session_path = tmp_path / "previews" / session["preview_id"] / "session.json"
    session["cv_generated"] = "<p>Lucas PERTUSA</p>"
    session_path.write_text(json.dumps(session, ensure_ascii=False), encoding="utf-8")

    loaded = load_preview_session(session["preview_id"], tmp_path / "previews")

    assert loaded["cv_generated"].startswith('<img src="data:image/png;base64,')
    assert json.loads(session_path.read_text(encoding="utf-8"))["cv_generated"].startswith("<img")
    assert loaded["cv_document"]["image_html"].startswith("<img")


def test_load_preview_session_backfills_structured_documents_for_old_sessions(tmp_path):
    pack = tmp_path / "pack"
    pack.mkdir()
    _docx(pack / "CV - Test.docx", ["Lucas PERTUSA"])
    _docx(pack / "LM - Test.docx", ["Madame, Monsieur"])
    session = create_preview_session(pack, tmp_path / "previews")
    session_path = tmp_path / "previews" / session["preview_id"] / "session.json"
    del session["cv_document"]
    del session["lm_document"]
    session_path.write_text(json.dumps(session, ensure_ascii=False), encoding="utf-8")

    loaded = load_preview_session(session["preview_id"], tmp_path / "previews")

    assert loaded["cv_document"]["blocks"][0]["text"] == "Lucas PERTUSA"
    assert loaded["lm_document"]["blocks"][0]["text"] == "Madame, Monsieur"
    saved = json.loads(session_path.read_text(encoding="utf-8"))
    assert saved["cv_document"]["blocks"][0]["text"] == "Lucas PERTUSA"


def test_docx_to_html_preserves_cv_photo_sections_and_word_bullets(tmp_path):
    image_path = tmp_path / "photo.png"
    image_path.write_bytes(
        base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=")
    )
    document = Document()
    document.add_picture(str(image_path))
    document.add_paragraph("Lucas PERTUSA  Clamart 92 • lucaspertusa.pro@gmail.com • +33 07 66 40 32 00")
    document.add_paragraph("Éducation", style="Heading 1")
    document.add_paragraph("École Supérieure de Publicité ( ESP ) – Paris 16", style="Heading 1")
    document.add_paragraph("Bachelor III - Chef de Projet - Graduation Oct.2025")
    document.add_paragraph("Expériences", style="Heading 1")
    document.add_paragraph("Coordination des flux import/export avec 15 partenaires.", style="List Bullet")
    document.add_paragraph("Compétences et intérêts")
    docx_path = tmp_path / "CV - Test.docx"
    document.save(docx_path)

    html = _docx_to_html(docx_path)

    assert html.startswith('<img src="data:image/png;base64,')
    assert '<h2>Éducation</h2>' in html
    assert '<h2>École Supérieure de Publicité' not in html
    assert '<p><strong>École Supérieure de Publicité ( ESP ) – Paris 16</strong></p>' in html
    assert '<ul><li>Coordination des flux import/export avec 15 partenaires.</li></ul>' in html
    assert '<h2>Compétences et intérêts</h2>' in html


def test_editable_blocks_rebuild_document_without_changing_template_structure():
    source = "\n".join(
        [
            '<img src="data:image/png;base64,abc" alt="Photo de profil">',
            "<p>Lucas PERTUSA  Clamart 92</p>",
            "<h2>Expériences</h2>",
            "<p><strong>Blurry</strong></p>",
            "<p><strong>Analyste commercial ADV</strong></p>",
            "<p>Paris 01– 2024 - 2026</p>",
            "<ul><li>Coordination import/export.</li></ul>",
            "<h2>Compétences et intérêts</h2>",
            "<p><strong>Compétences techniques :</strong> ERP, Excel</p>",
        ]
    )

    document = extract_editable_blocks(source)
    document["blocks"][3]["text"] = "Acheteur & Coordinateur Supply Chain"
    document["blocks"][5]["text"] = "Coordination import/export et suivi OTIF."
    rebuilt = render_editable_blocks(document["blocks"], image_html=document["image_html"])

    assert rebuilt.startswith('<img src="data:image/png;base64,abc" alt="Photo de profil">')
    assert "<h2>Expériences</h2>" in rebuilt
    assert "<p><strong>Blurry</strong></p>" in rebuilt
    assert "<p><strong>Acheteur &amp; Coordinateur Supply Chain</strong></p>" in rebuilt
    assert "<ul><li>Coordination import/export et suivi OTIF.</li></ul>" in rebuilt
    assert "<strong>Compétences techniques :</strong> ERP, Excel" in rebuilt
    assert "document-page" not in rebuilt


def test_create_preview_session_stores_structured_editable_documents(tmp_path):
    pack = tmp_path / "pack"
    pack.mkdir()
    _docx(pack / "CV - Test.docx", ["Lucas Pertusa", "Expériences", "Blurry"])
    _docx(pack / "LM - Test.docx", ["Madame, Monsieur", "Motivation LM"])

    session = create_preview_session(pack, tmp_path / "previews")

    assert session["cv_document"]["blocks"][0]["text"] == "Lucas Pertusa"
    assert session["lm_document"]["blocks"][0]["text"] == "Madame, Monsieur"
    assert isinstance(session["cv_document"]["blocks"][0]["id"], str)


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
        assert names == ["CV_Lucas_Pertusa.docx", "Lettre_Motivation_Lucas_Pertusa.docx"]
        cv_docx = archive.read("CV_Lucas_Pertusa.docx")
        lm_docx = archive.read("Lettre_Motivation_Lucas_Pertusa.docx")

    assert b"CV" in cv_docx
    assert b"LM" in lm_docx
    assert "LM éditée ignorée".encode("latin-1") not in lm_docx


def test_export_final_zip_writes_edited_text_back_into_docx_when_dirty(tmp_path):
    preview_dir = tmp_path / "previews"
    pack = tmp_path / "pack"
    pack.mkdir()
    _docx(pack / "CV - Test.docx", ["Lucas PERTUSA", "Expériences", "Ancienne ligne"])
    _docx(pack / "LM - Test.docx", ["Madame, Monsieur"])
    session = create_preview_session(pack, preview_dir)

    zip_path = export_final_zip(
        session["preview_id"],
        preview_dir,
        tmp_path / "exports",
        cv_edited="<p>Lucas PERTUSA</p><h2>Expériences</h2><p>Nouvelle ligne exportée</p>",
        cv_is_dirty=True,
    )

    extracted_docx = tmp_path / "CV_Lucas_Pertusa.docx"
    with zipfile.ZipFile(zip_path) as archive:
        extracted_docx.write_bytes(archive.read("CV_Lucas_Pertusa.docx"))

    exported = Document(extracted_docx)
    exported_text = "\n".join(paragraph.text for paragraph in exported.paragraphs)
    assert "Nouvelle ligne exportée" in exported_text
    assert "Ancienne ligne" not in exported_text


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
        assert names == ["CV_Lucas_Pertusa.docx", "Lettre_Motivation_Lucas_Pertusa.docx"]
        assert archive.read("CV_Lucas_Pertusa.docx")


def test_export_final_zip_prefers_clean_docx_over_pack_pdf_when_documents_are_not_dirty(tmp_path):
    preview_dir = tmp_path / "previews"
    pack = tmp_path / "pack"
    pack.mkdir()
    (pack / "CV_Lucas_Pertusa.pdf").write_bytes(b"beautiful cv pdf")
    (pack / "Lettre_Motivation_Lucas_Pertusa.pdf").write_bytes(b"beautiful lm pdf")
    _docx(pack / "CV - Test.docx", ["CV généré fidèle"])
    _docx(pack / "LM - Test.docx", ["LM générée fidèle"])
    session = create_preview_session(pack, preview_dir)

    zip_path = export_final_zip(session["preview_id"], preview_dir, tmp_path / "exports")

    with zipfile.ZipFile(zip_path) as archive:
        assert sorted(archive.namelist()) == ["CV_Lucas_Pertusa.docx", "Lettre_Motivation_Lucas_Pertusa.docx"]
        assert archive.read("CV_Lucas_Pertusa.docx")
        assert archive.read("Lettre_Motivation_Lucas_Pertusa.docx")


def test_export_final_zip_uses_docx_before_faithful_html_fallback_when_pdf_is_missing(tmp_path):
    preview_dir = tmp_path / "previews"
    pack = tmp_path / "pack"
    pack.mkdir()
    image_path = tmp_path / "photo.png"
    image_path.write_bytes(
        base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=")
    )
    document = Document()
    document.add_picture(str(image_path))
    document.add_paragraph("Lucas PERTUSA")
    document.add_paragraph("Expériences")
    document.add_paragraph("Blurry")
    document.save(pack / "CV - Test.docx")
    _docx(pack / "LM - Test.docx", ["Madame, Monsieur"])
    session = create_preview_session(pack, preview_dir)

    zip_path = export_final_zip(session["preview_id"], preview_dir, tmp_path / "exports")

    with zipfile.ZipFile(zip_path) as archive:
        names = sorted(archive.namelist())
        assert names == ["CV_Lucas_Pertusa.docx", "Lettre_Motivation_Lucas_Pertusa.docx"]
        assert archive.read("CV_Lucas_Pertusa.docx")


def test_export_final_zip_uses_faithful_html_only_when_no_pdf_or_docx_exists(tmp_path):
    preview_dir = tmp_path / "previews"
    pack = tmp_path / "pack"
    pack.mkdir()
    image_path = tmp_path / "photo.png"
    image_path.write_bytes(
        base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=")
    )
    document = Document()
    document.add_picture(str(image_path))
    document.add_paragraph("CV généré")
    document.save(pack / "CV - Test.docx")
    _docx(pack / "LM - Test.docx", ["LM générée"])
    session = create_preview_session(pack, preview_dir)
    for path in pack.glob("*.docx"):
        path.unlink()

    zip_path = export_final_zip(session["preview_id"], preview_dir, tmp_path / "exports")

    with zipfile.ZipFile(zip_path) as archive:
        names = sorted(archive.namelist())
        assert names == ["CV_Lucas_Pertusa.html", "Lettre_Motivation_Lucas_Pertusa.html"]
        cv_html = archive.read("CV_Lucas_Pertusa.html").decode("utf-8")

    assert '<img src="data:image/png;base64,' in cv_html
    assert "width: 210mm" in cv_html
    assert "min-height: 297mm" in cv_html
    assert ".document-body img:first-child" in cv_html
    assert "<title>CV_Lucas_Pertusa</title>" in cv_html
