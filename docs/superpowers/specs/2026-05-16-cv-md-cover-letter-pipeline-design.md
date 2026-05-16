# SPEC - CV Markdown + Cover Letter Pipeline

**Date:** 2026-05-16  
**Project:** ResumeForge  
**Status:** Source of truth for the CV Markdown + LM DOCX pipeline.  
**Supersedes:** `docs/superpowers/specs/2026-05-15-company-research-lm-pipeline-design.md`

---

## 1. Objective

Add a complete application pipeline while preserving the existing CV generator.

The pipeline must produce:

- Final CV DOCX.
- Final CV Markdown for Gemini.
- `application_context.json`.
- Final cover letter DOCX only.
- Validation JSON.
- Updated application tracker.

There is no final cover letter Markdown export.

`run.py` remains the CV-only entry point. `src/generate_cv.py` remains unchanged. The complete application flow is orchestrated by `run_application.py`.

---

## 2. Non-Negotiable Decisions

### Final Outputs

Each successful application run produces:

- `data/output/CV_...docx` from the existing CV pipeline.
- `data/output/CV_...md` derived from the final personalized CV.
- `data/output/application_context.json`.
- `data/output/LM_...docx`.
- `data/output/letter_validation.json`.
- An updated applications tracker.

The pipeline must not produce a final LM Markdown file. Markdown is allowed only as reference material for Gemini prompts.

### Reference Markdown Files Only

The only LM Markdown reference files are:

- `templates/LM_template.md`
- `templates/LM_demo_validee.md`
- `templates/LM_instructions.md`

These files are prompt references. They are not final user-facing exports.

### Source of Truth

- The LM uses the final CV Markdown.
- The LM never reads `master_profile.xlsx` directly.
- The CV Markdown is derived from the final personalized CV, not from raw profile data.
- `application_context.json` controls what is authorized for the LM generation.
- Any information absent from `application_context.json` is unauthorized for the final LM.

### Templates

- `templates/base_cover_letter_example.docx` is versioned.
- `templates/base_cover_letter.docx` is private and ignored by Git.
- The user creates their private template at the end with:

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

The renderer uses `templates/base_cover_letter.docx` for real runs and may use the example template in tests.

### Validation

The LM must pass deterministic validation before DOCX export.

Validation must check that:

- The generated result is valid JSON.
- Required fields are present.
- The LM uses only facts allowed by `application_context.json`.
- No unsupported fact from the JD, company research, or CV is invented.
- No direct `master_profile.xlsx` dependency exists in the LM path.
- The final output target is DOCX only.

If validation fails, no final LM DOCX is produced. A validation JSON file must still be written.

---

## 3. Target Architecture

```text
run.py
  -> existing CV-only flow, unchanged

run_application.py
  -> parses the JD
  -> runs existing CV generation
  -> exports final CV Markdown
  -> builds application_context.json
  -> loads or refreshes company research cache
  -> builds Gemini LM prompt from reference Markdown files
  -> calls Gemini with GEMINI_LETTER_API_KEY
  -> parses letter_result.json
  -> validates deterministically
  -> renders final LM DOCX only
  -> updates application tracker
```

`run_application.py` is the orchestrator for the full application. It may call existing public functions, but it must not rewrite the existing CV-only behavior.

---

## 4. Data Flow

```text
JD + existing CV generator
        |
        v
Final personalized CV DOCX
        |
        v
Final personalized CV Markdown
        |
        v
application_context.json
        |
        +--> company_research cache JSON
        |
        v
Gemini LM prompt
        |
        v
letter_result.json
        |
        v
deterministic validation JSON
        |
        v
final LM DOCX
        |
        v
tracker updated
```

The LM prompt may include the final CV Markdown, the JD, selected company facts, and explicit authorization boundaries from `application_context.json`.

---

## 5. `application_context.json`

`application_context.json` is the authorization layer for the LM.

It should contain:

- Application metadata: company, job title, run date, output filenames.
- JD summary and selected JD evidence.
- Final CV Markdown path and extracted CV facts.
- Selected company facts from cached research.
- Explicit allowed claims.
- Explicit rejected or unavailable claims.
- Validation constraints for the LM.

The LM generator must treat this file as the boundary of truth. If a claim is not present or derivable from this context, it must not appear in the final LM.

---

## 6. Company Research

`company_research` is retained with a JSON cache.

Rules:

- Company profiles live under `data/company_profiles/`.
- Cache entries are JSON.
- Stale or missing cache entries may be refreshed through Gemini Search grounding.
- Selected facts are copied into `application_context.json`.
- The LM uses only selected facts from `application_context.json`, not raw research output.

The company research module may keep its previous architecture where useful, but the final LM is controlled by the context file.

---

## 7. Gemini Cover Letter Generation

The LM generator uses a dedicated environment variable:

```text
GEMINI_LETTER_API_KEY
```

The prompt builder reads exactly these reference files:

- `templates/LM_template.md`
- `templates/LM_demo_validee.md`
- `templates/LM_instructions.md`

The Gemini output must be JSON, saved as `letter_result.json` or equivalent intermediate run artifact. It is not a final Markdown export.

The generator must be testable without a real API key. Tests must mock Gemini calls or test prompt construction, parsing, validation, and rendering locally.

---

## 8. DOCX Rendering

The final LM renderer produces DOCX only.

Template policy:

- `templates/base_cover_letter_example.docx` is committed.
- `templates/base_cover_letter.docx` is local/private.
- `templates/base_cover_letter.docx` must be ignored by Git.
- `scripts/create_cover_letter_template.py` creates or refreshes the example template.

The renderer must fail clearly if the private template is missing in a real run, with instructions to create it from the example template.

---

## 9. Tracker Update

After a completed application run, the tracker is updated with:

- Company.
- Job title.
- Date.
- CV DOCX path.
- CV Markdown path.
- LM DOCX path if validation succeeded.
- Validation status.
- Company research cache status.

Tracker update failures should be reported without corrupting generated artifacts.

---

## 10. Compatibility Constraints

Preserve these constraints from the previous plan:

- `run.py` stays unchanged.
- `src/generate_cv.py` stays unchanged.
- `run_application.py` is the full application orchestrator.
- `company_research` keeps JSON caching.
- `GEMINI_LETTER_API_KEY` is dedicated to LM generation.
- Tests do not require API keys.
- CI runs through GitHub Actions.
