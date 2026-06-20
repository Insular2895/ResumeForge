import json
from copy import deepcopy

from src.llm.gemini_client import ask_gemini, is_gemini_enabled
from src.application.career_translation import build_translation_context, resolve_target_domain
from src.web.prompt_overrides import append_cv_override


def clean_json_response(text: str) -> str:
    cleaned = text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.replace("```json", "", 1).strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```", "", 1).strip()

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    return cleaned


def improve_full_cv_with_gemini(
    selected_experiences,
    selected_leadership,
    job_text,
    ats_analysis=None,
    document_language="fr",
    target_domain="",
):
    """
    Optimise tous les bullets du CV en un seul appel Gemini.
    Fallback : retourne les contenus originaux si Gemini échoue.
    """

    if not is_gemini_enabled():
        return selected_experiences, selected_leadership

    experiences_copy = deepcopy(selected_experiences)
    leadership_copy = deepcopy(selected_leadership)

    payload = {
        "experiences": [
            {
                "index": index,
                "company": exp.get("company", ""),
                "position": exp.get("position", ""),
                "bullets": exp.get("bullets", []),
                "validated_memory": exp.get("validated_memory", ""),
                "facts_locked": bool(exp.get("facts_locked")),
                "rewrite_locked": bool(exp.get("rewrite_locked")),
            }
            for index, exp in enumerate(experiences_copy)
        ],
        "leadership": [
            {
                "index": index,
                "org": lead.get("org", ""),
                "role": lead.get("role", ""),
                "bullets": lead.get("bullets", []),
            }
            for index, lead in enumerate(leadership_copy)
        ],
    }
    ats_analysis = ats_analysis or {}
    evidence_text = "\n".join(
        text
        for group in [experiences_copy, leadership_copy]
        for item in group
        for text in [*item.get("bullets", []), item.get("validated_memory", "")]
        if text
    )
    resolved_domain = resolve_target_domain(job_text, target_domain)
    translation_context = build_translation_context(
        evidence_text,
        resolved_domain["key"],
        domain_model=resolved_domain["model"],
    )
    ats_guidance = {
        "score_initial": ats_analysis.get("score"),
        "mots_cles_injectables_car_deja_prouves": ats_analysis.get("injectable_keywords", []),
        "mots_cles_deja_prouves_a_integrer_si_utile": ats_analysis.get("injectable_keywords", []),
        "enjeux_de_l_offre_non_revendicables_comme_experience": ats_analysis.get("missing_keywords", [])[:20],
        "mots_cles_a_integrer_dans_les_experiences_pas_en_liste_competences": ats_analysis.get("priority_keywords", []),
        "suggestions_ats": ats_analysis.get("suggestions", []),
        "vocabulaire_metier_de_reference_si_offre_courte": ats_analysis.get(
            "job_reference_enrichment", {}
        ),
    }

    prompt = f"""
Tu es un expert CV ATS.

Objectif :
Réécris les bullets du CV pour mieux correspondre à l'offre.
Utilise uniquement les suggestions ATS déjà soutenues par les preuves du candidat.

Contraintes strictes :
- ne mens pas
- n'invente aucun chiffre
- n'ajoute aucune expérience
- n'ajoute aucun outil ou compétence seulement parce qu'il est demandé dans l'offre
- garde le sens original
- conserve exactement le même nombre de bullets pour chaque bloc
- améliore la clarté, l'impact et la correspondance avec l'offre
- adopte une logique de marketing-propre pour recruteur humain : valorise les missions avec un vocabulaire corporate, orienté impact, coordination, qualité, délais, client, reporting, sans inventer de faits
- intègre uniquement les mots-clés ATS déjà prouvés quand ils renforcent une mission
- si le score initial est inférieur à 70, améliore la formulation sans contourner la frontière des preuves soutenues
- privilégie l'intégration des mots-clés métier dans les bullets d'expérience, pas sous forme de liste artificielle
- chaque expérience doit porter plusieurs mots exacts de l'offre, répartis naturellement dans les bullets
- adapte l'optimisation à tout type d'offre : ADV, administratif, commercial, finance, marketing, data, projet, retail, support client, supply chain, export/import
- transforme les mots-clés de l'offre en missions naturelles quand le contexte est proche : outils, processus, clients, reporting, coordination, budget, litiges, qualité, délais, contrats, production, logistique, analyse, relation commerciale
- pour ADV / administratif / export, les termes comme cahiers des charges, consultations, approvisionnement, production, conditions contractuelles, demandes clients, support administratif, délais, coût, qualité peuvent devenir des formulations prudentes : "appui au suivi", "coordination avec", "fiabilisation de", "contribution à"
- si l'offre est courte ou vague, utilise le vocabulaire métier de référence fourni par l'analyse ATS pour enrichir les bullets avec des termes du métier cible
- remplace les formulations vagues par des formulations concrètes liées au domaine de l'offre, avec les mêmes preuves de fond que le CV source
- utilise les mots-clés exacts des ATS stricts uniquement quand ils sont vrais, naturels et soutenus
- préfère une formulation proportionnée à la responsabilité explicitement prouvée
- évite les formulations fortes du type "expert", "maîtrise avancée", "spécialiste SAP" si ce n'est pas prouvé
- style professionnel
- rédige tous les intitulés de poste, rôles et bullets en {"anglais professionnel" if document_language == "en" else "français naturel"}
- conserve les noms d'entreprise, organisations, lieux, dates, chiffres et outils inchangés
- les faits avec `facts_locked: true` sont immuables sur le fond mais leur formulation métier peut être traduite
- utilise `validated_memory` uniquement pour l'expérience à laquelle elle est rattachée
- bullets courts
- ne modifie pas les noms d'entreprise, lieux ou dates
- utilise le contexte de traduction métier fourni ci-dessous comme garde-fou :
  - les termes soutenus peuvent être intégrés naturellement ;
  - Les termes non soutenus sont interdits tant que le candidat ne les a pas validés ;
  - ne transforme jamais une proximité sémantique en responsabilité réelle
- réponse uniquement en JSON valide
- aucun commentaire avant ou après

Format de réponse obligatoire :
{{
  "experiences": [
    {{
      "index": 0,
      "position": "intitulé traduit si nécessaire",
      "bullets": ["bullet 1", "bullet 2"]
    }}
  ],
  "leadership": [
    {{
      "index": 0,
      "role": "rôle traduit si nécessaire",
      "bullets": ["bullet 1", "bullet 2"]
    }}
  ]
}}

Offre :
{job_text}

Analyse ATS à prendre en compte :
{json.dumps(ats_guidance, ensure_ascii=False, indent=2)}

Contexte de traduction métier crédible :
{json.dumps(translation_context, ensure_ascii=False, indent=2)}

CV à optimiser :
{json.dumps(payload, ensure_ascii=False, indent=2)}
"""

    prompt = append_cv_override(prompt)

    try:
        response = ask_gemini(prompt)
        response_json = json.loads(clean_json_response(response))

        for item in response_json.get("experiences", []):
            index = item.get("index")
            new_bullets = item.get("bullets", [])

            if not isinstance(index, int) or index < 0 or index >= len(experiences_copy):
                continue
            old_bullets = experiences_copy[index].get("bullets", [])
            if item.get("position"):
                experiences_copy[index]["position"] = str(item["position"]).strip()

            if len(new_bullets) == len(old_bullets):
                experiences_copy[index]["bullets"] = [
                    str(b).strip().lstrip("-").lstrip("•").lstrip("*").strip()
                    for b in new_bullets
                    if str(b).strip()
                ]

        for item in response_json.get("leadership", []):
            index = item.get("index")
            new_bullets = item.get("bullets", [])

            if not isinstance(index, int) or index < 0 or index >= len(leadership_copy):
                continue

            old_bullets = leadership_copy[index].get("bullets", [])
            if item.get("role"):
                leadership_copy[index]["role"] = str(item["role"]).strip()

            if len(new_bullets) == len(old_bullets):
                leadership_copy[index]["bullets"] = [
                    str(b).strip().lstrip("-").lstrip("•").lstrip("*").strip()
                    for b in new_bullets
                    if str(b).strip()
                ]

        return experiences_copy, leadership_copy

    except Exception as error:
        print(f"[Gemini fallback full CV] {error}")
        return selected_experiences, selected_leadership


def translate_cv_lists_to_english(certifications, technical_skills):
    fallback_certifications = [_translate_known_cv_term(item) for item in certifications]
    fallback_skills = [_translate_known_cv_term(item) for item in technical_skills]
    if not is_gemini_enabled():
        return fallback_certifications, fallback_skills
    prompt = f"""
Translate this CV content into concise professional English.
Keep product names, organizations, acronyms, and software names unchanged.
Return only valid JSON with exactly these keys and the same item counts:
{{
  "certifications": ["..."],
  "technical_skills": ["..."]
}}

Content:
{json.dumps({"certifications": certifications, "technical_skills": technical_skills}, ensure_ascii=False)}
"""
    try:
        result = json.loads(clean_json_response(ask_gemini(prompt)))
        translated_certifications = result.get("certifications", [])
        translated_skills = result.get("technical_skills", [])
        if len(translated_certifications) != len(certifications):
            translated_certifications = fallback_certifications
        if len(translated_skills) != len(technical_skills):
            translated_skills = fallback_skills
        return translated_certifications, translated_skills
    except Exception as error:
        print(f"[Gemini fallback English CV lists] {error}")
        return fallback_certifications, fallback_skills


def _translate_known_cv_term(value):
    text = str(value)
    replacements = {
        "Documentation administrative": "Administrative documentation",
        "Gestion de données clients": "Customer data management",
        "Service client": "Customer service",
        "Support client": "Customer support",
        "Gestion des commandes": "Order management",
        "Gestion des stocks": "Inventory management",
    }
    return replacements.get(text, text)
