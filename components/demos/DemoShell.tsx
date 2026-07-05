"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Badge from "@/components/ui/Badge";

/**
 * Enveloppe commune des démos : description de ce que Core a « livré »,
 * stack simulée, et bouton de réinitialisation. Le reset remonte la démo
 * via un changement de `key` — l'état repart de zéro sans logique dédiée.
 */
export default function DemoShell({
  title,
  description,
  stack,
  children,
}: {
  title: string;
  description: string;
  stack: string[];
  children: React.ReactNode;
}) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Réinitialiser la démo
        </button>
      </div>
      <div key={resetKey}>{children}</div>
    </div>
  );
}
