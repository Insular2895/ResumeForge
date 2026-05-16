import pytest

from src.letter.letter_result_parser import LetterResultParseError, parse_letter_result


def test_parse_fenced_json():
    result = parse_letter_result('```json\n{"final_letter": "Bonjour"}\n```')
    assert result["final_letter"] == "Bonjour"


def test_parse_rejects_invalid_json():
    with pytest.raises(LetterResultParseError):
        parse_letter_result("not json")

