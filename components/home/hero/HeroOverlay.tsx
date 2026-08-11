"use client";

import DemoOverlay from "@/components/demos/DemoOverlay";
import { SITE_COMPONENTS } from "./demoRegistry";
import { HERO_SITES, type HeroSiteId } from "./sites";

export default function HeroOverlay({
  active,
  onClose,
  onSelect,
}: {
  active: HeroSiteId;
  onClose: () => void;
  onSelect: (id: HeroSiteId) => void;
}) {
  const site = HERO_SITES.find((candidate) => candidate.id === active) ?? HERO_SITES[0];
  const ActiveSite = SITE_COMPONENTS[active];

  return (
    <DemoOverlay
      title={site.nom}
      onClose={onClose}
      switcher={
        <div
          role="group"
          aria-label="Changer de site vitrine"
          className="scrollbar-none flex gap-2 overflow-x-auto"
        >
          {HERO_SITES.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={candidate.id === active}
              onClick={() => onSelect(candidate.id)}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                candidate.id === active
                  ? "border-transparent bg-white text-zinc-950"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {candidate.nom}
            </button>
          ))}
        </div>
      }
    >
      <ActiveSite embedded />
    </DemoOverlay>
  );
}
