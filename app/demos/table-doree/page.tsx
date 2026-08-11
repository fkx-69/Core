import type { Metadata } from "next";
import Site from "@/components/demos/sites/table-doree/Site";

export const metadata: Metadata = {
  title: {
    absolute: "La Table Dorée — Démonstration de restaurant gastronomique",
  },
  description:
    "Démonstration conceptuelle d'une interface de restaurant gastronomique : menu, produits et réservation.",
};

export default function Page() {
  return <Site />;
}
