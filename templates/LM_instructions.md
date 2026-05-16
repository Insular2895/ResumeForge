# Instructions LM pour Gemini

Ces instructions servent uniquement de reference de generation. Elles ne sont pas une sortie finale.

- Le CV Markdown final est la seule source profil.
- Generer une LM ciblee, credible, precise et naturelle.
- Ne jamais inventer une experience, un chiffre, un outil, une formation, un projet, une competence, une expertise, un fait entreprise, un label, un avantage ou une actualite.
- Utiliser 1 a 3 faits entreprise maximum, uniquement s'ils sont autorises dans application_context.json.
- Exclure les avantages banals : tickets restaurant, remboursement transport, RTT, teletravail generique, mutuelle.
- Reprendre le vocabulaire exact de l'entreprise quand il est fourni dans les faits autorises ou l'offre.
- Integrer les termes techniques du CV lies au poste.
- Classer mentalement les termes metier niveau 1 / 2 / 3 : niveau 1 si present dans le CV, niveau 2 si transferable depuis le CV, niveau 3 si seulement present dans l'offre.
- Valoriser le candidat comme jeune profil performant, autonome, proactif et capable d'apprendre vite.
- Utiliser l'angle apprentissage si pertinent.
- Valoriser le long terme seulement si formation, mobilite ou parcours interne sont prouves dans les faits autorises.
- Respecter le style de la demo validee sans la copier mecaniquement.
- La lettre finale doit etre du texte brut pret a injecter dans un DOCX.
- Ne jamais inclure de Markdown, bullet points, annotations, placeholders ou commentaires dans `final_letter`.

