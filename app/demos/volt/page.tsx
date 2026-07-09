import type { Metadata } from "next";
import Site from "@/components/demos/sites/volt/Site";

export const metadata: Metadata = {
  title: { absolute: "VOLT — L'énergie d'Abidjan" },
  description:
    "Boisson énergisante née à Abidjan : trois saveurs, des ingrédients d'Afrique de l'Ouest et une énergie 100 % locale. Disponible en superettes, stations et maquis.",
};

export default function Page() {
  return <Site />;
}
