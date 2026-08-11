# Plan — Mettre les applications web au niveau des vitrines et du mobile

*Établi le 11 juillet 2026, branche `refonte/skills-redesign`. Constat de départ : les deux démos « Applications web » (Boutique Lumen, Pressing des Halles) paraissent un cran en dessous des 4 sites vitrines et des 2 apps mobiles du portfolio. Ce plan documente pourquoi, puis le chemin pour les hisser au même niveau.*

> Prérequis implémentation : lire les guides `node_modules/next/dist/docs/` avant de coder (cf. `AGENTS.md`) — notamment `01-app/03-api-reference/02-components/image.md` (`priority` est déprécié au profit de `preload`).

---

## Diagnostic — pourquoi elles paraissent un cran en dessous

| | Sites vitrines | Apps mobiles | **Apps web** |
|---|---|---|---|
| Identité propre (typos, palette, vars CSS) | ✅ `fonts.ts` + `--volt-*`, `--elixir-*`… | ⚠️ tokens Core, mais le cadre téléphone porte l'illusion | ❌ tokens Core partout |
| Localisation Afrique de l'Ouest | ✅ FCFA, Dakar/Abidjan | ❌ EUR (non perçu) | ❌ EUR, noms français, URLs `.fr` |
| Multi-vues / navigation | ✅ sites multi-sections | ✅ 4 écrans + TabBar | ❌ une seule vue, aucun chrome d'app |
| Version pleine page | ✅ routes `/demos/*` + « Visiter le site en entier » | n/a (mockup téléphone) | ❌ simple overlay plein écran |
| Volume (indicateur grossier) | 600–1100 lignes/site | ~400 lignes d'écrans | 243 / 315 lignes |

### 1. Aucune identité propre — elles ressemblent au site Core, pas à des produits livrés
[DashboardDemo.tsx](../../components/demos/apps/lumen/App.tsx) et [PressingDemo.tsx](../../components/demos/apps/sandaga/App.tsx) sont stylés avec les tokens du site (`bg-surface`, `border-line`, `text-accent`, `rounded-field`, `shadow-card`) et les couleurs data-viz Core (`var(--chart-1)`… dans [BarChart.tsx:116](../../components/demos/apps/lumen/Charts.tsx#L116), [DonutChart.tsx:10](../../components/demos/apps/lumen/Charts.tsx#L10)). Résultat : des panneaux qui se fondent dans la page portfolio au lieu d'affirmer « voici un produit qu'on a livré ». Chaque vitrine, elle, a ses fontes (`fonts.ts`), sa palette en variables CSS et son ambiance.

### 2. La localisation est rompue — et contredit les textes du site
- Le portfolio décrit **« une boutique de décoration dakaroise »** et un pressing **« du quartier Sandaga, à Dakar »** dont **« la caisse s'incrémente en FCFA »** ([portfolio/page.tsx:73](../../app/%28site%29/portfolio/page.tsx#L73), [:81](../../app/%28site%29/portfolio/page.tsx#L81)) — mais les démos affichent des **euros** ([dashboard/DashboardDemo.tsx:23-27](../../components/demos/apps/lumen/App.tsx#L23-L27), [pressing/data.ts:36-40](../../components/demos/apps/sandaga/data.ts#L36-L40)), des clients nommés Marie Lefebvre, Camille Roussel ou Hugo Lemaire, et des URLs `app.boutiquelumen.fr` / `app.pressing-des-halles.fr`.
- Le témoignage de la home promet « le chiffre du jour **en FCFA**, les retards et **les stocks** » ([Testimonials.tsx:32-34](../../components/home/Testimonials.tsx#L32-L34)) : ni FCFA ni vue stock dans la démo.
- La page Services situe la boutique **à Abidjan** ([services-data.ts:59-60](../../lib/services-data.ts#L59-L60)) quand le portfolio dit Dakar.

Les 4 vitrines, elles, sont impeccables sur ce plan (FCFA, Almadies, Plateau, Cocody).

### 3. Une seule vue, aucun chrome applicatif
Un vrai outil métier a une sidebar ou une topbar, plusieurs vues, un utilisateur connecté. Ici : un panneau nu dans un cadre navigateur. Les apps mobiles, à identité pourtant non différenciée, convainquent parce qu'elles ont 4 écrans, une TabBar et des parcours complets (panier → commande → suivi ; virement qui débite le solde).

### 4. Pas de vraie version pleine page
Les vitrines s'ouvrent en vrai site sur `/demos/*` (« Visiter le site en entier », nouvel onglet, [SitePreview.tsx](../../components/demos/sites/SitePreview.tsx)). Les apps web n'ont qu'un overlay ([DemoStage.tsx](../../components/demos/DemoOverlay.tsx)) qui rebascule le même sous-arbre en `position: fixed`. L'intro du portfolio (« visitez chaque site vitrine en pleine page ») les exclut d'ailleurs de la promesse.

### 5. Présentation moins flatteuse dans la page
Les vitrines défilent dans un mockup à hauteur fixe (560 px) ; les apps web s'étalent en blocs de 900–1200 px ([LazyDemo.tsx:51-64](../../components/demos/LazyDemo.tsx#L51-L64)) compressés dans la colonne 2/3 du [DemoShell](../../components/demos/DemoShell.tsx) — denses, écrasées, sans mise en scène.

---

## Cible

Appliquer aux deux apps web **le patron qui fait le succès des vitrines** : un composant `App.tsx` autonome, à l'identité propre, écrit en container queries, partagé entre un aperçu embarqué à hauteur fixe et une vraie route `/demos/*` — avec un contenu localisé Afrique de l'Ouest et une profondeur d'application (2–3 vues navigables).

**Définition de « au même niveau » (critères de sortie) :**
1. Zéro token Core dans le code des apps : nom, typos, palette et composants propres.
2. FCFA + contexte sénégalais/ivoirien partout, cohérent avec portfolio, services et témoignages.
3. Ouvrables en pleine page sur `/demos/*`, comme les vitrines.
4. Au moins 2 vues fonctionnelles par app, derrière un chrome d'application (sidebar/topbar, utilisateur).
5. Toutes les promesses écrites du site (FCFA, stocks, mobile money) sont tenues par les démos.

**Contrat technique `/demos/*` (inchangé, hérité des vitrines) :** responsive 100 % container queries calées sur le `@container` du root ; pas de `fixed` ni d'unités `vh` ; aucune fuite des tokens Core ; `next/image` avec `preload` (pas `priority`, déprécié) ; `robots: noindex` et `DemoBadge` déjà fournis par [app/demos/layout.tsx](../../app/demos/layout.tsx).

---

## Phase 0 — Décisions de cadrage (à arbitrer avant de coder)

- **D1 · Villes et noms.** Recommandation : tout ancrer à **Dakar** (aligné portfolio + témoignages). « Boutique Lumen » se garde tel quel (`boutiquelumen.sn`) ; renommer « Pressing des Halles » → **« Pressing Sandaga »** (le quartier est déjà dans le texte, « les Halles » sonne parisien) ; corriger le cas d'usage Services (Abidjan → Dakar) ou inversement, mais une seule ville par produit.
- **D2 · Plein écran.** Remplacer l'overlay `DemoStage` par le lien pleine page `/demos/*` (parité vitrines, moins de code : `DemoStage` et le flag `fullscreen` disparaissent). Alternative : garder les deux — déconseillé, deux mécanismes pour le même geste.
- **D3 · Ampleur fonctionnelle.** 1 à 2 vues secondaires par app, toutes réellement fonctionnelles (pas de sidebar aux entrées mortes) : **Stock** pour Lumen (promis par le témoignage), **Caisse du jour** pour le pressing.
- **D4 · Thème.** Comme les vitrines, chaque app assume **son propre thème fixe** (indépendant du toggle clair/sombre de Core) ; on vérifie seulement qu'elle reste belle dans le cadre navigateur des deux modes du portfolio.

## Phase 1 — Fondations « vrai produit » (structure & routes)

1. Nouvelle arborescence calquée sur `sites/` :
   - `components/demos/apps/lumen/{App.tsx, data.ts, fonts.ts, Preview.tsx, vues/…}`
   - `components/demos/apps/sandaga/{App.tsx, data.ts, fonts.ts, Preview.tsx}`
   - migration des composants existants (SalesTable, BarChart, DonutChart, AddSaleForm sous `lumen/` ; StatTile dupliqué ou thémé par app — il est aujourd'hui partagé entre les deux démos).
2. Routes pleine page `app/demos/lumen/page.tsx` et `app/demos/sandaga/page.tsx` (metadata `title.absolute`, comme [demos/volt/page.tsx](../../app/demos/volt/page.tsx)).
3. Aperçu embarqué : réutiliser [SitePreview](../../components/demos/sites/SitePreview.tsx) en paramétrant le libellé du lien (« Ouvrir l'application en entier ») — hauteur fixe 560 px, scroll interne, `@container`.
4. Réécriture du responsive des apps en **container queries** (aujourd'hui en breakpoints viewport `sm:`/`lg:`, qui ne réagiraient pas dans l'aperçu).
5. Câblage : [LazyDemo.tsx](../../components/demos/LazyDemo.tsx) pointe vers les nouveaux `Preview` (skeletons ramenés à ~640 px — fin des blocs de 1200 px et des sauts d'ancre) ; [DemoGroup.tsx](../../components/demos/DemoGroup.tsx) perd `fullscreen`/`DemoStage` (si D2 validé).

## Phase 2 — Identité visuelle par application

- **Lumen** (SaaS de gestion d'une boutique de déco) : proposition — UI claire et chaleureuse, sidebar sombre encre, accent cuivre/ambre (« lumen » = lumière), typo UI dédiée via `next/font` ; logo texte `lumen.` ; chrome : sidebar (logo, Ventes, Stock), topbar (recherche, mois affiché, avatar « Awa D. »).
- **Pressing Sandaga** (outil de comptoir) : proposition — identité utilitaire fraîche (vert d'eau/turquoise « propre », fond clair froid), gros repères visuels pensés « employé pressé » ; topbar simple avec date du jour et caisse.
- Variables CSS par app (`--lumen-*`, `--sandaga-*`) sur le root de `App.tsx`, à la manière de `--volt-*` ; les charts passent des tokens `--chart-*` Core aux couleurs de l'app.
- Purge finale : `grep` de contrôle — aucun `bg-surface|text-accent|rounded-field|border-line|--chart-` dans `components/demos/apps/`.

## Phase 3 — Localisation Afrique de l'Ouest *(quick win isolable : faisable seule, avant tout le reste)*

- **FCFA** avec le helper maison des vitrines (`formatFcfa`, pas de décimales) ; montants réalistes : déco 25 000–350 000 FCFA, CA mensuel ~1,2–1,6 M FCFA ; pressing 1 500–15 000 FCFA la commande.
- **Clients & produits** : noms sénégalais (Awa Ndiaye, Moussa Diop, Fatou Sarr, Hôtel Terrou-Bi…), matières locales possibles côté déco (teck, rônier, bogolan) ; dates conservées (juin–juillet 2026).
- **URLs** : `app.boutiquelumen.sn`, `app.pressingsandaga.sn`.
- **Mobile money** : mode de paiement (Wave / Orange Money / Espèces / Carte) sur les ventes Lumen et à l'encaissement du pressing — c'est à la fois de la localisation et de la profondeur produit, et ça honore le témoignage « mobile money » de la home.

## Phase 4 — Profondeur applicative

- **Lumen** : vue **Stock** (liste produits, seuils, badge « stock bas », KPI dédié sur le dashboard) — c'est littéralement ce que le témoignage vend ; le reste (ajout de vente, payé/annulé, filtres, tris, charts vivants) est déjà bon et se conserve tel quel.
- **Pressing** : encaissement avec **choix du mode de paiement**, vue **Caisse du jour** (répartition espèces/Wave/OM), bouton « Prévenir par SMS » simulé sur les commandes prêtes (toast de confirmation).
- Les deux : états vides soignés, `screen-in` aux changements de vue, exigence a11y du repo maintenue (labels, `aria-live` sur les KPI recalculés, focus rings aux couleurs de l'app).

## Phase 5 — Synchroniser les textes du site

- [portfolio/page.tsx](../../app/%28site%29/portfolio/page.tsx) : intro « visitez chaque **site vitrine** en pleine page » → « chaque site **et chaque application** » ; réécrire les 2 descriptions (FCFA réel, stock, mobile money, pleine page) ; retirer `fullscreen: true`.
- [services-data.ts](../../lib/services-data.ts) : ville du cas d'usage + mention stock/mobile money.
- [PortfolioTeaser.tsx:15](../../components/home/PortfolioTeaser.tsx#L15) : « trop grandes pour le héro, elles se testent en taille réelle » → à réécrire (aperçu navigable + pleine page).
- Témoignages : rien à changer — c'est la démo qui rattrape la promesse.

## Phase 6 — Vérification

- `tsc`, ESLint, build.
- Recette `/verify` (dev server + navigateur headless) : aperçus embarqués + routes pleine page, thèmes clair/sombre du portfolio, mobile 390, reset, ancres `#demo-dashboard`, absence de saut de layout au montage des démos.
- Contrôles contrat : grep `fixed|vh|tokens Core` dans `apps/`, `preload` sur les éventuelles images, poids du bundle (les charts restent en SVG maison, aucune lib ajoutée).

---

## Ordre conseillé & tailles

| Étape | Contenu | Taille |
|---|---|---|
| 0 | Arbitrages D1–D4 | XS |
| 3 | Localisation (livrable seule si créneau court — corrige la contradiction FCFA immédiatement) | S |
| 1 | Structure, routes `/demos/*`, container queries, aperçu 560 px | M |
| 2 | Identités Lumen & Sandaga, re-theming charts | M |
| 4 | Vue Stock, caisse, mobile money, SMS | M |
| 5 | Textes portfolio/services/home | S |
| 6 | Vérification complète | S |

**Hors périmètre (noté pour plus tard) :** les apps mobiles Rapido et Nova affichent aussi des EUR ([mobile/data.ts:97](../../components/demos/mobile/data.ts#L97), [banque/data.ts:50-56](../../components/demos/banque/data.ts#L50-L56)) alors que leurs descriptions parlent d'Abidjan et de mobile money — la passe de localisation de la Phase 3 leur sera transposable telle quelle.
