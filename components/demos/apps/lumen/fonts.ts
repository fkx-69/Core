import { Fraunces, Manrope } from "next/font/google";

export const lumenBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lumen-body",
});

// Serif éditoriale : c'est elle qui porte l'identité « galerie » de Lumen
// (titres, chiffres clés, wordmark italique).
export const lumenDisplay = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-lumen-display",
});
