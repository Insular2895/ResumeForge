# SPEC — Company Research + LM Pipeline

**Date :** 2026-05-15
**Projet :** ResumeForge
**Scope :** Ajout du module de recherche entreprise avec cache JSON + génération de lettre de motivation (LM) en DOCX

---

## 1. Objectif

Ajouter un pipeline complet `CV + LM` à ResumeForge, sans modifier le générateur CV existant.

**Problème résolu :** chaque lettre de motivation nécessitait soit une recherche manuelle sur l'entreprise, soit un appel LLM coûteux qui re-cherchait les mêmes informations à chaque candidature.

**Solution :** module de recherche entreprise avec cache JSON 30 jours + génération LM en un appel Gemini dédié.

```
run.py          → CV seul (inchangé)
run_application.py  → candidature complète : CV + recherche entreprise + LM
```

---

## 2. Arborescence cible

```
ResumeForge/
├── run.py                               ← INCHANGÉ
├── run_application.py                   ← NOUVEAU orchestrateur
│
├── data/
│   ├── input/
│   │   └── job_description.txt          ← inchangé
│   ├── company_profiles/                ← NOUVEAU cache entreprises
│   │   ├── ipsen.json
│   │   └── lvmh.json
│   └── output/
│       ├── CV_Lucas_Pertusa_...docx     ← inchangé
│       ├── LM_Lucas_Pertusa_...docx     ← NOUVEAU
│       ├── application_context.json     ← NOUVEAU snapshot run
│       ├── last_run_report.json         ← inchangé
│       └── last_run_report_lm.json      ← NOUVEAU rapport LM
│
├── templates/
│   ├── base_cv.docx                     ← inchangé
│   └── base_lm.docx                     ← NOUVEAU template lettre
│
├── src/
│   ├── config.py                        ← ÉTENDU (pas réécrit)
│   ├── generate_cv.py                   ← INCHANGÉ
│   │
│   ├── company_research/
│   │   ├── __init__.py
│   │   ├── company_identifier.py
│   │   ├── company_cache.py
│   │   ├── company_researcher.py
│   │   ├── company_fact_extractor.py
│   │   └── company_fact_selector.py
│   │
│   └── letter/
│       ├── __init__.py
│       ├── lm_generator.py
│       ├── lm_builder.py
│       └── lm_renderer.py
│
└── .env.example                         ← + GEMINI_LETTER_API_KEY
```

---

## 3. Pipeline complet

```
run_application.py
│
│  1. Lit data/input/job_description.txt
│  2. Appelle parse_job() importé de src.generate_cv (sans effet de bord)
│  3. Écrit data/output/application_context.json
│
│  4. company_identifier → (company_name, slug)
│  5. company_cache → profil frais ? → charge faits
│                   → absent ou > 30j ? → company_researcher (1 appel Gemini)
│                                       → company_fact_extractor (local)
│                                       → company_cache.save()
│  6. company_fact_selector → (selected_facts, rejected_facts) max 3
│
│  7. generate_cv_main()            ← boîte noire, inchangée
│  8. lit last_run_report.json      ← source de vérité CV
│
│  9. GEMINI_LETTER_API_KEY présente ?
│     → non : écrit last_run_report_lm.json {status: skipped} + fin propre
│     → oui : lm_generator (1 appel Gemini, clé dédiée)
│
│ 10. lm_builder → replacements dict + validation
│ 11. Validation OK ?
│     → oui : lm_renderer → LM DOCX
│     → non : LM_FAILED_{ts}.txt + last_run_report_lm.json {status: failed}
│
│ 12. Écrit last_run_report_lm.json complet
```

**Budget appels Gemini :**
- Étape 5 : 1 appel (rotation standard, Search grounding) — seulement si cache absent/stale
- Étape 9 : 1 appel (GEMINI_LETTER_API_KEY) — toujours
- Maximum : 2 appels par candidature, 0 si cache frais

---

## 4. Module `company_research/`

### `company_identifier.py`

- Importe `extract_company()` depuis `src.generate_cv` (import sans effet de bord)
- Normalise : lowercase, suppression accents, suppression suffixes légaux
- Suffixes à supprimer : `["sa", "sas", "sarl", "groupe", "group", "inc", "ltd", "plc", "corp", "co"]`
- Exemples : `"Ipsen SA"` → `("Ipsen", "ipsen")` · `"L'Oréal"` → `("L'Oréal", "loreal")` · `"LVMH Group"` → `("LVMH", "lvmh")`
- Retourne : `(company_name: str, slug: str)`

### `company_cache.py`

- Chemin : `data/company_profiles/{slug}.json`
- TTL : `COMPANY_CACHE_TTL_DAYS = 30` (depuis `config.py`)
- `load(slug) → dict | None` : retourne `None` si absent ou `last_updated` > 30 jours
- `save(slug, profile) → None` : écrit le JSON
- Schéma JSON :

```json
{
  "schema_version": "1.0",
  "source": "gemini_search_grounding",
  "company_name": "Ipsen",
  "company_slug": "ipsen",
  "last_updated": "2026-05-15",
  "facts": [
    {
      "fact": "Ipsen place les patients au centre de sa mission thérapeutique.",
      "category": "culture",
      "source_url": "https://www.ipsen.com/fr/about-us/",
      "confidence": "high",
      "use_for_roles": ["ADV", "supply_chain", "operations", "junior"],
      "is_generic": false,
      "last_checked": "2026-05-15"
    }
  ],
  "excluded_facts": [
    {
      "fact": "Remboursement transport 50%",
      "reason": "avantage légal / générique"
    }
  ]
}
```

### `company_researcher.py`

- **1 seul appel Gemini** avec Search grounding
- Modèle : rotation standard (`GEMINI_ROTATION_MODELS`)
- Config SDK :

```python
from google.genai import types
config = types.GenerateContentConfig(
    tools=[types.Tool(google_search=types.GoogleSearch())]
)
```

- Prompt structuré :

```
Entreprise : {company_name}

Recherche des informations factuelles sur cette entreprise via des sources officielles.

Sources prioritaires : site corporate, page carrière, rapport annuel, page valeurs/culture/diversité.
Sources secondaires acceptées si officielles : LinkedIn corporate, communiqués de presse.
Sources à éviter : Glassdoor, Welcome to the Jungle, blogs non officiels.

Catégories à chercher : culture interne, formation / développement, mobilité, mission / impact,
projets stratégiques, logique client/patient/utilisateur, réseau international, outils ou process.

Règles strictes :
- réponds uniquement avec un objet JSON valide, sans markdown, sans commentaire
- chaque fait doit avoir une source_url officielle ou fiable
- si aucune information fiable trouvée, retourne facts: []
- exclure : avantages légaux, transport, tickets restaurant, RTT, télétravail générique,
  termes vides ("entreprise dynamique", "bonne ambiance", "leader du secteur")

Format obligatoire :
{
  "facts": [
    {
      "fact": "texte court et précis",
      "category": "culture|formation|mobilité|mission|projet|international|process",
      "source_url": "url",
      "confidence": "high|medium|low",
      "use_for_roles": ["ADV", "supply_chain", "operations", "junior", "data", "marketing"],
      "is_generic": false
    }
  ],
  "excluded_facts": [
    { "fact": "...", "reason": "..." }
  ]
}
```

- Retourne la réponse brute (string) → passée à `company_fact_extractor.py`

### `company_fact_extractor.py`

**Zéro appel LLM.** Parsing et validation locale uniquement.

1. Nettoie le markdown si Gemini enveloppe en ` ```json `
2. Parse JSON — fallback `{"facts": [], "excluded_facts": []}` si invalide
3. Valide chaque fait :
   - `fact` présent, longueur 15–250 caractères
   - `source_url` présent et non vide
   - `category` dans les valeurs attendues
   - `confidence` normalisé en `high | medium | low`
   - `is_generic` présent et booléen
4. Rejette : faits trop courts < 15 chars, faits sans `source_url`, faits génériques (`is_generic: true`)
5. Déduplique par substring similarity simple
6. Ajoute `last_checked` = date du jour
7. Retourne `dict` conforme au schéma `company_cache.py`

### `company_fact_selector.py`

Entrées : `profile: dict`, `parsed_job: dict` (company, job_title, keywords)

Sélection :
1. Filtre `is_generic == false`
2. Filtre `source_url` non vide
3. Filtre `confidence` in `["high", "medium"]`
4. Filtre `use_for_roles` contient au moins 1 famille présente dans les keywords du poste
5. Trie par confidence (`high` d'abord)
6. Retourne **3 faits maximum**

Retourne : `(selected_facts: list, rejected_facts: list)`

Chaque `rejected_fact` inclut `{"fact": "...", "reason": "generic|no_source|low_confidence|role_mismatch"}` — inclus dans `last_run_report_lm.json`.

**Règle dégradée :** si aucun fait éligible → `selected_facts = []`. La LM continue sans personnalisation entreprise plutôt que d'inventer.

---

## 5. Module `letter/`

### Placeholders `base_lm.docx`

| Placeholder | Contenu |
|---|---|
| `[[LM_DATE]]` | `Paris, le 15 mai 2026` |
| `[[LM_COMPANY]]` | Nom de l'entreprise |
| `[[LM_JOB_TITLE]]` | Intitulé du poste |
| `[[LM_INTRO]]` | Accroche — qui je suis + pourquoi ce poste |
| `[[LM_CORPS_1]]` | Paragraphe métier — compétences + expériences vs JD |
| `[[LM_CORPS_2]]` | Paragraphe entreprise — utilise les faits sélectionnés |
| `[[LM_CLOSING]]` | Clôture + disponibilité |

### `lm_generator.py`

- **1 seul appel Gemini**, clé `GEMINI_LETTER_API_KEY`
- Pas de Search grounding — tout le contexte est fourni dans le prompt
- Pas de rotation multi-modèle sur cette clé

Prompt :

```
Tu rédiges une lettre de motivation en français.

Entreprise : {company_name}
Poste : {job_title}

Faits entreprise sourcés (utilise-les si pertinents, n'en invente pas d'autres) :
{facts_block}
[Si vide : "(aucun fait entreprise disponible — reste centré sur l'adéquation profil/poste)"]

Expériences sélectionnées pour ce CV :
{experiences_block}

Extraits de l'offre d'emploi (800 tokens max) :
{job_excerpt}

Règles strictes :
- n'utilise que les faits fournis, n'invente rien sur l'entreprise
- si aucun fait disponible, ne personnalise pas corps_2 avec des informations inventées
- n'invente aucune expérience ni compétence absente du profil fourni
- style direct, professionnel, français naturel
- pas de formules creuses ("dynamique", "passionné par vos valeurs", "entreprise leader")
- le nom de l'entreprise doit apparaître dans intro ou closing
- réponse uniquement en JSON valide, aucun commentaire, aucun markdown

Format obligatoire :
{
  "intro": "...",
  "corps_1": "...",
  "corps_2": "...",
  "closing": "..."
}
```

### `lm_builder.py`

**Zéro appel LLM.** Parse la réponse, construit le dict, valide.

Validation avant rendu :

| Règle | Détail |
|---|---|
| Sections non vides | `intro`, `corps_1`, `corps_2`, `closing` tous présents et ≥ 50 chars |
| Placeholders résolus | Aucun `[[...]]` non résolu dans le contenu généré |
| Nom entreprise | `company_name` présent dans `intro` ou `closing` |
| Faits grounded | Si `selected_facts` non vide : `corps_2` contient ≥ 1 mot-clé extrait des faits |
| Faits inventés | Si `selected_facts` vide : `corps_2` ne contient pas de claim spécifique inventé (heuristique simple) |

Si validation OK : retourne `(replacements: dict, validation: dict{status: "success"})`

Si validation échoue : retourne `(None, validation: dict{status: "failed", errors: [...]})`

**Tracking des faits utilisés** dans le rapport :

```json
"facts_used": [
  {
    "fact": "Ipsen place les patients au centre de sa mission.",
    "matched_keywords": ["patients", "mission"]
  }
]
```

### `lm_renderer.py`

**Zéro appel LLM.** Réutilise `DocxTemplateRenderer` depuis `src/render/docx_template.py` sans modification.

Nom de fichier de sortie : `LM_Lucas_Pertusa_{slug}_{title_slug}_{timestamp}.docx`
- `slug` et `title_slug` passés par `clean_filename_part()` existant dans `generate_cv.py`
- Exemple : `LM_Lucas_Pertusa_ipsen_coordinateur_adv_import_export_20260515_143022.docx`

---

## 6. `config.py`, `.env.example`, `run_application.py`

### `src/config.py` — extensions

```python
# Ajouts seulement — ne pas réécrire le fichier existant

COMPANY_PROFILES_DIR = DATA_DIR / "company_profiles"
BASE_LM_TEMPLATE_PATH = TEMPLATES_DIR / "base_lm.docx"
APPLICATION_CONTEXT_PATH = OUTPUT_DIR / "application_context.json"
LM_REPORT_PATH = OUTPUT_DIR / "last_run_report_lm.json"
COMPANY_CACHE_TTL_DAYS = 30

# Étendre ensure_project_directories() pour inclure COMPANY_PROFILES_DIR
```

### `.env.example` — ajout

```env
# ----- Letter Generation (LM) -----------------------------------------------
# Clé Gemini dédiée à la génération de lettres de motivation.
# Recommandé : utiliser une clé ou un projet Google Cloud séparé pour isoler l'usage.
# Si absent : la LM ne sera pas générée (pas de crash, avertissement + rapport skipped).
GEMINI_LETTER_API_KEY=your_dedicated_letter_generation_key
```

### `run_application.py`

```python
def main():
    # 1. Contexte job
    job_text = load_job_description()
    parsed_job = parse_job(job_text)           # importé de src.generate_cv
    write_application_context(parsed_job)      # → application_context.json

    # 2. Recherche entreprise
    company_name, slug = identify_company(parsed_job)
    profile = load_or_research(
        company_name=company_name,
        slug=slug,
        parsed_job=parsed_job,
    )
    selected_facts, rejected_facts = select_facts(profile, parsed_job)

    # 3. CV — boîte noire, inchangée
    generate_cv_main()                         # écrit CV DOCX + last_run_report.json
    cv_report = load_cv_report()               # lit last_run_report.json

    # 4. LM
    letter_key = os.getenv("GEMINI_LETTER_API_KEY")
    if not letter_key:
        write_lm_skipped_report(cv_report)     # status: skipped, reason: missing key
        print("[LM] GEMINI_LETTER_API_KEY absente — LM ignorée.")
        return

    raw_response = generate_lm(
        parsed_job=parsed_job,
        selected_facts=selected_facts,
        cv_report=cv_report,
        job_text=job_text,
        api_key=letter_key,
    )

    replacements, validation = build_lm(
        raw_response=raw_response,
        parsed_job=parsed_job,
        selected_facts=selected_facts,
    )

    # 5. Export
    if validation["status"] == "success":
        output_path = render_lm(replacements, parsed_job)
        write_lm_report(
            validation=validation,
            output_path=output_path,
            raw_response=raw_response,
            cv_report=cv_report,
            selected_facts=selected_facts,
            rejected_facts=rejected_facts,
        )
        print(f"LM générée : {output_path}")
    else:
        write_failed_report(
            validation=validation,
            raw_response=raw_response,
            parsed_job=parsed_job,
        )
        print(f"[LM] Validation échouée : {validation['errors']}")
```

### `last_run_report_lm.json` — structure complète

```json
{
  "run_id": "20260515_143022",
  "company": "Ipsen",
  "company_slug": "ipsen",
  "job_title": "Coordinateur ADV Import-Export",
  "cv_output_path": "data/output/CV_Lucas_Pertusa_ipsen_..._20260515_143022.docx",
  "lm_output_path": "data/output/LM_Lucas_Pertusa_ipsen_..._20260515_143022.docx",
  "validation_status": "success",
  "validation_errors": [],
  "selected_company_facts": [
    {
      "fact": "Ipsen place les patients au centre de sa mission thérapeutique.",
      "source_url": "https://www.ipsen.com/fr/about-us/",
      "category": "culture",
      "confidence": "high"
    }
  ],
  "rejected_company_facts": [
    {
      "fact": "Remboursement transport 50%",
      "reason": "generic_benefit"
    }
  ],
  "facts_used": [
    {
      "fact": "Ipsen place les patients au centre de sa mission thérapeutique.",
      "matched_keywords": ["patients", "mission"]
    }
  ],
  "selected_experiences": ["Blurry", "Orion Trading"],
  "raw_gemini_response": {
    "intro": "...",
    "corps_1": "...",
    "corps_2": "...",
    "closing": "..."
  },
  "timestamp": "2026-05-15T14:30:22"
}
```

**Si `status: skipped` :**

```json
{
  "validation_status": "skipped",
  "reason": "missing_GEMINI_LETTER_API_KEY",
  "cv_generated": true,
  "cv_output_path": "data/output/CV_Lucas_Pertusa_...",
  "timestamp": "2026-05-15T14:30:22"
}
```

**Si `status: failed` :**

```json
{
  "validation_status": "failed",
  "validation_errors": ["corps_2_too_short", "company_name_missing"],
  "raw_gemini_response": { ... },
  "lm_output_path": null,
  "failed_output_path": "data/output/LM_FAILED_20260515_143022.txt",
  "timestamp": "2026-05-15T14:30:22"
}
```

---

## 7. Règles strictes pour Claude / Codex

Ces règles s'appliquent à toute implémentation basée sur cette spec.

```
1. Ne pas modifier src/generate_cv.py
   → sauf blocage technique explicite documenté avant toute modification
   → dans ce cas, proposer le changement minimal, attendre confirmation

2. Ne pas modifier run.py

3. Ne pas ajouter d'appel LLM non prévu dans cette spec
   → company_fact_extractor.py = zéro LLM
   → lm_builder.py = zéro LLM
   → lm_renderer.py = zéro LLM

4. Recherche entreprise = 1 appel Gemini maximum (company_researcher.py)

5. Génération LM = 1 appel Gemini maximum (lm_generator.py)

6. Si validation LM échoue → ne pas produire de DOCX final
   → écrire LM_FAILED_{timestamp}.txt
   → écrire last_run_report_lm.json avec status: failed

7. Tout comportement doit être traçable dans last_run_report_lm.json
   → chaque run écrit ce fichier, quelle que soit l'issue (success/skipped/failed)

8. company_researcher.py utilise la rotation standard (GEMINI_ROTATION_MODELS)
   lm_generator.py utilise GEMINI_LETTER_API_KEY uniquement

9. Le cache company doit toujours inclure schema_version et last_updated
   → ne jamais supprimer ces champs

10. DocxTemplateRenderer dans src/render/docx_template.py est réutilisé tel quel
    → ne pas le modifier ni le dupliquer
```

---

## 8. Critères de validation (définition of done)

- [ ] `run.py` génère un CV identique à avant (régression zéro)
- [ ] `run_application.py` génère CV + LM en un seul appel
- [ ] Un profil entreprise inexistant déclenche la recherche et est sauvegardé en JSON
- [ ] Un profil entreprise frais (< 30j) est réutilisé sans appel Gemini
- [ ] Un profil entreprise > 30j déclenche un refresh
- [ ] Si `GEMINI_LETTER_API_KEY` absente : CV généré, LM skippée proprement, rapport écrit
- [ ] Si Gemini retourne un JSON invalide en recherche : profil vide sauvegardé, pas de crash
- [ ] Si Gemini retourne un JSON invalide en LM : `LM_FAILED_{ts}.txt` écrit, pas de crash
- [ ] Si validation LM échoue : pas de DOCX généré, `last_run_report_lm.json` contient les erreurs
- [ ] `last_run_report_lm.json` écrit à chaque run quelle que soit l'issue
- [ ] `data/company_profiles/` contient un JSON par entreprise après le premier run
- [ ] Le LM DOCX contient le nom de l'entreprise et aucun placeholder non résolu
