import type { Metadata } from "next";
import LumenApp from "@/components/demos/apps/lumen/App";

export const metadata: Metadata = {
  title: { absolute: "Lumen — Gestion de boutique à Dakar" },
  description: "Application de gestion des ventes et des stocks d’une boutique de décoration dakaroise.",
};

export default function Page() {
  return <LumenApp />;
}
