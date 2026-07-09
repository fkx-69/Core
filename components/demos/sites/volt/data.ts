/**
 * Contenu éditorial du site VOLT — marque fictive de boisson énergisante née
 * à Abidjan. La palette néon de chaque saveur est injectée en variables CSS
 * (--volt-accent / --volt-glow / --volt-halo) sur le root de Site.tsx : c'est
 * elle qui rethème toute la page au changement de saveur.
 */

export type SaveurId = "original" | "citrus" | "berry";

export type Saveur = {
  id: SaveurId;
  nom: string;
  /** Duo aromatique, affiché en kicker. */
  accroche: string;
  description: string;
  /** Profil gustatif, intensités sur 5. */
  notes: { label: string; niveau: number }[];
  image: string;
  /** Néon principal de la saveur (calé sur la canette photographiée). */
  accent: string;
  /** Ombre portée « glow » (rgba marqué). */
  glow: string;
  /** Halo d'ambiance très dilué (rgba léger). */
  halo: string;
};

export const SAVEURS: Saveur[] = [
  {
    id: "original",
    nom: "Original",
    accroche: "Kola & guarana",
    description:
      "La recette signature : noix de kola torréfiée, guarana et une pointe d’agrumes. Un courant net, franc, sans sucre — l’énergie qui tient jusqu’à la fermeture du dernier maquis.",
    notes: [
      { label: "Puissance", niveau: 5 },
      { label: "Fraîcheur", niveau: 3 },
      { label: "Rondeur", niveau: 2 },
    ],
    image: "/assets/demos/volt/original.webp",
    accent: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.55)",
    halo: "rgba(56, 189, 248, 0.14)",
  },
  {
    id: "citrus",
    nom: "Citron Vert",
    accroche: "Citron vert & gingembre",
    description:
      "Du citron vert pressé à froid, réveillé par le gingembre — notre clin d’œil au gnamakoudji. Tranchant, vif, presque insolent : la saveur préférée des lève-tôt de Treichville.",
    notes: [
      { label: "Puissance", niveau: 4 },
      { label: "Fraîcheur", niveau: 5 },
      { label: "Rondeur", niveau: 1 },
    ],
    image: "/assets/demos/volt/citrus.webp",
    accent: "#a3e635",
    glow: "rgba(163, 230, 53, 0.5)",
    halo: "rgba(163, 230, 53, 0.13)",
  },
  {
    id: "berry",
    nom: "Baies Noires",
    accroche: "Mûre & hibiscus",
    description:
      "Mûre, cassis et une infusion d’hibiscus comme un bissap de minuit. Profond, velouté, dangereusement facile à boire — l’énergie côté nuit.",
    notes: [
      { label: "Puissance", niveau: 4 },
      { label: "Fraîcheur", niveau: 3 },
      { label: "Rondeur", niveau: 4 },
    ],
    image: "/assets/demos/volt/berry.webp",
    accent: "#e879f9",
    glow: "rgba(232, 121, 249, 0.5)",
    halo: "rgba(232, 121, 249, 0.14)",
  },
];

export const NAV = [
  { label: "Saveurs", href: "#saveurs" },
  { label: "Ingrédients", href: "#ingredients" },
  { label: "La marque", href: "#marque" },
  { label: "Points de vente", href: "#points-de-vente" },
  { label: "Distributeurs", href: "#distributeurs" },
];

export const MARQUEE = [
  "Zéro sucre",
  "160 mg de caféine",
  "Kola & guarana",
  "Née à Abidjan",
  "Canette recyclable",
  "1 000 FCFA prix conseillé",
];

export const PRIX = {
  montant: "1 000",
  devise: "FCFA",
  mention: "Canette 50 cl · zéro sucre · 160 mg de caféine",
};

/** Blocs chiffrés de la section composition. */
export const COMPOSITION = [
  {
    valeur: "160",
    unite: "mg",
    titre: "Caféine naturelle",
    texte:
      "Guarana et noix de kola : l’équivalent de deux expressos bien serrés, diffusés sans à-coups.",
  },
  {
    valeur: "0",
    unite: "g",
    titre: "Sucres",
    texte: "Sucralose et stévia — 12 kcal la canette, zéro pic, zéro crash.",
  },
  {
    valeur: "3",
    unite: "",
    titre: "Vitamines B",
    texte:
      "B3, B6 et B12 à 100 % des apports journaliers, pour transformer l’effort en énergie.",
  },
  {
    valeur: "100",
    unite: "%",
    titre: "Recyclable",
    texte:
      "Une canette aluminium recyclable à l’infini, collectée avec nos frigos partenaires.",
  },
];

/** Provenance des ingrédients clés (icônes mappées dans Site.tsx). */
export const ORIGINES = [
  {
    id: "kola",
    titre: "Noix de kola de Divo",
    texte:
      "Torréfiée artisanalement, elle signe l’amertume de VOLT et sa caféine d’origine ivoirienne.",
  },
  {
    id: "gingembre",
    titre: "Gingembre d’Akoupé",
    texte:
      "Pressé frais chaque semaine, il apporte le piquant qui réveille — sans arôme artificiel.",
  },
  {
    id: "guarana",
    titre: "Guarana d’Amazonie",
    texte:
      "Une caféine végétale à libération lente, qui prolonge l’effet au lieu de l’écraser d’un coup.",
  },
];

export const IMAGE_MARQUE = "/assets/demos/volt/hero.webp";

export const MANIFESTE =
  "VOLT est née en 2021 dans un atelier de la Zone 4, entre deux gbakas et une console de mixage. On voulait une énergisante qui nous ressemble : franche, sans sucre, montée sur la kola de chez nous plutôt que sur des poudres importées. Cinq ans plus tard, la canette noire s’ouvre dans les maquis de Yopougon comme dans les open spaces du Plateau — et elle n’a rien perdu de son voltage.";

export const STATS_MARQUE = [
  { valeur: "2021", label: "naissance à Marcory" },
  { valeur: "3", label: "saveurs au catalogue" },
  { valeur: "400+", label: "points de vente actifs" },
  { valeur: "10", label: "communes couvertes" },
];

/** Canaux de distribution (icônes mappées dans Site.tsx). */
export const POINTS_DE_VENTE = [
  {
    id: "superettes",
    titre: "Superettes & supermarchés",
    texte:
      "Au rayon frais des grandes enseignes comme des boutiques de quartier, de Cocody à Port-Bouët.",
  },
  {
    id: "stations",
    titre: "Stations-service",
    texte:
      "Dans les frigos des stations, sur l’autoroute du Nord comme sur le boulevard VGE — 24 h/24.",
  },
  {
    id: "maquis",
    titre: "Maquis & lounges",
    texte:
      "De la Rue Princesse aux rooftops de la Zone 4, VOLT se mixe ou se boit glacée, nature.",
  },
  {
    id: "livraison",
    titre: "Livraison express",
    texte:
      "Par pack de 6 ou de 24 via nos livreurs partenaires, réglée en Wave ou Orange Money.",
  },
];

export const COMMUNES = [
  "Cocody",
  "Plateau",
  "Marcory",
  "Zone 4",
  "Treichville",
  "Yopougon",
  "Koumassi",
  "Abobo",
  "Port-Bouët",
  "Bingerville",
];

export const EXPANSION = "Bientôt : Bouaké, Yamoussoukro & San Pedro";

export const AVANTAGES_DISTRIBUTEUR = [
  "Jusqu’à 25 % de marge sur le prix conseillé",
  "Livraison sous 48 h partout dans le Grand Abidjan",
  "Paiement à la livraison — Wave, Orange Money ou espèces",
  "Frigo VOLT et PLV offerts dès 40 packs par mois",
];

export const TYPES_COMMERCE = [
  "Superette / supermarché",
  "Station-service",
  "Maquis / lounge / bar",
  "Grossiste",
  "Autre commerce",
];

export const CONTACT = {
  adresse: "Rue du Canal, Zone 4C — Marcory, Abidjan",
  telephone: "+225 07 07 89 21 45",
  telephoneLien: "tel:+2250707892145",
  email: "hello@drinkvolt.ci",
};

export const RESEAUX = ["Instagram", "TikTok", "Facebook", "WhatsApp"];

export const AVERTISSEMENT =
  "Teneur élevée en caféine (32 mg/100 ml). Déconseillé aux enfants et aux femmes enceintes ou allaitantes. À consommer avec modération.";
