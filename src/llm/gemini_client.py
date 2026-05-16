import json
import os
from datetime import date
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
STATE_PATH = ROOT_DIR / "data" / "output" / "gemini_rotation_state.json"
DEFAULT_ROTATION_MODELS = "gemini-3.1-flash-lite,gemini-3-flash-preview,gemini-2.5-flash-lite,gemini-2.5-flash"
DEFAULT_OPTIONAL_MODELS = "gemini-2.0-flash"
TEMPORARY_MODEL_ERROR_MARKERS = [
    "429 RESOURCE_EXHAUSTED",
    "404 NOT_FOUND",
    "quota",
    "not found",
]


def is_gemini_enabled():
    return os.getenv("USE_GEMINI", "false").lower() in ["1", "true", "yes"]


def get_rotation_models():
    raw = os.getenv(
        "GEMINI_ROTATION_MODELS",
        DEFAULT_ROTATION_MODELS,
    )
    optional_raw = os.getenv("GEMINI_OPTIONAL_MODELS", "")

    models = _parse_model_list(raw)
    optional_models = _parse_model_list(optional_raw)

    for optional_model in optional_models:
        if optional_model not in models:
            models.append(optional_model)

    if not models:
        models = ["gemini-2.5-flash-lite"]

    return models


def _parse_model_list(raw):
    return [item.strip() for item in (raw or "").split(",") if item.strip()]


def get_daily_limit_per_model():
    raw = os.getenv("GEMINI_DAILY_LIMIT_PER_MODEL", "20")

    try:
        return int(raw)
    except ValueError:
        return 20


def load_rotation_state():
    today = date.today().isoformat()

    default = {"date": today, "last_index": -1, "usage": {}, "blocked": {}}

    if not STATE_PATH.exists():
        return default

    try:
        state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        return default

    if state.get("date") != today:
        return default

    state.setdefault("usage", {})
    state.setdefault("blocked", {})
    state.setdefault("last_index", -1)

    return state


def save_rotation_state(state):
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(
        json.dumps(state, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def choose_next_model():
    """
    Choisit le prochain modèle en rotation et incrémente son compteur.
    Retourne None si tous les modèles ont atteint leur limite quotidienne.
    """

    models = get_rotation_models()
    daily_limit = get_daily_limit_per_model()
    state = load_rotation_state()

    usage = state.get("usage", {})
    blocked = state.get("blocked", {})
    last_index = int(state.get("last_index", -1))

    for offset in range(1, len(models) + 1):
        index = (last_index + offset) % len(models)
        model = models[index]
        if blocked.get(model):
            continue
        used = int(usage.get(model, 0))

        if used < daily_limit:
            usage[model] = used + 1
            state["usage"] = usage
            state["last_index"] = index
            save_rotation_state(state)
            return model

    return None


def mark_model_blocked(model, reason):
    state = load_rotation_state()
    blocked = state.setdefault("blocked", {})
    blocked[model] = str(reason)[:300]
    save_rotation_state(state)


def is_temporary_model_error(error):
    text = str(error).lower()
    return any(marker.lower() in text for marker in TEMPORARY_MODEL_ERROR_MARKERS)


def ask_gemini(prompt, model=None):
    """
    1 seul appel, 1 seul modèle, pas de retry, pas de fallback multi-modèle.
    Si l'appel échoue, cv_enhancer catch l'exception et retourne les bullets originaux.
    """

    if not is_gemini_enabled():
        raise RuntimeError("Gemini est désactivé. Mets USE_GEMINI=true dans .env.")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY manquante dans .env.")

    try:
        from google import genai
    except ImportError:
        raise RuntimeError("Package google-genai manquant. Lance : pip install google-genai")

    client = genai.Client(api_key=api_key)

    last_error = None

    while True:
        selected_model = model or choose_next_model()

        if not selected_model:
            if last_error:
                raise RuntimeError(f"Aucun modèle Gemini disponible après erreur : {last_error}")
            raise RuntimeError("Limite quotidienne locale atteinte pour tous les modèles Gemini.")

        print(f"[Gemini] Modèle utilisé : {selected_model}")

        try:
            response = client.models.generate_content(
                model=selected_model,
                contents=prompt,
            )
            break
        except Exception as error:
            last_error = error
            if model or not is_temporary_model_error(error):
                raise
            print(f"[Gemini] Modèle ignoré temporairement : {selected_model} ({str(error).splitlines()[0]})")
            mark_model_blocked(selected_model, error)

    return (response.text or "").strip()
