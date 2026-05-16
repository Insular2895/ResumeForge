from pathlib import Path
import json

from src.application.document_to_markdown import docx_to_markdown


def _read_json(path: str | Path) -> dict:
    path = Path(path)
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _as_list(value) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def build_cv_markdown_from_report(report: dict, docx_markdown: str = "") -> str:
    company = report.get("company_detected", "")
    job_title = report.get("job_title_detected", "")

    lines = [
        "# CV final personnalise - Lucas Pertusa",
        "",
        "## Candidature cible",
        f"- Entreprise cible : {company}",
        f"- Poste cible : {job_title}",
        "",
        "## Experiences selectionnees",
    ]

    for experience in _as_list(report.get("selected_experiences")):
        if not isinstance(experience, dict):
            continue
        title = " - ".join(
            part
            for part in [
                experience.get("company", ""),
                experience.get("position_title", ""),
                experience.get("dates", ""),
            ]
            if part
        )
        if title:
            lines.append(f"### {title}")
        for tag in _as_list(experience.get("reason_tags")):
            if tag:
                lines.append(f"- Terme associe : {tag}")

    lines.extend(["", "## Leadership selectionne"])
    for item in _as_list(report.get("selected_leadership")):
        if not isinstance(item, dict):
            continue
        title = " - ".join(
            part
            for part in [
                item.get("organisation", ""),
                item.get("role", ""),
                item.get("dates", ""),
            ]
            if part
        )
        if title:
            lines.append(f"- {title}")

    lines.extend(["", "## Certifications et formations"])
    for certification in _as_list(report.get("selected_certifications")):
        if certification:
            lines.append(f"- {certification}")

    lines.extend(["", "## Competences techniques"])
    for skill in _as_list(report.get("selected_technical_skills")):
        if skill:
            lines.append(f"- {skill}")

    if docx_markdown.strip():
        lines.extend(
            [
                "",
                "## Texte extrait du CV DOCX final",
                "",
                docx_markdown.strip(),
            ]
        )

    return "\n".join(lines).strip() + "\n"


def export_cv_markdown(
    cv_docx_path: str | Path,
    report_path: str | Path,
    output_path: str | Path | None = None,
) -> Path:
    cv_docx_path = Path(cv_docx_path)
    if output_path is None:
        output_path = cv_docx_path.with_suffix(".md")
    output_path = Path(output_path)

    report = _read_json(report_path)
    docx_markdown = docx_to_markdown(cv_docx_path)
    markdown = build_cv_markdown_from_report(report, docx_markdown)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    return output_path

