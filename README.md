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
- `npm run lint` : vérification ESLint ;
- `npx tsc --noEmit` : vérification TypeScript stricte.

## Stack

- **Next.js 16** (App Router) + **TypeScript** — attention, version 16 : `params`/`searchParams` asynchrones, prop `preload` sur `next/image` (remplace `priority`), Turbopack par défaut.
- **Tailwind CSS v4** en mode CSS-first : pas de `tailwind.config`, les tokens de design vivent dans `app/globals.css` (`@theme inline`).
- **lucide-react**, `better-sqlite3` et `@maxmind/geoip2-node` (GeoLite2 facultatif) ; graphiques SVG maison, animations via IntersectionObserver et CSS.

## Structure

```
app/
  layout.tsx            # Layout racine : fonts, script anti-flash du thème, Header/Footer
  page.tsx              # Accueil
  services/             # Les 4 services détaillés
  portfolio/            # Les 8 démos interactives, regroupées par catégorie
  contact/              # Formulaire avec validation (envoi simulé)
  mentions-legales/     # Placeholder légal
  admin/                 # Tableau de bord privé de l’audience consentie
  api/analytics/         # Collecteur pageview et retrait des données visiteur
  globals.css           # Tokens clair/sombre, @custom-variant dark, animations
proxy.ts                # Barrière optionnelle des environnements de preview
components/
  layout/               # Header (nav + burger), Footer, ThemeToggle
  ui/                   # Primitives : Button, Card, Badge, SectionHeading, Reveal…
  home/                 # Sections de la page d'accueil
  services/             # Rendu d'un service
  contact/              # Formulaire de contact
  demos/                # Les démos du portfolio
    DemoOverlay.tsx      # Plein écran mobile partagé, fermeture et historique
    PhonePreview.tsx     # Miniature téléphone fidèle à un viewport de 390 px
    apps/               # Applications web « Lumen » et « Sandaga »
    sites/              # Sites « Table Dorée », « VOLT », « Élixir » et « Écrin »
    banque/             # Démo mobile de néo-banque « Nova »
    mobile/             # Démo mobile de livraison « Rapido »
    mockups/            # Cadres navigateur et smartphone (CSS)
  analytics/            # Bandeau de consentement, tracker et préférences
  admin/                # Vue responsive du tableau de bord privé
  home/hero/            # Orchestration, scènes desktop/mobile et registre lazy
lib/
  preview-auth.ts       # Signature/validation de la session de preview
  admin-auth.ts         # Signature/validation de la session d’administration
  analytics/             # Configuration, cookies, DAL SQLite, GeoIP et validation
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

## Mesure d’audience et administration

La mesure est désactivée par défaut. Pour l’activer, définir `NEXT_PUBLIC_ANALYTICS_ENABLED=true`, `ANALYTICS_COOKIE_SECRET` (au moins 32 caractères) et, en production, un chemin absolu `ANALYTICS_DATABASE_PATH` situé hors du dépôt. En développement et en test, `.data/analytics.sqlite` est utilisé et est ignoré par Git. La base utilise WAL, des transactions et une purge quotidienne des données de plus de 90 jours.

Les indicateurs du tableau couvrent uniquement les visiteurs ayant consenti :

- **Visiteur unique** : nombre distinct de `visitor_id` pseudonymisés ayant au moins une page vue pendant la période UTC sélectionnée.
- **Visite** : nombre distinct de sessions ayant au moins une page vue pendant cette période ; une session expire après 30 minutes d’inactivité.
- **Page vue** : événement accepté et dédupliqué par son UUID, associé à un chemin sans requête ni fragment.
- **Visiteur actif** : `visitor_id` distinct ayant une page vue dans les cinq dernières minutes.

Pour sauvegarder une base en WAL sans copier uniquement son fichier principal, utiliser la sauvegarde en ligne de SQLite vers un emplacement protégé :

```sh
DB="/chemin/absolu/analytics.sqlite"
DEST="/var/backups/core/analytics-$(date -u +%Y%m%dT%H%M%SZ).sqlite"
sqlite3 "$DB" ".backup '$DEST'"
```

La commande `.backup` produit une copie cohérente en tenant compte du journal WAL ; appliquer ensuite la politique de chiffrement, de rétention et de restauration de l’exploitation.

Un bandeau à deux choix de même importance demande le consentement avant tout cookie ou page vue. Le choix est conservé 180 jours et le lien du pied de page permet de le modifier. Retirer le consentement supprime les sessions et pages vues du visiteur courant et efface ses identifiants HttpOnly. Seuls le chemin, un hôte référent externe, une catégorie d’appareil et un code pays ISO (si GeoLite2 est explicitement activé via `ANALYTICS_TRUST_PROXY_HEADERS=true`) sont conservés ; aucune adresse IP, chaîne User-Agent, requête, fragment ou donnée de formulaire n’est enregistrée. Il n’y a pas de rétrospective ni de backfill historique.

Pour la géolocalisation, provisionner légalement `GeoLite2-Country.mmdb` depuis MaxMind, le copier hors du dépôt et renseigner `ANALYTICS_GEOIP_DATABASE_PATH`. Vérifier le fichier et le remplacer atomiquement lors des mises à jour mensuelles ; un fichier absent ou invalide laisse simplement le pays à « Inconnu ».

Le tableau de bord `/admin` exige `ADMIN_PASSWORD_HASH` (bcrypt) et `ADMIN_SESSION_SECRET` (au moins 32 caractères). La session signée dure huit heures, le cookie est HttpOnly/Secure/SameSite=Strict et les échecs sont limités à cinq en quinze minutes. `/admin` n’est jamais exposé dans la navigation publique.

## Démos du portfolio

Chaque démo est un composant client isolé, chargé paresseusement (`next/dynamic` + `IntersectionObserver`) et remis à zéro par le bouton « Réinitialiser la démo » (remontage par changement de `key`). Les sites et applications web disposent aussi d’une route autonome sous `/demos/*`. Toutes les données sont factices.

Sur desktop, le héro monte les sites interactifs à la demande dans un cadre navigateur et conserve leur état entre les changements d’onglet. Sur mobile, il affiche des captures légères dans un carrousel natif ; toucher une capture ouvre la vraie démo dans un overlay plein écran. Cette séparation évite de rendre quatre sites complets pendant le swipe.

## SEO et mise en ligne

L’origine canonique par défaut est `https://mycore.work`. Si le domaine public change, renseigner `NEXT_PUBLIC_SITE_URL` avec une origine absolue sans chemin. Les domaines de prévisualisation reçoivent automatiquement l’en-tête `X-Robots-Tag: noindex, nofollow` afin de ne pas concurrencer le domaine canonique.

Après chaque mise en ligne importante :

1. vérifier les réponses de `/robots.txt` et `/sitemap.xml` sur le domaine public ;
2. créer ou valider la propriété du domaine dans Google Search Console, puis renseigner si nécessaire `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` avec la valeur fournie par Google ;
3. envoyer `https://mycore.work/sitemap.xml` dans Search Console et contrôler l’indexation des pages publiques ;
4. compléter les mentions légales, les coordonnées et les preuves commerciales uniquement avec des informations réelles et vérifiables.

Le dépôt prépare le référencement technique, mais ne peut ni garantir une position, ni créer à la place du propriétaire une fiche d’établissement, des avis, des liens externes ou une campagne publicitaire.

## Documentation

L’index [docs/README.md](docs/README.md) distingue la documentation active des audits et plans historiques conservés sous `docs/archive/`.

## Limites actuelles

- Le formulaire de contact valide les champs côté client, mais simule l'envoi : aucun message ne quitte le navigateur.
- Les coordonnées, réseaux sociaux, témoignages implicites, résultats annoncés et projets du portfolio sont fictifs.
- Le formulaire de contact reste une simulation et aucune donnée historique d’audience n’est importée. L’administration et la collecte SQLite sont conçues pour une instance persistante derrière le proxy de confiance (pas pour un déploiement serverless multi-instance).
