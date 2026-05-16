# ResumeForge - Commandes prêtes

## 1. Lancer le pipeline complet sans bruit

```bash
src/.venv/bin/python run_application.py --quiet
```

Sorties :

```text
data/output/CV_....docx
data/output/CV_....md
data/output/application_context.json
data/output/cover_letters/LM_....docx
data/output/cover_letters/LM_...._validation.json
```

## 2. Lancer le pipeline complet avec logs détaillés

```bash
src/.venv/bin/python run_application.py
```

## 3. Lancer seulement le CV + tracker historique

```bash
src/.venv/bin/python run.py
```

## 4. Tester le projet

```bash
src/.venv/bin/python -m pytest
```

## 5. Enrichir manuellement la base métier

Utilise `GEMINI_DOMAIN_API_KEY`.

```bash
src/.venv/bin/python scripts/enrich_domain_vocabulary.py
```

## 6. Créer le template LM privé depuis l'exemple

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

Puis ouvrir `templates/base_cover_letter.docx` dans Word ou LibreOffice.

## 7. Vérifier les fichiers modifiés avant commit

```bash
git status --short
```

Ne pas commit :

```text
.env
data/input/job_description.txt
data/reference/master_profile.xlsx
templates/base_cv.docx
templates/base_cover_letter.docx
data/output/
data/company_profiles/
data/tracker/applications.csv
```

## 8. Nettoyer les caches visuels Python

```bash
find . -type d \\( -name "__pycache__" -o -name ".pytest_cache" \\) -prune -exec rm -rf {} +
```

Les dossiers générés `data/output/` et `data/company_profiles/` sont masqués dans VS Code par `.vscode/settings.json`.
