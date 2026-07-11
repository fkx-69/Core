# Rapport design — site principal Core

*Audit du 10 juillet 2026, branche `refonte/skills-redesign`. Méthode : lecture du code (pages `app/(site)`, composants `home/`, `layout/`, `ui/`, `shared/`), captures Playwright pleine page des 4 pages en desktop 1440 (clair + sombre) et mobile 390 (clair), inspection des PNG d'illustration (dimensions, alpha), sondes DOM (chargement des images, tailles servies).*

> **Statut (11 juillet 2026)** : étapes 1 à 4 + finitions sûres **implémentées et vérifiées** (tsc, ESLint, captures light/dark/mobile). Notes d'implémentation : P1-1 résolu en supprimant l'image (pas de régénération) ; **P2-6 abandonné** — le filtre CSS `invert + hue-rotate` a été essayé puis retiré (rendu jugé mauvais) : les illustrations restent en version claire dans les deux modes, la seule voie propre restante est de générer de vraies variantes sombres des assets ; `loading="eager"` ajouté aux illustrations d'intro (LCP signalé par Next). **Restent à arbitrer** : P4-14 (identité couleur), P4-16 (mur de logos fictifs), la frise « Pourquoi Core » (P4-17b) et les variantes sombres d'illustrations (P2-6).

---

## Ce qui tient déjà très bien (à ne pas casser)

- **Le héro-scène** : les démos vivantes comme preuve, le rethémage complet du héro par marque, l'autoplay respectueux (desktop only, save-data, reduced-motion, pause au survol) — c'est le point fort du site, rare et mémorable.
- **Le système de design** : tokens propres (`globals.css`), rayons/ombres cohérents, palette data-viz validée, statuts AA. Le langage « éditorial » (numéraux filaires, filets, pointillés teal, trames de points) est appliqué avec constance.
- **L'accessibilité** : tablist clavier, `aria-live`, `inert`, focus rings partout, `prefers-reduced-motion` traité à chaque animation, formulaire avec validation accessible. Au-dessus du standard.
- **Le fond** : contenus localisés (FCFA, Wave, Dakar/Abidjan), ton juste, hiérarchie typographique claire (Space Grotesk / Inter).

Les recommandations ci-dessous sont classées par rapport impact/effort.

---

## P1 — Corrections rapides à fort impact

### 1. L'illustration du bandeau CTA est invisible
**Constat.** `home-cta.png` est à 99 % transparente (alpha moyen 3/255) et ses traits sont quasi blancs (`#eef1f2`). Affichée à `opacity-25` sur l'indigo du bandeau, elle ne se voit **ni en clair ni en sombre** — vérifié sur captures. On télécharge une image de 600 px pour rien.
**Reco.** Régénérer l'asset avec des traits blanc franc et plus denses (pipeline gpt-image + sharp existant) et monter à `opacity-40`–`50`, ou supprimer l'image et laisser le filigrane « Core. » porter seul le décor.
**Où :** [CtaBanner.tsx:28-35](components/shared/CtaBanner.tsx#L28-L35)

### 2. La couture header / héro — la première impression du site
**Constat.** Le header (`bg-background/80`) reste blanc au-dessus du héro crème « La Table Dorée » ; en mode sombre c'est une barre noire posée sur un bloc crème. La scène immersive commence sous une bande qui n'appartient pas à l'ambiance.
**Reco.** Sur la home, faire hériter le header de `--hero-bg` tant qu'on est en haut de page (ou le rendre transparent au-dessus du héro, opaque au scroll). Effet immédiat : la scène de marque occupe tout le premier écran, la transition de thème au changement d'onglet colore aussi le header — l'immersion promise par le commentaire du code devient totale.
**Où :** [Header.tsx:26](components/layout/Header.tsx#L26), [HeroShowcase.tsx:170-178](components/home/hero/HeroShowcase.tsx#L170-L178)

### 3. Le héro convainc mais ne convertit pas
**Constat.** Le seul « Démarrer un projet » est dans le header. Dans le héro : un lien discret « Visiter le site en entier » et c'est tout. Un visiteur séduit par la démo doit remonter chercher le CTA.
**Reco.** Ajouter un CTA primaire dans la barre méta sous le cadre (légende à gauche, `Démarrer un projet` + `Visiter le site` à droite), stylé avec `--hero-accent` pour qu'il se rethème avec la scène. Ne pas le mettre au-dessus du cadre : le titre-poster respire bien tel quel.
**Où :** [HeroShowcase.tsx:238-251](components/home/hero/HeroShowcase.tsx#L238-L251)

### 4. Chiffres clés : ajouter `tabular-nums`
**Constat.** Le compteur anime 0 → 40 en chiffres proportionnels : la largeur tremble pendant le comptage et le suffixe « + » danse.
**Reco.** Une classe `tabular-nums` sur le span du compteur (ou dans `KeyFigures`).
**Où :** [Counter.tsx:63-68](components/ui/Counter.tsx#L63-L68), [KeyFigures.tsx:39-44](components/home/KeyFigures.tsx#L39-L44)

### 5. `sizes` manquants sur les illustrations à largeur fixe
**Constat.** Sondé en live : `home-portfolio-stack.png` charge **1400 px pour un slot de 512 px**, `home-why-us.png` 1400 px pour 672 px, `home-cta.png` 640 px pour 384 px.
**Reco.** Ajouter des `sizes` réalistes (`(min-width: 1024px) 32rem, 100vw`, etc.). Coût quasi nul, gain net sur mobile ouest-africain — cohérent avec le positionnement du site.
**Où :** [PortfolioTeaser.tsx:92-100](components/home/PortfolioTeaser.tsx#L92-L100), [WhyUs.tsx:38-47](components/home/WhyUs.tsx#L38-L47), [CtaBanner.tsx:28-35](components/shared/CtaBanner.tsx#L28-L35)

---

## P2 — Le mode sombre mérite une passe dédiée

Le thème sombre est bien construit (tokens, ombres compensées par bordures) mais trois moments perdent leur intention :

### 6. Les illustrations « flashent » en sombre
**Constat.** Tous les PNG ont des aplats **blanc opaque** (fenêtres navigateur, cartes, téléphones). Sur les tuiles sombres, ils ressortent comme des cartons lumineux — lisible, mais on sent l'asset « mode clair » posé sur du sombre. C'est le plus gros chantier de cohérence dark (bento services, stack portfolio, frise Pourquoi Core, page contact).
**Reco.** Trois pistes, par ordre de qualité :
1. **Variantes sombres** des 5–6 assets majeurs (fills `#181b26`, traits `#818cf8`) via le pipeline sharp existant, servies avec un `<picture>`/classe `dark:hidden` ;
2. un **filtre CSS doux** (`dark:invert` calibré ou `dark:opacity-80`) — le site utilise déjà ce type d'astuce (`dark:brightness-200` sur le 404 et le succès du formulaire) ;
3. **assumer des vignettes claires** : encadrer chaque illustration dans une pastille `bg-[#f7f7fb] rounded-card` délibérée, identique dans les deux modes.

### 7. Le poster « Core en chiffres » disparaît en sombre
**Constat.** La bande est en `#0b0d13` absolu… qui est aussi le fond du site en dark. Le « moment poster » voulu (commentaire du code) n'existe plus que par deux filets `white/10`.
**Reco.** En dark, donner une vraie surface à la bande : dégradé indigo profond (`#12142a → #0b0d13`), ou halo indigo renforcé + trame plus visible. L'inversion clair/sombre du reste de la page fait déjà le travail en mode clair ; en dark il faut recréer le contraste autrement.
**Où :** [KeyFigures.tsx:19-28](components/home/KeyFigures.tsx#L19-L28)

### 8. Les filigranes du bandeau CTA meurent en sombre
**Constat.** En dark, `bg-accent` devient périwinkle **clair** (`#818cf8`) — mais le filigrane « Core. » garde son contour *blanc* 15 % et la trame ses points *blancs* 25 % : quasi invisibles sur fond clair.
**Reco.** Variantes dark : contour et points en encre (`rgb(11 13 19 / 0.12)`) quand `.dark`. Deux petites classes dans `globals.css`.
**Où :** [globals.css:137-140](app/globals.css#L137-L140), [globals.css:157-160](app/globals.css#L157-L160), [CtaBanner.tsx:24-41](components/shared/CtaBanner.tsx#L24-L41)

---

## P3 — Structure et conversion, page par page

### 9. Contact : équilibrer la grille et ancrer la promesse
- Le formulaire (~½ hauteur de la sidebar) laisse un grand vide à gauche avant la FAQ. Ajouter sous le bouton un bloc **« Et ensuite ? »** en 3 jalons (réponse sous 24 h → appel de cadrage → devis en FCFA sous 48 h) : ça comble, ça rassure, et ça réutilise le langage timeline de la page Services.
- La FAQ (max-w-3xl) est collée à gauche avec un tiers de page vide à droite : la centrer, ou passer le titre en `align="center"` avec la liste centrée.
**Où :** [contact/page.tsx:62-150](app/(site)/contact/page.tsx#L62-L150)

### 10. Portfolio : donner un sommaire aux 5 500 px
**Constat.** Trois chips inertes (« 8 démos · 3 catégories · 0 capture d'écran ») décorent l'intro alors que la page a exactement trois sections ancrées.
**Reco.** Remplacer/compléter par des chips-ancres cliquables (Sites vitrines · Applications web · Applications mobiles), éventuellement en barre sticky discrète sous le header. Les ancres existent déjà (`DEMO_ANCHORS`), il ne manque que la navigation.
**Où :** [portfolio/page.tsx:129-138](app/(site)/portfolio/page.tsx#L129-L138)

### 11. Services : casser le rythme des 4 blocs identiques
**Constat.** `alternate` ne change que le fond ([ServiceSection.tsx:29](components/services/ServiceSection.tsx#L29)) : les 4 sections sont 4 fois la même composition (récit gauche / rail droit), très hautes — la page devient prévisible dès le 2ᵉ écran.
**Reco.** Au choix : miroir gauche/droite sur 02 et 04 (une ligne de grid), ou varier le rail (le « Cas d'usage » en pleine largeur sous le bloc une fois sur deux). Le survol du numéral (`group-hover:text-accent-soft`) est un joli détail — le généraliser aux autres numéraux filaires du site.

### 12. Bento services : la tuile 02 perd son illustration en mobile
**Constat.** « Applications web » masque son visuel sous `sm` (`hidden sm:block`) alors que les tuiles 03/04 gardent le leur : en mobile, une seule tuile du bento est « nue ».
**Reco.** Vignette compacte (96–128 px) à droite du titre en mobile plutôt que masquage.
**Où :** [ServicesPreview.tsx:139-145](components/home/ServicesPreview.tsx#L139-L145)

### 13. Bento services : trancher le fond fantôme de la grande tuile
**Constat.** `home-services-preview.png` en `object-cover opacity-10` sous l'illustration principale : invisible à l'œil (vérifié sur capture), mais téléchargée. Deux illustrations empilées dans la même tuile se neutralisent.
**Reco.** Supprimer l'image de fond (l'illustration principale suffit), ou l'assumer à `opacity-20+` en la décalant (coin bas droit) pour qu'elle raconte quelque chose.
**Où :** [ServicesPreview.tsx:94-101](components/home/ServicesPreview.tsx#L94-L101)

---

## P4 — Identité et finitions

### 14. Sortir de l'« indigo Tailwind »
**Constat.** L'accent est littéralement la palette indigo par défaut de Tailwind (`#4f46e5` = indigo-600, `#818cf8` = indigo-400, `#eef2ff` = indigo-50). Pour une agence qui vend du « sur mesure », c'est la couleur la plus générique de l'écosystème. Par ailleurs les illustrations portent un **trio** indigo + ambre + teal/vert… dont l'UI n'exploite qu'un tiers : le teal n'existe qu'en pointillés, l'ambre n'existe pas.
**Reco.** Sans tout rethémer : faire vivre les couleurs secondaires des illustrations dans l'UI — compteurs ou suffixes ambre dans un des « moments » (la scène VOLT du bandeau chiffres s'y prête), chips ou check-icons teal sur la page Services, souligné ambre sur un mot du titre héro. Alternative plus ambitieuse : décaler la teinte de l'accent de quelques degrés pour la rendre « ownable ». À arbitrer avec le brief illustrations verrouillé.

### 15. Témoignages : rendre les résultats scannables
Les citations contiennent les vrais arguments (« doublé nos réservations en trois mois », « remplace trois cahiers et un tableur ») noyés dans le gris du texte. Graisser (`<strong>`) le résultat chiffré de chaque citation ; en lecture en Z, la section devient une rangée de preuves.
**Où :** [Testimonials.tsx:5-27](components/home/Testimonials.tsx#L5-L27)

### 16. Mur de logos : une décision à prendre, pas un bug
Les huit marques sont fictives (cohérentes avec les témoignages — bien vu), en `text-muted/70` (~3,1:1, acceptable pour du décoratif). Deux points à trancher : **(a)** la promesse « Ils nous font confiance » sur des marques inventées peut coûter cher en crédibilité si un prospect le réalise — un libellé du type « Pensé pour les commerces de Dakar & Abidjan » vend la même chose sans sur-promettre ; **(b)** si le mur reste, le garder — l'exécution (traitements typo variés, fondu, pause au survol) est bonne.
**Où :** [LogoMarquee.tsx:86-107](components/home/LogoMarquee.tsx#L86-L107)

### 17. Micro-finitions
- **Reveal en mobile** : les `delay` échelonnés (100–300 ms) s'ajoutent alors qu'en colonne chaque élément entre déjà seul dans le viewport — réserver le stagger à `lg:` ou le plafonner à 100 ms en mobile.
- **Frise « Pourquoi Core »** : les 3 pictos flottent sans lien avec les 4 colonnes du dessous ; les relier au langage existant (pointillés teal qui descendent vers les numéraux) ou passer à un picto par colonne.
- **Page 404 / succès formulaire** : `dark:brightness-200` fonctionne mais blanchit les couleurs — à remplacer par les variantes sombres si le chantier P2-6 est fait.

---

## Ordre d'attaque suggéré

| Étape | Contenu | Statut |
|---|---|---|
| 1 | P1-1, P1-4, P1-5, P3-13 (nettoyages sûrs, une session) | ✅ fait |
| 2 | P1-2 + P1-3 (header thémé + CTA héro — le premier écran) | ✅ fait |
| 3 | P2-7/8 (poster chiffres, filigranes CTA) — P2-6 abandonné, illustrations laissées claires | ✅ / ⏳ |
| 4 | P3-9/10/11/12 (structure pages) | ✅ fait |
| 5 | P4 — témoignages (15) et stagger Reveal (17a) faits ; identité couleur (14), mur de logos (16), frise Pourquoi Core (17b) | ⏳ à arbitrer |

**Captures de référence** (générées pour cet audit) : `/tmp/claude-1000/-home-ubuntu-code-core/aa87786b-a314-4edc-bb41-6d3ff2d1f395/scratchpad/v2-*.png` — desktop clair/sombre + mobile pour les 4 pages.
