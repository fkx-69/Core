# Guide d'integration frontend/API

Derniere verification documentaire : 2026-06-22.

Ce document conserve les contrats et parcours qui ne sont pas evidents a partir des ecrans. Pour la liste exhaustive et actuelle des champs, filtres et actions, utiliser le schema genere par le backend :

- `GET /api/schema/` : schema OpenAPI JSON ;
- `GET /api/docs/` : Swagger UI.

## Conventions

- Base frontend locale : `http://localhost:5173/`.
- Base API locale : `http://localhost:8000/api/`.
- Les identifiants metier sont des UUID.
- Les listes DRF sont generalement des tableaux JSON directs ; aucune pagination globale n'est configuree.
- Recherche : `?search=...` lorsque le ViewSet declare des `search_fields`.
- Tri : `?ordering=champ` ou `?ordering=-champ`.
- Filtres exacts : query params declares par chaque ViewSet.

Le client lit `VITE_API_URL`, avec `http://localhost:8000/api/` comme valeur par defaut. `VITE_ENABLE_MOCKS=true` active les reponses mockees prevues dans le client ; la valeur par defaut est `false`.

## Authentification et autorisations

Connexion :

```http
POST /api/auth/token/
Content-Type: application/json

{"email":"agent@example.com","password":"..."}
```

La reponse contient `access` et `refresh`. Envoyer ensuite :

```text
Authorization: Bearer <access_token>
```

Renouvellement : `POST /api/auth/token/refresh/` avec `{"refresh":"..."}`.

Les comptes doivent avoir `actif=true` et `is_active=true` pour obtenir, rafraichir ou utiliser un token. Le frontend doit vider la session et revenir a la connexion apres un refus d'authentification persistant.

Les droits principaux sont :

- `accounts.manage` ;
- `alumni.view`, `alumni.manage` ;
- `careers.view`, `careers.manage` ;
- `surveys.view`, `surveys.manage` ;
- `campaigns.view`, `campaigns.manage` ;
- `data.import`, `data.export` ;
- `analytics.view`, `analytics.manage`.

Utiliser `GET /api/accounts/utilisateurs/me/` pour charger l'utilisateur courant et ses permissions. Les controles frontend ameliorent l'UX ; l'API reste la source d'autorite.

## Domaines API

| Prefixe | Ressources et actions principales |
| --- | --- |
| `/api/accounts/` | `roles`, `permissions`, `role-permissions`, `utilisateurs`, `utilisateurs/me`. |
| `/api/alumni/` | `alumnis`, `filieres`, `cycles`, `niveaux-etude`. |
| `/api/careers/` | `secteurs`, `entreprises`, `situations` et suggestion publique d'entreprise. |
| `/api/surveys/` | `formulaires`, `questions`, `choix-questions`, `reponses-formulaires`, `reponses-questions`. |
| `/api/campaigns/` | `campagnes`, `invitations`, `relances` et actions d'envoi. |
| `/api/data-exchange/` | Historique et actions `imports/alumni-csv`, `exports/alumni-csv`. |
| `/api/analytics/` | `dashboard`, `stats-academiques`, `stats-professionnelles`, `stats-campagnes`, `rapports`. |

Les routes detaillees et leurs methodes doivent etre lues dans Swagger, afin d'eviter de recopier un inventaire rapidement obsolete dans ce guide.

## Parcours public personnalise

1. Un agent cree un formulaire `MISE_A_JOUR_ALUMNI` et une campagne.
2. Le backend cree une invitation et un token par alumni.
3. Le frontend charge `GET /api/surveys/public/invitations/{token}/`.
4. Il pre-remplit le formulaire avec l'objet `alumnus` retourne.
5. Il soumet `POST /api/surveys/public/invitations/{token}/submit/`.
6. Le backend enregistre la reponse et marque l'invitation `REPONDU`.
7. Les donnees alumni restent en attente de validation administrative.

Erreurs a presenter clairement : token inconnu, lien expire, formulaire inactif et limite de debit atteinte.

## Parcours public commun

Un formulaire `PUBLIC_ALUMNI` peut etre charge et soumis avec son slug :

- `GET /api/surveys/public/formulaires/{slug}/` ;
- `POST /api/surveys/public/formulaires/{slug}/submit/`.

Le backend exige dans `donnees_alumni` : `nom`, `prenom`, `email`, `telephone` et `niveau_diplome_obtenu`.

Regles de rattachement :

- un score de 100 avec un candidat unique provoque le rattachement et la mise a jour automatiques ;
- un score strictement superieur a 60 place la reponse dans `A_ARBITRER` ;
- un score inferieur ou egal a 60 ne cree aucune fiche sans validation ;
- les conflits et candidats multiples restent toujours manuels.

Le detail du bareme et des protections est canonique dans [backend-api.md](backend-api.md). Le frontend public ne doit jamais afficher le score ni l'identite des candidats.

Une campagne peut aussi exposer un lien public commun :

- `GET /api/surveys/public/campagnes/{campagne_id}/` ;
- `POST /api/surveys/public/campagnes/{campagne_id}/submit/`.

## Soumission et validation

Une soumission accepte `donnees_alumni`, `reponses_questions`, ou les deux :

```json
{
  "donnees_alumni": {
    "nom": "DIALLO",
    "prenom": "Aminata",
    "email": "aminata@example.com",
    "telephone": "+22377000000",
    "niveau_diplome_obtenu": "LICENCE",
    "situation_actuelle": "EMPLOYE"
  },
  "reponses_questions": [
    {"question": "uuid", "valeur": "Employe(e)"}
  ]
}
```

Le gestionnaire autorise traite ensuite les reponses non automatiques :

- `POST /api/surveys/reponses-formulaires/{id}/valider/` avec `{"decision":"RATTACHER_EXISTANT","alumnus":"uuid"}` rattache une fiche existante ;
- le meme endpoint avec `{"decision":"CREER_NOUVEAU"}` cree une nouvelle fiche apres verification des conflits ;
- `{"decision":"APPLIQUER"}` valide une reponse deja liee, notamment une invitation personnalisee ;
- `POST /api/surveys/reponses-formulaires/{id}/rejeter/` rejette la reponse sans modifier la fiche.

La file interne affiche `score_correspondance`, `statut_rapprochement`, la campagne et les candidats classes. Les actions doivent utiliser `can_decide`, car un responsable suivi ne peut arbitrer que ses propres campagnes, tandis qu'un administrateur peut aussi traiter les formulaires sans campagne.

## Etats a gerer dans l'interface

| Domaine | Valeurs |
| --- | --- |
| Formulaire | `STANDARD`, `MISE_A_JOUR_ALUMNI`, `PUBLIC_ALUMNI` |
| Question | `TEXTE`, `EMAIL`, `TELEPHONE`, `NOMBRE`, `DATE`, `CHOIX`, `BOOLEEN` |
| Validation | `EN_ATTENTE_VALIDATION`, `VALIDEE`, `REJETEE` |
| Rapprochement | `NON_APPLICABLE`, `AUCUNE_CORRESPONDANCE`, `A_ARBITRER`, `RATTACHE_AUTOMATIQUEMENT`, `RATTACHE_MANUELLEMENT`, `NOUVEL_ALUMNI_CREE`, `REJETE` |
| Invitation | `EN_ATTENTE`, `ENVOYE`, `REPONDU`, `NON_REPONDU`, `EXPIRE`, `INCOMPLET` |
| Canal | `EMAIL`, `WHATSAPP` |
| Diplome | `LICENCE`, `MASTER`, `PREPA`, `AUTRE` |
| Situation actuelle | `STAGIAIRE`, `EMPLOYE`, `ETUDIANT`, `SANS_ACTIVITE`, `AUTRE` |

Pour les campagnes et les reponses, ne pas figer les transitions dans plusieurs composants : centraliser les libelles et variantes visuelles, puis laisser l'API refuser les transitions interdites.

## Points d'attention frontend

- Ne jamais appliquer localement une soumission publique a une fiche alumni ; le backend effectue seul le rapprochement et la mise a jour.
- Afficher une confirmation avant import CSV, envoi en masse ou changement d'URL publique.
- Afficher la progression des envois de campagne via l'action `email-progress`.
- N'afficher l'action de relance individuelle que lorsque `date_envoi` est renseignee et que le statut est different de `REPONDU`.
- Pour une relance en masse, charger `classes-relance`, puis envoyer avec `scope=TOUS` ou `scope=CLASSE`; ne pas reconstruire la population cible depuis la seule page visible du tableau.
- Gerer explicitement les reponses `401`, `403`, `429` et les erreurs de validation `400`.
- L'import CSV accepte au plus 5 Mio et 10 000 lignes par defaut ; afficher les limites avant envoi.
- Invalider les queries TanStack Query concernees apres toute mutation.
- Ne pas supposer qu'un e-mail ou un numero est absent : masquer ou desactiver les actions de contact impossibles.

## Sources canoniques

- Contrats HTTP : schema OpenAPI genere par le backend.
- Regles metier : services, serializers et tests Django.
- Routes frontend : `frontend-alumni/apps/web/src/App.tsx`.
- Permissions d'interface : `frontend-alumni/apps/web/src/lib/permissions.ts`.
- Statuts et libelles : `frontend-alumni/apps/web/src/lib/status.ts` et les enums Django.
