"use client";

import { useSyncExternalStore } from "react";

/**
 * Suit une media query côté client. Rend `false` au SSR et pendant
 * l'hydratation (les scènes desktop sont prérendues), puis la vraie valeur —
 * les composants ne s'en servent que pour décider quoi MONTER, l'affichage
 * des cadres restant piloté par CSS pour éviter tout layout shift.
 */
export default function useIsMobile(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
