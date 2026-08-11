import { Anton, Archivo } from "next/font/google";

/**
 * Typographies propres à la marque VOLT, indépendantes de celles de Core :
 * Anton pour les titres massifs en capitales, Archivo pour le texte courant.
 * Les variables sont posées sur le root de Site.tsx et consommées via
 * `[font-family:var(--font-volt-…)]`.
 */
export const voltDisplay = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-volt-display",
});

export const voltBody = Archivo({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-volt-body",
});
