from __future__ import annotations

import os


DEFAULT_LETTER_MODEL = "gemini-2.5-flash-lite"


def generate_letter_with_gemini(prompt: str, api_key: str | None = None, model: str = DEFAULT_LETTER_MODEL) -> str:
    """Call Gemini once for LM generation using the dedicated letter key."""
    api_key = (api_key or os.getenv("GEMINI_LETTER_API_KEY", "")).strip()
    if not api_key:
        raise RuntimeError("missing_GEMINI_LETTER_API_KEY")

    from google import genai

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(model=model, contents=prompt)
    return getattr(response, "text", "") or ""

