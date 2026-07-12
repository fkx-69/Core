import type { Metadata } from "next";
import DemoBadge from "@/components/demos/sites/DemoBadge";

export const metadata: Metadata = {
  // Produits fictifs de démonstration : jamais indexés.
  robots: { index: false, follow: false },
};

/**
 * Segment /demos : les produits de démonstration se présentent comme des
 * interfaces autonomes, sans le chrome Core — seule une pastille flottante
 * ramène au portfolio.
 */
export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="@container flex-1">
      {children}
      <DemoBadge />
    </div>
  );
}
