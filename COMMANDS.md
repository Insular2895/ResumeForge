# ResumeForge - Commandes prêtes

## 1. Lancer le pipeline complet sans bruit

```bash
src/.venv/bin/python run_application.py --quiet
```

Sorties :

```text
data/output/cv/CV_....docx
data/output/cover_letters/LM_....docx
data/output/cover_letters/LM_...._validation.json
```

Le CV Markdown est temporaire : il est supprimé automatiquement après génération réussie de la LM DOCX.

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

Les JSON techniques de `data/output/` et le cache `data/company_profiles/` sont masqués dans VS Code par `.vscode/settings.json`.

## 9. Mode VS Code clean

Masque le code, la doc, les templates et les fichiers techniques pour garder seulement l'usage quotidien visible.

```bash
src/.venv/bin/python - <<'PY'
import json
from pathlib import Path

path = Path(".vscode/settings.json")
settings = json.loads(path.read_text(encoding="utf-8"))
files_exclude = settings.setdefault("files.exclude", {})
files_exclude.update({
    ".env.example": True,
    ".gitignore": True,
    ".github": True,
    "assets": True,
    "cv-tailor.code-workspace": True,
    "data/output/.gitkeep": True,
    "data/output/*.json": True,
    "data/company_profiles": True,
    "data/.claude": True,
    "docs": True,
    "LICENSE": True,
    "README.md": True,
    "requirements.txt": True,
    "run.py": True,
    "run_application.py": True,
    "scripts": True,
    "src": True,
    "templates": True,
    "tests": True,
    ".claude": True,
    "credentials": True,
})
path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
PY
```

## 10. Mode VS Code dev

Réaffiche le code, la doc, les templates et les fichiers techniques.

```bash
src/.venv/bin/python - <<'PY'
import json
from pathlib import Path

path = Path(".vscode/settings.json")
settings = json.loads(path.read_text(encoding="utf-8"))
files_exclude = settings.setdefault("files.exclude", {})
for key in [
    ".env.example",
    ".gitignore",
    ".github",
    "assets",
    "cv-tailor.code-workspace",
    "data/output/*.json",
    "docs",
    "LICENSE",
    "README.md",
    "requirements.txt",
    "run.py",
    "run_application.py",
    "scripts",
    "src",
    "templates",
    "tests",
]:
    files_exclude.pop(key, None)
path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
PY
```
