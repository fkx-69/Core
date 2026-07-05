# Backend et API

Derniere verification documentaire : 2026-06-22.

## Stack

- Django 6.0.4
- Django REST Framework 3.17.1
- Simple JWT
- django-cors-headers
- PostgreSQL par defaut, SQLite possible en local
- openpyxl pour l'import Excel
- Brevo pour les e-mails
- Gupshup pour WhatsApp

Dans le dépôt d'origine, les dépendances Python étaient listées dans `requirements.txt`.

## Configuration

Le backend charge `backend_alumni/.env` si `python-dotenv` est disponible.

Variables importantes :

| Variable | Role |
| --- | --- |
| `DJANGO_DEBUG` | Active/desactive le mode debug. Desactive par defaut. |
| `DJANGO_SECRET_KEY` | Obligatoire, sauf cle locale explicitement autorisee. |
| `DJANGO_ALLOW_INSECURE_DEV_KEY=1` | Autorise la cle non sure integree, uniquement avec `DJANGO_DEBUG=1` en local. |
| `DJANGO_ALLOWED_HOSTS` | Liste separee par virgules. |
| `DJANGO_USE_SQLITE=1` | Force SQLite pour le developpement local. |
| `DJANGO_SQLITE_NAME` | Nom/chemin de la base SQLite. |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` | Connexion PostgreSQL. |
| `TRUSTED_PROXY_IPS` | Proxies autorises a fournir l'adresse client via `X-Forwarded-For`. |
| `AUTH_LOGIN_RATE`, `AUTH_REFRESH_RATE` | Limites DRF des endpoints JWT. |
| `PUBLIC_SUBMISSION_RATE` | Limite des soumissions publiques de formulaires. |
| `COMPANY_SUGGESTION_RATE` | Limite de l'endpoint public de suggestion d'entreprise. |
| `CSV_IMPORT_MAX_BYTES`, `CSV_IMPORT_MAX_ROWS` | Taille et nombre de lignes maximum d'un import CSV. |
| `FRONTEND_FORM_BASE_URL` | Base des liens publics de formulaires. |
| `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `BREVO_DAILY_EMAIL_LIMIT` | Envoi e-mail. |
| `GUPSHUP_API_KEY`, `GUPSHUP_TEMPLATE_API_URL`, `GUPSHUP_SOURCE`, `GUPSHUP_APP_NAME`, `GUPSHUP_INVITATION_TEMPLATE_ID` | Envoi WhatsApp. |

Copier `backend_alumni/.env.example` vers `backend_alumni/.env` pour un demarrage local. La configuration d'exemple active SQLite et autorise explicitement la cle de developpement non sure ; ne pas reprendre ces deux reglages en production.

## Commandes locales

```powershell
cd backend_alumni
Copy-Item .env.example .env
..\venv\Scripts\python.exe manage.py migrate
..\venv\Scripts\python.exe manage.py runserver
```

Creer un superutilisateur :

```powershell
cd backend_alumni
..\venv\Scripts\python.exe manage.py createsuperuser
```

Lancer les tests backend :

```powershell
cd backend_alumni
..\venv\Scripts\python.exe manage.py test
```

Importer le fichier Excel historique :

```powershell
cd backend_alumni
..\venv\Scripts\python.exe manage.py import_alumnis_xlsx "..\ALUMNIS_ITMA.xlsx" --dry-run
..\venv\Scripts\python.exe manage.py import_alumnis_xlsx "..\ALUMNIS_ITMA.xlsx"
```

## Authentification

Endpoints publics :

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`

Les endpoints internes utilisent JWT via :

```text
Authorization: Bearer <access_token>
```

Le modele utilisateur est `accounts.Utilisateur` et s'authentifie par e-mail.

Les tokens ne sont delivres qu'aux comptes actifs. L'authentification JWT verifie aussi `actif` et `is_active` a chaque requete : desactiver un compte invalide donc son acces sans attendre l'expiration de son access token.

Limites par defaut :

- connexion : `5/minute` ;
- rafraichissement JWT : `30/minute` ;
- soumissions publiques : `10/minute` ;
- suggestions d'entreprise : `60/minute`.

Ces limites sont appliquees par client. Ne renseigner `TRUSTED_PROXY_IPS` qu'avec les adresses de proxies effectivement controles par le deploiement.

## Routes principales

| Prefixe | Domaine |
| --- | --- |
| `/api/accounts/` | Roles, permissions, utilisateurs et endpoint `me`. |
| `/api/alumni/` | Alumnis, niveaux d'etude, cycles et filieres. |
| `/api/careers/` | Secteurs, entreprises, situations professionnelles et suggestions. |
| `/api/surveys/` | Formulaires, questions, choix, reponses et endpoints publics. |
| `/api/campaigns/` | Campagnes, invitations, relances, e-mails et WhatsApp. |
| `/api/data-exchange/` | Import/export CSV. |
| `/api/analytics/` | Dashboard, statistiques et rapports. |
| `/api/schema/` | Schema OpenAPI JSON. |
| `/api/docs/` | Swagger UI. |

Swagger charge une version epinglee de Swagger UI avec verification d'integrite, ne persiste pas les autorisations JWT et repond avec `Cache-Control: no-store`.

## Endpoints publics de formulaires

Ces routes ne demandent pas de JWT :

- `GET /api/surveys/public/invitations/<token>/`
- `POST /api/surveys/public/invitations/<token>/submit/`
- `GET /api/surveys/public/formulaires/<slug>/`
- `POST /api/surveys/public/formulaires/<slug>/submit/`
- `GET /api/surveys/public/campagnes/<campagne_id>/`
- `POST /api/surveys/public/campagnes/<campagne_id>/submit/`

Les soumissions publiques creent une `ReponseFormulaire`, puis lancent le rapprochement decrit ci-dessous. Les invitations personnalisees restent liees a leur alumni et conservent leur validation administrative habituelle.

### Rapprochement des soumissions `PUBLIC_ALUMNI`

Le backend ne recherche des candidats que parmi les alumni ayant le meme telephone E.164 ou le meme e-mail, sans tenir compte de la casse. Le barème version 1 est la source canonique :

| Critere | Points maximum |
| --- | ---: |
| Telephone identique | 65 |
| E-mail identique | 55 |
| Nom normalise | 15 |
| Prenom normalise | 10 |
| Diplome | 3 |
| Annee d'obtention | 3 |
| Filiere | 4 |

Les noms sont compares sans casse, accents, ponctuation ni espaces. Une similarite inferieure a 80 % ne rapporte aucun point. Le score est plafonne a 100.

- `100`, un seul candidat et aucun conflit entre e-mail et telephone : rattachement, mise a jour et validation automatiques ;
- score strictement superieur a `60` : `A_ARBITRER` ;
- score inferieur ou egal a `60` : `AUCUNE_CORRESPONDANCE`, avec creation possible uniquement apres validation ;
- plusieurs candidats, un ex aequo ou des identifiants pointant vers des alumni differents interdisent l'automatisation.

Les champs facultatifs vides ne remplacent pas les valeurs existantes lors d'un rattachement public. L'API publique de soumission ne retourne ni score, ni candidat, ni donnees alumni.

L'API interne des reponses expose `statut_rapprochement`, `score_correspondance`, `version_rapprochement`, `candidats_correspondance`, `campagne_detail`, `can_decide`, `traite_par` et `date_traitement`. Elle accepte les filtres `campagne` et `statut_rapprochement`, ainsi que le tri `score_correspondance`.

Pour `POST /api/surveys/reponses-formulaires/{id}/valider/` :

```json
{"decision":"RATTACHER_EXISTANT","alumnus":"uuid"}
```

```json
{"decision":"CREER_NOUVEAU"}
```

```json
{"decision":"APPLIQUER"}
```

`APPLIQUER` est reserve aux reponses deja liees, notamment les invitations personnalisees. Pour une campagne publique, seuls son createur et les administrateurs peuvent arbitrer. Une reponse publique sans campagne est reservee aux administrateurs.

L'import CSV est limite par defaut a 5 Mio et 10 000 lignes. L'API rejette les fichiers depassant une de ces bornes avant de poursuivre l'import.

## Relances de campagne privee

Une relance est autorisee uniquement si l'invitation a deja une `date_envoi` et si son statut n'est pas `REPONDU`. Si le lien est expire, il est automatiquement rafraichi avec une nouvelle validite de 7 jours avant l'envoi de la relance.

- `POST /api/campaigns/invitations/{id}/relancer/` cree puis envoie une relance individuelle ;
- `GET /api/campaigns/campagnes/{id}/classes-relance/` retourne les classes eligibles, regroupees par filiere et promotion ;
- `POST /api/campaigns/campagnes/{id}/relancer/` relance tous les destinataires eligibles ou une classe precise.

Les payloads d'envoi exigent `canal` (`EMAIL` ou `WHATSAPP`). `message` est obligatoire pour une relance email. Une relance WhatsApp reutilise le template Gupshup et le lien personnel de l'envoi normal, sans message libre. La relance en masse accepte `scope=TOUS` ou `scope=CLASSE`; une classe est identifiee par `filiere_type`, `filiere_id` si elle est connue, et `annee_obtention_diplome`. La reponse distingue les compteurs `sent_count`, `queued_count` et `failed_count`. Les e-mails conservent le mecanisme de quota et de file d'attente existant.

## Modeles principaux

| App | Modeles |
| --- | --- |
| `accounts` | `Role`, `Permission`, `RolePermission`, `Utilisateur` |
| `alumni` | `NiveauEtude`, `Cycle`, `Filiere`, `Alumnus` |
| `careers` | `SecteurActivite`, `Entreprise`, `SituationProfessionnelle` |
| `surveys` | `Formulaire`, `Question`, `ChoixQuestion`, `ReponseFormulaire`, `ReponseQuestion` |
| `campaigns` | `Campagne`, `InvitationFormulaire`, `Relance`, `EmailDailyQuota`, `EmailSendJob` |
| `data_exchange` | `ImportDonnees`, `ExportDonnees` |
| `analytics` | `RapportStatistique` |

## CORS local

Les origins locales autorisees incluent `localhost` et `127.0.0.1` sur les ports Vite `5173` et `5174`, plus une regex pour `517x`.
