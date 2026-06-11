# Automatic Application Language Design

## Goal

ResumeForge must generate the CV and cover letter in the language expected by
the job description. Final application packs must contain only the recruiter
documents.

## Language Decision

The pipeline determines one `document_language` value before CV generation:

- `en` when the job description is predominantly English;
- `en` when the job description explicitly asks for an English CV or
  application, even if the surrounding page contains French job-board text;
- `fr` otherwise.

Explicit English requests such as `send in your CV (in English)` take priority
over the surrounding language. The selected language is recorded in internal
run reports and application context.

## CV Generation

The existing experience, leadership, certification, and skill selection logic
remains unchanged.

For English applications, Gemini must return:

- experience positions and bullets in professional English;
- leadership roles and bullets in professional English;
- certifications and skills translated only when translation is appropriate;
- unchanged company names, dates, locations, numbers, tools, and factual
  claims.

The CV template remains shared between languages. Static French labels in the
template are replaced at render time:

- `Education`
- `Certifications`
- `Experience`
- `Leadership & Activities`
- `Skills & Interests`
- `Technical skills`
- `Interests`
- `Languages`

The French proofreading gate runs only for French CVs. English CVs still
receive safe punctuation cleanup and factual/ATS checks.

## Cover Letter Generation

The letter prompt receives `document_language` from the application context.
It requests a professional English cover letter for `en` applications and a
professional French cover letter for `fr` applications.

English letter rendering uses English metadata:

- `Application for the position of ...`
- `Dear Hiring Manager`
- English date formatting.

The deterministic checks for invented numbers, experiences, tools, company
facts, placeholders, and markdown remain active in both languages. The French
spelling check and French-only cliché checks run only for French letters.

## Final Application Pack

Successful final packs contain only:

- `CV - <company> - <job>.docx`
- `LM - <company> - <job>.docx`

The pack does not contain:

- `validation.json`;
- `A_MODIFIER.md`;
- Markdown exports;
- failed-generation text files.

Internal JSON, Markdown, validation, and failure artifacts remain under
`data/output/` so the pipeline can validate, debug, and update the tracker.

CV-only packs contain only the CV DOCX. LM-only packs contain the reference CV
DOCX and generated LM DOCX.

## stichd Regeneration

After implementation, ResumeForge reruns the current stichd job description.
The resulting stichd pack must contain an English CV DOCX and English cover
letter DOCX only.

## Tests

Automated tests cover:

- predominantly English job descriptions;
- explicit English-CV requests inside mixed French/English job-board text;
- French job descriptions remaining French;
- English CV prompt requirements and translated template labels;
- English cover-letter prompt and metadata;
- language-aware validation;
- final packs containing DOCX files only.

