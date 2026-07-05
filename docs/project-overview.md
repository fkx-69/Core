# Vue d'ensemble de Core

Dernière vérification documentaire : 5 juillet 2026.

## Objectif et état

Core est le site vitrine en français d'une agence de développement logiciel fictive. Il présente quatre offres et trois démonstrations interactives destinées à illustrer un site vitrine, un dashboard de ventes et une application mobile.

Le projet est un frontend autonome. Il n'intègre actuellement ni API, ni base de données, ni authentification. Les projets, données, coordonnées et résultats commerciaux affichés sont fictifs.

## Stack et exécution

- Next.js 16.2.10 avec App Router et Turbopack ;
- React 19.2.4 et TypeScript en mode strict ;
- Tailwind CSS 4 configuré dans `app/globals.css` ;
- `lucide-react` pour les icônes ;
- ESLint 9 avec la configuration Next.js.

Node.js 20.9 ou une version ultérieure est requis par cette version de Next.js. Les commandes canoniques sont documentées dans le [README racine](../README.md).

## Routes

| Route | Rôle |
| --- | --- |
| `/` | Accueil, résumé des services, arguments et aperçu du portfolio. |
| `/services` | Présentation détaillée des quatre services. |
| `/portfolio` | Trois démos interactives chargées à l'approche du viewport. |
| `/contact` | Coordonnées fictives et formulaire validé côté client. |
| `/mentions-legales` | Mentions légales actuellement présentées comme un exemple à personnaliser. |

Une page `not-found` personnalisée gère les routes inconnues.

## Architecture

```text
app/                 Routes, métadonnées et styles globaux
components/
  contact/           Formulaire de contact
  demos/             Démos et cadres de présentation
  home/              Sections de l'accueil
  layout/            En-tête, pied de page et thème
  services/          Présentation des services
  ui/                Primitives d'interface partagées
lib/
  site.ts            Navigation, ancres et coordonnées
  services-data.ts   Catalogue canonique des services
public/              Ressources statiques
```

Les composants de page sont rendus côté serveur sauf lorsqu'une interaction navigateur impose `"use client"`. Les alias `@/*` pointent vers la racine du dépôt.

## Comportements importants

- Le thème clair ou sombre respecte d'abord la valeur enregistrée dans `localStorage`, puis la préférence système. Un script exécuté avant le rendu évite le flash de thème.
- Les ancres de services et de démos sont centralisées dans `lib/site.ts` pour garder les liens cohérents.
- Les démos sont importées avec `next/dynamic`, sans rendu serveur, puis montées via `IntersectionObserver`.
- Le bouton de réinitialisation remonte une démo avec une nouvelle clé React et restaure son état initial.
- Le formulaire de contact effectue une validation locale et affiche un succès simulé après un délai ; aucune donnée n'est transmise.

## Points à finaliser avant une mise en production réelle

- Brancher le formulaire de contact à un service d'envoi sécurisé et gérer ses erreurs.
- Remplacer les coordonnées, liens sociaux, textes commerciaux et mentions légales fictifs.
- Vérifier les exigences de confidentialité, consentement et conservation des données.
- Ajouter une stratégie de tests automatisés ; aucun script de test n'est actuellement déclaré.
- Définir la cible de déploiement et ses variables de configuration si de nouvelles intégrations sont ajoutées.

## Sources de vérité

- dépendances et scripts : [`package.json`](../package.json) ;
- routes et métadonnées : [`app/`](../app/) ;
- contenu partagé : [`lib/site.ts`](../lib/site.ts) et [`lib/services-data.ts`](../lib/services-data.ts) ;
- design system et thème : [`app/globals.css`](../app/globals.css) ;
- index documentaire : [`docs/README.md`](README.md).
