export type Saveur = {
  id: string;
  nom: string;
  sousTitre: string;
  description: string;
  image: string;
  /** Classes littérales par saveur — Tailwind ne compile pas les classes construites. */
  accentText: string;
  glow: string;
  pill: string;
  halo: string;
};

export const SAVEURS: Saveur[] = [
  {
    id: "original",
    nom: "Original",
    sousTitre: "Taurine & guarana",
    description:
      "La recette signature : un shot net et franc, zéro sucre, 200 mg de caféine par canette. L'énergie sans le crash.",
    image: "/assets/demos/volt/original.webp",
    accentText: "text-sky-400",
    glow: "shadow-[0_0_90px_-10px_rgba(56,189,248,0.6)]",
    pill: "bg-sky-400 text-sky-950",
    halo: "from-sky-500/25",
  },
  {
    id: "citrus",
    nom: "Citron Givré",
    sousTitre: "Citron vert & yuzu",
    description:
      "L'acidité du citron vert pressé, la fraîcheur du yuzu japonais. Le coup de fouet le plus vif de la gamme.",
    image: "/assets/demos/volt/citrus.webp",
    accentText: "text-lime-400",
    glow: "shadow-[0_0_90px_-10px_rgba(163,230,53,0.55)]",
    pill: "bg-lime-400 text-lime-950",
    halo: "from-lime-500/25",
  },
  {
    id: "berry",
    nom: "Baies Noires",
    sousTitre: "Mûre & cassis",
    description:
      "Un fruit noir profond, presque velouté, relevé d'une pointe de framboise. L'énergie côté obscur.",
    image: "/assets/demos/volt/berry.webp",
    accentText: "text-fuchsia-400",
    glow: "shadow-[0_0_90px_-10px_rgba(232,121,249,0.55)]",
    pill: "bg-fuchsia-400 text-fuchsia-950",
    halo: "from-fuchsia-500/25",
  },
];

export const NUTRITION: { label: string; value: string }[] = [
  { label: "Énergie", value: "5 kcal / 100 ml" },
  { label: "Sucres", value: "0 g" },
  { label: "Caféine", value: "32 mg / 100 ml" },
  { label: "Taurine", value: "400 mg / 100 ml" },
  { label: "Vitamines B3 · B6 · B12", value: "100 % des AJR" },
];

export const MARQUEE = [
  "Zéro sucre",
  "200 mg de caféine",
  "100 % vegan",
  "Fabriqué en France",
  "Canette recyclable à l'infini",
];
