from pathlib import Path
import json
import re


class LetterResultParseError(ValueError):
    pass


def strip_json_fences(raw_text: str) -> str:
    text = (raw_text or "").strip()
    fenced = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        return fenced.group(1).strip()
    return text


def parse_letter_result(raw_text: str) -> dict:
    text = strip_json_fences(raw_text)
    try:
        result = json.loads(text)
    except json.JSONDecodeError as exc:
        raise LetterResultParseError(f"invalid_json: {exc}") from exc

    if not isinstance(result, dict):
        raise LetterResultParseError("invalid_shape: root must be an object")
    if "final_letter" not in result:
        raise LetterResultParseError("missing_field: final_letter")
    return result


def save_letter_result(result: dict, output_path: str | Path) -> Path:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return output_path

