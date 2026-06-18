# ResumeForge Template Preview MVP

ResumeForge no longer uses OnlyOffice for the MVP editing flow.

The active workflow is:

```text
Job offer
  -> AI generation through the existing pipeline
  -> application pack with CV/LM DOCX
  -> structured CV/LM JSON session
  -> stable DOCX regeneration
  -> optional PDF preview through LibreOffice headless
  -> section editing in ResumeForge
  -> regenerate preview
  -> final ZIP with latest DOCX files
```

## Active Modules

- `src/web/template_sessions.py`
  - creates `data/output/template_sessions/{session_id}/`;
  - writes `cv_data.json` and `lm_data.json`;
  - generates `CV_Lucas_Pertusa.docx`;
  - generates `Lettre_Motivation_Lucas_Pertusa.docx`;
  - converts DOCX to PDF preview when LibreOffice is available;
  - exports the latest DOCX files in a ZIP.
- `src/web/templates/template_preview.html`
  - displays CV and LM tabs;
  - displays a PDF preview when available;
  - exposes editable section fields;
  - posts updates to regenerate DOCX/PDF.

## Session Shape

```text
data/output/template_sessions/{session_id}/
  cv_data.json
  lm_data.json
  session.json
  CV_Lucas_Pertusa.docx
  Lettre_Motivation_Lucas_Pertusa.docx
  CV_Lucas_Pertusa.pdf                 optional
  Lettre_Motivation_Lucas_Pertusa.pdf  optional
```

If LibreOffice headless is not available, ResumeForge shows a clear warning and
keeps the DOCX download available.

## Routes

```text
GET  /template-preview/{session_id}
POST /template-preview/{session_id}/regenerate
GET  /template-preview/{session_id}/files/{filename}
GET  /template-preview/{session_id}/export
```

## Run Locally

```bash
cd "/Users/insular/Desktop/ResumeReforge"
src/.venv/bin/python run_web.py
```

Open:

```text
http://127.0.0.1:8765
```

LibreOffice preview support is optional. On macOS, install it only if PDF
preview is needed:

```bash
brew install --cask libreoffice
```

The final ZIP always contains the latest DOCX files generated from the saved
JSON session.
