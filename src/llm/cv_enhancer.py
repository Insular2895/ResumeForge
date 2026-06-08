import json
from copy import deepcopy

from src.llm.gemini_client import ask_gemini, is_gemini_enabled
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


def improve_full_cv_with_gemini(selected_experiences, selected_leadership, job_text, ats_analysis=None):
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
    ats_guidance = {
        "score_initial": ats_analysis.get("score"),
        "mots_cles_injectables_car_deja_prouves": ats_analysis.get("injectable_keywords", []),
        "mots_cles_transferables_a_ajouter_si_utile": ats_analysis.get("transferable_keywords", []),
        "mots_cles_manquants_a_traiter_en_priorite": ats_analysis.get("missing_keywords", [])[:20],
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
Utilise les suggestions ATS, y compris les compétences transférables réalistes demandées par l'offre.

Contraintes strictes :
- ne mens pas
- n'invente aucun chiffre
- n'ajoute aucune expérience
- tu peux ajouter des outils/compétences transférables demandés par l'offre si cela reste crédible pour un profil junior opérationnel
- pour un ERP demandé, tu peux parler d'ERP ou de prise en main d'un ERP équivalent sans prétendre être expert d'un logiciel précis
- pour Pack Office / Microsoft Office / Google Workspace, tu peux les intégrer comme outils bureautiques opérationnels
- garde le sens original
- conserve exactement le même nombre de bullets pour chaque bloc
- améliore la clarté, l'impact et la correspondance avec l'offre
- adopte une logique de marketing-propre pour recruteur humain : valorise les missions avec un vocabulaire corporate, orienté impact, coordination, qualité, délais, client, reporting, sans inventer de faits
- intègre les mots-clés ATS manquants quand ils renforcent une mission proche
- si le score initial est inférieur à 70, traite les mots-clés manquants/prioritaires comme une contrainte forte : intègre-en le maximum dans les bullets existants quand c'est crédible
- privilégie l'intégration des mots-clés métier dans les bullets d'expérience, pas sous forme de liste artificielle
- chaque expérience doit porter plusieurs mots exacts de l'offre, répartis naturellement dans les bullets
- adapte l'optimisation à tout type d'offre : ADV, administratif, commercial, finance, marketing, data, projet, retail, support client, supply chain, export/import
- transforme les mots-clés de l'offre en missions naturelles quand le contexte est proche : outils, processus, clients, reporting, coordination, budget, litiges, qualité, délais, contrats, production, logistique, analyse, relation commerciale
- pour ADV / administratif / export, les termes comme cahiers des charges, consultations, approvisionnement, production, conditions contractuelles, demandes clients, support administratif, délais, coût, qualité peuvent devenir des formulations prudentes : "appui au suivi", "coordination avec", "fiabilisation de", "contribution à"
- si l'offre est courte ou vague, utilise le vocabulaire métier de référence fourni par l'analyse ATS pour enrichir les bullets avec des termes du métier cible
- remplace les formulations vagues par des formulations concrètes liées au domaine de l'offre, avec les mêmes preuves de fond que le CV source
- utilise les mots-clés exacts des ATS stricts quand ils sont vrais et naturels, surtout ceux listés comme manquants par Workday, Taleo ou SuccessFactors
- préfère une formulation crédible du type "contribution à", "suivi de", "coordination de", "appui à", "fiabilisation de", plutôt que des claims trop forts quand la preuve est indirecte
- évite les formulations fortes du type "expert", "maîtrise avancée", "spécialiste SAP" si ce n'est pas prouvé
- style professionnel
- français naturel
- bullets courts
- ne modifie pas les noms d'entreprise, postes, lieux ou dates
- réponse uniquement en JSON valide
- aucun commentaire avant ou après

Format de réponse obligatoire :
{{
  "experiences": [
    {{
      "index": 0,
      "bullets": ["bullet 1", "bullet 2"]
    }}
  ],
  "leadership": [
    {{
      "index": 0,
      "bullets": ["bullet 1", "bullet 2"]
    }}
  ]
}}

Offre :
{job_text}

Analyse ATS à prendre en compte :
{json.dumps(ats_guidance, ensure_ascii=False, indent=2)}

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
