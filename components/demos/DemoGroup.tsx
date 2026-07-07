"use client";

import { useState } from "react";
import DemoShell from "@/components/demos/DemoShell";
import DemoStage from "@/components/demos/DemoStage";
import LazyDemo, { type DemoName } from "@/components/demos/LazyDemo";

export type DemoEntry = {
  demo: DemoName;
  title: string;
  description: string;
  stack: string[];
  /** Propose le plein écran (sites & applis web — inutile pour les mockups mobiles). */
  fullscreen?: boolean;
};

/**
 * Groupe de démos d'une même catégorie : un sélecteur en pilules bascule
 * entre les projets, le DemoShell affiche la légende du projet actif.
 */
export default function DemoGroup({
  index,
  kind,
  entries,
  serviceHref,
  serviceLabel,
  flip = false,
  illustration,
}: {
  index: number;
  kind: string;
  entries: DemoEntry[];
  serviceHref: string;
  serviceLabel: string;
  flip?: boolean;
  illustration?: string;
}) {
  const [active, setActive] = useState(0);
  const entry = entries[active];

  const demo = (
    <div key={entry.demo} className="screen-in">
      <LazyDemo demo={entry.demo} />
    </div>
  );

  return (
    <DemoShell
      index={index}
      kind={kind}
      title={entry.title}
      description={entry.description}
      stack={entry.stack}
      serviceHref={serviceHref}
      serviceLabel={serviceLabel}
      flip={flip}
      illustration={illustration}
      switcher={
        entries.length > 1 ? (
          <div
            role="tablist"
            aria-label={`Projets de la catégorie ${kind}`}
            className="mb-4 flex flex-wrap gap-2"
          >
            {entries.map((e, i) => (
              <button
                key={e.demo}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  i === active
                    ? "bg-accent text-accent-contrast"
                    : "border border-line bg-surface-raised text-muted hover:border-accent/50 hover:text-foreground"
                }`}
              >
                {e.title}
              </button>
            ))}
          </div>
        ) : undefined
      }
    >
      {entry.fullscreen ? (
        <DemoStage label={entry.title}>{demo}</DemoStage>
      ) : (
        demo
      )}
    </DemoShell>
  );
}
