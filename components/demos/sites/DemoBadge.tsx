import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Pastille flottante des pages /demos/* : rappelle discrètement que le site
 * est une démo Core et ramène au portfolio. Volontairement neutre pour ne
 * pas polluer la direction artistique du site fictif.
 */
export default function DemoBadge() {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-50">
      <Link
        href="/portfolio#demo-vitrine"
        aria-label="Retour au portfolio Core"
        className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-neutral-950/85 text-xs font-medium text-neutral-100 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] backdrop-blur transition hover:bg-neutral-950 sm:h-auto sm:w-auto sm:gap-2 sm:py-2 sm:pl-3 sm:pr-4"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          aria-hidden
        />
        <span className="hidden sm:inline">
          Site fictif — démo{" "}
          <span className="font-semibold text-indigo-300">Core</span>
        </span>
      </Link>
    </div>
  );
}
