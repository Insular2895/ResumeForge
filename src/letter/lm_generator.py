from __future__ import annotations

import os


DEFAULT_LETTER_MODEL = "gemini-3.1-flash-lite"
DEFAULT_LETTER_FALLBACK_MODELS = "gemini-3-flash-preview,gemini-2.5-flash-lite,gemini-2.5-flash"
TEMPORARY_ERROR_MARKERS = [
    "503 UNAVAILABLE",
    "429 RESOURCE_EXHAUSTED",
    "high demand",
    "quota",
]


def generate_letter_with_gemini(prompt: str, api_key: str | None = None, model: str | None = None) -> str:
    """Call Gemini once for LM generation using the dedicated letter key."""
    api_key = (api_key or os.getenv("GEMINI_LETTER_API_KEY", "")).strip()
    if not api_key:
        raise RuntimeError("missing_GEMINI_LETTER_API_KEY")

    from google import genai

    client = genai.Client(api_key=api_key)
    models = _letter_models(model)
    last_error = None

    for selected_model in models:
        try:
            response = client.models.generate_content(model=selected_model, contents=prompt)
            return getattr(response, "text", "") or ""
        except Exception as error:
            last_error = error
            if not _is_temporary_error(error):
                raise
            print(f"[Gemini LM] Modèle ignoré temporairement : {selected_model} ({str(error).splitlines()[0]})")

    raise RuntimeError(f"Aucun modèle Gemini LM disponible après erreur : {last_error}")


def _letter_models(model: str | None) -> list[str]:
    primary = model or os.getenv("GEMINI_LETTER_MODEL", DEFAULT_LETTER_MODEL)
    fallbacks = os.getenv("GEMINI_LETTER_FALLBACK_MODELS", DEFAULT_LETTER_FALLBACK_MODELS)
    models = [primary]
    for item in fallbacks.split(","):
        candidate = item.strip()
        if candidate and candidate not in models:
            models.append(candidate)
    return models


def _is_temporary_error(error: Exception) -> bool:
    text = str(error).lower()
    return any(marker.lower() in text for marker in TEMPORARY_ERROR_MARKERS)
