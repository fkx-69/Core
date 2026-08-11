import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * Typographies de la marque « La Table Dorée ».
 * Les variables CSS sont posées sur le root de <Site /> et consommées via
 * des classes arbitraires `[font-family:var(--font-td-…)]`, afin de ne pas
 * toucher aux fontes globales de Core.
 */

/** Serif éditoriale — logotype, titres, chiffres de la carte. */
export const tdSerif = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-td-serif",
  display: "swap",
  preload: false,
});

/** Sans géométrique discrète — corps de texte, navigation, formulaires. */
export const tdSans = Jost({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-td-sans",
  display: "swap",
  preload: false,
});
