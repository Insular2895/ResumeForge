# CV Markdown + Cover Letter Pipeline - Implementation Plan

> **For Codex:** This is the active plan for coding the CV Markdown + LM DOCX pipeline. Do not follow the superseded 2026-05-15 plan except for explicitly retained constraints listed below.

**Goal:** Produce a complete application package from `run_application.py`: final CV DOCX, final CV Markdown for Gemini, `application_context.json`, validated final LM DOCX only, validation JSON, and an updated applications tracker.

**Spec reference:** `docs/superpowers/specs/2026-05-16-cv-md-cover-letter-pipeline-design.md`

---

## Active Decisions

- Final CV outputs are DOCX and Markdown.
- The final LM output is DOCX only.
- No final LM Markdown export is allowed.
- `templates/LM_template.md`, `templates/LM_demo_validee.md`, and `templates/LM_instructions.md` are Gemini references only.
- `templates/base_cover_letter_example.docx` is versioned.
- `templates/base_cover_letter.docx` is private and ignored by Git.
- The LM uses the final CV Markdown.
- The LM never reads `master_profile.xlsx` directly.
- `application_context.json` controls authorized facts and claims.
- Deterministic validation runs before DOCX rendering.
- The applications tracker is updated at the end of the pipeline.

---

## Retained From Previous Plan

- `run.py` remains unchanged.
- `src/generate_cv.py` remains unchanged.
- `run_application.py` is the orchestrator.
- `company_research` uses a JSON cache.
- LM generation uses dedicated `GEMINI_LETTER_API_KEY`.
- Tests must run without API keys.
- CI uses GitHub Actions.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/config.py` | Add paths for CV Markdown, application context, LM references, LM result, validation JSON, tracker output, and cover letter templates |
| Create/Modify | `run_application.py` | Orchestrate CV generation, CV Markdown export, context build, research, LM generation, validation, rendering, tracker update |
| Create | `src/cv_markdown/` | Export final personalized CV to Markdown for Gemini |
| Create/Modify | `src/company_research/` | Identify company, load or refresh JSON cache, select facts for context |
| Create | `src/application_context/` | Build `application_context.json` from final CV Markdown, JD, and selected company facts |
| Create | `src/letter/prompt_builder.py` | Build Gemini LM prompt from context and reference Markdown files |
| Create | `src/letter/lm_generator.py` | Call Gemini with `GEMINI_LETTER_API_KEY` |
| Create | `src/letter/letter_result_parser.py` | Parse Gemini JSON into `letter_result.json` |
| Create | `src/letter/letter_validator.py` | Deterministic validation against `application_context.json` |
| Create | `src/letter/lm_docx_renderer.py` | Render final LM DOCX only |
| Create | `scripts/create_cover_letter_template.py` | Generate `templates/base_cover_letter_example.docx` |
| Create | `templates/LM_template.md` | Reference structure for Gemini |
| Create | `templates/LM_demo_validee.md` | Annotated validated example for Gemini |
| Create | `templates/LM_instructions.md` | Rules and constraints for Gemini |
| Create | `templates/base_cover_letter_example.docx` | Versioned example template |
| Modify | `.gitignore` | Ignore `templates/base_cover_letter.docx` |
| Modify | `.env.example` | Document `GEMINI_LETTER_API_KEY` |
| Create/Modify | `tests/` | Unit tests without API keys |
| Create | `.github/workflows/ci.yml` | Run tests in CI |
| Modify | `README.md` | Document the full application flow |

---

## Task 1 - Add Config Paths

- [ ] Add config paths for final CV Markdown output.
- [ ] Add `APPLICATION_CONTEXT_PATH`.
- [ ] Add LM reference Markdown paths:
  - `LM_TEMPLATE_MD_PATH`
  - `LM_DEMO_VALIDEE_MD_PATH`
  - `LM_INSTRUCTIONS_MD_PATH`
- [ ] Add `LETTER_RESULT_PATH`.
- [ ] Add `LETTER_VALIDATION_PATH`.
- [ ] Add `BASE_COVER_LETTER_EXAMPLE_PATH`.
- [ ] Add `BASE_COVER_LETTER_PATH`.
- [ ] Add or confirm `COMPANY_PROFILES_DIR`.
- [ ] Add tracker output/config paths if missing.
- [ ] Ensure required project directories are created.

Acceptance:

- `python -c "from src import config; print(config.APPLICATION_CONTEXT_PATH)"` works.
- Existing CV-only imports still work.

---

## Task 2 - Add Final CV Markdown Export

- [ ] Create a module that derives Markdown from the final personalized CV output.
- [ ] Ensure the Markdown represents the final CV, not raw `master_profile.xlsx`.
- [ ] Include sections needed by Gemini: identity, target role, selected experiences, selected skills, education, languages, and relevant evidence.
- [ ] Write the final CV Markdown to `data/output/`.
- [ ] Add the Markdown path to the run report or orchestration context.

Acceptance:

- A full application run can produce both final CV DOCX and final CV Markdown.
- The LM path can consume the Markdown without reading `master_profile.xlsx`.

---

## Task 3 - Build `application_context.json`

- [ ] Build context from final CV Markdown, JD, and selected company facts.
- [ ] Include allowed claims and rejected/unavailable claims.
- [ ] Include company, job title, run date, and artifact paths.
- [ ] Include validation constraints for the LM.
- [ ] Save to `data/output/application_context.json`.

Acceptance:

- `application_context.json` is sufficient to explain why every final LM claim is allowed.
- The context does not include raw spreadsheet dependencies.

---

## Task 4 - Add or Adapt `company_research`

- [ ] Keep JSON cache under `data/company_profiles/`.
- [ ] Identify company from parsed JD/application context.
- [ ] Load fresh cached facts when available.
- [ ] Refresh stale or missing facts through Gemini Search grounding.
- [ ] Select only relevant, sourced facts.
- [ ] Copy selected facts into `application_context.json`.

Acceptance:

- A cached company can be used without an API call.
- If no facts are eligible, the LM pipeline continues without inventing company personalization.

---

## Task 5 - Create LM Reference Markdown Files

- [ ] Create `templates/LM_instructions.md`.
- [ ] Create `templates/LM_template.md`.
- [ ] Create `templates/LM_demo_validee.md` as an annotated validated reference.
- [ ] Make clear inside those files that they are references for Gemini, not final exports.
- [ ] Ensure no task writes a final LM Markdown artifact.

Acceptance:

- Prompt builder can load all three files.
- Tests can assert these files exist and are read as references.

---

## Task 6 - Create LM Prompt Builder

- [ ] Build the prompt from `application_context.json`.
- [ ] Include final CV Markdown.
- [ ] Include JD evidence and selected company facts.
- [ ] Include the three LM Markdown reference files.
- [ ] Require JSON-only Gemini output.
- [ ] Explicitly forbid unsupported claims and final Markdown output.

Acceptance:

- Prompt construction is deterministic and testable without API keys.

---

## Task 7 - Create Gemini LM Generator

- [ ] Use `GEMINI_LETTER_API_KEY`, not the standard CV key.
- [ ] Make exactly one Gemini call for LM generation per LM attempt.
- [ ] Return raw text for parsing.
- [ ] If the key is missing, skip LM generation cleanly and write a validation/report status.

Acceptance:

- Tests use mocks and do not require `GEMINI_LETTER_API_KEY`.

---

## Task 8 - Create `letter_result.json` Parser

- [ ] Strip accidental Markdown fences if present.
- [ ] Parse Gemini output as JSON.
- [ ] Validate the expected result shape.
- [ ] Save normalized `letter_result.json`.
- [ ] Report parse errors in validation JSON.

Acceptance:

- Invalid JSON never reaches DOCX rendering.

---

## Task 9 - Create Deterministic Validator

- [ ] Validate required fields.
- [ ] Validate that all claims are authorized by `application_context.json`.
- [ ] Validate that selected company facts came from the context.
- [ ] Validate that the LM path did not read `master_profile.xlsx`.
- [ ] Validate that the renderer target is DOCX only.
- [ ] Save `letter_validation.json`.

Acceptance:

- Validation failure prevents final LM DOCX export.
- Validation always writes a JSON result.

---

## Task 10 - Create LM DOCX Renderer Only

- [ ] Render final LM DOCX from parsed and validated letter result.
- [ ] Use `templates/base_cover_letter.docx` for real runs.
- [ ] Allow tests to use `templates/base_cover_letter_example.docx`.
- [ ] Do not render or export final LM Markdown.
- [ ] Fail clearly if the private template is missing.

Acceptance:

- Successful validation produces one final LM DOCX.
- No final LM Markdown file is created.

---

## Task 11 - Create `create_cover_letter_template.py`

- [ ] Add `scripts/create_cover_letter_template.py`.
- [ ] Generate `templates/base_cover_letter_example.docx`.
- [ ] Document that the private template is created with:

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

- [ ] Ensure `templates/base_cover_letter.docx` is ignored by Git.

Acceptance:

- The example template can be regenerated.
- The private template is never committed.

---

## Task 12 - Update Applications Tracker

- [ ] Update tracker after the pipeline completes.
- [ ] Record company, job title, date, artifact paths, validation status, and research cache status.
- [ ] Handle tracker failures without deleting generated artifacts.

Acceptance:

- Tracker state reflects each completed or skipped LM run.

---

## Task 13 - Add Tests

- [ ] Test config paths.
- [ ] Test CV Markdown export from representative final CV data.
- [ ] Test application context builder.
- [ ] Test company research cache and fact selection without API calls.
- [ ] Test prompt builder loads the three reference Markdown files.
- [ ] Test Gemini generator with mocks only.
- [ ] Test parser with valid JSON, fenced JSON, and invalid JSON.
- [ ] Test deterministic validator success and failure cases.
- [ ] Test DOCX renderer with the example template.
- [ ] Test that no final LM Markdown export is produced.

Acceptance:

- `python -m pytest` passes without API keys.

---

## Task 14 - Add CI

- [ ] Add GitHub Actions workflow.
- [ ] Install dependencies.
- [ ] Run tests without secrets.
- [ ] Ensure API-dependent tests are mocked or skipped by design.

Acceptance:

- CI can pass on a clean checkout without private keys or private templates.

---

## Task 15 - Update README

- [ ] Document `run.py` for CV-only generation.
- [ ] Document `run_application.py` for the complete application pipeline.
- [ ] Document final outputs.
- [ ] Document that there is no final LM Markdown export.
- [ ] Document `GEMINI_LETTER_API_KEY`.
- [ ] Document company research cache behavior.
- [ ] Document how to create the private cover letter template:

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

Acceptance:

- A new contributor understands the active pipeline and does not follow the superseded 2026-05-15 plan.
