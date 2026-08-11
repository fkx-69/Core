"use client";

import { useState } from "react";
import DemoShell from "@/components/demos/DemoShell";
import LazyDemo, { type DemoName } from "@/components/demos/LazyDemo";

export type DemoEntry = {
  demo: DemoName;
  title: string;
  description: string;
  stack: string[];
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
            role="group"
            aria-label={`Projets de la catégorie ${kind}`}
            className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {entries.map((e, i) => (
              <button
                key={e.demo}
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:min-h-0 sm:px-4 sm:py-1.5 ${
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
      {demo}
    </DemoShell>
  );
}
