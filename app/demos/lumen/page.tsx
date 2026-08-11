import type { Metadata } from "next";
import LumenApp from "@/components/demos/apps/lumen/App";

export const metadata: Metadata = {
  title: { absolute: "Lumen — Démonstration de gestion de boutique" },
  description: "Démonstration conceptuelle d'une application de gestion des ventes et des stocks.",
};

export default function Page() {
  return <LumenApp />;
}
