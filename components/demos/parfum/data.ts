export type Contenance = "30" | "50" | "100";

export type Parfum = {
  id: string;
  nom: string;
  accroche: string;
  description: string;
  image: string;
  notes: { tete: string; coeur: string; fond: string };
  prix: Record<Contenance, number>;
};

export const PARFUMS: Parfum[] = [
  {
    id: "ambre",
    nom: "Ambre Nocturne",
    accroche: "Chaud, enveloppant, magnétique",
    description:
      "Un oriental boisé qui s'ouvre sur la lumière du safran avant de plonger dans un cœur d'ambre gris et de labdanum. Le sillage d'un soir qui ne finit jamais.",
    image: "/assets/demos/parfum/ambre.webp",
    notes: {
      tete: "Safran, bergamote, poivre rose",
      coeur: "Ambre gris, labdanum, rose de Damas",
      fond: "Oud, vanille bourbon, musc",
    },
    prix: { "30": 85, "50": 120, "100": 175 },
  },
  {
    id: "rose",
    nom: "Rose Aurore",
    accroche: "Floral, lumineux, délicat",
    description:
      "La rose cueillie à l'aube, encore couverte de rosée. Un floral poudré traversé d'agrumes, tendre sans jamais être sage.",
    image: "/assets/demos/parfum/rose.webp",
    notes: {
      tete: "Litchi, mandarine, feuille de violette",
      coeur: "Rose centifolia, pivoine, iris",
      fond: "Santal blanc, musc, cèdre",
    },
    prix: { "30": 78, "50": 110, "100": 160 },
  },
  {
    id: "vetiver",
    nom: "Vétiver Sauvage",
    accroche: "Vert, minéral, racé",
    description:
      "Le vétiver d'Haïti dans toute sa rudesse, adouci d'une sève de figuier et posé sur un lit de pierre mouillée. Un chypre vert d'une élégance brute.",
    image: "/assets/demos/parfum/vetiver.webp",
    notes: {
      tete: "Pamplemousse, cardamome, sève de figuier",
      coeur: "Vétiver d'Haïti, galbanum, géranium",
      fond: "Patchouli, mousse de chêne, encens",
    },
    prix: { "30": 92, "50": 130, "100": 190 },
  },
];

export const CONTENANCES: Contenance[] = ["30", "50", "100"];

export const formatEur = (n: number) =>
  n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
