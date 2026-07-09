import type { Metadata } from "next";
import Site from "@/components/demos/sites/elixir/Site";

export const metadata: Metadata = {
  title: { absolute: "Maison Élixir — Haute parfumerie d'Abidjan" },
  description:
    "Maison de parfumerie fine d'Abidjan : trois eaux de parfum composées à partir des matières d'Afrique de l'Ouest — vétiver, hibiscus, karité. Boutique à Cocody.",
};

export default function Page() {
  return <Site />;
}
