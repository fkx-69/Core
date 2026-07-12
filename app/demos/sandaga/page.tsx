import type { Metadata } from "next";
import SandagaApp from "@/components/demos/apps/sandaga/App";

export const metadata: Metadata = {
  title: { absolute: "Pressing Sandaga — Gestion d’atelier" },
  description: "Application de comptoir pour suivre les commandes et la caisse d’un pressing à Dakar.",
};

export default function Page() {
  return <SandagaApp />;
}
