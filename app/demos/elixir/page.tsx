import type { Metadata } from "next";
import Site from "@/components/demos/sites/elixir/Site";

export const metadata: Metadata = {
  title: { absolute: "Maison Élixir — Démonstration de haute parfumerie" },
  description:
    "Démonstration conceptuelle d'une maison de parfumerie fine : trois eaux de parfum et une collection éditoriale.",
};

export default function Page() {
  return <Site />;
}
