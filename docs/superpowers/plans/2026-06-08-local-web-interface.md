# Local Web Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a free, localhost-only interface that reliably runs ResumeForge's three existing generation modes without replacing the CLI.

**Architecture:** A small FastAPI package under `src/web/` owns browser forms, local reference replacement, prompt overrides, subprocess orchestration, artifact verification, and ZIP download. The generation adapter invokes the existing `run_menu.py` command so the CLI remains the single pipeline implementation. Narrow prompt-loader hooks let both CLI and web runs use optional ignored local overrides.

**Tech Stack:** Python 3.11, FastAPI, Uvicorn, Jinja2, vanilla HTML/CSS, pytest.

---

## File Structure

- Create `src/web/app.py`: FastAPI routes and localhost server entry point.
- Create `src/web/generation_service.py`: subprocess mode orchestration, locking, artifact verification, and sanitized results.
- Create `src/web/reference_manager.py`: reference readiness, validation, and atomic replacement.
- Create `src/web/prompt_overrides.py`: ignored local CV/LM prompt override storage.
- Create `src/web/result_packager.py`: current-result cleanup and ZIP creation.
- Create `src/web/templates/index.html`: single-page interface.
- Create `src/web/static/styles.css`: minimal static styling with no animations.
- Create `src/web/__init__.py`: web package marker.
- Create `run_web.py`: localhost-only launcher.
- Create `tests/test_web_reference_manager.py`: reference validation tests.
- Create `tests/test_web_prompt_overrides.py`: prompt override tests.
- Create `tests/test_web_result_packager.py`: ZIP naming and replacement tests.
- Create `tests/test_web_generation_service.py`: three-mode contracts and failure tests.
- Create `tests/test_web_app.py`: route and localhost configuration tests.
- Modify `.gitignore`: ignore local prompt overrides and current web ZIP.
- Modify `requirements.txt`: add the web dependencies without changing existing pins.
- Modify `src/llm/cv_enhancer.py`: append the effective local CV prompt override when present.
- Modify `run_application.py`: load effective LM instructions through the shared override helper.
- Modify `run_menu.py`: load effective LM instructions through the shared override helper.
- Modify `README.md`: document the optional local interface and preserve CLI instructions.

### Task 1: Reference And Prompt Storage

- [ ] Write failing tests for reference readiness, extension validation, DOCX placeholder validation, atomic replacement, prompt save/load/reset, and empty prompt rejection.
- [ ] Run `src/.venv/bin/python -m pytest tests/test_web_reference_manager.py tests/test_web_prompt_overrides.py -q` and confirm failures are caused by missing web modules.
- [ ] Implement `reference_manager.py` and `prompt_overrides.py` with local-only paths and atomic writes.
- [ ] Add ignored local web paths to `.gitignore`.
- [ ] Run the focused tests and confirm they pass.

### Task 2: Prompt Integration Without CLI Replacement

- [ ] Write failing tests showing the effective CV override is appended and the effective LM instructions replace the default only when an override exists.
- [ ] Run focused prompt tests and confirm the new expectations fail.
- [ ] Add narrow prompt-loader calls to `cv_enhancer.py`, `run_application.py`, and `run_menu.py`.
- [ ] Run focused prompt tests plus existing LM prompt and CV tests.

### Task 3: Artifact Verification And ZIP Packaging

- [ ] Write failing tests for ATS ZIP naming, replacement of the current ZIP, required artifact checks per mode, and partial `CV + LM` failure.
- [ ] Run `src/.venv/bin/python -m pytest tests/test_web_result_packager.py tests/test_web_generation_service.py -q` and confirm missing-module failures.
- [ ] Implement `result_packager.py` and the pure verification/result helpers in `generation_service.py`.
- [ ] Run focused tests and confirm they pass.

### Task 4: Existing CLI Subprocess Adapter

- [ ] Add failing tests for mode-to-stdin mapping, missing prerequisites, one-run lock behavior, sanitized subprocess errors, and successful result discovery.
- [ ] Run the focused generation-service tests and confirm failures.
- [ ] Implement the subprocess adapter around `run_menu.py`, preserving shared-path constraints and preventing concurrent web runs.
- [ ] Run generation-service tests and relevant existing fallback/input tests.

### Task 5: Minimal FastAPI Interface

- [ ] Write failing route tests for the home page, reference upload, prompt save/reset, generation form validation, result download, and localhost host constant.
- [ ] Run `src/.venv/bin/python -m pytest tests/test_web_app.py -q` and confirm failures.
- [ ] Implement `app.py`, `run_web.py`, `index.html`, and `styles.css`.
- [ ] Keep one visible primary action, native disclosure panels, no animations, and no history.
- [ ] Run route tests and confirm they pass.

### Task 6: Dependencies And Documentation

- [ ] Add pinned-compatible FastAPI, Uvicorn, Jinja2, and multipart dependencies to `requirements.txt`.
- [ ] Add localhost startup and usage instructions to `README.md` while preserving CLI usage as the primary existing path.
- [ ] Install dependencies into `src/.venv`.
- [ ] Run import and startup smoke checks.

### Task 7: Full Verification

- [ ] Run all web tests.
- [ ] Run the full existing pytest suite.
- [ ] Start the server on `127.0.0.1` and verify the home page and static CSS through HTTP.
- [ ] Verify the server is not bound to `0.0.0.0`.
- [ ] Inspect the rendered page at desktop and mobile widths.
- [ ] Run `git diff --check`.
- [ ] Review `git status` and ensure no private references, prompts, outputs, credentials, or tracker data were newly staged.
- [ ] Confirm the existing CLI entry points remain present and documented.
