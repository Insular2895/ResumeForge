from pathlib import Path

from docx import Document


ROOT_DIR = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT_DIR / "templates" / "base_cover_letter_example.docx"


def create_template(output_path: Path = OUTPUT_PATH) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    document = Document()
    document.add_paragraph("Paris, le [[LM_DATE]]")
    document.add_paragraph("")
    document.add_paragraph("Objet : Candidature au poste de [[LM_JOB_TITLE]] chez [[LM_COMPANY]]")
    document.add_paragraph("")
    document.add_paragraph("Madame, Monsieur,")
    document.add_paragraph("")
    document.add_paragraph("[[LM_FINAL_LETTER]]")
    document.add_paragraph("")
    document.add_paragraph("[[LM_SIGNATURE]]")
    document.save(output_path)
    return output_path


def main() -> None:
    path = create_template()
    print(f"Template exemple cree : {path}")


if __name__ == "__main__":
    main()

