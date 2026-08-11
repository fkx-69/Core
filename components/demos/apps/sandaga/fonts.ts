import { Archivo, IBM_Plex_Mono } from "next/font/google";

export const sandagaBody = Archivo({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-sandaga-body",
});

export const sandagaDisplay = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800", "900"],
  preload: false,
  variable: "--font-sandaga-display",
});

// Le mono est le marqueur « ticket » : numéros, montants, heures, dates, téléphones.
export const sandagaMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
  preload: false,
  variable: "--font-sandaga-mono",
});
