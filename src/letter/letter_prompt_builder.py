import json


STRICT_JSON_SCHEMA = {
    "company_identified": "",
    "sources_used": [],
    "facts_retained": [],
    "facts_excluded": [],
    "job_family": "",
    "useful_job_vocabulary": [],
    "cv_experiences_used": [],
    "cv_technical_terms_reused": [],
    "transferable_skills_linked": [],
    "education_used": [],
    "learning_angle_used": True,
    "final_letter": "",
    "quality_check": {
        "uses_only_cv_profile": True,
        "uses_cv_markdown_as_source": True,
        "no_fake_numbers": True,
        "no_fake_experience": True,
        "no_fake_company_fact": True,
        "tone_professional": True,
        "not_generic": True,
        "no_demo_annotations_in_final_letter": True,
    },
}


def build_letter_prompt(
    application_context: dict,
    cv_markdown: str,
    lm_instructions: str,
    lm_template: str,
    lm_demo: str,
) -> str:
    """Build the strict Gemini prompt for cover letter generation."""
    context_json = json.dumps(application_context, ensure_ascii=False, indent=2)
    schema_json = json.dumps(STRICT_JSON_SCHEMA, ensure_ascii=False, indent=2)

    return f"""Tu generes une lettre de motivation en francais pour ResumeForge.

CONTRAINTE ABSOLUE:
- Retourne uniquement un objet JSON valide.
- N'ajoute aucun markdown autour du JSON.
- `final_letter` doit etre du texte brut pret a injecter dans un DOCX.
- N'exporte jamais de lettre finale en Markdown.
- Ne lis et n'utilise jamais master_profile.xlsx.
- La seule source profil autorisee est le CV Markdown final fourni ci-dessous.
- application_context.json controle toutes les affirmations autorisees.
- `facts_retained` est reserve uniquement aux faits entreprise autorises presents dans application_context.selected_company_facts.
- Si application_context.selected_company_facts est vide, `facts_retained` doit etre [].
- Ne mets jamais de preuve CV, d'experience, de certification, d'outil ou de competence dans `facts_retained`.
- Les preuves CV vont uniquement dans `cv_experiences_used`, `cv_technical_terms_reused`, `transferable_skills_linked` et `education_used`.
- `cv_experiences_used` doit contenir des noms courts d'experiences visibles dans le CV Markdown, par exemple "Blurry - Analyste commercial ADV".
- `cv_technical_terms_reused` doit contenir uniquement des termes presents dans le CV Markdown.
- Si des faits entreprise autorises existent, utilise-les vraiment pour produire une motivation differenciante et concrete.
- Reprends le vocabulaire officiel present dans `official_company_vocabulary` quand il est coherent.
- Le style vise la qualite de `LM_DEMO_VALIDEE_MD`: precis, operationnel, moins generique qu'une lettre standard.
- Pour un jeune diplômé, privilégie "base opérationnelle", "réflexes solides", "exposition concrète", "capacité d'apprentissage".
- N'utilise jamais les mots "expertise", "maîtrise", "maîtriser", "spécialiste" ou "expert" pour parler du candidat ; préfère "exposition", "base", "pratique", "compréhension", "utilisation", "socle" ou "montée en compétence".
- N'écris jamais "maîtrise technique", même pour SAP ; écris "pratique technique", "utilisation de SAP" ou "socle SAP".
- Ne formule jamais "cette expertise" ; écris plutôt "cette base opérationnelle", "cette exposition" ou "ce socle".
- Si application_context contient un fait autorisé sur formation, learning, mobilité, progression ou parcours collaborateurs, appuie clairement l'angle apprentissage/developpement personnel.
- Si aucun fait entreprise ne prouve l'apprentissage ou la progression, garde l'angle apprentissage côté candidat mais ne prétends pas que l'entreprise offre formation, mobilité ou développement.
- L'objectif professionnel du candidat peut être formulé comme : apprendre vite, consolider une base opérationnelle, progresser dans un environnement structuré et contribuer durablement.
- Utilise une logique ABC/XYZ dans les preuves CV quand c'est naturel :
  - ABC : Action réalisée, Bénéfice ou résultat, Contexte métier.
  - XYZ : résultat obtenu, par action menée, dans un contexte donné.
- Les formulations ABC/XYZ doivent rester fluides et professionnelles, pas mécaniques.
- N'ajoute jamais de résultat chiffré absent du CV Markdown, de l'offre ou des faits autorisés.
- Pour l'ATS, reprends naturellement les mots-clés métier vérifiés : ADV, import/export, SAP, Incoterms, commandes, SLA, lettres de crédit, documentation commerciale, transport, conformité, douanes, stocks, FEFO/FIFO, coordination interservices, finance, qualité, procurement, warehouse, transport.
- Si un mot-clé métier est présent dans l'offre mais absent du CV, utilise-le comme enjeu du poste, pas comme compétence déjà maîtrisée.
- Utilise `application_context.domain_vocabulary` pour raisonner par vagues métier :
  - vague 1 : domaine large ;
  - vague 2 : processus ;
  - vague 3 : documents, outils, contraintes précises ;
  - vague 4 : risques opérationnels.
- Une bonne phrase métier doit idéalement combiner 2 à 4 vagues, par exemple domaine + processus + outil/document + risque.
- N'empile pas les termes : chaque terme précis doit servir une preuve ou un enjeu clair.
- Les termes de vague 3 ou 4 absents du CV mais présents dans l'offre peuvent être utilisés comme contraintes du poste.
- Les termes de vague 3 ou 4 absents du CV et de l'offre peuvent seulement montrer une compréhension prudente du métier.
- La motivation entreprise doit être plus précise que "organisation reconnue" : utilise les faits autorisés, le vocabulaire officiel et le lien avec le poste.

INTERDICTIONS DANS final_letter:
- markdown
- bullet points
- annotations comme [ROLE:], [VALEUR:], [CV_PROOF:]
- placeholders comme [[...]]
- phrases cliches
- avantages banals
- invention d'elements non autorises
- salutation d'ouverture type "Madame, Monsieur," dans `final_letter`
- date ou signature dans `final_letter`

REGLES DE CLASSEMENT DU JSON:
- `facts_retained`: seulement les faits entreprise sourcés et autorises. Maximum 3.
- `facts_excluded`: faits entreprise refuses ou non utilises. Ne pas y mettre les preuves CV.
- `cv_experiences_used`: experiences CV utilisees comme preuve, sous forme de chaines courtes.
- `cv_technical_terms_reused`: outils, logiciels et termes techniques repris depuis le CV Markdown.
- `useful_job_vocabulary`: vocabulaire metier utile, sans pretendre que le candidat maitrise les termes absents du CV.

STRUCTURE REDACTIONNELLE DE final_letter:
- 5 a 7 paragraphes courts separes par une ligne vide.
- Paragraphe 1: candidature ciblee + motivation entreprise avec 1 a 3 faits autorises si disponibles.
- Paragraphe 2: positionnement jeune diplome deja operationnel.
- Paragraphe 3: preuve principale Blurry ou experience la plus pertinente, avec formulation ABC/XYZ et termes metier precis.
- Paragraphe 4: preuve complementaire seulement si elle renforce le poste, avec formulation ABC/XYZ si possible.
- Dans les paragraphes 3 et 4, essaye de relier explicitement les vagues métier : flux import/export -> commande/transport/stock -> SAP/Incoterms/documents -> delais/conformite/qualite de service.
- Paragraphe 5: apprentissage/progression SAP si visible dans le CV.
- Paragraphe 6: projection chez l'entreprise, concrete, sans flatterie. Si un fait autorisé le permet, relier cette projection à la montée en compétences offerte par l'entreprise.
- Conclusion sobre avec une formule de politesse professionnelle.
- La formule de politesse finale doit être classique : "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées." ou une variante adaptée au destinataire.
- N'utilise pas "Bien cordialement", "Cordialement" ou une formule email.

JSON STRICT A RETOURNER:
{schema_json}

APPLICATION_CONTEXT_JSON:
{context_json}

CV FINAL MARKDOWN:
{cv_markdown}

LM_INSTRUCTIONS_MD:
{lm_instructions}

LM_TEMPLATE_MD:
{lm_template}

LM_DEMO_VALIDEE_MD:
{lm_demo}
"""
