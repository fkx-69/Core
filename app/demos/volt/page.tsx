import type { Metadata } from "next";
import Site from "@/components/demos/sites/volt/Site";

export const metadata: Metadata = {
  title: { absolute: "VOLT — Démonstration de marque de boisson" },
  description:
    "Démonstration conceptuelle d'une marque de boisson énergisante : trois saveurs et une identité visuelle néon.",
};

export default function Page() {
  return <Site />;
}
