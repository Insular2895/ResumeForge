from docx import Document
from docx.enum.text import WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

from src.render.docx_template import DocxTemplateRenderer


def test_renderer_removes_dangling_separators_for_missing_optional_values(tmp_path):
    template = tmp_path / "template.docx"
    document = Document()
    document.add_paragraph("[[POSITION]] - ")
    document.add_paragraph("[[LOCATION]] - [[DATES]]")
    document.save(template)

    output = tmp_path / "output.docx"
    DocxTemplateRenderer(template).render(
        {
            "[[POSITION]]": "Primeur sur les marchés",
            "[[LOCATION]]": "",
            "[[DATES]]": "",
        },
        output,
    )

    rendered = Document(output)
    lines = [paragraph.text.strip() for paragraph in rendered.paragraphs if paragraph.text.strip()]
    assert lines == ["Primeur sur les marchés"]


def test_renderer_removes_hidden_column_layout_that_creates_large_blanks(tmp_path):
    template = tmp_path / "template.docx"
    document = Document()
    document.add_paragraph("Expérience")
    break_paragraph = document.add_paragraph()
    break_paragraph.add_run().add_break(WD_BREAK.COLUMN)
    cols = OxmlElement("w:cols")
    cols.set(qn("w:num"), "3")
    document.sections[0]._sectPr.append(cols)
    document.add_paragraph("[[BULLET]]")
    document.save(template)

    output = tmp_path / "output.docx"
    DocxTemplateRenderer(template).render({"[[BULLET]]": "Preuve métier."}, output)

    rendered = Document(output)
    assert all(
        br.get(qn("w:type")) != "column"
        for paragraph in rendered.paragraphs
        for br in paragraph._p.findall(".//" + qn("w:br"))
    )
    assert all(
        cols.get(qn("w:num")) in {None, "1"}
        for sect_pr in rendered._element.findall(".//" + qn("w:sectPr"))
        for cols in sect_pr.findall(qn("w:cols"))
    )
