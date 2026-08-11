/**
 * Contenu éditorial de Maison Élixir — maison de haute parfumerie fictive
 * de Bamako, au Mali. Matières premières ouest-africaines, prix en FCFA.
 * Aucune donnée n'est réelle : site de démonstration.
 */

export const CONTENANCES = ["50", "100"] as const;
export type Contenance = (typeof CONTENANCES)[number];

/** Teinte d'accent d'un parfum, déclinée pour fonds clairs et sombres. */
export type Accent = {
  /** Texte accent lisible sur ivoire (AA). */
  text: string;
  /** Version plus dense, pour filets et détails. */
  deep: string;
  /** Fond teinté très pâle de la fiche. */
  soft: string;
  /** Version lumineuse pour fonds encre. */
  glow: string;
};

export type Parfum = {
  id: string;
  nom: string;
  /** Famille olfactive, en une ligne. */
  famille: string;
  /** Accroche courte pour la collection. */
  accroche: string;
  /** Récit sensoriel de la fiche. */
  recit: string;
  image: string;
  accent: Accent;
  notes: { tete: string[]; coeur: string[]; fond: string[] };
  prix: Record<Contenance, number>;
};

export const PARFUMS: Parfum[] = [
  {
    id: "ambre",
    nom: "Ambre Lagune",
    famille: "Ambré · solaire",
    accroche: "Chaud, résineux, doré",
    recit:
      "Un ambre profond qui s'ouvre sur le gingembre frais et le safran, avant de fondre dans un cœur de fleur d'oranger. Le beurre de karité et le benjoin déposent un sillage résineux, doré comme la lumière de fin de journée sur la lagune Ébrié.",
    image: "/assets/demos/parfum/ambre.webp",
    accent: { text: "#8a5a24", deep: "#6d4619", soft: "#f1e7d6", glow: "#c99a5f" },
    notes: {
      tete: ["Gingembre frais", "Bergamote", "Safran"],
      coeur: ["Fleur d'oranger", "Ambre", "Rose de Damas"],
      fond: ["Beurre de karité", "Benjoin", "Vanille de Madagascar"],
    },
    prix: { "50": 48000, "100": 75000 },
  },
  {
    id: "rose",
    nom: "Rose Bissap",
    famille: "Floral · acidulé",
    accroche: "Floral, poudré, pourpre",
    recit:
      "La rose cueillie à l'aube, traversée par l'acidité pourpre de l'hibiscus. Un floral poudré où la fleur d'oranger adoucit le bissap, posé sur un fond de musc blanc et de karité — tendre, sans jamais être sage.",
    image: "/assets/demos/parfum/rose.webp",
    accent: { text: "#9c4f4f", deep: "#7c3d3d", soft: "#f2e3df", glow: "#cf9793" },
    notes: {
      tete: ["Hibiscus (bissap)", "Litchi", "Mandarine"],
      coeur: ["Rose centifolia", "Fleur d'oranger", "Pivoine"],
      fond: ["Musc blanc", "Santal", "Beurre de karité"],
    },
    prix: { "50": 45000, "100": 72000 },
  },
  {
    id: "vetiver",
    nom: "Vétiver Sauvage",
    famille: "Boisé · vert",
    accroche: "Vert, minéral, racé",
    recit:
      "Le vétiver cultivé sur les plateaux de l'intérieur, dans toute sa fraîcheur minérale. Le gingembre et le pamplemousse l'électrisent, le galbanum le verdit, le cèdre et le karité fumé lui donnent une élégance brute.",
    image: "/assets/demos/parfum/vetiver.webp",
    accent: { text: "#41583f", deep: "#33452f", soft: "#e5ebe0", glow: "#93a986" },
    notes: {
      tete: ["Pamplemousse", "Gingembre", "Cardamome"],
      coeur: ["Vétiver d'Afrique de l'Ouest", "Galbanum", "Géranium"],
      fond: ["Cèdre", "Mousse", "Karité fumé"],
    },
    prix: { "50": 52000, "100": 82000 },
  },
];

/** Étiquettes ordonnées de la pyramide olfactive. */
export const TIERS: { key: keyof Parfum["notes"]; label: string }[] = [
  { key: "tete", label: "Tête" },
  { key: "coeur", label: "Cœur" },
  { key: "fond", label: "Fond" },
];

/** Étapes de fabrication (section savoir-faire). */
export const ETAPES: { titre: string; texte: string }[] = [
  {
    titre: "Sélection",
    texte:
      "Chaque matière est choisie à la source, auprès de coopératives d'Afrique de l'Ouest.",
  },
  {
    titre: "Macération",
    texte:
      "Les essences reposent six semaines dans l'alcool, à l'abri de la lumière.",
  },
  {
    titre: "Assemblage",
    texte:
      "Le parfumeur ajuste l'accord, goutte à goutte, jusqu'à l'équilibre juste.",
  },
  {
    titre: "Mise en flacon",
    texte:
      "Chaque flacon est rempli, bouché et étiqueté à la main dans l'atelier de démonstration.",
  },
];

/** Chiffres discrets de la maison. */
export const CHIFFRES: { valeur: string; label: string }[] = [
  { valeur: "6", label: "semaines de macération" },
  { valeur: "37", label: "matières premières" },
  { valeur: "3", label: "eaux de parfum" },
  { valeur: "100 %", label: "assemblé pour la démonstration" },
];

/** Bandeau défilant des matières. */
export const MATIERES = [
  "Vétiver",
  "Hibiscus",
  "Beurre de karité",
  "Gingembre",
  "Fleur d'oranger",
  "Bissap",
  "Benjoin",
  "Santal",
  "Cardamome",
  "Fève tonka",
];

/** Coordonnées de la boutique. */
export const BOUTIQUE = {
  adresse: ["Bamako, Mali", "Démonstration conceptuelle"],
  horaires: [
    { jours: "Mardi – Samedi", heures: "10 h – 19 h" },
    { jours: "Dimanche & Lundi", heures: "Sur rendez-vous" },
  ],
  telephone: "+225 27 22 44 18 90",
  email: "Démonstration uniquement",
  livraison: "Parcours de livraison simulé",
  paiement: "Wave · Orange Money · Carte · En boutique",
};

/** Citations presse. */
export const PRESSE: { citation: string; source: string }[] = [
  {
    citation: "Une signature olfactive présentée à titre conceptuel.",
    source: "Fashion Afrique",
  },
  {
    citation: "Un luxe sobre, profondément ancré dans nos matières.",
    source: "Éléphant Magazine",
  },
  {
    citation: "Trois parfums, zéro compromis.",
    source: "Source conceptuelle",
  },
];

export const formatFcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
