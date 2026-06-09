# ResumeForge - Commandes prêtes

## 1. Installer depuis un clone neuf

```bash
git clone https://github.com/Insular2895/ResumeForge.git
cd ResumeForge
python3 -m venv src/.venv
src/.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env
```

Remplir `.env`, puis ajouter les fichiers privés depuis l'interface locale ou
manuellement selon les chemins documentés dans `README.md`.

## 2. Lancer l'interface locale

```bash
src/.venv/bin/python run_web.py
```

Ouvrir :

```text
http://127.0.0.1:8765
```

Ou ouvrir directement le site depuis un second terminal :

```bash
open http://127.0.0.1:8765
```

Arrêter avec `Ctrl+C`.

Une seule génération peut fonctionner à la fois. L'interface bloque les
doubles clics et refuse les générations simultanées.

Si le terminal affiche `address already in use`, le site est normalement déjà
lancé. Ouvre simplement l'URL ci-dessus. Pour forcer un redémarrage :

```bash
lsof -ti :8765 | xargs kill
src/.venv/bin/python run_web.py
```

Chaque CV et LM passe par un contrôle linguistique obligatoire avant puis
après le rendu DOCX. Le contrôle final lit aussi les en-têtes, pieds de page,
zones de texte, notes et commentaires. Si une anomalie est détectée, le DOCX
est supprimé et la génération est bloquée afin qu'il ne soit jamais ajouté au
pack. Le correcteur réduit fortement le risque de faute, sans pouvoir garantir
mathématiquement l'absence de toute erreur grammaticale ou contextuelle.

## 3. Lancer le menu terminal guidé

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

En modes `Juste CV` et `CV + LM`, le pipeline lance une passe ATS automatiquement :
score CV/JB, suggestions de mots-clés, optimisation du CV final, puis génération de la LM sur ce CV final.
Le score ATS final est basé sur le modèle multi-plateformes de `sunnypatell/ats-screener`
(Workday, Taleo, SuccessFactors, iCIMS, Greenhouse, Lever), adapté en Python avec une
extraction de mots-clés française orientée ADV/ERP.
Si la JB est très courte, le pipeline ajoute un vocabulaire métier de référence selon le
poste détecté (ex. ADV -> commandes, facturation, ERP, Incoterms, logistique). Les offres
détaillées restent guidées par leurs propres mots-clés.
Les passes Gemini sont gardées seulement si elles maintiennent ou améliorent le score ATS :
une optimisation qui baisse le score est automatiquement ignorée.
Un score entre `70%` et `100%` est considéré comme acceptable. En dessous de `70%`,
le CV est marqué à retravailler et le pipeline tente une passe d'optimisation supplémentaire.
Dans Google Sheets, `ats_match_percent` est la première colonne et les dates restent en
deuxième colonne (`created_at`).
La playlist finale commence par le score ATS, par exemple :

```text
99% Ipsen - Gestionnaire ADV - 20260604_104500/
```

Les fichiers ATS intermédiaires ne sont pas affichés dans la playlist finale.
Le score ATS apparaît uniquement dans le nom de la playlist, jamais dans les noms des fichiers CV et LM.

En mode `LM seulement`, le menu utilise un CV de référence séparé :

```text
data/input/reference_cv.docx
data/input/reference_cv.md
data/input/reference_cv.txt
```

S'il n'existe pas encore, le menu demande le chemin de ton CV optimisé et le copie automatiquement dans `data/input/reference_cv.*`. Les runs suivants peuvent réutiliser ce CV sans le redonner.

## 4. Pipeline complet sans menu

```bash
src/.venv/bin/python run_application.py --quiet
```

Sorties historiques :

```text
data/output/cv/CV_....docx
data/output/cover_letters/LM_....docx
data/output/cover_letters/LM_...._validation.json
data/output/applications/95% Entreprise - Poste - timestamp/
```

## 5. Pipeline complet avec logs détaillés

```bash
src/.venv/bin/python run_application.py
```

## 6. Tests

```bash
src/.venv/bin/python -m pytest
```

## 7. CV seul historique

```bash
src/.venv/bin/python run.py
```

## 8. Enrichir manuellement la base métier

Utilise `GEMINI_DOMAIN_API_KEY`.

```bash
src/.venv/bin/python scripts/enrich_domain_vocabulary.py
```

## 9. Créer le template LM privé depuis l'exemple

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

Puis ouvrir `templates/base_cover_letter.docx` dans Word ou LibreOffice.

## 10. Vérifier les fichiers modifiés avant commit

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

## 11. Nettoyer les caches visuels Python

```bash
find . -type d \\( -name "__pycache__" -o -name ".pytest_cache" \\) -prune -exec rm -rf {} +
```

Les JSON techniques de `data/output/` et le cache `data/company_profiles/` sont masqués dans VS Code par `.vscode/settings.json`.

## 12. Mode VS Code clean

Masque le code, la doc, les templates et les fichiers techniques pour garder seulement l'usage quotidien visible.

```bash
src/.venv/bin/python - <<'PY'
import json
from pathlib import Path

path = Path(".vscode/settings.json")
settings = json.loads(path.read_text(encoding="utf-8"))
files_exclude = settings.setdefault("files.exclude", {})
files_exclude.update({
    "COMMANDS.md": True,
    "THIRD_PARTY_NOTICES.md": True,
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
search_exclude = settings.setdefault("search.exclude", {})
search_exclude.update({
    "THIRD_PARTY_NOTICES.md": True,
})
path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
PY
```

## 13. Mode VS Code dev

Réaffiche le code, la doc, les templates et les fichiers techniques.

```bash
src/.venv/bin/python - <<'PY'
import json
from pathlib import Path

path = Path(".vscode/settings.json")
settings = json.loads(path.read_text(encoding="utf-8"))
files_exclude = settings.setdefault("files.exclude", {})
for key in [
    "COMMANDS.md",
    "THIRD_PARTY_NOTICES.md",
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
search_exclude = settings.setdefault("search.exclude", {})
search_exclude.pop("THIRD_PARTY_NOTICES.md", None)
path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
PY
```
