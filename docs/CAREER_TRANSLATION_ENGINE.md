# ResumeForge Career Translation Engine

ResumeForge treats professional experience as immutable evidence and translates
that evidence into the vocabulary of a target profession.

## Pipeline

```text
validated profile evidence
  -> target profession detection
  -> four-layer coverage assessment
  -> enrichment request when coverage is weak
  -> supported / unsupported term boundary
  -> career translation
  -> ATS optimization
```

## Four Layers

Each target profession defines:

- `concepts`: domain terminology and frameworks;
- `actions`: verbs used by practitioners;
- `objects`: items manipulated by the profession;
- `results`: outcomes recruiters expect.

Domains may also define narrow `evidence_signals`. These map a real-world
description such as `gestion de partenaires fournisseurs` to a defensible
professional concept such as `SRM`, without treating every adjacent term as
proven.

`templates/career_translation/domains.json` contains reusable accelerators, not
an exhaustive taxonomy. When a job description does not match an existing or
previously learned profession, ResumeForge creates a new four-layer model from
the job description and caches it under
`data/local_config/career_translation_domains/`.

This allows the engine to support any sufficiently described profession rather
than forcing unknown jobs into the closest preset.

The engine calculates coverage for every layer and an overall score. Generation
requires both the overall threshold and at least one supported term in every
layer. A weak or uneven score opens enrichment mode instead of allowing
ResumeForge to invent missing experience.

## Credibility Boundary

`src/application/career_translation.py` returns:

- `supported_terms`: vocabulary grounded in profile evidence;
- `unsupported_terms`: vocabulary that cannot yet be claimed;
- targeted questions for missing evidence.

The CV enhancer receives this boundary. Supported terms may be integrated
naturally. Unsupported terms are forbidden until the user validates new facts.
Legacy contextual skill fallbacks and ATS-missing keywords are not rendered as
candidate skills unless they are already backed by profile evidence.
The technical skills line stays intentionally short. Domain terms such as TCO,
SRM or expected results belong primarily in experience bullets, not in a
catch-all skills list.

## Experience Memory

Validated enrichment is appended to the `experience_memory` sheet of
`master_profile.xlsx`. Existing truth bullets are never overwritten. Every
memory entry must be linked to a real `experience_id`.

Each memory entry records:

- related experience identifier;
- target profession;
- free-form description;
- targeted question/answer pairs;
- validation status, active/archive status, provenance and a deduplication hash.

This lets later CV generations reuse previously validated facts during
experience selection, skills selection and bounded rewriting. Archived entries
are excluded. Backups use microsecond timestamps so rapid writes do not
overwrite one another.

## Web Flow

The local interface keeps its existing visual design:

1. The user pastes a job description and optionally selects a target profession.
2. ResumeForge assesses profile coverage before generation.
3. If coverage is sufficient, generation continues normally.
4. If coverage is weak, a native dialog shows layer scores and targeted questions.
5. The user selects the real experience concerned.
6. Only user-validated answers are written to experience memory.

The resolved target domain is propagated through the web subprocess, CV
enhancer, technical skills and letter application context. The letter remains
bounded by the final CV.

## Office Editing Before Export

After generation, the preferred web flow opens the generated DOCX files in
ONLYOFFICE Docs Community Edition. This avoids the HTML reconstruction problem:
the base CV template, photo, Word styles, tables, lists and document-level
formatting remain inside the actual DOCX.

The integration keeps the existing FastAPI and Jinja app structure:

```text
generated application pack
  -> copy real CV/LM DOCX into an OnlyOffice session
  -> serve the files through ResumeForge URLs
  -> initialize DocsAPI.DocEditor
  -> save edited DOCX through OnlyOffice callback
  -> export final DOCX files in a ZIP
```

TipTap can remain useful as a lightweight fallback/editor experiment, but it is
not the fidelity target for template-preserving CV editing. The source of truth
for professional preview/edit/export is now the DOCX itself.

OnlyOffice-specific setup and limitations are documented in
`docs/ONLYOFFICE_INTEGRATION.md`.
