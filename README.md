# Core — Site vitrine

Site vitrine de **Core**, agence de développement logiciel fictive : sites web, applications web et mobiles, software sur mesure. Entièrement en français, avec un portfolio de **huit démos interactives** : quatre sites vitrines, deux applications web et deux applications mobiles.

## Lancer le projet

Prérequis : Node.js 20.9 ou version ultérieure.

```bash
npm install
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

Autres commandes :

- `npm run build` : build de production avec Turbopack ;
- `npm run start` : serveur de production après un build ;
- `npm run lint` : vérification ESLint.

## Stack

- **Next.js 16** (App Router) + **TypeScript** — attention, version 16 : `params`/`searchParams` asynchrones, prop `preload` sur `next/image` (remplace `priority`), Turbopack par défaut.
- **Tailwind CSS v4** en mode CSS-first : pas de `tailwind.config`, les tokens de design vivent dans `app/globals.css` (`@theme inline`).
- **lucide-react** pour les icônes. Aucune autre dépendance : graphiques SVG maison, animations via IntersectionObserver et CSS.

## Structure

```
app/
  layout.tsx            # Layout racine : fonts, script anti-flash du thème, Header/Footer
  page.tsx              # Accueil
  services/             # Les 4 services détaillés
  portfolio/            # Les 8 démos interactives, regroupées par catégorie
  contact/              # Formulaire avec validation (envoi simulé)
  mentions-legales/     # Placeholder légal
  globals.css           # Tokens clair/sombre, @custom-variant dark, animations
components/
  layout/               # Header (nav + burger), Footer, ThemeToggle
  ui/                   # Primitives : Button, Card, Badge, SectionHeading, Reveal…
  home/                 # Sections de la page d'accueil
  services/             # Rendu d'un service
  contact/              # Formulaire de contact
  demos/                # Les démos du portfolio
    apps/               # Applications web « Lumen » et « Sandaga »
    sites/              # Sites « Table Dorée », « VOLT », « Élixir » et « Écrin »
    banque/             # Démo mobile de néo-banque « Nova »
    mobile/             # Démo mobile de livraison « Rapido »
    mockups/            # Cadres navigateur et smartphone (CSS)
lib/
  site.ts               # Navigation, coordonnées, ids d'ancres canoniques
  services-data.ts      # Source unique des 4 services
```

## Thème clair/sombre

Toggle dans le header, persisté en `localStorage`, avec respect de `prefers-color-scheme` au premier chargement. Un script inline dans `app/layout.tsx` applique la classe `.dark` sur `<html>` avant le premier rendu (pas de flash). Les composants consomment des tokens sémantiques (`bg-surface`, `text-muted`, `--chart-*`…), si bien que les démos suivent automatiquement le thème.

## Accès privé de prévisualisation

Le domaine de test peut être protégé par une page de connexion et un cookie de session persistant pendant 30 jours. Cette barrière remplace l’authentification HTTP Basic du reverse proxy, qui perd ses identifiants lorsque Safari iOS est fermé.

1. Copier `.env.example` vers `.env.local`.
2. Activer `PREVIEW_AUTH_ENABLED`.
3. Générer `PREVIEW_AUTH_SECRET` avec `openssl rand -base64 48`.
4. Renseigner `PREVIEW_AUTH_PASSWORD_HASH` avec un hash bcrypt.

Le reverse proxy doit ensuite uniquement transmettre les requêtes à Next.js : laisser une directive `basic_auth` devant l’application conserverait le problème initial.

## Démos du portfolio

Chaque démo est un composant client isolé, chargé paresseusement (`next/dynamic` + `IntersectionObserver`) et remis à zéro par le bouton « Réinitialiser la démo » (remontage par changement de `key`). Les sites et applications web disposent aussi d’une route autonome sous `/demos/*`. Toutes les données sont factices.

## Limites actuelles

- Le formulaire de contact valide les champs côté client, mais simule l'envoi : aucun message ne quitte le navigateur.
- Les coordonnées, réseaux sociaux, témoignages implicites, résultats annoncés et projets du portfolio sont fictifs.
- Le projet ne possède ni backend ni base de données. La seule authentification est la barrière optionnelle de prévisualisation ; elle ne gère pas de comptes utilisateurs.
