import type { Metadata } from "next";
import Site from "@/components/demos/sites/table-doree/Site";

export const metadata: Metadata = {
  title: {
    absolute: "La Table Dorée — Restaurant gastronomique aux Almadies, Dakar",
  },
  description:
    "Cuisine sénégalaise de saison, produits locaux et cave choisie, au cœur des Almadies. Réservez votre table au +221 33 869 12 40.",
};

export default function Page() {
  return <Site />;
}
