<div align="center">

# ResumeForge

**Pipeline local pour générer un dossier de candidature ciblé : CV, lettre de motivation, validation et tracker.**

<p>
  <a href="https://python.org"><img src="docs/assets/badge-python-animated.svg" alt="Python 3.9+" height="28"></a>
  <a href="https://aistudio.google.com"><img src="docs/assets/badge-gemini-animated.svg" alt="Gemini AI" height="28"></a>
  <a href="https://sheets.google.com"><img src="docs/assets/badge-google-sheets-animated.svg" alt="Google Sheets tracker" height="28"></a>
  <a href="LICENSE"><img src="docs/assets/badge-license-personal-animated.svg" alt="License Personal Use Only" height="28"></a>
</p>

</div>

---

Pipeline local pour générer un dossier de candidature ciblé à partir d'une offre d'emploi.

ResumeForge produit un CV personnalisé, une lettre de motivation contrôlée, un rapport de validation et un suivi de candidature, en gardant les fichiers privés hors Git.

<div align="center">

<img src="assets/cv_output_example.png" alt="Exemple de CV généré" width="480">

*Exemple de CV généré — [voir le PDF complet](assets/cv_output_example.pdf)*

</div>

## Fonctionnalités

| Fonction | Rôle |
|---|---|
| CV ciblé | Sélectionne les expériences et adapte les bullets à l'offre |
| CV Markdown temporaire | Produit une source propre pour Gemini, puis la supprime après LM DOCX réussie |
| Lettre DOCX | Génère uniquement une LM finale Word, sans export Markdown |
| Validation | Bloque la LM si elle invente un chiffre, un outil, une expérience ou un fait entreprise |
| Base métier | Réutilise les termes précis par domaine sans alourdir le prompt |
| Traduction métier | Traduit les mêmes faits vers Achats, Supply Chain, Finance, Data, Gestion ou Projet sans inventer d'expérience |
| Mémoire d'expérience | Conserve les enrichissements explicitement validés pour améliorer les générations suivantes |
| Tracker | Met à jour le suivi de candidature sans casser le pipeline si Sheets est indisponible |
| Sécurité | Garde `.env`, profils, templates privés et outputs hors Git |

## Sorties

Commande principale :

```bash
src/.venv/bin/python run_web.py
```

Ouvre ensuite `http://127.0.0.1:8765` dans ton navigateur. L'interface guide
les trois usages courants : CV seul, CV + LM, ou LM seulement. Sorties attendues :

```text
data/output/
├── cv/
│   └── CV_....docx
├── cover_letters/
│   ├── LM_....docx
│   └── LM_...._validation.json
└── applications/
    └── Entreprise_Poste/
        ├── CV_Entreprise_Poste.docx
        ├── LM_Entreprise_Poste.docx
        └── A_MODIFIER.md
```

Les fichiers techniques du run restent dans `data/output/`, mais ils sont masqués dans VS Code pour garder l'explorateur lisible.

Le CV Markdown est un fichier temporaire interne pour Gemini : il est généré, utilisé pour la LM, puis supprimé dès que la LM DOCX est créée. La lettre de motivation finale est exportée uniquement en DOCX. ResumeForge ne génère pas de fichier final `LM_....md`.

Le dossier `data/output/applications/` est le pack propre de candidature. Il applique la règle **1 job = 1 playlist** : pour une même entreprise et un même poste, le dossier est remplacé à chaque nouvelle génération. Pour une nouvelle job description, un nouveau dossier est créé. Le CV n'est pas réécrit en mode `LM seulement` : il est seulement copié et renommé pour coller à la candidature.

Le pack garde un seul fichier éditable : `A_MODIFIER.md`. C'est la source lisible à ouvrir dans VS Code si tu veux demander une modification ou reprendre le texte. Les DOCX du pack sont mis à jour automatiquement à chaque génération/rendu. En revanche, si tu modifies manuellement `A_MODIFIER.md`, il faut relancer un rendu pour produire des DOCX propres.

## Logique

```text
offre d'emploi
  + profil Excel privé
  -> CV DOCX recruteur
  -> CV Markdown temporaire pour Gemini
  -> application_context.json
  -> LM DOCX finale
  -> suppression du CV Markdown temporaire si succès
  -> validation JSON
  -> tracker candidatures
```

La lettre de motivation ne lit jamais directement `master_profile.xlsx`.

Elle utilise uniquement :

- le CV Markdown temporaire dérivé du CV final ;
- l'offre d'emploi ;
- `application_context.json` ;
- les faits entreprise autorisés ;
- les fichiers de référence LM.

La validation bloque l'export DOCX si la LM contient un élément inventé : chiffre, outil, expérience, formation, compétence, fait entreprise, annotation, placeholder ou survente d'expertise.

## Commandes

### Utilisation quotidienne avec l'interface web

Lancer le serveur local :

```bash
src/.venv/bin/python run_web.py
```

Puis ouvrir l'interface dans un second terminal :

```bash
open http://127.0.0.1:8765
```

Pour arrêter le serveur, utilise `Ctrl+C` dans son terminal. Pour le couper
depuis n'importe quel terminal :

```bash
pid=$(lsof -tiTCP:8765 -sTCP:LISTEN); if [ -n "$pid" ]; then kill "$pid"; fi
```

Redémarrer complètement l'interface :

```bash
pid=$(lsof -tiTCP:8765 -sTCP:LISTEN); if [ -n "$pid" ]; then kill "$pid"; fi
src/.venv/bin/python run_web.py
```

Commandes utiles :

| Besoin | Commande |
|---|---|
| Lancer l'interface web | `src/.venv/bin/python run_web.py` |
| Ouvrir l'interface | `open http://127.0.0.1:8765` |
| Utiliser le menu terminal historique | `src/.venv/bin/python run_menu.py` |
| Tester le projet | `src/.venv/bin/python -m pytest` |
| Commandes avancées | voir [COMMANDS.md](COMMANDS.md) |

## Interface Web Locale

L'interface web locale ajoute une page simple au-dessus du pipeline existant.
Elle constitue le parcours utilisateur recommandé et ne publie rien sur Internet.
Le menu historique `run_menu.py` reste disponible pour un usage en terminal.

### Installation depuis un clone neuf

Prérequis :

- Python 3.11 recommandé ;
- une clé Gemini pour les générations utilisant Gemini ;
- Word uniquement si tu veux modifier les templates DOCX.
- LibreOffice est optionnel : il sert seulement à générer la preview PDF locale.

```bash
git clone https://github.com/Insular2895/ResumeForge.git
cd ResumeForge
python3 -m venv src/.venv
src/.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env
```

Remplis ensuite les clés nécessaires dans `.env`, puis démarre l'interface :

```bash
src/.venv/bin/python run_web.py
```

Puis ouvrir :

```text
http://127.0.0.1:8765
```

Après génération, ResumeForge ouvre une prévisualisation DOCX par sections :

- onglets `CV` et `Lettre de motivation` ;
- preview PDF si LibreOffice headless est disponible ;
- champs éditables pour les sections texte ;
- bouton `Régénérer preview` pour recréer DOCX + PDF ;
- bouton `Télécharger ZIP` pour récupérer les derniers DOCX.

Le MVP ne dépend pas d'OnlyOffice, d'un iframe Document Server, d'un service
worker ou d'un éditeur Word en ligne.

Au premier lancement, ouvre `Références locales` et ajoute :

- le profil Excel maître ;
- le template CV Word ;
- le template LM Word ;
- un CV de référence si tu utilises `LM seulement`.

L'interface permet :

- de choisir `CV`, `CV + LM` ou `LM seulement` ;
- de sélectionner un métier cible ou de laisser ResumeForge le détecter ;
- de mesurer la couverture du profil selon les concepts, actions, objets et résultats du métier ;
- de collecter dans un popup les faits manquants avant génération ;
- de remplacer les références privées locales ;
- de personnaliser séparément les instructions Gemini CV et LM ;
- de télécharger le pack courant au format ZIP.
- de bloquer les doubles clics et toute seconde génération simultanée.

Le moteur de traduction métier est documenté dans
[`docs/CAREER_TRANSLATION_ENGINE.md`](docs/CAREER_TRANSLATION_ENGINE.md).
Les métiers préconfigurés servent uniquement de raccourcis : toute autre offre
suffisamment détaillée produit automatiquement son propre modèle métier à quatre
couches, conservé localement pour les générations suivantes.

L'interface écoute uniquement sur `127.0.0.1`. Ne lance pas une génération
depuis le terminal pendant qu'une génération web est en cours, car les deux
parcours utilisent les mêmes fichiers temporaires.

Pour arrêter l'interface :

```bash
Ctrl+C
```

Pour mettre à jour une installation existante :

```bash
git pull
src/.venv/bin/python -m pip install -r requirements.txt
src/.venv/bin/python run_web.py
```

Si le port `8765` est déjà utilisé, l'interface est probablement déjà lancée.
Ouvre `http://127.0.0.1:8765` ou utilise la commande d'arrêt documentée plus haut
avant de relancer `run_web.py`.

## Modes De Travail

### Option 1 - Juste CV

Tu colles une job description, puis `FIN`. ResumeForge génère un CV ciblé depuis `master_profile.xlsx` et `templates/base_cv.docx`, puis crée un pack dans `data/output/applications/`.

### Option 2 - CV + LM

Tu colles une job description, puis `FIN`. ResumeForge génère le CV, exporte temporairement le CV en Markdown pour Gemini, génère la LM, valide la lettre, rend le DOCX, puis crée un pack complet `CV + LM`.

### Option 3 - LM seulement

Ce mode sert quand tu as déjà un CV optimisé pour un domaine, par exemple un CV ADV, banque ou supply.

Le CV source est stocké ici :

```text
data/input/reference_cv.docx
data/input/reference_cv.md
data/input/reference_cv.txt
```

Au premier run, le menu demande le chemin du CV optimisé et le copie dans `data/input/reference_cv.*`. Aux runs suivants, il propose de réutiliser ce CV. Tu peux taper `r` pour le remplacer.

Ensuite tu colles seulement l'offre ou le contexte cible pour la LM, puis `FIN`. Le système utilise le CV de référence comme seule source profil, génère une LM adaptée, et crée un pack où le CV est simplement copié/renommé selon l'entreprise et le poste.

## Installation

```bash
git clone https://github.com/Insular2895/ResumeForge.git
cd ResumeForge
python3 -m venv src/.venv
source src/.venv/bin/activate
pip install -r requirements.txt
```

Copier l'exemple d'environnement :

```bash
cp .env.example .env
```

Puis remplir `.env` localement. Ce fichier est ignoré par Git.

## Configuration Par Utilisateur

Chaque utilisateur du repo doit avoir sa propre configuration locale.

Le repo versionne seulement :

```text
.env.example
```

Chaque utilisateur crée ensuite son fichier privé :

```bash
cp .env.example .env
```

Puis il remplit ses propres clés et son propre tracker :

```env
GEMINI_API_KEY=your_gemini_cv_key_here
GEMINI_LETTER_API_KEY=your_gemini_letter_key_here
GEMINI_DOMAIN_API_KEY=your_gemini_domain_key_here

GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SHEET_TAB=applications
```

Pour Google Sheets, chaque utilisateur ajoute aussi son propre service account local :

```text
credentials/service_account.json
```

Ce fichier doit avoir accès au Google Sheet indiqué dans `GOOGLE_SHEET_ID`.

À ne jamais commit :

```text
.env
credentials/service_account.json
data/input/job_description.txt
data/reference/master_profile.xlsx
templates/base_cv.docx
templates/base_cover_letter.docx
data/tracker/applications.csv
data/output/
```

En clair : le repo contient le moteur et les exemples, mais chaque personne apporte ses clés Gemini, son Google Sheet, son Excel profil, ses templates Word privés et ses offres d'emploi.

## Configuration Privée

Fichiers privés à créer localement :

```text
.env
data/input/job_description.txt
data/reference/master_profile.xlsx
templates/base_cv.docx
templates/base_cover_letter.docx
credentials/
```

Ces fichiers ne doivent pas être commit.

### Clés API

`.env.example` documente les variables sans secrets :

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_LETTER_API_KEY=your_gemini_letter_api_key_here
GEMINI_DOMAIN_API_KEY=your_gemini_domain_research_api_key_here
```

Rôles recommandés :

- `GEMINI_API_KEY` : génération et optimisation CV ;
- `GEMINI_LETTER_API_KEY` : génération LM ;
- `GEMINI_DOMAIN_API_KEY` : enrichissement manuel de la base métier.

Si `GEMINI_LETTER_API_KEY` est absente, le pipeline génère le CV, le Markdown et `application_context.json`, puis écrit un rapport `skipped` sans générer de LM.

## Modèles Gemini

Configuration recommandée :

```env
GEMINI_ROTATION_MODELS=gemini-3.1-flash-lite,gemini-3-flash-preview,gemini-2.5-flash-lite,gemini-2.5-flash
GEMINI_DAILY_LIMIT_PER_MODEL=20

GEMINI_LETTER_MODEL=gemini-3.1-flash-lite
GEMINI_LETTER_FALLBACK_MODELS=gemini-3-flash-preview,gemini-2.5-flash-lite,gemini-2.5-flash

GEMINI_DOMAIN_MODEL=gemini-3.1-flash-lite
```

Gemini 3.1 Flash Lite est utilisé en priorité pour la LM et la base métier, avec fallback automatique si le modèle est indisponible ou en quota.

Avec la limite locale `GEMINI_DAILY_LIMIT_PER_MODEL=20`, le débit CV est volontairement conservateur. Tu peux augmenter cette limite si tes quotas Google AI Studio le permettent.

## Templates CV Et LM

### CV

Template privé :

```text
templates/base_cv.docx
```

Il contient les placeholders CV utilisés par `run.py` et `run_application.py`.

Le CV généré est rendu en Arial.

### Lettre de motivation

Template versionné :

```text
templates/base_cover_letter_example.docx
```

Template privé de production :

```bash
cp templates/base_cover_letter_example.docx templates/base_cover_letter.docx
```

Ouvre ensuite `templates/base_cover_letter.docx` dans Word ou LibreOffice, adapte la mise en page et garde les placeholders exactement identiques.

Placeholders principaux :

```text
[[LM_COMPANY]]
[[LM_COMPANY_ADDRESS_LINE_1]]
[[LM_COMPANY_POSTAL_CITY]]
[[LM_JOB_TITLE]]
[[LM_DATE]]
[[LM_FINAL_LETTER]]
[[LM_SIGNATURE]]
```

La LM générée est rendue en Arial.

## Références LM

Ces fichiers guident Gemini. Ils ne sont pas des sorties finales :

```text
templates/LM_instructions.md
templates/LM_template.md
templates/LM_demo_validee.md
```

Leur rôle :

- `LM_instructions.md` : règles de génération, interdictions, ATS, méthode ABC/XYZ, angle apprentissage ;
- `LM_template.md` : structure logique attendue ;
- `LM_demo_validee.md` : démonstration annotée du style cible.

Les annotations et placeholders de raisonnement ne doivent jamais apparaître dans la lettre finale.

## Base Métier

ResumeForge charge une base métier courte selon le domaine détecté :

```text
templates/domain_vocabulary/
├── supply_chain.json
├── retail_operations.json
└── _cross_domain_terms.json
```

Objectif : réutiliser les bons termes transversaux sans brûler trop de tokens.

Exemples :

- supply chain : Incoterms, FIFO/FEFO, packing list, airway bill, bill of lading, cut-off, douane ;
- retail operations : ADV, précommandes, royalties, litiges, marges, réseau de boutiques, KPI service client ;
- transverse : reporting, coordination, fiabilité des données, parties prenantes, amélioration de process.

Pour enrichir manuellement une base depuis une nouvelle offre :

```bash
src/.venv/bin/python scripts/enrich_domain_vocabulary.py --domain retail_operations
```

Cette commande utilise `GEMINI_DOMAIN_API_KEY` et ne consomme pas la clé CV ni la clé LM.

## Recherche Entreprise

Le pipeline peut construire un profil entreprise avec cache JSON local :

```text
data/company_profiles/
```

Les faits entreprise retenus sont injectés dans `application_context.json`. La LM peut utiliser au maximum 1 à 3 faits autorisés.

Si la recherche entreprise est indisponible, le pipeline reste sobre et ne force pas de faits non vérifiés.

## Validation

Le rapport de validation est écrit ici :

```text
data/output/cover_letters/LM_...._validation.json
```

Statuts possibles :

- `success` : LM validée, DOCX généré ;
- `failed` : LM rejetée, aucun DOCX final exporté ;
- `skipped` : génération LM sautée, souvent à cause d'une clé absente.

En cas d'échec, ResumeForge écrit aussi :

```text
data/output/cover_letters/LM_FAILED_....txt
```

## Tracker Candidatures

Le tracker est mis à jour avec :

- timestamp ;
- entreprise ;
- poste ;
- famille métier ;
- chemin CV DOCX ;
- chemin LM DOCX si disponible ;
- statut de validation ;
- statut recherche entreprise ;
- nombre de faits entreprise retenus.

Il n'y a pas de champ `lm_md_path`.

Si Google Sheets est configuré, la logique existante est réutilisée. Sinon, le pipeline écrit un warning sans casser la génération.

## Organisation

```text
run_menu.py                    # menu guidé, commande principale
run.py                         # CV seul historique
run_application.py             # pipeline complet sans menu
src/application/               # contexte, tracking, markdown CV, recherche, base métier
src/letter/                    # prompt LM, génération, validation, rendu DOCX
src/render/                    # rendu Word
templates/                     # templates et références Gemini
docs/                          # specs, plans, guide d'utilisation
tests/                         # tests sans clé API obligatoire
```

Guide plus détaillé :

```text
docs/USAGE.md
```

## Sécurité Git

Avant de commit :

```bash
git status --short
```

À ne jamais commit :

```text
.env
data/input/job_description.txt
data/reference/master_profile.xlsx
templates/base_cv.docx
templates/base_cover_letter.docx
data/output/
data/company_profiles/
credentials/
```

Les exemples versionnés restent publics :

```text
.env.example
templates/base_cover_letter_example.docx
templates/LM_instructions.md
templates/LM_template.md
templates/LM_demo_validee.md
templates/domain_vocabulary/*.json
```

## Tests

```bash
src/.venv/bin/python -m pytest
```

Les tests ne nécessitent pas de clé Gemini.

## Licence

Usage personnel uniquement. Voir [LICENSE](LICENSE).
