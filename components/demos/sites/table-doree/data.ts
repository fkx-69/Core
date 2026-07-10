/**
 * Contenu du site fictif « La Table Dorée » — restaurant gastronomique
 * des Almadies, Dakar. Cuisine sénégalaise revisitée, prix en FCFA.
 */

export const SITE = {
  name: "La Table Dorée",
  baseline: "Cuisine sénégalaise de haute volée, face à l'Atlantique",
  address: "12, route des Almadies",
  city: "Dakar — Sénégal",
  phone: "+221 33 869 24 10",
  phoneHref: "tel:+221338692410",
  mobile: "+221 77 452 18 60",
  email: "contact@latabledoree.sn",
  emailHref: "mailto:contact@latabledoree.sn",
} as const;

export const NAV_LINKS = [
  { href: "#maison", label: "La maison" },
  { href: "#carte", label: "La carte" },
  { href: "#galerie", label: "Galerie" },
  { href: "#infos", label: "Infos" },
  { href: "#reserver", label: "Réserver" },
] as const;

/* ------------------------------------------------------------------ */
/* Images — uniquement les assets /assets/demos/resto/                 */
/* ------------------------------------------------------------------ */

export const IMAGES = {
  hero: {
    src: "/assets/demos/resto/hero.webp",
    alt: "La grande salle du restaurant, murs en terre cuite et textiles bogolan",
  },
  plat: {
    src: "/assets/demos/resto/plat.webp",
    alt: "Assiette gastronomique dressée minute au passe",
  },
  chef: {
    src: "/assets/demos/resto/chef.webp",
    alt: "Le chef Ousmane Dieng en cuisine, concentré sur un dressage",
  },
  /** Recadrage 4/5 dédié au portrait de « La maison » — évite le crop
   *  object-cover qui fait servir à next/image une variante trop petite. */
  chefPortrait: {
    src: "/assets/demos/resto/chef-portrait.webp",
    alt: "Le chef Ousmane Dieng en cuisine, concentré sur un dressage",
  },
  terrasse: {
    src: "/assets/demos/resto/terrasse.webp",
    alt: "La terrasse ombragée du restaurant, tables dressées sous les arbres",
  },
  dessert: {
    src: "/assets/demos/resto/dessert.webp",
    alt: "Tatin de mangue caramélisée, servie tiède avec sa crème",
  },
  cave: {
    src: "/assets/demos/resto/cave.webp",
    alt: "La cave à vins voûtée et ses bouteilles alignées",
  },
} as const;

/* ------------------------------------------------------------------ */
/* La maison                                                            */
/* ------------------------------------------------------------------ */

export const STORY = {
  eyebrow: "La maison",
  title: "Une maison des Almadies, tournée vers l'océan",
  paragraphs: [
    "Ouverte en 2016 à la pointe des Almadies, La Table Dorée occupe une ancienne demeure aux murs de terre cuite, habillée de bois patiné et de bogolans tissés à la main. Trente-quatre couverts, une seule salle, et la rumeur de l'Atlantique en fond sonore.",
    "Ici, la cuisine ne traverse pas l'océan. Le thiof arrive chaque matin de la criée de Soumbédioune, les légumes des maraîchers des Niayes, les agrumes et le miel de Casamance, l'arachide de Kaolack. Le chef Ousmane Dieng, formé à Paris puis revenu par Saint-Louis, habille ce terroir d'un geste précis : yassa réduit en jus court, mafé confit sept heures, thiakry dressé comme un grand dessert.",
  ],
  quote:
    "Ma cuisine ne traverse pas l'océan : elle reste entre le sable de Soumbédioune et les vergers des Niayes. Je ne fais que la vêtir autrement.",
  chefName: "Ousmane Dieng",
  chefRole: "Chef & fondateur",
} as const;

export const STATS = [
  { value: "2016", label: "la maison ouvre aux Almadies" },
  { value: "34", label: "couverts, une seule salle" },
  { value: "9", label: "producteurs et pêcheurs partenaires" },
  { value: "300", label: "références en cave" },
] as const;

/** Piliers du sourcing, mis en avant dans « La maison ». */
export const SOURCING = [
  {
    icon: "fish",
    title: "Pêche de Soumbédioune",
    text: "Thiof, lotte et gambas débarqués chaque matin à la criée, choisis à la pièce.",
  },
  {
    icon: "leaf",
    title: "Maraîchers des Niayes",
    text: "Légumes, mangues et herbes cueillis la veille dans la bande côtière des Niayes.",
  },
  {
    icon: "wine",
    title: "Cave vivante",
    text: "300 références, de la Bourgogne à Stellenbosch, et une carte d'infusions du pays.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* La carte                                                             */
/* ------------------------------------------------------------------ */

export type MenuCategory = "entrees" | "plats" | "desserts";

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  entrees: "Entrées",
  plats: "Plats",
  desserts: "Desserts",
};

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  /** Plat emblématique de la maison, signalé d'une étoile. */
  signature?: boolean;
};

export const MENU: Record<MenuCategory, MenuItem[]> = {
  entrees: [
    {
      name: "Tartare de thiof de Soumbédioune",
      description:
        "Taillé au couteau, agrumes de Casamance, huile de baobab, tuile de fonio croustillante.",
      price: "8 500 FCFA",
      signature: true,
    },
    {
      name: "Velouté de niébé fumé",
      description:
        "Haricots niébé de Louga, crevettes de Joal snackées, huile verte au persil plat.",
      price: "6 500 FCFA",
    },
    {
      name: "Pastels de la mer, version maison",
      description:
        "Farce fine de mérou, condiment tamarin, sauce kani douce montée au citron vert.",
      price: "7 000 FCFA",
    },
    {
      name: "Salade de mangue verte des Niayes",
      description:
        "Gambas rôties, arachide torréfiée, vinaigrette bissap-gingembre.",
      price: "7 500 FCFA",
    },
    {
      name: "Foie gras poêlé au mad de Casamance",
      description:
        "Chutney de mad, brioche toastée au miel de Casamance, fleur de sel de Fatick.",
      price: "9 000 FCFA",
    },
  ],
  plats: [
    {
      name: "Thiof rôti, jus yassa réduit",
      description:
        "Pêche du jour de Soumbédioune, oignons confits douze heures, citron confit, riz de la vallée du fleuve.",
      price: "16 500 FCFA",
      signature: true,
    },
    {
      name: "Yassa de poulet fermier des Niayes",
      description:
        "Suprême doré à la broche, oignons caramélisés au citron, riz parfumé au laurier.",
      price: "12 500 FCFA",
    },
    {
      name: "Mafé d'agneau de Tambacounda",
      description:
        "Épaule confite sept heures, arachide de Kaolack torréfiée, légumes racines glacés.",
      price: "14 500 FCFA",
    },
    {
      name: "Gambas de Casamance flambées",
      description:
        "Purée de patate douce fumée, émulsion coco-citronnelle, herbes de la dune.",
      price: "17 500 FCFA",
    },
    {
      name: "Filet de bœuf, jus corsé au café Touba",
      description:
        "Écrasé de pommes de terre des Niayes au beurre noisette, oignons grelots laqués.",
      price: "18 000 FCFA",
    },
  ],
  desserts: [
    {
      name: "Tatin de mangue des Niayes",
      description:
        "Feuilletage caramélisé minute, caramel au bissap, crème épaisse à peine salée.",
      price: "6 000 FCFA",
      signature: true,
    },
    {
      name: "Thiakry comme un riz au lait",
      description:
        "Mil de Fatick, vanille bourbon, chantilly coco, croustillant au sésame doré.",
      price: "5 000 FCFA",
    },
    {
      name: "Tout bissap",
      description:
        "Sorbet, gelée et meringue de bissap, sablé au beurre de karité.",
      price: "5 500 FCFA",
    },
    {
      name: "Grand cru chocolat & café Touba",
      description:
        "Moelleux cœur coulant, glace à l'arachide de Kaolack, cacao du Ghana.",
      price: "6 500 FCFA",
    },
    {
      name: "Agrumes de Casamance, sorbet corossol",
      description:
        "Suprêmes au sirop léger, sorbet corossol turbiné du jour, zestes confits.",
      price: "4 500 FCFA",
    },
  ],
};

export const TASTING_MENU = {
  name: "Menu Téranga",
  subtitle: "Sept séquences, servies pour l'ensemble de la table",
  description:
    "Un voyage du sable de Soumbédioune aux vergers des Niayes, composé chaque semaine au retour du marché. Dernier départ à 21 h 30.",
  price: "45 000 FCFA",
  priceNote: "par convive",
  pairings: [
    "Accords vins — 5 verres · 25 000 FCFA",
    "Accords jus & infusions — bissap, gingembre, kinkéliba · 12 000 FCFA",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Galerie                                                              */
/* ------------------------------------------------------------------ */

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export const GALLERY: GalleryItem[] = [
  {
    src: IMAGES.hero.src,
    alt: IMAGES.hero.alt,
    caption: "La grande salle — terre cuite, bois patiné et bogolan",
  },
  {
    src: IMAGES.plat.src,
    alt: IMAGES.plat.alt,
    caption: "Dressage minute au passe — le thiof, jus yassa réduit",
  },
  {
    src: IMAGES.chef.src,
    alt: IMAGES.chef.alt,
    caption: "Le chef Ousmane Dieng, pendant le coup de feu",
  },
  {
    src: IMAGES.terrasse.src,
    alt: IMAGES.terrasse.alt,
    caption: "La terrasse ombragée, dans la brise de l'Atlantique",
  },
  {
    src: IMAGES.dessert.src,
    alt: IMAGES.dessert.alt,
    caption: "La Tatin de mangue des Niayes, caramel au bissap",
  },
  {
    src: IMAGES.cave.src,
    alt: IMAGES.cave.alt,
    caption: "La cave — 300 références, de la Bourgogne à Stellenbosch",
  },
];

/* ------------------------------------------------------------------ */
/* Infos pratiques                                                      */
/* ------------------------------------------------------------------ */

export const HOURS = [
  { days: "Mardi — Jeudi", hours: "12h – 14h30 · 19h30 – 22h30" },
  { days: "Vendredi — Samedi", hours: "12h – 14h30 · 19h30 – 23h" },
  { days: "Dimanche", hours: "Brunch de la mer · 11h30 – 15h" },
  { days: "Lundi", hours: "Fermé" },
] as const;

/** Bandeau réassurance de la section « Infos pratiques ». */
export const FEATURES = [
  {
    icon: "trees",
    title: "Terrasse face à l'océan",
    text: "Dressée midi et soir, à l'ombre des filaos, de novembre à juin.",
  },
  {
    icon: "users",
    title: "Privatisation",
    text: "La salle entière pour vos événements, jusqu'à 34 couverts assis.",
  },
  {
    icon: "car",
    title: "Voiturier",
    text: "Service voiturier offert chaque soir à partir de 19 h 30.",
  },
  {
    icon: "wine",
    title: "Cave d'exception",
    text: "300 références choisies, servies au verre ou à la bouteille.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Réservation                                                          */
/* ------------------------------------------------------------------ */

export const TIME_SLOTS = [
  "12h00",
  "12h30",
  "13h00",
  "13h30",
  "19h30",
  "20h00",
  "20h30",
  "21h00",
  "21h30",
] as const;

export const GUEST_OPTIONS = [
  "1 couvert",
  "2 couverts",
  "3 couverts",
  "4 couverts",
  "5 couverts",
  "6 couverts",
  "7 couverts",
  "8 couverts",
  "Plus de 8 — privatisation",
] as const;
