# SPEC - Local Web Interface

**Date:** 2026-06-08  
**Project:** ResumeForge  
**Status:** Validated design pending user review  
**Backup branch:** `backup/pre-local-ui-20260608`

---

## 1. Objective

Add a minimal localhost web interface around ResumeForge without replacing,
moving, or breaking the existing command-line workflows.

The interface must let the user:

- paste a job description;
- select `CV`, `CV + LM`, or `LM seulement`;
- generate the expected documents reliably;
- download one ZIP pack named with the ATS percentage, company, and job title;
- replace local reference files;
- optionally edit separate Gemini prompts for CV optimization and LM writing.

The interface is a private local tool, not a public SaaS.

---

## 2. Non-Negotiable Constraints

- The application binds only to `127.0.0.1`.
- No authentication, OAuth, account system, remote deployment, database, or
  paid infrastructure is added.
- Existing entry points such as `run_menu.py` and `run_application.py` keep
  working in parallel.
- Existing pipeline files are not moved or renamed.
- The web layer is additive and calls the existing Python pipeline.
- Existing user changes in the worktree are preserved.
- Private references, prompts, outputs, API keys, and tracker data remain
  local and ignored by Git.
- Only one generation may run at a time.
- The UI has no animations and very few visible controls.
- No generation history is shown or maintained by the web interface.

Gemini API use remains subject to the user's existing Google account quotas.

---

## 3. Chosen Architecture

Use a small FastAPI server with server-rendered HTML and minimal vanilla
JavaScript. HTMX may be used only where it simplifies form submission without
adding client-side state complexity.

```text
browser on localhost
  -> FastAPI web layer
  -> local reference manager
  -> web-run adapter
  -> existing ResumeForge pipeline
  -> output verifier
  -> ZIP pack download
```

The web layer owns only browser concerns:

- form handling;
- reference upload and replacement;
- prompt override editing;
- run locking;
- readable error messages;
- ZIP creation and download.

The existing pipeline remains responsible for CV and LM generation,
validation, ATS analysis, and application pack creation.

---

## 4. User Interface

The interface is a single clean page with no animation.

### Always Visible

- Title: `ResumeForge`
- Compact reference readiness summary.
- Large job-description textarea.
- Three mode choices:
  - `CV`
  - `CV + LM`
  - `LM seulement`
- One primary button: `Générer`
- Result area shown after a run.

### Closed By Default

Two native disclosure panels keep secondary controls out of the main flow:

- `Références locales`
- `Paramètres avancés`

### Result Area

After success, show:

- generated mode;
- detected company and job title;
- ATS percentage when available;
- produced document names;
- warnings, including a non-blocking tracker failure;
- one button: `Télécharger le pack`.

There is no history screen and no list of previous generations.

---

## 5. Reference Management

The `Références locales` panel manages four files:

| Reference | Destination | Required For |
|---|---|---|
| Profil Excel maître | `data/reference/master_profile.xlsx` | `CV`, `CV + LM` |
| Template CV Word | `templates/base_cv.docx` | `CV`, `CV + LM` |
| Template LM Word | `templates/base_cover_letter.docx` | `CV + LM`, `LM seulement` |
| CV de référence | `data/input/reference_cv.<ext>` | `LM seulement` |

Rules:

- A replacement is written atomically.
- The previous valid file remains in place if validation fails.
- Accepted extensions are explicit.
- DOCX templates are checked for required placeholders before replacement.
- The current filename and readiness state are shown.
- Uploaded private files remain ignored by Git.

The CV reference accepts the formats already supported by the CLI:
`.docx`, `.md`, and `.txt`.

---

## 6. Prompt Overrides

The `Paramètres avancés` panel contains two independent editable prompts:

- CV optimization prompt override;
- LM writing instructions override.

Rules:

- Default prompts remain the source of truth until an override is saved.
- Overrides are stored in an ignored local configuration directory.
- Empty overrides cannot be saved.
- Each prompt has a `Restaurer la valeur d'origine` action.
- Resetting removes the local override and immediately restores the existing
  built-in prompt.
- The UI must clearly distinguish a default prompt from a customized prompt.

The implementation should introduce narrow prompt-loading functions so both
the CLI and web interface use the same effective prompt without duplicating
prompt logic.

---

## 7. Mode Contracts

### `CV`

Required before run:

- non-empty job description;
- valid master Excel profile;
- valid CV DOCX template.

Success requires:

- a newly generated CV DOCX;
- a generated application pack;
- an ATS score when the existing pipeline can calculate it.

### `CV + LM`

Required before run:

- non-empty job description;
- valid master Excel profile;
- valid CV DOCX template;
- valid LM DOCX template;
- required Gemini configuration.

Success requires:

- a newly generated CV DOCX;
- a newly generated LM DOCX;
- successful LM validation;
- a generated application pack.

If LM generation fails after the CV succeeds, the UI reports a partial
failure and must not claim that `CV + LM` succeeded.

### `LM seulement`

Required before run:

- non-empty job description or target context;
- valid stored reference CV;
- valid LM DOCX template;
- required Gemini configuration.

Success requires:

- the stored reference CV copied into the pack;
- a newly generated LM DOCX;
- successful LM validation;
- a generated application pack.

---

## 8. Reliability Controls

The web adapter must treat generated artifacts, not console output, as proof
of success.

Before a run:

- validate the selected mode;
- validate required references and configuration;
- reject an empty job description;
- acquire a process-level generation lock;
- prepare an isolated web-run workspace.

During a run:

- keep secrets and privileged operations server-side;
- capture pipeline output for diagnostics;
- do not allow a second browser request to start another generation;
- preserve existing non-blocking Google Sheets behavior.

The CLI and web interface remain independently usable, but they must not run
generations at the exact same time because the existing pipeline uses shared
runtime input and output paths. Supporting simultaneous CLI and web generation
would require a separate path-isolation refactor outside this feature's scope.

After a run:

- verify every artifact required by the selected mode exists;
- verify the LM validation status for modes requiring a letter;
- build a ZIP from the verified application pack;
- expose only the current ZIP to the browser;
- release the run lock even after failure.

Errors must be actionable and must never expose API keys, private document
contents, stack traces, or filesystem internals in the browser.

---

## 9. Output And Replacement Policy

The browser exposes one current result only.

ZIP naming:

```text
<ATS>% <Entreprise> - <Poste>.zip
```

If ATS is unavailable:

```text
Entreprise - Poste.zip
```

The current web result is replaced on the next successful run. The interface
does not maintain a history. Existing pipeline output behavior outside the
web-owned result directory remains unchanged so CLI usage stays compatible.

---

## 10. Additive File Boundaries

New web-specific code should live under a dedicated package:

```text
src/web/
  app.py
  generation_service.py
  prompt_overrides.py
  reference_manager.py
  result_packager.py
  templates/
  static/
```

Tests should be added as separate web-focused files under `tests/`.

Existing pipeline modules may receive only narrow compatibility changes that
are required to expose reusable functions or load prompt overrides. Existing
CLI entry points and their observable behavior must remain intact.

---

## 11. Testing Strategy

Automated tests must cover:

- readiness checks for each of the three modes;
- successful artifact verification for each mode;
- rejection when a required reference is missing;
- partial failure when CV succeeds but LM fails;
- non-blocking Google Sheets failure;
- prevention of concurrent runs;
- reference replacement validation and atomicity;
- prompt override save, load, reset, and empty-value rejection;
- ZIP naming with and without ATS score;
- localhost binding configuration;
- regression smoke tests for existing CLI entry points.

Real Gemini calls are not used in automated tests.

Manual acceptance checks:

1. Start the local server.
2. Confirm it listens on `127.0.0.1`, not all interfaces.
3. Replace each reference through the UI.
4. Run `CV`, `CV + LM`, and `LM seulement`.
5. Confirm each mode produces exactly its required documents.
6. Confirm the ZIP name begins with the ATS percentage when available.
7. Confirm `run_menu.py` still works independently.

---

## 12. Definition Of Done

The feature is complete when:

- the interface is usable from one localhost page;
- the three modes pass their artifact-based success contracts;
- reference replacement and prompt overrides work;
- only one current ZIP is offered;
- existing CLI workflows remain functional;
- automated tests pass;
- no private file or secret is added to Git;
- no paid infrastructure or hosted dependency is introduced.
