# Modele logique de donnees - Plateforme Alumni

Ce document decrit le modele logique de donnees derive du diagramme de classes du projet Alumni.

## Notation

- `PK` : cle primaire
- `FK` : cle etrangere
- `UQ` : valeur unique
- `NN` : valeur obligatoire, non nulle
- `NULL` : valeur optionnelle
- Les types proposes sont compatibles avec une base relationnelle comme PostgreSQL.

## Vue relationnelle synthetique

```text
ROLE(
  id PK,
  nom UQ NN,
  description
)

PERMISSION(
  id PK,
  code UQ NN,
  nom NN,
  description
)

ROLE_PERMISSION(
  role_id PK, FK -> ROLE.id NN,
  permission_id PK, FK -> PERMISSION.id NN,
  date_attribution NN
)

UTILISATEUR(
  id PK,
  role_id FK -> ROLE.id NN,
  nom NN,
  email UQ NN,
  mot_de_passe_hash NN,
  actif NN,
  date_creation NN,
  dernier_acces
)

FILIERE(
  id PK,
  nom NN,
  departement,
  niveau
)

ALUMNUS(
  id PK,
  filiere_id FK -> FILIERE.id NN,
  matricule UQ,
  nom NN,
  prenom NN,
  email UQ,
  telephone,
  niveau_etude,
  annee_sortie,
  ville_residence,
  pays_residence,
  statut_dossier NN,
  date_creation NN,
  date_derniere_maj
)

SECTEUR_ACTIVITE(
  id PK,
  nom UQ NN
)

ENTREPRISE(
  id PK,
  secteur_activite_id FK -> SECTEUR_ACTIVITE.id NN,
  nom NN,
  ville,
  pays,
  site_web
)

SITUATION_PROFESSIONNELLE(
  id PK,
  alumnus_id FK -> ALUMNUS.id NN,
  entreprise_id FK -> ENTREPRISE.id NULL,
  secteur_activite_id FK -> SECTEUR_ACTIVITE.id NULL,
  statut NN,
  poste,
  date_debut,
  date_fin,
  travaille_dans_domaine,
  est_actuelle NN,
  date_maj NN
)

FORMULAIRE(
  id PK,
  titre NN,
  description,
  actif NN,
  date_creation NN
)

QUESTION(
  id PK,
  formulaire_id FK -> FORMULAIRE.id NN,
  libelle NN,
  type NN,
  obligatoire NN,
  ordre NN
)

CAMPAGNE(
  id PK,
  formulaire_id FK -> FORMULAIRE.id NN,
  utilisateur_id FK -> UTILISATEUR.id NN,
  nom NN,
  objet_message,
  message,
  date_debut,
  date_fin,
  statut NN
)

INVITATION_FORMULAIRE(
  id PK,
  campagne_id FK -> CAMPAGNE.id NN,
  alumnus_id FK -> ALUMNUS.id NN,
  token UQ NN,
  lien_personnalise UQ NN,
  canal NN,
  date_envoi,
  date_expiration,
  statut NN
)

RELANCE(
  id PK,
  invitation_id FK -> INVITATION_FORMULAIRE.id NN,
  canal NN,
  message,
  date_relance NN,
  statut_envoi
)

REPONSE_FORMULAIRE(
  id PK,
  invitation_id FK -> INVITATION_FORMULAIRE.id UQ NN,
  alumnus_id FK -> ALUMNUS.id NN,
  date_soumission,
  statut NN,
  taux_completion,
  adresse_ip
)

REPONSE_QUESTION(
  id PK,
  reponse_formulaire_id FK -> REPONSE_FORMULAIRE.id NN,
  question_id FK -> QUESTION.id NN,
  valeur
)

IMPORT_DONNEES(
  id PK,
  utilisateur_id FK -> UTILISATEUR.id NN,
  nom_fichier NN,
  format NN,
  date_import NN,
  nb_lignes,
  nb_crees,
  nb_mis_a_jour,
  nb_erreurs
)

EXPORT_DONNEES(
  id PK,
  utilisateur_id FK -> UTILISATEUR.id NN,
  format NN,
  filtre,
  date_export NN,
  chemin_fichier
)

RAPPORT_STATISTIQUE(
  id PK,
  utilisateur_id FK -> UTILISATEUR.id NN,
  titre NN,
  periode_debut,
  periode_fin,
  format,
  date_generation NN
)
```

## Description detaillee des tables

### ROLE

Table contenant les profils d'acces de l'application.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant du role |
| nom | VARCHAR(100) | NN, UQ | Nom du role : administrateur, responsable, consultation |
| description | TEXT | NULL | Description du role |

### PERMISSION

Table contenant les droits unitaires disponibles dans l'application.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la permission |
| code | VARCHAR(150) | NN, UQ | Code technique de la permission, par exemple `alumni.read` |
| nom | VARCHAR(150) | NN | Nom lisible de la permission |
| description | TEXT | NULL | Description du droit accorde |

### ROLE_PERMISSION

Table d'association entre les roles et les permissions. Elle permet d'attribuer plusieurs permissions a un role et de reutiliser une meme permission dans plusieurs roles.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| role_id | UUID | PK, FK, NN | Role concerne |
| permission_id | UUID | PK, FK, NN | Permission attribuee |
| date_attribution | TIMESTAMP | NN | Date d'association de la permission au role |

### UTILISATEUR

Table contenant les comptes autorises a acceder a l'administration.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de l'utilisateur |
| role_id | UUID | FK, NN | Role associe a l'utilisateur |
| nom | VARCHAR(150) | NN | Nom complet |
| email | VARCHAR(255) | NN, UQ | Adresse e-mail de connexion |
| mot_de_passe_hash | VARCHAR(255) | NN | Mot de passe chiffre ou hache |
| actif | BOOLEAN | NN | Etat du compte |
| date_creation | TIMESTAMP | NN | Date de creation du compte |
| dernier_acces | TIMESTAMP | NULL | Derniere connexion |

### FILIERE

Table representant les filieres ou formations suivies par les alumnis.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la filiere |
| nom | VARCHAR(150) | NN | Nom de la filiere |
| departement | VARCHAR(150) | NULL | Departement rattache |
| niveau | VARCHAR(100) | NULL | Niveau de formation |

### ALUMNUS

Table centrale contenant les informations personnelles et academiques des anciens etudiants.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de l'alumnus |
| filiere_id | UUID | FK, NN | Filiere suivie |
| matricule | VARCHAR(100) | UQ, NULL | Matricule ou numero etudiant |
| nom | VARCHAR(150) | NN | Nom |
| prenom | VARCHAR(150) | NN | Prenom |
| email | VARCHAR(255) | UQ, NULL | Adresse e-mail |
| telephone | VARCHAR(30) | NULL | Numero de telephone |
| niveau_etude | VARCHAR(100) | NULL | Niveau d'etude atteint |
| annee_sortie | INTEGER | NULL | Annee de sortie |
| ville_residence | VARCHAR(150) | NULL | Ville de residence |
| pays_residence | VARCHAR(150) | NULL | Pays de residence |
| statut_dossier | VARCHAR(30) | NN | Etat du dossier |
| date_creation | TIMESTAMP | NN | Date de creation de la fiche |
| date_derniere_maj | TIMESTAMP | NULL | Derniere mise a jour |

### SECTEUR_ACTIVITE

Table de reference des secteurs professionnels.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant du secteur |
| nom | VARCHAR(150) | NN, UQ | Nom du secteur d'activite |

### ENTREPRISE

Table contenant les entreprises des alumnis.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de l'entreprise |
| secteur_activite_id | UUID | FK, NN | Secteur principal de l'entreprise |
| nom | VARCHAR(200) | NN | Nom de l'entreprise |
| ville | VARCHAR(150) | NULL | Ville |
| pays | VARCHAR(150) | NULL | Pays |
| site_web | VARCHAR(255) | NULL | Site web |

### SITUATION_PROFESSIONNELLE

Table contenant le parcours professionnel d'un alumnus.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la situation |
| alumnus_id | UUID | FK, NN | Alumnus concerne |
| entreprise_id | UUID | FK, NULL | Entreprise associee |
| secteur_activite_id | UUID | FK, NULL | Secteur declare par l'alumnus |
| statut | VARCHAR(50) | NN | Situation professionnelle |
| poste | VARCHAR(150) | NULL | Poste occupe |
| date_debut | DATE | NULL | Date de debut |
| date_fin | DATE | NULL | Date de fin |
| travaille_dans_domaine | BOOLEAN | NULL | Indique si le poste correspond a la formation |
| est_actuelle | BOOLEAN | NN | Indique si la situation est actuelle |
| date_maj | TIMESTAMP | NN | Date de mise a jour |

### FORMULAIRE

Table contenant les formulaires de collecte ou de mise a jour.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant du formulaire |
| titre | VARCHAR(200) | NN | Titre du formulaire |
| description | TEXT | NULL | Description |
| actif | BOOLEAN | NN | Etat du formulaire |
| date_creation | TIMESTAMP | NN | Date de creation |

### QUESTION

Table contenant les questions appartenant a un formulaire.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la question |
| formulaire_id | UUID | FK, NN | Formulaire parent |
| libelle | TEXT | NN | Texte de la question |
| type | VARCHAR(30) | NN | Type de question |
| obligatoire | BOOLEAN | NN | Question obligatoire ou non |
| ordre | INTEGER | NN | Position dans le formulaire |

### CAMPAGNE

Table representant une campagne d'envoi de formulaires.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la campagne |
| formulaire_id | UUID | FK, NN | Formulaire utilise |
| utilisateur_id | UUID | FK, NN | Utilisateur createur |
| nom | VARCHAR(200) | NN | Nom de la campagne |
| objet_message | VARCHAR(255) | NULL | Objet du message e-mail |
| message | TEXT | NULL | Contenu du message |
| date_debut | TIMESTAMP | NULL | Debut de campagne |
| date_fin | TIMESTAMP | NULL | Fin de campagne |
| statut | VARCHAR(30) | NN | Etat de la campagne |

### INVITATION_FORMULAIRE

Table de liaison entre une campagne et un alumnus. Elle permet de suivre l'envoi, le lien personnalise et le statut de reponse.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de l'invitation |
| campagne_id | UUID | FK, NN | Campagne concernee |
| alumnus_id | UUID | FK, NN | Alumnus destinataire |
| token | VARCHAR(255) | NN, UQ | Jeton unique du lien personnalise |
| lien_personnalise | VARCHAR(500) | NN, UQ | URL envoyee a l'alumnus |
| canal | VARCHAR(30) | NN | Canal d'envoi |
| date_envoi | TIMESTAMP | NULL | Date d'envoi |
| date_expiration | TIMESTAMP | NULL | Date d'expiration du lien |
| statut | VARCHAR(30) | NN | Etat de l'invitation |

### RELANCE

Table contenant les relances effectuees pour une invitation.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la relance |
| invitation_id | UUID | FK, NN | Invitation concernee |
| canal | VARCHAR(30) | NN | Canal de relance |
| message | TEXT | NULL | Message envoye |
| date_relance | TIMESTAMP | NN | Date de relance |
| statut_envoi | VARCHAR(50) | NULL | Resultat de l'envoi |

### REPONSE_FORMULAIRE

Table contenant la soumission globale d'un formulaire par un alumnus.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la reponse |
| invitation_id | UUID | FK, NN, UQ | Invitation ayant produit la reponse |
| alumnus_id | UUID | FK, NN | Alumnus ayant repondu |
| date_soumission | TIMESTAMP | NULL | Date de soumission |
| statut | VARCHAR(30) | NN | Etat de la reponse |
| taux_completion | DECIMAL(5,2) | NULL | Pourcentage de completion |
| adresse_ip | VARCHAR(45) | NULL | Adresse IP de soumission |

### REPONSE_QUESTION

Table contenant les reponses detaillees aux questions.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de la reponse de question |
| reponse_formulaire_id | UUID | FK, NN | Reponse formulaire parent |
| question_id | UUID | FK, NN | Question concernee |
| valeur | TEXT | NULL | Valeur saisie |

### IMPORT_DONNEES

Table de journalisation des imports Excel ou CSV.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de l'import |
| utilisateur_id | UUID | FK, NN | Utilisateur ayant lance l'import |
| nom_fichier | VARCHAR(255) | NN | Nom du fichier importe |
| format | VARCHAR(20) | NN | Format du fichier |
| date_import | TIMESTAMP | NN | Date d'import |
| nb_lignes | INTEGER | NULL | Nombre de lignes lues |
| nb_crees | INTEGER | NULL | Nombre d'alumnis crees |
| nb_mis_a_jour | INTEGER | NULL | Nombre d'alumnis mis a jour |
| nb_erreurs | INTEGER | NULL | Nombre d'erreurs |

### EXPORT_DONNEES

Table de journalisation des exports de donnees.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant de l'export |
| utilisateur_id | UUID | FK, NN | Utilisateur ayant effectue l'export |
| format | VARCHAR(20) | NN | Format exporte |
| filtre | JSONB | NULL | Filtres appliques |
| date_export | TIMESTAMP | NN | Date d'export |
| chemin_fichier | VARCHAR(500) | NULL | Chemin du fichier genere |

### RAPPORT_STATISTIQUE

Table contenant les rapports statistiques generes.

| Colonne | Type | Contraintes | Description |
|---|---:|---|---|
| id | UUID | PK | Identifiant du rapport |
| utilisateur_id | UUID | FK, NN | Utilisateur ayant genere le rapport |
| titre | VARCHAR(200) | NN | Titre du rapport |
| periode_debut | DATE | NULL | Debut de la periode analysee |
| periode_fin | DATE | NULL | Fin de la periode analysee |
| format | VARCHAR(20) | NULL | Format du rapport |
| date_generation | TIMESTAMP | NN | Date de generation |

## Contraintes metier recommandees

### Unicite

- `UTILISATEUR.email` doit etre unique.
- `PERMISSION.code` doit etre unique.
- `ROLE_PERMISSION(role_id, permission_id)` constitue la cle primaire composee.
- `ALUMNUS.matricule` doit etre unique si le matricule est renseigne.
- `ALUMNUS.email` doit etre unique si l'e-mail est renseigne.
- `SECTEUR_ACTIVITE.nom` doit etre unique.
- `INVITATION_FORMULAIRE.token` doit etre unique.
- `INVITATION_FORMULAIRE.lien_personnalise` doit etre unique.
- `REPONSE_FORMULAIRE.invitation_id` doit etre unique afin de garantir une seule reponse par invitation.
- `REPONSE_QUESTION(reponse_formulaire_id, question_id)` doit etre unique afin d'eviter deux reponses pour la meme question dans une meme soumission.

### Integrite et valeurs autorisees

- `ALUMNUS.statut_dossier` doit prendre une valeur parmi : `COMPLET`, `INCOMPLET`, `A_VERIFIER`.
- `SITUATION_PROFESSIONNELLE.statut` doit prendre une valeur parmi : `EMPLOYE`, `INDEPENDANT`, `EN_RECHERCHE`, `POURSUITE_ETUDES`, `INACTIF`, `AUTRE`.
- `QUESTION.type` doit prendre une valeur parmi : `TEXTE`, `EMAIL`, `TELEPHONE`, `NOMBRE`, `DATE`, `CHOIX`, `BOOLEEN`.
- `CAMPAGNE.statut` doit prendre une valeur parmi : `BROUILLON`, `PROGRAMMEE`, `EN_COURS`, `TERMINEE`, `ANNULEE`.
- `INVITATION_FORMULAIRE.canal` et `RELANCE.canal` doivent prendre une valeur parmi : `EMAIL`, `WHATSAPP`.
- `INVITATION_FORMULAIRE.statut` doit prendre une valeur parmi : `EN_ATTENTE`, `ENVOYE`, `REPONDU`, `NON_REPONDU`, `EXPIRE`, `INCOMPLET`.
- `REPONSE_FORMULAIRE.statut` doit prendre une valeur parmi : `BROUILLON`, `SOUMISE`, `INCOMPLETE`, `VALIDEE`.
- `REPONSE_FORMULAIRE.taux_completion` doit etre compris entre `0` et `100`.
- `ALUMNUS.annee_sortie` doit etre une annee valide.
- `SITUATION_PROFESSIONNELLE.date_fin` doit etre superieure ou egale a `date_debut` lorsque les deux dates sont renseignees.
- Pour un meme alumnus, il est recommande d'avoir au maximum une `SITUATION_PROFESSIONNELLE` avec `est_actuelle = true`.

## Cardinalites principales

| Relation | Cardinalite | Traduction relationnelle |
|---|---:|---|
| Role - Utilisateur | 1,n | `UTILISATEUR.role_id` |
| Role - Permission | n,n | Table d'association `ROLE_PERMISSION` |
| Filiere - Alumnus | 1,n | `ALUMNUS.filiere_id` |
| Alumnus - SituationProfessionnelle | 1,n | `SITUATION_PROFESSIONNELLE.alumnus_id` |
| SecteurActivite - Entreprise | 1,n | `ENTREPRISE.secteur_activite_id` |
| Entreprise - SituationProfessionnelle | 0,n | `SITUATION_PROFESSIONNELLE.entreprise_id` nullable |
| Formulaire - Question | 1,n | `QUESTION.formulaire_id` |
| Formulaire - Campagne | 1,n | `CAMPAGNE.formulaire_id` |
| Utilisateur - Campagne | 1,n | `CAMPAGNE.utilisateur_id` |
| Campagne - InvitationFormulaire | 1,n | `INVITATION_FORMULAIRE.campagne_id` |
| Alumnus - InvitationFormulaire | 1,n | `INVITATION_FORMULAIRE.alumnus_id` |
| InvitationFormulaire - Relance | 1,n | `RELANCE.invitation_id` |
| InvitationFormulaire - ReponseFormulaire | 1,0..1 | `REPONSE_FORMULAIRE.invitation_id` unique |
| ReponseFormulaire - ReponseQuestion | 1,n | `REPONSE_QUESTION.reponse_formulaire_id` |
| Question - ReponseQuestion | 1,n | `REPONSE_QUESTION.question_id` |

## Index recommandes

- Index sur toutes les cles etrangeres.
- Index sur `ROLE_PERMISSION.role_id`.
- Index sur `ROLE_PERMISSION.permission_id`.
- Index sur `ALUMNUS.annee_sortie`.
- Index sur `ALUMNUS.statut_dossier`.
- Index sur `ALUMNUS.pays_residence`.
- Index sur `INVITATION_FORMULAIRE.statut`.
- Index sur `INVITATION_FORMULAIRE.date_envoi`.
- Index sur `REPONSE_FORMULAIRE.statut`.
- Index sur `CAMPAGNE.statut`.

## Remarques de conception

- Le lien personnalise d'un alumnus est porte par `INVITATION_FORMULAIRE`, car il depend d'une campagne precise.
- Les permissions sont separees des roles afin d'eviter une liste de droits stockee dans une seule colonne et de faciliter les recherches, l'administration et l'evolution des droits.
- Les relances sont rattachees a l'invitation, ce qui permet de garder l'historique des tentatives de contact.
- Les reponses sont separees en deux niveaux : `REPONSE_FORMULAIRE` pour la soumission globale et `REPONSE_QUESTION` pour les valeurs detaillees.
- Les exports, imports et rapports sont journalises afin de tracer les actions realisees par les utilisateurs autorises.
- Les statistiques peuvent etre calculees a partir des tables `ALUMNUS`, `SITUATION_PROFESSIONNELLE`, `INVITATION_FORMULAIRE` et `REPONSE_FORMULAIRE`.
