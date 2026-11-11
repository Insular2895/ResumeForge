from pathlib import Path

import pytest
from docx import Document
from docx.shared import Mm

from src.render.cv_layout_guard import CvLayoutError, measure_docx_pages, render_cv_one_page


class _FakeRenderer:
    def render(self, replacements, output_path):
        document = Document()
        section = document.sections[0]
        section.page_width = Mm(210)
        section.page_height = Mm(297)
        section.top_margin = section.bottom_margin = Mm(10)
        for line in replacements["lines"]:
            document.add_paragraph(line)
        document.save(output_path)


def _factory(experiences, certifications, skills):
    lines = ["CV", *certifications, *skills]
    for experience in experiences:
        lines.extend(experience.get("bullets", []))
    return {"lines": lines}


def test_short_cv_is_one_page(tmp_path):
    path = tmp_path / "short.docx"
    result = render_cv_one_page(
        renderer=_FakeRenderer(),
        output_path=path,
        replacement_factory=_factory,
        experiences=[{"bullets": ["Gestion des commandes."]}],
        certifications=[],
        technical_skills=["Excel"],
    )
    assert result.page_count == 1
    assert measure_docx_pages(path).page_count == 1


def test_long_cv_is_compacted_to_one_page(monkeypatch, tmp_path):
    calls = {"count": 0}

    def measurement(path):
        calls["count"] += 1
        from src.render.cv_layout_guard import PageMeasurement
        return PageMeasurement(2 if calls["count"] == 1 else 1, "test")

    monkeypatch.setattr("src.render.cv_layout_guard.measure_docx_pages", measurement)
    result = render_cv_one_page(
        renderer=_FakeRenderer(),
        output_path=tmp_path / "long.docx",
        replacement_factory=_factory,
        experiences=[{"bullets": ["Gestion " + "très longue " * 40] * 4}],
        certifications=[],
        technical_skills=[f"Compétence {index}" for index in range(12)],
    )
    assert result.page_count == 1
    assert result.compaction_passes == 1


def test_impossible_cv_raises_and_does_not_leave_a_two_page_export(monkeypatch, tmp_path):
    from src.render.cv_layout_guard import PageMeasurement
    monkeypatch.setattr(
        "src.render.cv_layout_guard.measure_docx_pages",
        lambda path: PageMeasurement(2, "test"),
    )
    output = tmp_path / "impossible.docx"
    with pytest.raises(CvLayoutError):
        render_cv_one_page(
            renderer=_FakeRenderer(),
            output_path=output,
            replacement_factory=_factory,
            experiences=[{"bullets": ["Contenu incompressible"]}],
            certifications=[],
            technical_skills=[],
        )
    assert not output.exists()
