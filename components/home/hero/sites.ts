/**
 * Métadonnées des 4 sites vitrines mis en scène dans le héro. Les imports
 * dynamiques des composants Site restent dans demoRegistry (contexte client
 * obligatoire pour ssr: false) ; l'ordre du tableau est l'ordre de rotation.
 */
export const HERO_SITES = [
  {
    id: "table-doree",
    nom: "La Table Dorée",
    secteur: "Restaurant gastronomique · démonstration",
    url: "Démo conceptuelle",
    href: "/demos/table-doree",
  },
  {
    id: "volt",
    nom: "VOLT Energy",
    secteur: "Boisson énergisante · démonstration",
    url: "Démo conceptuelle",
    href: "/demos/volt",
  },
  {
    id: "elixir",
    nom: "Maison Élixir",
    secteur: "Haute parfumerie · démonstration",
    url: "Démo conceptuelle",
    href: "/demos/elixir",
  },
  {
    id: "ecrin",
    nom: "L'Écrin",
    secteur: "Salon de beauté · démonstration",
    url: "Démo conceptuelle",
    href: "/demos/ecrin",
  },
] as const;

export type HeroSite = (typeof HERO_SITES)[number];
export type HeroSiteId = HeroSite["id"];
