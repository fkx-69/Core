"use client";

import { useRef } from "react";
import { Pause, Play } from "lucide-react";
import { HERO_SITES, type HeroSiteId } from "./sites";
import type { Autoplay } from "./HeroShowcase";

/**
 * Onglets du héro-scène : tablist accessible à activation manuelle (les
 * flèches déplacent le focus, Entrée/Espace active — on ne télécharge pas un
 * bundle de démo au simple parcours clavier). L'onglet actif porte la couleur
 * de la marque et, pendant l'auto-rotation, la barre de progression qui SERT
 * de minuteur : son animationend déclenche le passage à la démo suivante.
 * Toutes les couleurs viennent des variables --hero-* du thème actif.
 */
export default function HeroTabs({
  active,
  autoplay,
  onSelect,
  onProgressEnd,
  onToggleAutoplay,
}: {
  active: HeroSiteId;
  autoplay: Autoplay;
  onSelect: (id: HeroSiteId) => void;
  onProgressEnd: () => void;
  onToggleAutoplay: () => void;
}) {
  const refs = useRef<Partial<Record<HeroSiteId, HTMLButtonElement | null>>>({});
  const enabled = autoplay === "playing" || autoplay === "paused";

  function handleKey(e: React.KeyboardEvent<HTMLButtonElement>, id: HeroSiteId) {
    const order = HERO_SITES.map((s) => s.id);
    const i = order.indexOf(id);
    let target: HeroSiteId | undefined;
    if (e.key === "ArrowRight") target = order[(i + 1) % order.length];
    else if (e.key === "ArrowLeft") target = order[(i - 1 + order.length) % order.length];
    else if (e.key === "Home") target = order[0];
    else if (e.key === "End") target = order[order.length - 1];
    if (target) {
      e.preventDefault();
      refs.current[target]?.focus();
    }
  }

  return (
    <div className="mt-7 flex w-full items-center gap-3 sm:w-auto sm:justify-center">
      <div
        role="tablist"
        aria-label="Démos de sites vitrines"
        className="scrollbar-none -mx-4 flex min-w-0 snap-x gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        {HERO_SITES.map((s) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[s.id] = el;
            }}
            type="button"
            role="tab"
            id={`hero-tab-${s.id}`}
            aria-selected={s.id === active}
            aria-controls={`hero-panel-${s.id}`}
            tabIndex={s.id === active ? 0 : -1}
            title={s.secteur}
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => handleKey(e, s.id)}
            className={`relative shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hero-accent)] ${
              s.id === active
                ? "border-transparent bg-[color:var(--hero-accent)] text-[color:var(--hero-accent-ink)]"
                : "border-[color:var(--hero-line)] bg-[color:var(--hero-surface)] text-[color:var(--hero-muted)] hover:border-[color:var(--hero-accent)] hover:text-[color:var(--hero-ink)]"
            }`}
          >
            {s.nom}
            {s.id === active && enabled && (
              <span
                aria-hidden
                onAnimationEnd={onProgressEnd}
                className="hero-progress absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-current opacity-40"
                style={{
                  animationPlayState: autoplay === "playing" ? "running" : "paused",
                }}
              />
            )}
          </button>
        ))}
      </div>
      {autoplay !== "idle" && (
        <button
          type="button"
          onClick={onToggleAutoplay}
          aria-pressed={enabled}
          aria-label={
            enabled
              ? "Suspendre le défilement automatique des démos"
              : "Reprendre le défilement automatique des démos"
          }
          title={enabled ? "Suspendre le défilement" : "Reprendre le défilement"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--hero-line)] bg-[color:var(--hero-surface)] text-[color:var(--hero-muted)] transition-colors duration-500 hover:border-[color:var(--hero-accent)] hover:text-[color:var(--hero-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hero-accent)]"
        >
          {enabled ? (
            <Pause className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Play className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      )}
    </div>
  );
}
