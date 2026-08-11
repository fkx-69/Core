import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * Typographies propres à la marque Maison Élixir, chargées via next/font.
 * Les variables CSS sont posées sur le root de <Site /> puis consommées via
 * des classes arbitraires `[font-family:var(--font-elixir-…)]`.
 */

/** Serif haute couture — titres, grands nombres, noms de parfums, récits. */
export const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-elixir-display",
  display: "swap",
  preload: false,
});

/** Sans géométrique — capitales espacées, libellés, prix, navigation. */
export const microSans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-elixir-sans",
  display: "swap",
  preload: false,
});
