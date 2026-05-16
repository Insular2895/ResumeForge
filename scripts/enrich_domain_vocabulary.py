from __future__ import annotations

import json
from pathlib import Path

from dotenv import load_dotenv

from src.application.domain_vocabulary_builder import (
    enrich_domain_vocabulary_with_gemini,
    save_domain_vocabulary,
)
from src.config import JOB_DESCRIPTION_PATH


ROOT_DIR = Path(__file__).resolve().parents[1]


def main() -> None:
    load_dotenv(ROOT_DIR / ".env")

    if not JOB_DESCRIPTION_PATH.exists():
        raise FileNotFoundError(f"Job description introuvable : {JOB_DESCRIPTION_PATH}")

    job_description = JOB_DESCRIPTION_PATH.read_text(encoding="utf-8", errors="ignore")
    vocabulary = enrich_domain_vocabulary_with_gemini(job_description)
    output_path = save_domain_vocabulary(vocabulary)

    print(f"Base métier enrichie : {output_path}")
    print(json.dumps({"domain": vocabulary.get("domain"), "waves": list(vocabulary.get("waves", {}).keys())}, ensure_ascii=False))


if __name__ == "__main__":
    main()

