export type CategoriePrestation = "coiffure" | "ongles" | "soins";

export type Prestation = {
  nom: string;
  duree: string;
  prix: number;
};

export const CATEGORIES_PRESTATIONS: Record<CategoriePrestation, string> = {
  coiffure: "Coiffure",
  ongles: "Ongles",
  soins: "Soins",
};

export const PRESTATIONS: Record<CategoriePrestation, Prestation[]> = {
  coiffure: [
    { nom: "Coupe & brushing", duree: "1 h", prix: 55 },
    { nom: "Balayage lumière", duree: "2 h 30", prix: 120 },
    { nom: "Coiffure événement", duree: "1 h 15", prix: 75 },
  ],
  ongles: [
    { nom: "Manucure signature", duree: "45 min", prix: 40 },
    { nom: "Pose semi-permanente", duree: "1 h", prix: 55 },
    { nom: "Beauté des pieds", duree: "50 min", prix: 45 },
  ],
  soins: [
    { nom: "Soin visage éclat", duree: "1 h", prix: 70 },
    { nom: "Soin anti-âge premium", duree: "1 h 15", prix: 95 },
    { nom: "Modelage relaxant", duree: "50 min", prix: 65 },
  ],
};

/** Images des univers de prestations, affichées dans l'onglet Prestations. */
export const CATEGORIE_IMAGES: Record<CategoriePrestation, string> = {
  coiffure: "/assets/demos/salon/coiffure.webp",
  ongles: "/assets/demos/salon/manucure.webp",
  soins: "/assets/demos/salon/soin.webp",
};

export const JOURS = ["Mar. 7", "Mer. 8", "Jeu. 9", "Ven. 10", "Sam. 11"] as const;

export const CRENEAUX = [
  "9 h 30",
  "10 h 15",
  "11 h 00",
  "14 h 00",
  "15 h 30",
  "16 h 15",
  "17 h 00",
] as const;

/** Créneaux déjà pris, pour que la grille respire comme un vrai planning. */
export const CRENEAUX_PRIS: Record<(typeof JOURS)[number], string[]> = {
  "Mar. 7": ["9 h 30", "14 h 00"],
  "Mer. 8": ["11 h 00"],
  "Jeu. 9": ["10 h 15", "15 h 30", "17 h 00"],
  "Ven. 10": ["9 h 30"],
  "Sam. 11": ["10 h 15", "11 h 00", "14 h 00", "16 h 15"],
};

export const formatEur = (n: number) =>
  n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
