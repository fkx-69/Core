"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2 } from "lucide-react";

/**
 * Scène d'une démo web : ajoute un bouton « Plein écran » qui bascule le même
 * sous-arbre React en overlay fixe — la démo garde donc son état. Échap ferme,
 * le scroll de la page est gelé pendant l'overlay.
 */
export default function DemoStage({
  label,
  children,
}: {
  /** Nom de la démo, pour les libellés d'accessibilité. */
  label: string;
  children: React.ReactNode;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const toggle = (
    <button
      type="button"
      onClick={() => setFullscreen((f) => !f)}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs font-medium text-muted shadow-card transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {fullscreen ? (
        <>
          <Minimize2 className="h-3.5 w-3.5" aria-hidden />
          Quitter le plein écran
        </>
      ) : (
        <>
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          Plein écran
        </>
      )}
    </button>
  );

  if (!fullscreen) {
    return (
      <div>
        <div className="mb-3 flex justify-end">{toggle}</div>
        {children}
      </div>
    );
  }

  // Portal vers <body> : les ancêtres animés (Reveal pose un `translate`)
  // feraient sinon office de containing block pour cette position fixe.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Démo ${label} en plein écran`}
      className="fixed inset-0 z-[60] flex flex-col bg-background/95 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="mx-auto mb-3 flex w-full max-w-6xl items-center justify-between gap-4">
        <p className="truncate text-sm font-semibold text-muted">{label}</p>
        {toggle}
      </div>
      <div className="scrollbar-none mx-auto min-h-0 w-full max-w-6xl flex-1 overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body,
  );
}
