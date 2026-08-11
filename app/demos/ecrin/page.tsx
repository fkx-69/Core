import type { Metadata } from "next";
import Site from "@/components/demos/sites/ecrin/Site";

export const metadata: Metadata = {
  title: { absolute: "L'Écrin — Démonstration de salon de beauté" },
  description:
    "Démonstration conceptuelle d'une interface de salon de beauté : coiffure, soins et onglerie sur rendez-vous.",
};

export default function Page() {
  return <Site />;
}
