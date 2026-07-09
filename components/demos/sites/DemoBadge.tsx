import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Pastille flottante des pages /demos/* : rappelle discrètement que le site
 * est une démo Core et ramène au portfolio. Volontairement neutre pour ne
 * pas polluer la direction artistique du site fictif.
 */
export default function DemoBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Link
        href="/portfolio#demo-vitrine"
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/85 py-2 pl-3 pr-4 text-xs font-medium text-neutral-100 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] backdrop-blur transition hover:bg-neutral-950"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          aria-hidden
        />
        <span>
          Site fictif — démo{" "}
          <span className="font-semibold text-indigo-300">Core</span>
        </span>
      </Link>
    </div>
  );
}
