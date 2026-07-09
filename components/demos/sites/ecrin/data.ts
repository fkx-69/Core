/**
 * Contenu du site vitrine fictif « L'Écrin » — salon de beauté haut de gamme
 * du Plateau, à Abidjan. Prix en FCFA, prestations et localisation adaptées à
 * la Côte d'Ivoire. Aucune donnée n'est calculée au rendu : le planning est
 * dérivé d'une date figée pour rester déterministe entre le serveur et le
 * client (pas de mismatch d'hydratation).
 */

export type UniversId = "coiffure" | "soins" | "onglerie";

export type Prestation = {
  id: string;
  nom: string;
  description: string;
  duree: string;
  prix: number;
};

export type Univers = {
  id: UniversId;
  nom: string;
  intro: string;
  image: string;
  imageAlt: string;
  prestations: Prestation[];
};

/** Sépare les milliers par une espace insécable, sans dépendre d'Intl (SSR-safe). */
export function formatFcfa(n: number): string {
  const s = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s} FCFA`;
}

export const UNIVERS: Univers[] = [
  {
    id: "coiffure",
    nom: "Coiffure",
    intro:
      "Tresses, tissages et soins profonds pensés pour sublimer le cheveu naturel comme défrisé.",
    image: "/assets/demos/salon/coiffure.webp",
    imageAlt: "Cliente coiffée au salon L'Écrin, brushing lumière",
    prestations: [
      {
        id: "coupe-brushing",
        nom: "Coupe & brushing lumière",
        description: "Coupe personnalisée, brushing soyeux et finition soin.",
        duree: "1 h 15",
        prix: 15000,
      },
      {
        id: "tresses-collees",
        nom: "Tresses collées graphiques",
        description: "Cornrows aux motifs dessinés à la main, tenue plusieurs semaines.",
        duree: "2 h 30",
        prix: 22000,
      },
      {
        id: "tissage",
        nom: "Tissage cousu à la main",
        description: "Pose invisible, mèches sélectionnées, coiffage inclus.",
        duree: "3 h",
        prix: 35000,
      },
      {
        id: "soin-profond",
        nom: "Soin profond & coiffage vapeur",
        description: "Bain d'huiles chaudes, masque réparateur au karité, coiffage.",
        duree: "1 h 30",
        prix: 18000,
      },
    ],
  },
  {
    id: "soins",
    nom: "Soins visage & corps",
    intro:
      "Des rituels lents, aux produits naturels d'Afrique de l'Ouest, pour retrouver l'éclat.",
    image: "/assets/demos/salon/soin.webp",
    imageAlt: "Soin du visage relaxant en cabine au salon L'Écrin",
    prestations: [
      {
        id: "soin-eclat",
        nom: "Soin visage éclat au karité",
        description: "Nettoyage, gommage doux et masque au karité de Korhogo.",
        duree: "1 h",
        prix: 25000,
      },
      {
        id: "gommage-corps",
        nom: "Gommage corps & enveloppement",
        description: "Gommage sucre-karité puis enveloppement hydratant.",
        duree: "45 min",
        prix: 20000,
      },
      {
        id: "anti-age",
        nom: "Rituel anti-âge premium",
        description: "Sérum concentré, massage liftant et masque raffermissant.",
        duree: "1 h 15",
        prix: 45000,
      },
      {
        id: "modelage",
        nom: "Modelage relaxant aux huiles",
        description: "Massage aux huiles chaudes, dos-jambes ou corps entier.",
        duree: "1 h",
        prix: 30000,
      },
    ],
  },
  {
    id: "onglerie",
    nom: "Onglerie",
    intro:
      "Mains et pieds soignés dans le moindre détail, du nude discret à la pose la plus créative.",
    image: "/assets/demos/salon/manucure.webp",
    imageAlt: "Manucure semi-permanente réalisée au salon L'Écrin",
    prestations: [
      {
        id: "manucure",
        nom: "Manucure signature",
        description: "Mise en forme, soin des cuticules et vernis longue tenue.",
        duree: "45 min",
        prix: 8000,
      },
      {
        id: "semi-permanent",
        nom: "Pose semi-permanente",
        description: "Vernis gel brillance miroir, tenue jusqu'à deux semaines.",
        duree: "1 h",
        prix: 12000,
      },
      {
        id: "gel-french",
        nom: "Pose gel & French sur-mesure",
        description: "Rallongement au gel, French délicate ou nude naturel.",
        duree: "1 h 15",
        prix: 18000,
      },
      {
        id: "beaute-pieds",
        nom: "Beauté des pieds complète",
        description: "Soin complet, gommage et pose semi-permanente.",
        duree: "50 min",
        prix: 10000,
      },
    ],
  },
];

/** Accès rapide à toutes les prestations, tous univers confondus. */
export const PRESTATIONS: Prestation[] = UNIVERS.flatMap((u) => u.prestations);

/** Retrouve l'univers d'une prestation (pour le récapitulatif de réservation). */
export function universDePrestation(id: string): Univers | undefined {
  return UNIVERS.find((u) => u.prestations.some((p) => p.id === id));
}

// —— Planning déterministe ————————————————————————————————————————————————

export type Jour = {
  id: string;
  jourCourt: string;
  jourLong: string;
  date: string;
  ferme: boolean;
};

/** Date figée : vendredi 10 juillet 2026 (UTC, pour éviter tout effet de fuseau). */
const BASE_PLANNING = Date.UTC(2026, 6, 10);
const MOIS = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];
const JOURS_LONGS = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
];
const JOURS_COURTS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/** Six prochains jours à partir de la date figée ; le salon est fermé le dimanche. */
export const JOURS: Jour[] = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(BASE_PLANNING + i * 86_400_000);
  const dow = d.getUTCDay();
  return {
    id: `jour-${i}`,
    jourCourt: JOURS_COURTS[dow],
    jourLong: JOURS_LONGS[dow],
    date: `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]}`,
    ferme: dow === 0,
  };
});

export const CRENEAUX = [
  "9 h 00",
  "10 h 30",
  "11 h 30",
  "13 h 00",
  "14 h 30",
  "16 h 00",
  "17 h 30",
] as const;

/** Créneaux déjà réservés, pour que le planning respire comme un vrai agenda. */
export const CRENEAUX_PRIS: Record<string, string[]> = {
  "jour-0": ["9 h 00", "14 h 30"],
  "jour-1": ["10 h 30", "11 h 30", "16 h 00"],
  "jour-2": [],
  "jour-3": ["13 h 00"],
  "jour-4": ["9 h 00", "17 h 30"],
  "jour-5": ["11 h 30"],
};

// —— Le salon ————————————————————————————————————————————————————————————

export const CHIFFRES = [
  { valeur: "10 ans", label: "au service de votre beauté" },
  { valeur: "4 800", label: "clientes accompagnées" },
  { valeur: "4,9/5", label: "note moyenne des avis" },
  { valeur: "100 %", label: "matériel stérilisé" },
];

export const VALEURS = [
  {
    titre: "Produits d'exception",
    texte:
      "Karité brut de Korhogo, huiles végétales et marques professionnelles, choisis pour tous les types de cheveux et de peaux.",
  },
  {
    titre: "Hygiène irréprochable",
    texte:
      "Matériel stérilisé après chaque cliente, linge propre à chaque soin, protocoles suivis à la lettre.",
  },
  {
    titre: "Des mains expertes",
    texte:
      "Coiffeuses, prothésistes ongulaires et esthéticiennes diplômées, formées aux dernières techniques.",
  },
];

// —— Galerie ——————————————————————————————————————————————————————————————

export const GALERIE = [
  { image: "/assets/demos/salon/hero.webp", legende: "L'atmosphère du salon", alt: "Salle d'accueil chaleureuse du salon L'Écrin" },
  { image: "/assets/demos/salon/coiffure.webp", legende: "Coiffure sur-mesure", alt: "Prestation de coiffure au salon L'Écrin" },
  { image: "/assets/demos/salon/soin.webp", legende: "Cabine de soin", alt: "Cabine de soin du visage au salon L'Écrin" },
  { image: "/assets/demos/salon/manucure.webp", legende: "Détail onglerie", alt: "Détail d'une pose d'ongles au salon L'Écrin" },
];

// —— Avis ————————————————————————————————————————————————————————————————

export type Avis = {
  nom: string;
  quartier: string;
  note: number;
  texte: string;
};

export const AVIS: Avis[] = [
  {
    nom: "Aïcha Kouassi",
    quartier: "Cocody",
    note: 5,
    texte:
      "Je viens pour mes tresses depuis deux ans et je ne changerais pour rien au monde. Le résultat tient des semaines et l'accueil est toujours aussi chaleureux.",
  },
  {
    nom: "Mariam Touré",
    quartier: "Marcory",
    note: 5,
    texte:
      "Un vrai moment pour soi. Le soin visage au karité a transformé ma peau, et l'ambiance du salon est d'un raffinement rare au Plateau.",
  },
  {
    nom: "Grace N'Guessan",
    quartier: "Plateau",
    note: 5,
    texte:
      "La prise de rendez-vous en ligne est très pratique, jamais d'attente. Les prothésistes sont minutieuses, ma pose gel est impeccable à chaque fois.",
  },
  {
    nom: "Fatou Bamba",
    quartier: "Deux-Plateaux",
    note: 4,
    texte:
      "Cadre magnifique et équipe aux petits soins. Une demi-étoile en moins pour l'attente un samedi chargé, mais le tissage était parfait.",
  },
];

// —— Infos pratiques ——————————————————————————————————————————————————————

export const HORAIRES = [
  { jour: "Lundi – Vendredi", heures: "9 h 00 – 19 h 00" },
  { jour: "Samedi", heures: "9 h 00 – 20 h 00" },
  { jour: "Dimanche", heures: "Fermé" },
];

export const CONTACT = {
  adresse: "Immeuble Alpha 2000, rue du Commerce",
  ville: "Le Plateau, Abidjan",
  telephone: "+225 27 20 31 84 90",
  telephoneLien: "+2252720318490",
  whatsapp: "+225 07 07 12 34 56",
  email: "bonjour@lecrin.ci",
  instagram: "lecrin.abidjan",
};

/** Ancres de navigation du site (préfixées pour éviter toute collision d'id). */
export const NAV = [
  { id: "ecrin-prestations", label: "Prestations" },
  { id: "ecrin-salon", label: "Le salon" },
  { id: "ecrin-galerie", label: "Galerie" },
  { id: "ecrin-avis", label: "Avis" },
  { id: "ecrin-rendez-vous", label: "Rendez-vous" },
];
