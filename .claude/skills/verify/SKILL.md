---
name: verify
description: Recette de vérification runtime du site Core (Next.js) — lancer le dev server et piloter les pages au navigateur headless.
---

# Vérifier une modification du site Core

## Lancer

```bash
pgrep -fa "next-server|next dev"            # TUER tout résidu d'abord (kill <pid>)
npm run dev > <scratchpad>/dev.log 2>&1 &   # port 3000, prêt en ~8 s
grep Local <scratchpad>/dev.log             # VÉRIFIER le port : si 3000 est occupé,
                                            # Next bascule en silence sur 3001 et un
                                            # vieux serveur sert du code périmé sur 3000
curl -s http://localhost:3000/ | grep -o "<marqueur du nouveau code>"  # confirmer la fraîcheur
```

Logs runtime détaillés (warnings next/image, erreurs browser relayées) :
`.next/dev/logs/next-development.log` — fichier persistant, les vieilles
entrées datent des sessions précédentes ; se fier aux timestamps.

## Piloter

Playwright n'est PAS dans node_modules du projet. Il est dispo dans le cache
npx avec Chromium déjà téléchargé — importer par chemin absolu :

```js
import { chromium } from "/home/ubuntu/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
```

(`NODE_PATH` ne fonctionne pas pour les imports ESM ; si ce hash npx a
disparu : `find /home/ubuntu/.npm/_npx -maxdepth 3 -name playwright -type d`.)

Viewports utiles : 1440×900 (desktop), 390×844 (mobile).

## Gotchas de mesure

- Les démos vitrines vivent dans des conteneurs `@container` scrollables ;
  sélecteur CSS : `.\@container` (échapper le `@`). Chaque site démo a
  aussi son propre `@container` interne — le count est ~2× le nombre attendu.
- Détection de débordement horizontal : `getBoundingClientRect` signale
  aussi les éléments clippés par un ancêtre `overflow-hidden` (marquee des
  logos, etc.) — filtrer les éléments dont un ancêtre clippe `overflow-x`.
- Le système `Reveal` (`.reveal-right`, translate 20px tant que non révélé)
  ajoute ~4px de `scrollWidth` sous la fold : bruit connu, pas un bug de la
  modification testée.
- Les démos embarquées contiennent leurs propres boutons `aria-pressed`,
  liens et rôles : les sélecteurs Playwright globaux (`[aria-pressed]`,
  `getByRole("link", { name: … })`) violent le strict mode — toujours cibler
  par nom accessible précis (`{ name: /défilement automatique/ }`,
  `{ exact: true }`).
