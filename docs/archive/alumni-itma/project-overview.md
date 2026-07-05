# Vue d'ensemble du projet

Derniere verification documentaire : 2026-06-22.

## Objectif

Alumni ITMA est une plateforme de gestion et de suivi des anciens etudiants de l'ITMA. Elle sert a maintenir une base alumni exploitable, collecter des mises a jour via formulaires, suivre les campagnes d'invitation et produire des indicateurs de pilotage.

## Etat courant

Le projet n'est plus seulement un prototype Vite sans backend. Le repository contient maintenant :

- un backend Django REST dans `backend_alumni/` ;
- une application frontend React/Vite dans `frontend-alumni/apps/web/` ;
- une base locale SQLite possible pour le developpement, avec PostgreSQL comme configuration par defaut ;
- des integrations d'envoi e-mail Brevo et WhatsApp/Gupshup configurees par variables d'environnement.

## Perimetre fonctionnel

Fonctionnalites principales actuellement representees dans le code :

- authentification JWT et gestion des roles/permissions ;
- gestion des alumnis, cycles, niveaux d'etude et filieres ;
- suivi des situations professionnelles, entreprises et secteurs ;
- formulaires dynamiques et formulaires publics ;
- invitations personnalisees, campagnes, relances et suivi d'envoi ;
- import/export CSV et commande d'import Excel historique ;
- analytics dashboard, statistiques academiques, professionnelles et campagnes ;
- rapprochement des soumissions publiques avec les fiches alumni, avec application automatique uniquement pour une correspondance certaine et arbitrage humain sinon.

## Garanties de securite actuelles

- Django demarre avec `DEBUG` desactive et exige une cle secrete, sauf opt-in local explicite ;
- les comptes desactives ne peuvent ni obtenir, ni rafraichir, ni utiliser un JWT ;
- les endpoints d'authentification, de soumission publique et de suggestion d'entreprise sont limites en debit ;
- les imports CSV ont une taille et un nombre de lignes maximum configurables ;
- les en-tetes de proxy ne sont acceptes que depuis les adresses declarees dans `TRUSTED_PROXY_IPS`.

## Architecture

### Backend

Le backend est une API Django REST organisee en apps :

```text
backend_alumni/
  config/
  apps/
    accounts/
    alumni/
    analytics/
    campaigns/
    careers/
    core/
    data_exchange/
    surveys/
```

Les routes principales sont exposees sous `/api/`. La documentation OpenAPI locale est disponible via :

- `GET /api/schema/`
- `GET /api/docs/`

### Frontend

Le frontend est un monorepo npm/Turbo avec une application Vite :

```text
frontend-alumni/
  apps/web/
  packages/ui/
```

L'app utilise React, React Router, TanStack Query, Axios, shadcn/ui via le package `@workspace/ui`, Recharts et Zustand.

## Flux produit prioritaires

1. Connexion agent ITMA par JWT.
2. Gestion interne des alumnis et referentiels.
3. Creation de formulaires et campagnes.
4. Generation de liens personnalises ou de liens publics.
5. Soumission publique d'un formulaire par l'alumni.
6. Rapprochement automatique de la soumission avec la base alumni.
7. Mise a jour automatique si le score atteint 100 avec un candidat unique, sinon arbitrage ou creation validee par le gestionnaire de campagne ou un administrateur.
8. Consultation des statistiques et exports.

## Donnees et secrets

Les donnees locales peuvent inclure `ALUMNIS_ITMA.xlsx`, `backend_alumni/db.sqlite3` et des fichiers `.env`. Ces fichiers ne doivent pas etre traites comme documentation active.

Les mots de passe, tokens et cles d'API doivent rester dans un `.env` local ou un gestionnaire de secrets, jamais dans les fichiers Markdown.
