# Core — Site vitrine

Site vitrine de **Core**, agence de développement logiciel fictive : sites web, applications web et mobiles, software sur mesure. Entièrement en français, avec un portfolio de **démos interactives** (mini site vitrine, dashboard de ventes, app mobile de livraison).

## Lancer le projet

```bash
npm install
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

Autres commandes : `npm run build` (build de production, Turbopack), `npm run start` (serveur de production), `npm run lint` (ESLint).

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
  portfolio/            # Les 3 démos interactives
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
    mockups/            # Cadres navigateur et smartphone (CSS)
    vitrine/            # Démo restaurant « La Table Dorée »
    dashboard/          # Démo dashboard « Boutique Lumen » (graphiques SVG maison)
    mobile/             # Démo app de livraison « Rapido »
lib/
  site.ts               # Navigation, coordonnées, ids d'ancres canoniques
  services-data.ts      # Source unique des 4 services
```

## Thème clair/sombre

Toggle dans le header, persisté en `localStorage`, avec respect de `prefers-color-scheme` au premier chargement. Un script inline dans `app/layout.tsx` applique la classe `.dark` sur `<html>` avant le premier rendu (pas de flash). Les composants consomment des tokens sémantiques (`bg-surface`, `text-muted`, `--chart-*`…), si bien que les démos suivent automatiquement le thème.

## Démos du portfolio

Chaque démo est un composant client isolé, chargé paresseusement (`next/dynamic` + IntersectionObserver) et remis à zéro par le bouton « Réinitialiser la démo » (remontage par changement de `key`). Toutes les données sont factices.
