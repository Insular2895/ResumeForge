# ResumeForge - Guide d'utilisation

## Fichiers privés à préparer

Ces fichiers restent locaux et ne doivent pas être commit.

| Fichier | Rôle |
|---|---|
| `.env` | Clés API et configuration Gemini |
| `data/input/job_description.txt` | Offre d'emploi à cibler |
| `data/reference/master_profile.xlsx` | Base profil, compétences, expériences |
| `templates/base_cv.docx` | Template Word du CV |
| `templates/base_cover_letter.docx` | Template Word privé de la LM |
| `data/tracker/applications.csv` | Suivi local des candidatures |

## Configuration API

Le repo fournit uniquement le modèle :

```text
.env.example
```

Chaque utilisateur crée son propre fichier privé :

```bash
cp .env.example .env
```

Dans `.env`, chacun met ses propres clés Gemini :

```env
USE_GEMINI=true

GEMINI_API_KEY=your_gemini_cv_key_here
GEMINI_ROTATION_MODELS=gemini-3.1-flash-lite,gemini-3-flash-preview,gemini-2.5-flash-lite,gemini-2.5-flash
GEMINI_OPTIONAL_MODELS=gemini-2.0-flash

GEMINI_LETTER_API_KEY=your_gemini_letter_key_here
GEMINI_LETTER_MODEL=gemini-3.1-flash-lite
GEMINI_LETTER_FALLBACK_MODELS=gemini-3-flash-preview,gemini-2.5-flash-lite,gemini-2.5-flash

GEMINI_DOMAIN_API_KEY=your_gemini_domain_key_here
GEMINI_DOMAIN_MODEL=gemini-3.1-flash-lite
AUTO_ENRICH_DOMAIN_VOCABULARY=false
```

## Configuration Google Sheets

Chaque utilisateur doit connecter son propre tracker Google Sheets.

Dans `.env` :

```env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SHEET_TAB=applications
```

`GOOGLE_SHEET_ID` correspond à la partie centrale de l'URL :

```text
https://docs.google.com/spreadsheets/d/<GOOGLE_SHEET_ID>/edit
```

Puis ajouter localement le service account :

```text
credentials/service_account.json
```

Le service account doit être partagé sur le Google Sheet avec un accès éditeur.

Ces fichiers restent privés et ne doivent jamais être commit :

```text
.env
credentials/service_account.json
data/tracker/applications.csv
```

## Template CV

Fichier :

```text
templates/base_cv.docx
```

Placeholders principaux :

```text
[[EXP_1_COMPANY]]
[[EXP_1_POSITION_TITLE]]
[[EXP_1_LOCATION]]
[[EXP_1_DATES]]
[[EXP_1_BULLETS]]
[[EXP_2_COMPANY]]
[[EXP_2_POSITION_TITLE]]
[[EXP_2_LOCATION]]
[[EXP_2_DATES]]
[[EXP_2_BULLETS]]
[[LEAD_1_ORG]]
[[LEAD_1_ROLE]]
[[LEAD_1_LOCATION]]
[[LEAD_1_DATES]]
[[LEAD_1_BULLETS]]
[[TECHNICAL_SKILLS]]
[[CERTIFICATION_ENTRIES]]
```

Le rendu force la police en Arial.

## Template LM

Exemple versionné :

```text
templates/base_cover_letter_example.docx
```

Template privé :

```text
templates/base_cover_letter.docx
```

Créer le template privé :

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

Placeholders LM :

```text
[[CANDIDATE_FULL_NAME]]
[[CANDIDATE_ADDRESS_LINE_1]]
[[CANDIDATE_ADDRESS_LINE_2]]
[[CANDIDATE_PHONE]]
[[CANDIDATE_EMAIL]]
[[LM_COMPANY]]
[[LM_COMPANY_ADDRESS_LINE_1]]
[[LM_COMPANY_POSTAL_CITY]]
[[LM_ATTENTION_TO]]
[[LM_DEPARTMENT]]
[[LM_JOB_TITLE]]
[[LM_SALUTATION]]
[[LM_FINAL_LETTER]]
[[LM_DATE]]
[[LM_SIGNATURE]]
```

Gemini remplit uniquement `[[LM_FINAL_LETTER]]`. Les autres champs viennent du contexte, du template ou de la configuration.

Le rendu force la police en Arial.

## Références LM Gemini

Ces fichiers guident Gemini. Ce ne sont pas des sorties finales.

```text
templates/LM_instructions.md
templates/LM_template.md
templates/LM_demo_validee.md
```

## Base métier

Les vocabulaires métier sont ici :

```text
templates/domain_vocabulary/
```

Exemples :

```text
templates/domain_vocabulary/supply_chain.json
templates/domain_vocabulary/retail_operations.json
templates/domain_vocabulary/_cross_domain_terms.json
```

Le pipeline charge seulement le domaine détecté pour éviter de brûler les tokens.

Pour enrichir manuellement une base métier à partir de la JD courante :

```bash
src/.venv/bin/python scripts/enrich_domain_vocabulary.py
```

## Commande quotidienne

Commande recommandée :

```bash
src/.venv/bin/python run_application.py --quiet
```

Elle affiche seulement les chemins finaux.

## Sorties

```text
data/output/CV_....docx
data/output/application_context.json
data/output/cover_letters/LM_....docx
data/output/cover_letters/LM_...._validation.json
```

Le CV Markdown est temporaire : il sert à Gemini pendant le run, puis il est supprimé automatiquement après génération réussie de la LM DOCX.

Il n'y a pas de LM finale Markdown.

## Tracker

Tracker local :

```text
data/tracker/applications.csv
```

Champs principaux :

```text
timestamp
company
job_title
salary
location
job_url
job_family
cv_docx_path
lm_docx_path
score
selected_experiences
selected_certifications
selected_technical_skills
validation_status
tracker_update_status
```

Il n'y a pas de champ `lm_md_path` ni `cv_markdown_path` dans le tracker.
