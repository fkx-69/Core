import { Fraunces, Karla } from "next/font/google";

/**
 * Typographies propres à la marque « L'Écrin ».
 * Les variables sont posées sur le root de Site.tsx et consommées via des
 * classes arbitraires `[font-family:var(--font-ecrin-…)]` — aucun token Core.
 */

/** Serif expressive et douce, réservée aux titres (élégance de boudoir). */
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-ecrin-serif",
});

/** Sans-serif ronde et propre pour le texte courant et l'interface. */
export const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ecrin-sans",
});
