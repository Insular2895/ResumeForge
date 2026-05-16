# Regles de generation LM pour Gemini

Ce fichier sert uniquement de reference pour Gemini. Il n'est jamais une sortie finale.

## 1. Structure logique attendue

La lettre finale doit suivre cette progression :

1. Candidature ciblee a l'entreprise et au poste.
2. Motivation liee a des faits entreprise autorises.
3. Positionnement du candidat.
4. Preuve principale issue du CV.
5. Preuves complementaires uniquement si elles renforcent le poste.
6. Apprentissage et progression si pertinent.
7. Projection dans l'entreprise.
8. Conclusion sobre.

## 2. Regle de selection des experiences

La LM ne doit pas etre un resume du CV. Chaque experience utilisee doit servir une preuve precise pour le poste cible.

Une experience peut etre utilisee si elle prouve au moins un des elements suivants :

- competence metier liee au poste ;
- competence operationnelle transferable ;
- exposition a un outil utile ;
- comprehension d'un secteur proche ;
- gestion de flux, clients, partenaires, donnees, projets ou contraintes ;
- autonomie ;
- rigueur ;
- capacite d'apprentissage ;
- capacite a structurer ou executer ;
- capacite a communiquer avec plusieurs parties prenantes.

Avant d'utiliser une experience, reponds implicitement a cette question : "En quoi cette experience prouve que le candidat peut reussir dans le poste cible ?"

Regles :

- l'experience principale doit etre celle qui a le lien le plus direct avec le poste ;
- les experiences secondaires doivent seulement renforcer une competence complementaire ;
- ne pas empiler les experiences ;
- ne pas citer une experience uniquement parce qu'elle est presente dans le CV ;
- ne pas inventer de lien metier artificiel.

## 3. Comprehension metier avancee

Ne te limite pas aux mots-cles visibles dans l'offre. Comprends la meta-metier du poste a partir de la famille metier, des missions, du CV Markdown, des outils, des termes techniques, des contraintes implicites et des pratiques habituelles du secteur.

Objectif : identifier les termes metier utiles, meme lorsqu'ils ne sont pas ecrits explicitement dans l'offre, a condition de ne pas inventer d'expertise.

Exemples :

- Import/export, flux internationaux, expeditions ou livraisons impliquent delais, coordination, transport, documents, fiabilite des informations, interlocuteurs internes/externes et suivi operationnel.
- Incoterms peut etre utilise seulement si present dans le CV Markdown.
- Stock, achats, rotation ou logistique impliquent stock, suivi, disponibilite, pertes, qualite, prevision ou rotation.
- FIFO peut etre utilise seulement si present dans le CV Markdown.
- ADV export implique suivi de commande, relation client, facturation, documents, delais, transporteurs, coordination interne et reporting.
- Marketing digital implique funnel, acquisition, CRM, SEO, SEA, emailing, tracking, reporting et KPI.
- Data ou BI implique qualite des donnees, dashboard, automatisation, SQL, Python, Excel, Google Sheets, reporting et prise de decision.
- Gestion de projet implique planning, coordination, priorisation, livrables, parties prenantes, arbitrage et suivi d'avancement.
- Finance ou operations implique controle, suivi, risque, conformite, reporting, fiabilite et execution.

## 4. Niveaux d'utilisation des termes metier

### Niveau 1 - Present dans le CV Markdown

Le terme peut etre utilise comme preuve, exposition ou competence. Il peut etre relie directement au candidat.

### Niveau 2 - Present dans l'offre mais absent du CV Markdown

Le terme peut etre utilise comme enjeu du poste, mais jamais comme competence maitrisee.

### Niveau 3 - Implicite au metier mais absent du CV et de l'offre

Le terme peut etre utilise seulement avec prudence pour montrer une comprehension generale du metier. Il ne doit jamais etre presente comme expertise personnelle.

## 5. Placeholders de raisonnement interdits dans la lettre finale

Ces placeholders servent uniquement a guider le raisonnement :

- `[[LM_INTRO_CIBLEE]]`
- `[[LM_MOTIVATION_ENTREPRISE]]`
- `[[LM_PROFILE_POSITIONING]]`
- `[[LM_PREUVE_CV_PRINCIPALE]]`
- `[[LM_PREUVE_CV_COMPLEMENTAIRE]]`
- `[[LM_APPRENTISSAGE]]`
- `[[LM_PROJECTION_ENTREPRISE]]`
- `[[LM_PROJECTION_LONG_TERME]]`
- `[[LM_CONCLUSION]]`
- `[[LM_POLITENESS_FORMULA]]`

Ils ne doivent jamais apparaitre dans la lettre finale.

## 6. Placeholders DOCX finaux

Ces placeholders sont reserves au template Word :

- `[[CANDIDATE_FULL_NAME]]`
- `[[CANDIDATE_ADDRESS_LINE_1]]`
- `[[CANDIDATE_ADDRESS_LINE_2]]`
- `[[CANDIDATE_PHONE]]`
- `[[CANDIDATE_EMAIL]]`
- `[[LM_COMPANY]]`
- `[[LM_COMPANY_ADDRESS_LINE_1]]`
- `[[LM_COMPANY_POSTAL_CITY]]`
- `[[LM_ATTENTION_TO]]`
- `[[LM_DEPARTMENT]]`
- `[[LM_JOB_TITLE]]`
- `[[LM_SALUTATION]]`
- `[[LM_FINAL_LETTER]]`
- `[[LM_DATE]]`
- `[[LM_SIGNATURE]]`

Le champ `final_letter` genere par Gemini doit remplir uniquement `[[LM_FINAL_LETTER]]`.

## 7. Informations a verifier avant utilisation

Les elements suivants ne peuvent etre utilises que s'ils sont presents dans le CV Markdown, l'offre ou `application_context.json`.

Profil candidat : entreprises d'experience, intitules de poste, dates, chiffres, outils, logiciels, formations, certifications, projets, competences, missions, perimetres geographiques, responsabilites manageriales, termes techniques et realisations quantifiees.

Entreprise ciblee : nom, adresse, recruteur, service, poste, valeurs, mission, culture interne, programmes de formation, mobilite interne, parcours collaborateurs, organisation internationale, labels employeur, engagements RSE, actualites, vocabulaire officiel, logique client/patient/utilisateur.

Metier cible : famille metier, missions principales, contraintes operationnelles, interlocuteurs, outils, documents, process, qualite, delais, reporting, relation client, relation fournisseur, coordination interservices, suivi des risques, conformite, performance, pilotage et execution.

## 7 bis. Methodologie entreprise reproductible

Pour chaque entreprise, chercher d'abord dans les sources officielles :

1. Mission, impact et logique client/patient/utilisateur.
2. Culture interne : collaboration, autonomie, feedback, ownership, confiance, excellence, impact.
3. Formation et apprentissage : academy, learning model, coaching, onboarding, cours, certifications, mentoring.
4. Mobilite et progression : mobilite interne, mobilite internationale, parcours collaborateurs, cross-functional mobility.
5. Organisation internationale : pays, equipes, exposition globale, environnement multiculturel.
6. Vocabulaire officiel exact.

Si un fait officiel prouve formation, apprentissage, mobilite ou progression, utiliser cet angle pour montrer que le candidat veut progresser dans un cadre structure tout en contribuant rapidement.

Si aucun fait officiel ne le prouve, rester sobre : parler de la capacite d'apprentissage du candidat, mais ne pas affirmer que l'entreprise offre des cours, un parcours ou une mobilite.

## 8. Style attendu

Le style doit etre professionnel, direct, naturel, precis, credible, operationnel, ambitieux sans exces, oriente contribution et non generique.

## 8 bis. Formulation ATS et preuves ABC/XYZ

La LM doit rester naturelle, mais les preuves CV doivent etre formulees avec une logique proche de ABC ou XYZ lorsque c'est pertinent.

ABC :

- Action realisee ;
- Benefice, resultat ou effet operationnel ;
- Contexte metier.

XYZ :

- resultat obtenu ;
- par action menee ;
- dans un contexte donne.

Exemples de logique, sans copier mot pour mot :

- "Chez Blurry, j'ai coordonne des flux import/export pour plusieurs partenaires, en fiabilisant le suivi des commandes et des documents dans un contexte international."
- "Cette experience m'a permis de renforcer la coordination entre commandes, transport, stock et interlocuteurs externes, avec une attention particuliere aux delais et a la conformite."

Regles :

- ne jamais ajouter de chiffre absent du CV Markdown, de l'offre ou des faits autorises ;
- ne pas transformer une exposition en expertise ;
- reprendre naturellement les mots-cles ATS quand ils sont autorises : ADV, import/export, SAP, Incoterms, commandes, SLA, lettres de credit, documentation commerciale, transport, conformite, douanes, stocks, FEFO/FIFO, coordination interservices, finance, qualite, procurement, warehouse, transport ;
- si un mot-cle est present dans l'offre mais absent du CV, l'utiliser comme enjeu du poste et non comme competence maitrisee.

## 8 ter. Precision metier par vagues

La LM doit montrer une comprehension precise du metier sans alourdir le style.

Raisonner par vagues :

1. Domaine large : supply chain, ADV, import/export, logistique internationale.
2. Processus : prise de commande, expedition, transport, douane, stock, facturation, paiement, relation client, coordination interservices.
3. Documents / outils / contraintes : SAP, ERP, Incoterms, FCA, CPT, DAP, commercial invoice, packing list, bill of lading, airway bill, lettres de credit, documents douaniers, SLA, FEFO/FIFO.
4. Risques operationnels : retard transporteur, cut-off, erreur documentaire, blocage douane, ecart stock, non-conformite, litige client, qualite de service.

Regles :

- combiner 2 a 4 vagues dans les phrases de preuve ;
- ne pas empiler des termes sans logique ;
- si un terme est dans le CV Markdown, il peut prouver une exposition candidat ;
- si un terme est seulement dans l'offre, il doit etre presente comme enjeu du poste ;
- si un terme est seulement implicite au domaine, il doit rester prudent ;
- ne jamais presenter un document precis comme deja pratique si le CV ne le prouve pas.

## 9. Interdictions

La lettre finale ne doit jamais contenir :

- annotations entre crochets ;
- placeholders ;
- markdown ;
- bullet points ;
- chiffres absents du CV ;
- outils absents du CV ;
- experiences absentes du CV ;
- formations absentes du CV ;
- faits entreprise non sources ;
- avantages banals ;
- phrases cliches ;
- survente d'expertise ;
- formulation qui donne l'impression que le candidat manque de competence.

## 10. Arguments a exclure

Ne pas utiliser comme motivation principale :

- remboursement transport ;
- tickets restaurant ;
- mutuelle standard ;
- RTT generiques ;
- teletravail generique ;
- primes vagues ;
- environnement dynamique ;
- entreprise innovante ;
- leader de son secteur ;
- equipe bienveillante sans preuve ;
- opportunites d'evolution sans element precis.

## 11. Regle finale

La lettre finale doit etre adaptee a chaque candidature. Elle ne doit jamais reutiliser automatiquement les elements d'une ancienne candidature.

Chaque information doit etre justifiee par :

1. le CV Markdown final ;
2. l'offre ;
3. `application_context.json` ;
4. les faits entreprise autorises.
