from __future__ import annotations

from datetime import datetime
from html.parser import HTMLParser
import html
import json
from pathlib import Path
import re
import uuid
import zipfile

from docx import Document


class _PlainTextHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self._in_li = False

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in {"p", "h1", "h2", "h3", "h4", "div"}:
            self._newline(block=True)
        if tag == "li":
            self._newline(block=False)
            self.parts.append("- ")
            self._in_li = True
        if tag == "br":
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"p", "h1", "h2", "h3", "h4", "div", "ul", "ol"}:
            self._newline(block=True)
        if tag == "li":
            self._in_li = False
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        text = re.sub(r"\s+", " ", data).strip()
        if text:
            self.parts.append(text)

    def _newline(self, *, block: bool) -> None:
        current = "".join(self.parts)
        if not current:
            return
        suffix = "\n\n" if block else "\n"
        if not current.endswith(suffix):
            self.parts.append(suffix)

    def text(self) -> str:
        text = "".join(self.parts)
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


def html_to_plain_text(html_content: str) -> str:
    parser = _PlainTextHTMLParser()
    parser.feed(str(html_content or ""))
    return parser.text()


class _DocumentHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.blocks: list[tuple[str, str]] = []
        self._stack: list[str] = []
        self._current_tag = ""
        self._current_text: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in {"h1", "h2", "h3", "p", "li"}:
            self._flush()
            self._current_tag = tag
            self._current_text = []
        self._stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag == self._current_tag:
            self._flush()
        if self._stack:
            self._stack.pop()

    def handle_data(self, data: str) -> None:
        if not self._current_tag:
            return
        text = re.sub(r"\s+", " ", data).strip()
        if text:
            self._current_text.append(text)

    def _flush(self) -> None:
        if not self._current_tag:
            return
        text = " ".join(self._current_text).strip()
        if text:
            self.blocks.append((self._current_tag, html.unescape(text)))
        self._current_tag = ""
        self._current_text = []

    def close(self) -> None:
        self._flush()
        super().close()


def html_to_document_blocks(html_content: str) -> list[tuple[str, str]]:
    parser = _DocumentHTMLParser()
    parser.feed(str(html_content or ""))
    parser.close()
    return parser.blocks


def _docx_to_html(path: Path) -> str:
    document = Document(path)
    chunks: list[str] = []
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue
        escaped = html.escape(text)
        style = (paragraph.style.name or "").lower() if paragraph.style else ""
        if "heading" in style or "titre" in style:
            chunks.append(f"<h2>{escaped}</h2>")
        elif style.startswith("list") or text.startswith(("•", "-", "*")):
            chunks.append(f"<ul><li>{html.escape(text.lstrip('•-* ').strip())}</li></ul>")
        else:
            chunks.append(f"<p>{escaped}</p>")
    for table in document.tables:
        for row in table.rows:
            cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if cells:
                chunks.append(f"<p>{html.escape(' | '.join(cells))}</p>")
    return "\n".join(chunks).strip() or "<p>Document vide.</p>"


def _first_file(pack_dir: Path, pattern: str) -> Path | None:
    matches = sorted(path for path in pack_dir.glob(pattern) if path.is_file())
    return matches[0] if matches else None


def create_preview_session(pack_dir: str | Path, preview_root: str | Path) -> dict:
    pack = Path(pack_dir)
    if not pack.is_dir():
        raise ValueError("Pack de candidature introuvable.")
    cv_path = _first_file(pack, "CV*.docx")
    lm_path = _first_file(pack, "LM*.docx")
    if not cv_path and not lm_path:
        raise ValueError("Aucun document éditable trouvé dans le pack.")

    preview_id = uuid.uuid4().hex
    root = Path(preview_root) / preview_id
    root.mkdir(parents=True, exist_ok=True)
    session = {
        "preview_id": preview_id,
        "pack_dir": str(pack),
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "cv_generated": _docx_to_html(cv_path) if cv_path else "<p>CV non généré.</p>",
        "cv_edited": "",
        "cv_is_dirty": False,
        "lm_generated": _docx_to_html(lm_path) if lm_path else "<p>Lettre de motivation non générée.</p>",
        "lm_edited": "",
        "lm_is_dirty": False,
    }
    (root / "session.json").write_text(json.dumps(session, ensure_ascii=False, indent=2), encoding="utf-8")
    return session


def load_preview_session(preview_id: str, preview_root: str | Path) -> dict:
    path = Path(preview_root) / str(preview_id) / "session.json"
    if not path.exists():
        raise ValueError("Session de prévisualisation introuvable.")
    return json.loads(path.read_text(encoding="utf-8"))


def _pdf_escape(text: str) -> str:
    escaped = text.encode("latin-1", errors="backslashreplace").decode("latin-1")
    return escaped.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


PDF_PAGE_WIDTH = 595
PDF_PAGE_HEIGHT = 842
PDF_MARGIN_X = 45
PDF_MARGIN_TOP = 51
PDF_MARGIN_BOTTOM = 45
PDF_BODY_SIZE = 10.6
PDF_BODY_LEADING = 13.6
PDF_HEADER_SIZE = 17.5
PDF_SECTION_SIZE = 11.5


def _wrap_text(text: str, *, max_width: float, font_size: float) -> list[str]:
    words = str(text or "").split()
    if not words:
        return []
    average_char_width = font_size * 0.52
    max_chars = max(18, int(max_width / average_char_width))
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def _text_width_estimate(text: str, font_size: float) -> float:
    return len(text) * font_size * 0.52


def _render_pdf_commands(html_content: str) -> list[str]:
    blocks = html_to_document_blocks(html_content)
    if not blocks:
        blocks = [("p", "Document final.")]

    max_width = PDF_PAGE_WIDTH - (PDF_MARGIN_X * 2)
    y = PDF_PAGE_HEIGHT - PDF_MARGIN_TOP
    commands: list[str] = []
    body_index = 0

    def ensure_space(height: float) -> None:
        nonlocal y, commands
        if y - height < PDF_MARGIN_BOTTOM:
            commands.append("__PAGE_BREAK__")
            y = PDF_PAGE_HEIGHT - PDF_MARGIN_TOP

    def draw_text(line: str, *, x: float, size: float, font: str = "F1") -> None:
        commands.append("BT")
        commands.append(f"/{font} {size:.1f} Tf")
        commands.append(f"1 0 0 1 {x:.1f} {y:.1f} Tm")
        commands.append(f"({_pdf_escape(line)}) Tj")
        commands.append("ET")

    for tag, raw_text in blocks:
        text = raw_text.strip()
        if not text:
            continue

        if tag == "h1" or (tag == "p" and body_index == 0):
            lines = _wrap_text(text, max_width=max_width, font_size=PDF_HEADER_SIZE)
            ensure_space(len(lines) * 20 + 6)
            for line in lines:
                x = max(PDF_MARGIN_X, (PDF_PAGE_WIDTH - _text_width_estimate(line, PDF_HEADER_SIZE)) / 2)
                draw_text(line, x=x, size=PDF_HEADER_SIZE, font="F2")
                y -= 20
            y -= 1
            body_index += 1
            continue

        if tag == "p" and body_index == 1:
            lines = _wrap_text(text, max_width=max_width, font_size=9.5)
            ensure_space(len(lines) * 12 + 9)
            for line in lines:
                x = max(PDF_MARGIN_X, (PDF_PAGE_WIDTH - _text_width_estimate(line, 9.5)) / 2)
                draw_text(line, x=x, size=9.5, font="F1")
                y -= 12
            y -= 7
            body_index += 1
            continue

        if tag == "h2":
            section = text.upper()
            ensure_space(24)
            y -= 4
            draw_text(section, x=PDF_MARGIN_X, size=PDF_SECTION_SIZE, font="F2")
            y -= 4
            commands.append(f"{PDF_MARGIN_X:.1f} {y:.1f} m {PDF_PAGE_WIDTH - PDF_MARGIN_X:.1f} {y:.1f} l S")
            y -= 12
            body_index += 1
            continue

        if tag == "h3":
            lines = _wrap_text(text, max_width=max_width, font_size=PDF_BODY_SIZE)
            ensure_space(len(lines) * PDF_BODY_LEADING + 3)
            for line in lines:
                draw_text(line, x=PDF_MARGIN_X, size=PDF_BODY_SIZE, font="F2")
                y -= PDF_BODY_LEADING
            y -= 1
            body_index += 1
            continue

        prefix = "- " if tag == "li" else ""
        indent = 11 if tag == "li" else 0
        lines = _wrap_text(text, max_width=max_width - indent, font_size=PDF_BODY_SIZE)
        ensure_space(len(lines) * PDF_BODY_LEADING + 3)
        for index, line in enumerate(lines):
            draw_text(f"{prefix if index == 0 else '  '}{line}", x=PDF_MARGIN_X + indent, size=PDF_BODY_SIZE, font="F1")
            y -= PDF_BODY_LEADING
        y -= 1
        body_index += 1
    return commands


def _simple_pdf_bytes(text: str) -> bytes:
    pages: list[list[str]] = [[]]
    for command in _render_pdf_commands(text):
        if command == "__PAGE_BREAK__":
            pages.append([])
        else:
            pages[-1].append(command)

    streams = ["\n".join(page).encode("latin-1", errors="backslashreplace") for page in pages]
    page_object_ids = [5 + index * 2 for index in range(len(streams))]
    content_object_ids = [6 + index * 2 for index in range(len(streams))]
    kids = " ".join(f"{object_id} 0 R" for object_id in page_object_ids)
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        f"<< /Type /Pages /Kids [{kids}] /Count {len(streams)} >>".encode("ascii"),
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    ]
    for page_id, content_id, stream in zip(page_object_ids, content_object_ids, streams):
        objects.append(
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PDF_PAGE_WIDTH} {PDF_PAGE_HEIGHT}] "
            f"/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {content_id} 0 R >>".encode("ascii")
        )
        objects.append(b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream")

    body = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(body))
        body.extend(f"{index} 0 obj\n".encode("ascii"))
        body.extend(obj)
        body.extend(b"\nendobj\n")
    xref = len(body)
    body.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    body.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        body.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    body.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode("ascii")
    )
    return bytes(body)


def export_final_zip(
    preview_id: str,
    preview_root: str | Path,
    output_root: str | Path,
    *,
    cv_edited: str = "",
    cv_is_dirty: bool = False,
    lm_edited: str = "",
    lm_is_dirty: bool = False,
) -> Path:
    session = load_preview_session(preview_id, preview_root)
    final_cv = cv_edited if cv_is_dirty else session["cv_generated"]
    final_lm = lm_edited if lm_is_dirty else session["lm_generated"]
    output = Path(output_root)
    output.mkdir(parents=True, exist_ok=True)
    zip_path = output / "ResumeForge_documents_finaux.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("CV_Lucas_Pertusa.pdf", _simple_pdf_bytes(final_cv))
        archive.writestr("Lettre_Motivation_Lucas_Pertusa.pdf", _simple_pdf_bytes(final_lm))
    return zip_path
