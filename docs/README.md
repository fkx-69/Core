# Documentation de Core

Dernière vérification documentaire : 5 juillet 2026.

Cet index sépare les sources de vérité actuelles des documents historiques qui ne décrivent pas ce dépôt.

## Documents actifs

| Sujet | Document | Rôle |
| --- | --- | --- |
| Installation et prise en main | [README racine](../README.md) | Prérequis, commandes, stack, structure et limites actuelles. |
| Vue d'ensemble technique | [project-overview.md](project-overview.md) | Périmètre, architecture, routes, état et décisions durables. |
| Consignes pour les agents | [AGENTS.md](../AGENTS.md) | Règle obligatoire pour travailler avec la version locale de Next.js. |

Le code reste la source de vérité pour le comportement détaillé. Les constantes de navigation, coordonnées et ancres vivent dans [`lib/site.ts`](../lib/site.ts), tandis que le catalogue de services vit dans [`lib/services-data.ts`](../lib/services-data.ts).

## Archives

[`archive/`](archive/) contient uniquement des documents non normatifs. Le sous-dossier [`archive/alumni-itma/`](archive/alumni-itma/) provient d'un autre projet et est conservé pour éviter toute perte de contexte ; il ne doit pas guider les changements apportés à Core.

## Règles d'entretien

- Mettre à jour le README et la vue d'ensemble lorsqu'une commande, une route ou une limite produit change.
- Garder un seul document actif par sujet et archiver les spécifications remplacées.
- Vérifier les affirmations contre le code et les guides de `node_modules/next/dist/docs/`.
- Ne jamais documenter de secret, token ou donnée personnelle.
