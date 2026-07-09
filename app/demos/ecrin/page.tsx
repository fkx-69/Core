import type { Metadata } from "next";
import Site from "@/components/demos/sites/ecrin/Site";

export const metadata: Metadata = {
  title: { absolute: "L'Écrin — Salon de beauté au Plateau, Abidjan" },
  description:
    "Salon de beauté haut de gamme au Plateau : coiffure, soins et onglerie sur rendez-vous. Réservez votre créneau en ligne en trois étapes.",
};

export default function Page() {
  return <Site />;
}
