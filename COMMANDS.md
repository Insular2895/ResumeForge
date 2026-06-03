# ResumeForge - Commandes prêtes

## 1. Lancer le menu terminal guidé

```bash
src/.venv/bin/python run_menu.py
```

Options :

```text
1 - Juste CV
2 - CV + LM
3 - LM seulement
```

Le menu nettoie les entrées temporaires avant chaque run.
Pour une offre, colle directement le texte de la JB dans le terminal puis appuie sur `Entrée`.
Le collage multi-lignes est détecté automatiquement, sans `FIN`.
Si tu appuies sur `Entrée` sans texte, le menu essaie d'utiliser le presse-papiers.
`FIN` reste disponible uniquement en secours.

En mode `LM seulement`, le menu utilise un CV de référence séparé :

```text
data/input/reference_cv.docx
data/input/reference_cv.md
data/input/reference_cv.txt
```

S'il n'existe pas encore, le menu demande le chemin de ton CV optimisé et le copie automatiquement dans `data/input/reference_cv.*`. Les runs suivants peuvent réutiliser ce CV sans le redonner.

## 2. Pipeline complet sans menu

```bash
src/.venv/bin/python run_application.py --quiet
```

Sorties historiques :

```text
data/output/cv/CV_....docx
data/output/cover_letters/LM_....docx
data/output/cover_letters/LM_...._validation.json
data/output/applications/Entreprise_Poste/
```

## 3. Pipeline complet avec logs détaillés

```bash
src/.venv/bin/python run_application.py
```

## 4. Tests

```bash
src/.venv/bin/python -m pytest
```

## 5. CV seul historique

```bash
src/.venv/bin/python run.py
```

## 6. Enrichir manuellement la base métier

Utilise `GEMINI_DOMAIN_API_KEY`.

```bash
src/.venv/bin/python scripts/enrich_domain_vocabulary.py
```

## 7. Créer le template LM privé depuis l'exemple

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

Puis ouvrir `templates/base_cover_letter.docx` dans Word ou LibreOffice.

## 8. Vérifier les fichiers modifiés avant commit

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

## 9. Nettoyer les caches visuels Python

```bash
find . -type d \\( -name "__pycache__" -o -name ".pytest_cache" \\) -prune -exec rm -rf {} +
```

Les JSON techniques de `data/output/` et le cache `data/company_profiles/` sont masqués dans VS Code par `.vscode/settings.json`.

## 10. Mode VS Code clean

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
    "data/output/cv": True,
    "data/output/cover_letters": True,
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

## 11. Mode VS Code dev

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
