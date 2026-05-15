# Company Research + LM Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a company research cache module and cover letter (LM) generator to ResumeForge, producing a CV DOCX + LM DOCX from a single `python run_application.py` command.

**Architecture:** Non-destructive approach — `src/generate_cv.py` and `run.py` are never modified. A new orchestrator `run_application.py` calls the existing CV pipeline then runs company research (Gemini Search grounding, cached in JSON) and LM generation (dedicated Gemini key) in sequence. All new code lives in `src/company_research/` and `src/letter/`.

**Tech Stack:** Python 3.11+, `google-genai==1.73.1` (already installed), `python-docx` (already installed), `pytest` (to add as dev dependency), `pathlib`, `json`, `unicodedata`.

**Spec reference:** `docs/superpowers/specs/2026-05-15-company-research-lm-pipeline-design.md`

---

## Critical rules — read before touching any file

```
1. NEVER modify src/generate_cv.py
2. NEVER modify run.py
3. company_fact_extractor.py  → zero LLM calls
4. lm_builder.py              → zero LLM calls
5. lm_renderer.py             → zero LLM calls
6. company_researcher.py      → exactly 1 Gemini call (Search grounding)
7. lm_generator.py            → exactly 1 Gemini call (GEMINI_LETTER_API_KEY)
8. If LM validation fails     → no DOCX produced, write LM_FAILED_{ts}.txt
9. Every run writes last_run_report_lm.json regardless of outcome
```

---

## File map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `src/config.py` | Add new paths + COMPANY_CACHE_TTL_DAYS constant |
| Create | `src/company_research/__init__.py` | Empty |
| Create | `src/company_research/company_identifier.py` | Normalize company name → (name, slug) |
| Create | `src/company_research/company_cache.py` | Read/write JSON profiles, TTL check |
| Create | `src/company_research/company_fact_extractor.py` | Parse + validate Gemini response locally |
| Create | `src/company_research/company_fact_selector.py` | Pick ≤3 relevant facts for the role |
| Create | `src/company_research/company_researcher.py` | 1 Gemini Search grounding call |
| Create | `src/letter/__init__.py` | Empty |
| Create | `src/letter/lm_generator.py` | 1 Gemini call with GEMINI_LETTER_API_KEY |
| Create | `src/letter/lm_builder.py` | Build replacements dict + validate |
| Create | `src/letter/lm_renderer.py` | Render base_lm.docx via DocxTemplateRenderer |
| Create | `run_application.py` | Orchestrate CV + research + LM |
| Create | `scripts/create_lm_template.py` | Generate base_lm.docx programmatically |
| Create | `templates/base_lm.docx` | Output of create_lm_template.py |
| Create | `tests/__init__.py` | Empty |
| Create | `tests/company_research/__init__.py` | Empty |
| Create | `tests/company_research/test_company_identifier.py` | |
| Create | `tests/company_research/test_company_cache.py` | |
| Create | `tests/company_research/test_company_fact_extractor.py` | |
| Create | `tests/company_research/test_company_fact_selector.py` | |
| Create | `tests/letter/__init__.py` | Empty |
| Create | `tests/letter/test_lm_builder.py` | |
| Create | `tests/letter/test_lm_renderer.py` | |
| Modify | `.env.example` | Add GEMINI_LETTER_API_KEY block |

---

## Task 1 — Extend `src/config.py` and install pytest

**Files:**
- Modify: `src/config.py`

- [ ] **Step 1: Add new paths and constant to config.py**

Open `src/config.py`. At the end of the file, **before** `ensure_project_directories()`, add:

```python
# Ajouts pipeline LM / company research
COMPANY_PROFILES_DIR = DATA_DIR / "company_profiles"
BASE_LM_TEMPLATE_PATH = TEMPLATES_DIR / "base_lm.docx"
APPLICATION_CONTEXT_PATH = OUTPUT_DIR / "application_context.json"
LM_REPORT_PATH = OUTPUT_DIR / "last_run_report_lm.json"
COMPANY_CACHE_TTL_DAYS = 30
```

Then update the existing `ensure_project_directories()` to include `COMPANY_PROFILES_DIR`:

```python
def ensure_project_directories():
    directories = [
        DATA_DIR,
        REFERENCE_DIR,
        INPUT_DIR,
        OUTPUT_DIR,
        TEMPLATES_DIR,
        COMPANY_PROFILES_DIR,   # ← add this line
    ]
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
```

- [ ] **Step 2: Install pytest**

```bash
pip install pytest
```

- [ ] **Step 3: Create test directory structure**

```bash
mkdir -p tests/company_research tests/letter
touch tests/__init__.py tests/company_research/__init__.py tests/letter/__init__.py
```

- [ ] **Step 4: Verify config imports cleanly**

```bash
python -c "from src.config import COMPANY_PROFILES_DIR, BASE_LM_TEMPLATE_PATH, COMPANY_CACHE_TTL_DAYS; print('OK')"
```

Expected output: `OK`

- [ ] **Step 5: Commit**

```bash
git add src/config.py tests/
git commit -m "feat: extend config with LM/research paths, add test dirs"
```

---

## Task 2 — `company_identifier.py`

**Files:**
- Create: `src/company_research/__init__.py`
- Create: `src/company_research/company_identifier.py`
- Create: `tests/company_research/test_company_identifier.py`

- [ ] **Step 1: Create empty `__init__.py`**

```bash
touch src/company_research/__init__.py
```

- [ ] **Step 2: Write the failing tests**

Create `tests/company_research/test_company_identifier.py`:

```python
import pytest
from src.company_research.company_identifier import normalize_company, identify_company


def test_strips_sa_suffix():
    name, slug = normalize_company("Ipsen SA")
    assert name == "Ipsen"
    assert slug == "ipsen"


def test_strips_group_suffix():
    name, slug = normalize_company("LVMH Group")
    assert name == "LVMH"
    assert slug == "lvmh"


def test_strips_accents():
    name, slug = normalize_company("L'Oréal")
    assert slug == "loreal"


def test_strips_accents_complex():
    name, slug = normalize_company("Société Générale")
    assert slug == "societe_generale"


def test_handles_apostrophe():
    name, slug = normalize_company("L'Oréal SAS")
    assert slug == "loreal"


def test_preserves_original_name():
    name, slug = normalize_company("Ipsen")
    assert name == "Ipsen"


def test_identify_company_returns_tuple():
    parsed_job = {"company": "Ipsen SA", "job_title": "ADV", "keywords": []}
    name, slug = identify_company(parsed_job)
    assert isinstance(name, str)
    assert isinstance(slug, str)
    assert slug == "ipsen"


def test_identify_company_fallback_slug():
    parsed_job = {"company": "Entreprise", "job_title": "ADV", "keywords": []}
    name, slug = identify_company(parsed_job)
    assert slug == "entreprise"
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
python -m pytest tests/company_research/test_company_identifier.py -v
```

Expected: `ImportError` or `ModuleNotFoundError`

- [ ] **Step 4: Implement `company_identifier.py`**

Create `src/company_research/company_identifier.py`:

```python
import re
import unicodedata

_LEGAL_SUFFIXES = {
    "sa", "sas", "sarl", "eurl", "sca", "snc",
    "groupe", "group", "inc", "ltd", "plc", "corp", "co", "llc", "gmbh", "ag",
}


def normalize_company(raw_name: str) -> tuple[str, str]:
    """
    Returns (display_name, slug).
    display_name = raw_name stripped of legal suffixes.
    slug         = lowercase, no accents, no punctuation, underscores.
    """
    clean = raw_name.strip()

    # Strip leading L', D', etc. for slug only
    slug_input = re.sub(r"^[Ll]'|^[Dd]'", "", clean)

    # Remove legal suffixes (word by word, case-insensitive)
    words = re.split(r"[\s,]+", clean)
    filtered_words = [w for w in words if w.lower() not in _LEGAL_SUFFIXES and w]
    display_name = " ".join(filtered_words).strip() or clean

    # Build slug
    slug_words = re.split(r"[\s,]+", slug_input)
    slug_filtered = [w for w in slug_words if w.lower() not in _LEGAL_SUFFIXES and w]
    slug_raw = " ".join(slug_filtered)

    slug = unicodedata.normalize("NFKD", slug_raw)
    slug = "".join(c for c in slug if not unicodedata.combining(c))
    slug = slug.lower()
    slug = re.sub(r"[^a-z0-9]+", "_", slug)
    slug = slug.strip("_")

    return display_name, slug or "entreprise"


def identify_company(parsed_job: dict) -> tuple[str, str]:
    """
    Extracts and normalizes the company name from a parsed_job dict.
    Returns (company_name, slug).
    """
    raw = parsed_job.get("company") or "Entreprise"
    return normalize_company(raw)
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
python -m pytest tests/company_research/test_company_identifier.py -v
```

Expected: all green

- [ ] **Step 6: Commit**

```bash
git add src/company_research/ tests/company_research/test_company_identifier.py
git commit -m "feat: add company_identifier — normalize company name to slug"
```

---

## Task 3 — `company_cache.py`

**Files:**
- Create: `src/company_research/company_cache.py`
- Create: `tests/company_research/test_company_cache.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/company_research/test_company_cache.py`:

```python
import json
import pytest
from datetime import date, timedelta
from pathlib import Path

from src.company_research.company_cache import CompanyCache


@pytest.fixture
def tmp_cache_dir(tmp_path):
    return tmp_path / "company_profiles"


@pytest.fixture
def cache(tmp_cache_dir):
    return CompanyCache(cache_dir=tmp_cache_dir, ttl_days=30)


@pytest.fixture
def valid_profile():
    return {
        "schema_version": "1.0",
        "source": "gemini_search_grounding",
        "company_name": "Ipsen",
        "company_slug": "ipsen",
        "last_updated": date.today().isoformat(),
        "facts": [],
        "excluded_facts": [],
    }


def test_load_returns_none_when_file_missing(cache):
    assert cache.load("ipsen") is None


def test_load_returns_none_when_stale(cache, tmp_cache_dir, valid_profile):
    stale_profile = dict(valid_profile)
    stale_date = date.today() - timedelta(days=31)
    stale_profile["last_updated"] = stale_date.isoformat()
    tmp_cache_dir.mkdir(parents=True)
    (tmp_cache_dir / "ipsen.json").write_text(
        json.dumps(stale_profile), encoding="utf-8"
    )
    assert cache.load("ipsen") is None


def test_load_returns_profile_when_fresh(cache, valid_profile):
    cache.save("ipsen", valid_profile)
    result = cache.load("ipsen")
    assert result is not None
    assert result["company_name"] == "Ipsen"


def test_save_creates_json_file(cache, tmp_cache_dir, valid_profile):
    cache.save("ipsen", valid_profile)
    assert (tmp_cache_dir / "ipsen.json").exists()


def test_save_round_trip(cache, valid_profile):
    cache.save("ipsen", valid_profile)
    loaded = cache.load("ipsen")
    assert loaded["company_slug"] == "ipsen"
    assert loaded["schema_version"] == "1.0"


def test_load_exactly_at_ttl_boundary_is_still_valid(cache, tmp_cache_dir, valid_profile):
    profile = dict(valid_profile)
    profile["last_updated"] = (date.today() - timedelta(days=30)).isoformat()
    cache.save("ipsen", profile)
    # 30 days ago is still within TTL (< 30 would be stale; <= 30 is fresh)
    result = cache.load("ipsen")
    assert result is not None
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
python -m pytest tests/company_research/test_company_cache.py -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `company_cache.py`**

Create `src/company_research/company_cache.py`:

```python
import json
from datetime import date, timedelta
from pathlib import Path


class CompanyCache:
    def __init__(self, cache_dir: Path, ttl_days: int = 30):
        self.cache_dir = Path(cache_dir)
        self.ttl_days = ttl_days

    def _path(self, slug: str) -> Path:
        return self.cache_dir / f"{slug}.json"

    def load(self, slug: str) -> dict | None:
        """Returns the profile if it exists and is fresh, else None."""
        path = self._path(slug)
        if not path.exists():
            return None
        try:
            profile = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return None
        last_updated_str = profile.get("last_updated", "")
        try:
            last_updated = date.fromisoformat(last_updated_str)
        except ValueError:
            return None
        if (date.today() - last_updated) > timedelta(days=self.ttl_days):
            return None
        return profile

    def save(self, slug: str, profile: dict) -> None:
        """Writes the profile JSON to disk, creating directories as needed."""
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self._path(slug).write_text(
            json.dumps(profile, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
python -m pytest tests/company_research/test_company_cache.py -v
```

Expected: all green

- [ ] **Step 5: Commit**

```bash
git add src/company_research/company_cache.py tests/company_research/test_company_cache.py
git commit -m "feat: add company_cache — JSON profiles with 30-day TTL"
```

---

## Task 4 — `company_fact_extractor.py`

**Files:**
- Create: `src/company_research/company_fact_extractor.py`
- Create: `tests/company_research/test_company_fact_extractor.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/company_research/test_company_fact_extractor.py`:

```python
import pytest
from src.company_research.company_fact_extractor import extract_facts


VALID_FACT = {
    "fact": "Ipsen place les patients au centre de sa mission thérapeutique.",
    "category": "culture",
    "source_url": "https://www.ipsen.com/fr/about-us/",
    "confidence": "high",
    "use_for_roles": ["ADV", "supply_chain"],
    "is_generic": False,
}


def _make_response(facts=None, excluded=None):
    import json
    return json.dumps({
        "facts": facts or [VALID_FACT],
        "excluded_facts": excluded or [],
    })


def test_parses_valid_json():
    result = extract_facts(_make_response())
    assert len(result["facts"]) == 1
    assert result["facts"][0]["fact"] == VALID_FACT["fact"]


def test_strips_markdown_fences():
    raw = "```json\n" + _make_response() + "\n```"
    result = extract_facts(raw)
    assert len(result["facts"]) == 1


def test_returns_empty_on_invalid_json():
    result = extract_facts("this is not json")
    assert result["facts"] == []
    assert result["excluded_facts"] == []


def test_rejects_fact_without_source_url():
    bad_fact = dict(VALID_FACT)
    bad_fact["source_url"] = ""
    result = extract_facts(_make_response(facts=[bad_fact]))
    assert len(result["facts"]) == 0


def test_rejects_fact_too_short():
    bad_fact = dict(VALID_FACT)
    bad_fact["fact"] = "Bien."
    result = extract_facts(_make_response(facts=[bad_fact]))
    assert len(result["facts"]) == 0


def test_rejects_generic_fact():
    bad_fact = dict(VALID_FACT)
    bad_fact["is_generic"] = True
    result = extract_facts(_make_response(facts=[bad_fact]))
    assert len(result["facts"]) == 0


def test_normalizes_confidence_to_known_values():
    fact = dict(VALID_FACT)
    fact["confidence"] = "VERY_HIGH"
    result = extract_facts(_make_response(facts=[fact]))
    # Unknown confidence → normalized to "medium"
    if result["facts"]:
        assert result["facts"][0]["confidence"] in {"high", "medium", "low"}


def test_adds_last_checked_field():
    result = extract_facts(_make_response())
    assert "last_checked" in result["facts"][0]


def test_deduplicates_identical_facts():
    result = extract_facts(_make_response(facts=[VALID_FACT, VALID_FACT]))
    assert len(result["facts"]) == 1


def test_schema_version_and_source_present():
    result = extract_facts(_make_response())
    assert result.get("schema_version") == "1.0"
    assert result.get("source") == "gemini_search_grounding"
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
python -m pytest tests/company_research/test_company_fact_extractor.py -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `company_fact_extractor.py`**

Create `src/company_research/company_fact_extractor.py`:

```python
import json
import re
from datetime import date

_VALID_CATEGORIES = {
    "culture", "formation", "mobilité", "mission",
    "projet", "international", "process", "rh", "business",
}
_VALID_CONFIDENCES = {"high", "medium", "low"}
_MIN_FACT_LENGTH = 15
_MAX_FACT_LENGTH = 250


def _clean_markdown(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


def _is_valid_fact(fact: dict) -> bool:
    text = fact.get("fact", "")
    if not isinstance(text, str):
        return False
    if len(text) < _MIN_FACT_LENGTH or len(text) > _MAX_FACT_LENGTH:
        return False
    if not fact.get("source_url", "").strip():
        return False
    if fact.get("is_generic") is True:
        return False
    return True


def _normalize_confidence(raw: str) -> str:
    val = str(raw).lower().strip()
    if val in _VALID_CONFIDENCES:
        return val
    if "high" in val:
        return "high"
    if "low" in val:
        return "low"
    return "medium"


def _normalize_category(raw: str) -> str:
    val = str(raw).lower().strip()
    return val if val in _VALID_CATEGORIES else "culture"


def extract_facts(raw_response: str) -> dict:
    """
    Parses and validates the raw string from company_researcher.
    Returns a profile dict ready to be saved by company_cache.
    Zero LLM calls.
    """
    cleaned = _clean_markdown(raw_response)
    try:
        data = json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        data = {}

    raw_facts = data.get("facts", []) if isinstance(data, dict) else []
    raw_excluded = data.get("excluded_facts", []) if isinstance(data, dict) else []

    today = date.today().isoformat()
    seen_texts: set[str] = set()
    valid_facts = []

    for fact in raw_facts:
        if not isinstance(fact, dict):
            continue
        if not _is_valid_fact(fact):
            continue
        text_key = fact["fact"].strip().lower()[:80]
        if text_key in seen_texts:
            continue
        seen_texts.add(text_key)
        valid_facts.append({
            "fact": fact["fact"].strip(),
            "category": _normalize_category(fact.get("category", "")),
            "source_url": fact.get("source_url", "").strip(),
            "confidence": _normalize_confidence(fact.get("confidence", "medium")),
            "use_for_roles": fact.get("use_for_roles", []),
            "is_generic": False,
            "last_checked": today,
        })

    excluded = [
        e for e in raw_excluded
        if isinstance(e, dict) and e.get("fact")
    ]

    return {
        "schema_version": "1.0",
        "source": "gemini_search_grounding",
        "last_updated": today,
        "facts": valid_facts,
        "excluded_facts": excluded,
    }
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
python -m pytest tests/company_research/test_company_fact_extractor.py -v
```

Expected: all green

- [ ] **Step 5: Commit**

```bash
git add src/company_research/company_fact_extractor.py tests/company_research/test_company_fact_extractor.py
git commit -m "feat: add company_fact_extractor — parse/validate Gemini response locally"
```

---

## Task 5 — `company_fact_selector.py`

**Files:**
- Create: `src/company_research/company_fact_selector.py`
- Create: `tests/company_research/test_company_fact_selector.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/company_research/test_company_fact_selector.py`:

```python
import pytest
from src.company_research.company_fact_selector import select_facts


def _make_fact(fact_text, confidence="high", is_generic=False,
               source_url="https://example.com/page", use_for_roles=None):
    return {
        "fact": fact_text,
        "category": "culture",
        "source_url": source_url,
        "confidence": confidence,
        "use_for_roles": use_for_roles or ["ADV", "supply_chain", "operations"],
        "is_generic": is_generic,
        "last_checked": "2026-05-15",
    }


def _make_profile(facts):
    return {
        "schema_version": "1.0",
        "facts": facts,
        "excluded_facts": [],
    }


def _make_job(job_title="Coordinateur ADV", keywords=None):
    return {
        "company": "Ipsen",
        "job_title": job_title,
        "keywords": keywords or ["adv", "import", "export", "supply"],
    }


def test_returns_empty_when_no_facts():
    selected, rejected = select_facts(_make_profile([]), _make_job())
    assert selected == []
    assert rejected == []


def test_returns_max_three_facts():
    facts = [_make_fact(f"Fait numéro {i} très précis et sourcé.") for i in range(6)]
    selected, rejected = select_facts(_make_profile(facts), _make_job())
    assert len(selected) <= 3


def test_excludes_generic_facts():
    facts = [
        _make_fact("Fait générique.", is_generic=True),
        _make_fact("Fait précis et sourcé sur la culture patient."),
    ]
    selected, rejected = select_facts(_make_profile(facts), _make_job())
    assert all(not f.get("is_generic") for f in selected)
    assert any(r["reason"] == "generic" for r in rejected)


def test_excludes_facts_without_source_url():
    facts = [
        _make_fact("Fait sans source.", source_url=""),
        _make_fact("Fait avec source officielle."),
    ]
    selected, rejected = select_facts(_make_profile(facts), _make_job())
    assert len(selected) == 1
    assert any(r["reason"] == "no_source" for r in rejected)


def test_excludes_low_confidence_facts():
    facts = [
        _make_fact("Fait peu fiable.", confidence="low"),
        _make_fact("Fait fiable."),
    ]
    selected, rejected = select_facts(_make_profile(facts), _make_job())
    assert len(selected) == 1
    assert any(r["reason"] == "low_confidence" for r in rejected)


def test_high_confidence_sorted_first():
    facts = [
        _make_fact("Fait medium.", confidence="medium"),
        _make_fact("Fait high.", confidence="high"),
    ]
    selected, _ = select_facts(_make_profile(facts), _make_job())
    assert selected[0]["confidence"] == "high"


def test_rejected_facts_include_reason():
    facts = [_make_fact("Court.", is_generic=True)]
    _, rejected = select_facts(_make_profile(facts), _make_job())
    for r in rejected:
        assert "fact" in r
        assert "reason" in r


def test_returns_empty_when_no_role_match():
    facts = [_make_fact("Fait pour data only.", use_for_roles=["data", "analyst"])]
    selected, rejected = select_facts(_make_profile(facts), _make_job(keywords=["adv", "supply"]))
    assert len(selected) == 0
    assert any(r["reason"] == "role_mismatch" for r in rejected)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
python -m pytest tests/company_research/test_company_fact_selector.py -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `company_fact_selector.py`**

Create `src/company_research/company_fact_selector.py`:

```python
_CONFIDENCE_ORDER = {"high": 0, "medium": 1, "low": 2}
_MAX_FACTS = 3


def select_facts(profile: dict, parsed_job: dict) -> tuple[list, list]:
    """
    Returns (selected_facts, rejected_facts).
    selected_facts: up to 3 facts, non-generic, sourced, high/medium confidence, role-relevant.
    rejected_facts: list of {"fact": "...", "reason": "..."}.
    """
    all_facts = profile.get("facts", [])
    job_keywords = {kw.lower() for kw in parsed_job.get("keywords", [])}
    job_title_words = {w.lower() for w in parsed_job.get("job_title", "").split()}
    relevant_terms = job_keywords | job_title_words

    selected = []
    rejected = []

    for fact in all_facts:
        text = fact.get("fact", "")

        if fact.get("is_generic") is True:
            rejected.append({"fact": text, "reason": "generic"})
            continue

        if not fact.get("source_url", "").strip():
            rejected.append({"fact": text, "reason": "no_source"})
            continue

        if fact.get("confidence", "low") == "low":
            rejected.append({"fact": text, "reason": "low_confidence"})
            continue

        use_for_roles = {r.lower() for r in fact.get("use_for_roles", [])}
        if use_for_roles and not use_for_roles.intersection(relevant_terms):
            rejected.append({"fact": text, "reason": "role_mismatch"})
            continue

        selected.append(fact)

    selected.sort(key=lambda f: _CONFIDENCE_ORDER.get(f.get("confidence", "low"), 2))
    return selected[:_MAX_FACTS], rejected
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
python -m pytest tests/company_research/test_company_fact_selector.py -v
```

Expected: all green

- [ ] **Step 5: Commit**

```bash
git add src/company_research/company_fact_selector.py tests/company_research/test_company_fact_selector.py
git commit -m "feat: add company_fact_selector — pick ≤3 relevant facts for role"
```

---

## Task 6 — `company_researcher.py`

**Files:**
- Create: `src/company_research/company_researcher.py`

No unit tests for the Gemini call itself (external API). The integration is tested in Task 13.

- [ ] **Step 1: Implement `company_researcher.py`**

Create `src/company_research/company_researcher.py`:

```python
import os

_PROMPT_TEMPLATE = """
Entreprise : {company_name}

Recherche des informations factuelles sur cette entreprise via des sources officielles.

Sources prioritaires : site corporate, page carrière, rapport annuel, page valeurs/culture/diversité.
Sources secondaires acceptées si officielles : LinkedIn corporate, communiqués de presse.
Sources à éviter : Glassdoor, Welcome to the Jungle, blogs non officiels.

Catégories à chercher : culture interne, formation / développement, mobilité, mission / impact,
projets stratégiques, logique client/patient/utilisateur, réseau international, outils ou process.

Règles strictes :
- réponds uniquement avec un objet JSON valide, sans markdown, sans commentaire
- chaque fait doit avoir une source_url officielle ou fiable
- si aucune information fiable trouvée, retourne facts: []
- exclure : avantages légaux, transport, tickets restaurant, RTT, télétravail générique,
  termes vides (entreprise dynamique, bonne ambiance, leader du secteur)

Format obligatoire :
{{
  "facts": [
    {{
      "fact": "texte court et précis (15-250 caractères)",
      "category": "culture|formation|mobilité|mission|projet|international|process",
      "source_url": "url",
      "confidence": "high|medium|low",
      "use_for_roles": ["ADV", "supply_chain", "operations", "junior", "data", "marketing"],
      "is_generic": false
    }}
  ],
  "excluded_facts": [
    {{ "fact": "...", "reason": "..." }}
  ]
}}
""".strip()


def research_company(company_name: str, model: str | None = None) -> str:
    """
    Calls Gemini with Search grounding.
    Returns the raw string response — to be parsed by company_fact_extractor.
    Exactly 1 Gemini call. Uses rotation model from GEMINI_ROTATION_MODELS.
    Raises RuntimeError if Gemini is disabled or API key is missing.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY manquante dans .env.")

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        raise RuntimeError("Package google-genai manquant. Lance : pip install google-genai")

    # Use provided model or first model from rotation
    if model is None:
        rotation_raw = os.getenv(
            "GEMINI_ROTATION_MODELS",
            "gemini-2.5-flash-lite,gemini-2.5-flash",
        )
        model = rotation_raw.split(",")[0].strip()

    prompt = _PROMPT_TEMPLATE.format(company_name=company_name)

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        ),
    )
    return (response.text or "").strip()
```

- [ ] **Step 2: Verify import works**

```bash
python -c "from src.company_research.company_researcher import research_company; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add src/company_research/company_researcher.py
git commit -m "feat: add company_researcher — Gemini Search grounding, 1 call"
```

---

## Task 7 — `lm_generator.py`

**Files:**
- Create: `src/letter/__init__.py`
- Create: `src/letter/lm_generator.py`

- [ ] **Step 1: Create empty `__init__.py`**

```bash
touch src/letter/__init__.py
```

- [ ] **Step 2: Implement `lm_generator.py`**

Create `src/letter/lm_generator.py`:

```python
import json

_PROMPT_TEMPLATE = """
Tu rédiges une lettre de motivation en français.

Entreprise : {company_name}
Poste : {job_title}

Faits entreprise sourcés (utilise-les si pertinents, n'en invente pas d'autres) :
{facts_block}

Expériences sélectionnées pour ce CV :
{experiences_block}

Extraits de l'offre d'emploi :
{job_excerpt}

Règles strictes :
- n'utilise que les faits fournis, n'invente rien sur l'entreprise
- si aucun fait disponible, ne personnalise pas corps_2 avec des informations inventées
- n'invente aucune expérience ni compétence absente du profil fourni
- style direct, professionnel, français naturel
- pas de formules creuses (dynamique, passionné par vos valeurs, entreprise leader)
- le nom de l'entreprise doit apparaître dans intro ou closing
- réponse uniquement en JSON valide, aucun commentaire, aucun markdown

Format obligatoire :
{{
  "intro": "...",
  "corps_1": "...",
  "corps_2": "...",
  "closing": "..."
}}
""".strip()

_MAX_JOB_EXCERPT_CHARS = 3000


def _format_facts_block(selected_facts: list) -> str:
    if not selected_facts:
        return "(aucun fait entreprise disponible — reste centré sur l'adéquation profil/poste)"
    lines = []
    for i, f in enumerate(selected_facts, 1):
        lines.append(f"{i}. {f['fact']} [source: {f.get('source_url', '')}]")
    return "\n".join(lines)


def _format_experiences_block(cv_report: dict) -> str:
    exps = cv_report.get("selected_experiences", [])
    if not exps:
        return "(aucune expérience disponible)"
    lines = []
    for exp in exps:
        company = exp.get("company", "")
        title = exp.get("position_title", "")
        if company or title:
            lines.append(f"- {company} : {title}")
    return "\n".join(lines) if lines else "(aucune expérience disponible)"


def generate_lm(
    parsed_job: dict,
    selected_facts: list,
    cv_report: dict,
    job_text: str,
    api_key: str,
    model: str = "gemini-2.5-flash",
) -> str:
    """
    Calls Gemini with GEMINI_LETTER_API_KEY.
    Returns the raw string response — to be parsed by lm_builder.
    Exactly 1 Gemini call. No Search grounding.
    """
    try:
        from google import genai
    except ImportError:
        raise RuntimeError("Package google-genai manquant. Lance : pip install google-genai")

    facts_block = _format_facts_block(selected_facts)
    experiences_block = _format_experiences_block(cv_report)
    job_excerpt = job_text[:_MAX_JOB_EXCERPT_CHARS]

    prompt = _PROMPT_TEMPLATE.format(
        company_name=parsed_job.get("company", ""),
        job_title=parsed_job.get("job_title", ""),
        facts_block=facts_block,
        experiences_block=experiences_block,
        job_excerpt=job_excerpt,
    )

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents=prompt,
    )
    return (response.text or "").strip()
```

- [ ] **Step 3: Verify import works**

```bash
python -c "from src.letter.lm_generator import generate_lm; print('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add src/letter/ 
git commit -m "feat: add lm_generator — 1 Gemini call with dedicated letter key"
```

---

## Task 8 — `lm_builder.py`

**Files:**
- Create: `src/letter/lm_builder.py`
- Create: `tests/letter/test_lm_builder.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/letter/test_lm_builder.py`:

```python
import json
import pytest
from src.letter.lm_builder import build_lm_replacements


def _make_raw(intro="Madame, Monsieur, je souhaite rejoindre Ipsen sur ce poste d'ADV.",
              corps_1="Fort de mes expériences en supply chain, je maîtrise les flux import-export.",
              corps_2="Votre culture orientée patient est cohérente avec mon parcours opérationnel.",
              closing="Je reste disponible pour un entretien. Cordialement."):
    return json.dumps({"intro": intro, "corps_1": corps_1,
                       "corps_2": corps_2, "closing": closing})


def _make_parsed_job(company="Ipsen", job_title="Coordinateur ADV"):
    return {"company": company, "job_title": job_title, "keywords": ["adv", "supply"]}


def _make_facts(fact_text="Ipsen place les patients au centre de sa mission."):
    return [{"fact": fact_text, "source_url": "https://ipsen.com", "category": "culture",
             "confidence": "high", "use_for_roles": ["ADV"], "is_generic": False}]


def test_returns_success_with_valid_input():
    replacements, validation = build_lm_replacements(
        raw_response=_make_raw(),
        parsed_job=_make_parsed_job(),
        selected_facts=_make_facts(),
    )
    assert validation["status"] == "success"
    assert "[[LM_INTRO]]" in replacements


def test_replacements_contain_all_placeholders():
    replacements, _ = build_lm_replacements(
        raw_response=_make_raw(),
        parsed_job=_make_parsed_job(),
        selected_facts=[],
    )
    for key in ["[[LM_DATE]]", "[[LM_COMPANY]]", "[[LM_JOB_TITLE]]",
                "[[LM_INTRO]]", "[[LM_CORPS_1]]", "[[LM_CORPS_2]]", "[[LM_CLOSING]]"]:
        assert key in replacements


def test_fails_when_section_too_short():
    replacements, validation = build_lm_replacements(
        raw_response=_make_raw(intro="Court."),
        parsed_job=_make_parsed_job(),
        selected_facts=[],
    )
    assert validation["status"] == "failed"
    assert any("intro" in e for e in validation["errors"])


def test_fails_when_company_not_in_intro_or_closing():
    replacements, validation = build_lm_replacements(
        raw_response=_make_raw(
            intro="Je souhaite rejoindre votre entreprise sur ce poste.",
            closing="Cordialement."
        ),
        parsed_job=_make_parsed_job(company="Ipsen"),
        selected_facts=[],
    )
    assert validation["status"] == "failed"
    assert any("company_name" in e for e in validation["errors"])


def test_fails_on_unresolved_placeholder():
    replacements, validation = build_lm_replacements(
        raw_response=_make_raw(intro="Je souhaite rejoindre Ipsen. [[UNRESOLVED]]"),
        parsed_job=_make_parsed_job(),
        selected_facts=[],
    )
    assert validation["status"] == "failed"


def test_facts_used_populated_when_facts_present():
    _, validation = build_lm_replacements(
        raw_response=_make_raw(),
        parsed_job=_make_parsed_job(),
        selected_facts=_make_facts(fact_text="Ipsen place les patients au centre."),
    )
    assert "facts_used" in validation


def test_strips_markdown_from_gemini_response():
    raw = "```json\n" + _make_raw() + "\n```"
    replacements, validation = build_lm_replacements(
        raw_response=raw,
        parsed_job=_make_parsed_job(),
        selected_facts=[],
    )
    assert validation["status"] == "success"
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
python -m pytest tests/letter/test_lm_builder.py -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `lm_builder.py`**

Create `src/letter/lm_builder.py`:

```python
import json
import re
from datetime import date

_MIN_SECTION_LENGTH = 50
_PLACEHOLDER_RE = re.compile(r"\[\[[A-Z_]+\]\]")


def _clean_markdown(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


def _extract_keywords_from_fact(fact_text: str) -> list[str]:
    stopwords = {
        "de", "du", "des", "la", "le", "les", "et", "en", "un", "une",
        "sur", "par", "avec", "pour", "dans", "est", "son", "ses",
        "the", "and", "for", "its", "with",
    }
    words = re.findall(r"[a-zA-ZÀ-ÿ]{5,}", fact_text.lower())
    return [w for w in words if w not in stopwords]


def _check_facts_used(corps_2: str, selected_facts: list) -> list:
    facts_used = []
    for fact in selected_facts:
        keywords = _extract_keywords_from_fact(fact.get("fact", ""))
        matched = [kw for kw in keywords if kw in corps_2.lower()]
        if matched:
            facts_used.append({
                "fact": fact["fact"],
                "matched_keywords": matched[:5],
            })
    return facts_used


def build_lm_replacements(
    raw_response: str,
    parsed_job: dict,
    selected_facts: list,
) -> tuple[dict | None, dict]:
    """
    Parses raw Gemini response, builds replacements dict, validates.
    Returns (replacements, validation).
    If validation fails, replacements is None.
    Zero LLM calls.
    """
    errors = []
    cleaned = _clean_markdown(raw_response)

    try:
        letter = json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        return None, {
            "status": "failed",
            "errors": ["invalid_json_from_gemini"],
            "parsed_letter": {},
            "facts_used": [],
        }

    intro = str(letter.get("intro", "")).strip()
    corps_1 = str(letter.get("corps_1", "")).strip()
    corps_2 = str(letter.get("corps_2", "")).strip()
    closing = str(letter.get("closing", "")).strip()

    # Validate section lengths
    for section_name, text in [("intro", intro), ("corps_1", corps_1),
                                ("corps_2", corps_2), ("closing", closing)]:
        if len(text) < _MIN_SECTION_LENGTH:
            errors.append(f"{section_name}_too_short")

    # Validate company name presence in intro or closing
    company = parsed_job.get("company", "").lower()
    if company and company not in intro.lower() and company not in closing.lower():
        errors.append("company_name_missing_from_intro_or_closing")

    # Validate no unresolved placeholders in any section
    all_text = f"{intro} {corps_1} {corps_2} {closing}"
    if _PLACEHOLDER_RE.search(all_text):
        errors.append("unresolved_placeholder_found")

    facts_used = _check_facts_used(corps_2, selected_facts)

    if errors:
        return None, {
            "status": "failed",
            "errors": errors,
            "parsed_letter": {"intro": intro, "corps_1": corps_1,
                              "corps_2": corps_2, "closing": closing},
            "facts_used": facts_used,
        }

    today = date.today()
    months_fr = ["janvier", "février", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    date_str = f"Paris, le {today.day} {months_fr[today.month - 1]} {today.year}"

    replacements = {
        "[[LM_DATE]]":      date_str,
        "[[LM_COMPANY]]":   parsed_job.get("company", ""),
        "[[LM_JOB_TITLE]]": parsed_job.get("job_title", ""),
        "[[LM_INTRO]]":     intro,
        "[[LM_CORPS_1]]":   corps_1,
        "[[LM_CORPS_2]]":   corps_2,
        "[[LM_CLOSING]]":   closing,
    }

    return replacements, {
        "status": "success",
        "errors": [],
        "parsed_letter": {"intro": intro, "corps_1": corps_1,
                          "corps_2": corps_2, "closing": closing},
        "facts_used": facts_used,
    }
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
python -m pytest tests/letter/test_lm_builder.py -v
```

Expected: all green

- [ ] **Step 5: Commit**

```bash
git add src/letter/lm_builder.py tests/letter/test_lm_builder.py
git commit -m "feat: add lm_builder — build replacements dict + validate LM sections"
```

---

## Task 9 — `lm_renderer.py`

**Files:**
- Create: `src/letter/lm_renderer.py`
- Create: `tests/letter/test_lm_renderer.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/letter/test_lm_renderer.py`:

```python
import pytest
from unittest.mock import patch, MagicMock
from pathlib import Path
from src.letter.lm_renderer import render_lm, build_lm_filename


def _make_replacements():
    return {
        "[[LM_DATE]]": "Paris, le 15 mai 2026",
        "[[LM_COMPANY]]": "Ipsen",
        "[[LM_JOB_TITLE]]": "Coordinateur ADV",
        "[[LM_INTRO]]": "Intro text.",
        "[[LM_CORPS_1]]": "Corps 1 text.",
        "[[LM_CORPS_2]]": "Corps 2 text.",
        "[[LM_CLOSING]]": "Closing text.",
    }


def _make_parsed_job():
    return {"company": "Ipsen", "job_title": "Coordinateur ADV Import-Export"}


def test_build_lm_filename_is_slugified():
    filename = build_lm_filename({"company": "L'Oréal SA", "job_title": "Chef ADV"}, "20260515_143022")
    assert " " not in filename
    assert filename.endswith(".docx")
    assert "LM_Lucas_Pertusa" in filename


def test_build_lm_filename_no_accents():
    filename = build_lm_filename({"company": "Société Générale", "job_title": "ADV"}, "20260515_143022")
    assert "é" not in filename
    assert "è" not in filename


def test_render_lm_calls_docx_renderer(tmp_path):
    mock_renderer = MagicMock()
    mock_renderer_instance = MagicMock()
    mock_renderer.return_value = mock_renderer_instance

    with patch("src.letter.lm_renderer.DocxTemplateRenderer", mock_renderer):
        with patch("src.letter.lm_renderer.BASE_LM_TEMPLATE_PATH", tmp_path / "base_lm.docx"):
            with patch("src.letter.lm_renderer.OUTPUT_DIR", tmp_path):
                render_lm(_make_replacements(), _make_parsed_job(), "20260515_143022")

    mock_renderer.assert_called_once()
    mock_renderer_instance.render.assert_called_once()
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
python -m pytest tests/letter/test_lm_renderer.py -v
```

Expected: `ImportError`

- [ ] **Step 3: Implement `lm_renderer.py`**

Create `src/letter/lm_renderer.py`:

```python
import re
import unicodedata
from pathlib import Path

from src.config import BASE_LM_TEMPLATE_PATH, OUTPUT_DIR
from src.render.docx_template import DocxTemplateRenderer

_LEGAL_SUFFIXES = {"sa", "sas", "sarl", "group", "groupe", "inc", "ltd", "plc"}


def _slugify(text: str) -> str:
    text = re.sub(r"^[Ll]'|^[Dd]'", "", text.strip())
    words = re.split(r"[\s,]+", text)
    words = [w for w in words if w.lower() not in _LEGAL_SUFFIXES and w]
    joined = " ".join(words)
    normalized = unicodedata.normalize("NFKD", joined)
    no_accents = "".join(c for c in normalized if not unicodedata.combining(c))
    slug = re.sub(r"[^A-Za-z0-9]+", "_", no_accents)
    return slug.strip("_").lower()[:35]


def build_lm_filename(parsed_job: dict, timestamp: str) -> str:
    company_slug = _slugify(parsed_job.get("company") or "entreprise")
    title_slug = _slugify(parsed_job.get("job_title") or "poste")
    return f"LM_Lucas_Pertusa_{company_slug}_{title_slug}_{timestamp}.docx"


def render_lm(replacements: dict, parsed_job: dict, timestamp: str) -> Path:
    """
    Renders base_lm.docx with replacements dict.
    Returns the output Path.
    Zero LLM calls.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = build_lm_filename(parsed_job, timestamp)
    output_path = OUTPUT_DIR / filename

    renderer = DocxTemplateRenderer(BASE_LM_TEMPLATE_PATH)
    renderer.render(replacements, output_path)

    return output_path
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
python -m pytest tests/letter/test_lm_renderer.py -v
```

Expected: all green

- [ ] **Step 5: Commit**

```bash
git add src/letter/lm_renderer.py tests/letter/test_lm_renderer.py
git commit -m "feat: add lm_renderer — render base_lm.docx via DocxTemplateRenderer"
```

---

## Task 10 — Create `base_lm.docx`

**Files:**
- Create: `scripts/create_lm_template.py`
- Create: `templates/base_lm.docx` (output of the script)

- [ ] **Step 1: Create the template generation script**

Create `scripts/create_lm_template.py`:

```python
"""
Run once to generate templates/base_lm.docx.
Usage: python scripts/create_lm_template.py
"""
from pathlib import Path
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH


def create_lm_template():
    doc = Document()

    # Margins
    section = doc.sections[0]
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

    def add_paragraph(text, bold=False, space_after=6, size=11, alignment=None):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.bold = bold
        run.font.size = Pt(size)
        p.paragraph_format.space_after = Pt(space_after)
        if alignment:
            p.alignment = alignment
        return p

    # Date
    add_paragraph("[[LM_DATE]]", space_after=12, alignment=WD_ALIGN_PARAGRAPH.RIGHT)

    # Subject line
    add_paragraph("Objet : Candidature au poste de [[LM_JOB_TITLE]] — [[LM_COMPANY]]",
                  bold=True, space_after=18)

    # Greeting
    add_paragraph("Madame, Monsieur,", space_after=12)

    # Body paragraphs
    add_paragraph("[[LM_INTRO]]", space_after=12)
    add_paragraph("[[LM_CORPS_1]]", space_after=12)
    add_paragraph("[[LM_CORPS_2]]", space_after=12)

    # Closing
    add_paragraph("[[LM_CLOSING]]", space_after=24)

    # Signature
    add_paragraph("Lucas Pertusa", bold=True, space_after=2)

    output_path = Path(__file__).resolve().parents[1] / "templates" / "base_lm.docx"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output_path)
    print(f"Template créé : {output_path}")


if __name__ == "__main__":
    create_lm_template()
```

- [ ] **Step 2: Run the script to generate the template**

```bash
python scripts/create_lm_template.py
```

Expected output: `Template créé : .../templates/base_lm.docx`

- [ ] **Step 3: Verify the file exists**

```bash
ls -lh templates/base_lm.docx
```

Expected: file present, ~10-20KB

- [ ] **Step 4: Commit**

```bash
git add scripts/create_lm_template.py templates/base_lm.docx
git commit -m "feat: add base_lm.docx template with LM placeholders"
```

---

## Task 11 — `run_application.py`

**Files:**
- Create: `run_application.py`

- [ ] **Step 1: Implement `run_application.py`**

Create `run_application.py` in the project root:

```python
"""
Pipeline complet : CV + recherche entreprise + LM.

Usage : python run_application.py

Prérequis :
  - data/input/job_description.txt  : l'offre d'emploi
  - data/reference/master_profile.xlsx
  - templates/base_cv.docx
  - templates/base_lm.docx
  - .env avec GEMINI_API_KEY et GEMINI_LETTER_API_KEY
"""
import json
import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from src.config import (
    INPUT_DIR, OUTPUT_DIR, COMPANY_PROFILES_DIR,
    APPLICATION_CONTEXT_PATH, LM_REPORT_PATH, COMPANY_CACHE_TTL_DAYS,
)
from src.generate_cv import parse_job, main as generate_cv_main
from src.company_research.company_identifier import identify_company
from src.company_research.company_cache import CompanyCache
from src.company_research.company_researcher import research_company
from src.company_research.company_fact_extractor import extract_facts
from src.company_research.company_fact_selector import select_facts
from src.letter.lm_generator import generate_lm
from src.letter.lm_builder import build_lm_replacements
from src.letter.lm_renderer import render_lm


def _load_job_description() -> str:
    path = INPUT_DIR / "job_description.txt"
    if not path.exists():
        raise FileNotFoundError(f"Job description introuvable : {path}")
    return path.read_text(encoding="utf-8")


def _write_application_context(parsed_job: dict) -> None:
    ctx = {
        "company": parsed_job.get("company"),
        "job_title": parsed_job.get("job_title"),
        "keywords": parsed_job.get("keywords", [])[:20],
        "timestamp": datetime.now().isoformat(),
    }
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    APPLICATION_CONTEXT_PATH.write_text(
        json.dumps(ctx, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _load_cv_report() -> dict:
    path = OUTPUT_DIR / "last_run_report.json"
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {}


def _write_lm_report(data: dict) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    LM_REPORT_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def main():
    print("=" * 55)
    print("ResumeForge — Pipeline candidature complète")
    print("=" * 55)

    # 1. Contexte
    print("\n[1/5] Lecture de la job description...")
    job_text = _load_job_description()
    parsed_job = parse_job(job_text)
    _write_application_context(parsed_job)
    print(f"      Entreprise  : {parsed_job.get('company')}")
    print(f"      Poste       : {parsed_job.get('job_title')}")

    # 2. Recherche entreprise
    print("\n[2/5] Recherche entreprise...")
    company_name, slug = identify_company(parsed_job)
    cache = CompanyCache(COMPANY_PROFILES_DIR, ttl_days=COMPANY_CACHE_TTL_DAYS)
    profile = cache.load(slug)

    if profile is None:
        print(f"      Cache absent/stale pour '{slug}' — recherche Gemini...")
        raw_research = research_company(company_name)
        profile = extract_facts(raw_research)
        profile["company_name"] = company_name
        profile["company_slug"] = slug
        cache.save(slug, profile)
        print(f"      Profil sauvegardé → data/company_profiles/{slug}.json")
        print(f"      {len(profile.get('facts', []))} faits extraits.")
    else:
        print(f"      Cache frais pour '{slug}' — réutilisation.")

    selected_facts, rejected_facts = select_facts(profile, parsed_job)
    print(f"      {len(selected_facts)} faits sélectionnés, {len(rejected_facts)} rejetés.")

    # 3. CV (boîte noire — ne pas modifier generate_cv.py)
    print("\n[3/5] Génération du CV...")
    generate_cv_main()
    cv_report = _load_cv_report()
    cv_path = cv_report.get("output_docx", "")
    if cv_path:
        print(f"      CV généré → {Path(cv_path).name}")

    # 4. LM
    print("\n[4/5] Génération de la LM...")
    letter_key = os.getenv("GEMINI_LETTER_API_KEY")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    run_id = timestamp

    if not letter_key:
        report = {
            "run_id": run_id,
            "validation_status": "skipped",
            "reason": "missing_GEMINI_LETTER_API_KEY",
            "cv_generated": True,
            "cv_output_path": cv_path,
            "timestamp": datetime.now().isoformat(),
        }
        _write_lm_report(report)
        print("      GEMINI_LETTER_API_KEY absente — LM ignorée.")
        print("      Rapport écrit → last_run_report_lm.json")
        return

    raw_response = generate_lm(
        parsed_job=parsed_job,
        selected_facts=selected_facts,
        cv_report=cv_report,
        job_text=job_text,
        api_key=letter_key,
    )

    replacements, validation = build_lm_replacements(
        raw_response=raw_response,
        parsed_job=parsed_job,
        selected_facts=selected_facts,
    )

    # 5. Export
    print("\n[5/5] Export...")
    if validation["status"] == "success":
        output_path = render_lm(replacements, parsed_job, timestamp)
        report = {
            "run_id": run_id,
            "company": parsed_job.get("company"),
            "company_slug": slug,
            "job_title": parsed_job.get("job_title"),
            "cv_output_path": cv_path,
            "lm_output_path": str(output_path),
            "validation_status": "success",
            "validation_errors": [],
            "selected_company_facts": selected_facts,
            "rejected_company_facts": rejected_facts,
            "facts_used": validation.get("facts_used", []),
            "selected_experiences": [
                e.get("company", "") for e in cv_report.get("selected_experiences", [])
            ],
            "raw_gemini_response": validation.get("parsed_letter", {}),
            "timestamp": datetime.now().isoformat(),
        }
        _write_lm_report(report)
        print(f"      LM générée  → {output_path.name}")
        print(f"      Rapport     → last_run_report_lm.json")
    else:
        failed_path = OUTPUT_DIR / f"LM_FAILED_{timestamp}.txt"
        content = "LM GENERATION FAILED\n\nErrors:\n"
        for err in validation.get("errors", []):
            content += f"  - {err}\n"
        content += f"\nRaw Gemini response:\n{raw_response}"
        failed_path.write_text(content, encoding="utf-8")

        report = {
            "run_id": run_id,
            "company": parsed_job.get("company"),
            "validation_status": "failed",
            "validation_errors": validation.get("errors", []),
            "raw_gemini_response": raw_response,
            "lm_output_path": None,
            "failed_output_path": str(failed_path),
            "timestamp": datetime.now().isoformat(),
        }
        _write_lm_report(report)
        print(f"      Validation échouée : {validation['errors']}")
        print(f"      Debug → {failed_path.name}")

    print("\n" + "=" * 55)
    print("Pipeline terminé.")
    print("=" * 55)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Verify import works without triggering CV generation**

```bash
python -c "import run_application; print('import OK')"
```

Expected: `import OK` (no CV generated, no errors)

- [ ] **Step 3: Commit**

```bash
git add run_application.py
git commit -m "feat: add run_application.py — orchestrate CV + company research + LM"
```

---

## Task 12 — Update `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add GEMINI_LETTER_API_KEY block**

Open `.env.example`. At the end of the file, add:

```env

# ----- Letter Generation / LM ------------------------------------------------
# Clé Gemini dédiée à la génération de lettres de motivation.
# Recommandé : utiliser une clé ou un projet Google Cloud séparé pour isoler l'usage.
# Si absent : la LM ne sera pas générée (avertissement propre, CV généré quand même).
GEMINI_LETTER_API_KEY=your_dedicated_letter_generation_key
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add GEMINI_LETTER_API_KEY to .env.example"
```

---

## Task 13 — Run full test suite + push

- [ ] **Step 1: Run all unit tests**

```bash
python -m pytest tests/ -v
```

Expected: all green. If any test fails, fix before continuing.

- [ ] **Step 2: Verify run.py is unmodified (regression check)**

```bash
python -c "from src.generate_cv import main; print('generate_cv import OK')"
```

Expected: `generate_cv import OK` — no side effects, no generation triggered.

- [ ] **Step 3: Smoke test with no GEMINI_LETTER_API_KEY**

With a valid `data/input/job_description.txt` and `data/reference/master_profile.xlsx`:

```bash
# Temporarily unset letter key to test skipped mode
GEMINI_LETTER_API_KEY="" python run_application.py
```

Expected:
- CV DOCX generated in `data/output/`
- `last_run_report_lm.json` written with `"validation_status": "skipped"`
- No crash

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

---

## Appendix — Key invariants to verify after any change

```
1. python run.py              → generates CV only, unchanged behaviour
2. python run_application.py  → generates CV + LM (or CV only if no letter key)
3. data/company_profiles/     → one JSON per company after first run
4. last_run_report_lm.json    → always written (success / skipped / failed)
5. No DOCX produced if LM validation fails
6. generate_cv.py             → never modified
```
