"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Plein écran mobile d'une démo : <dialog> natif (top layer — insensible aux
 * transforms des ancêtres type Reveal, fond rendu inerte par showModal),
 * barre de fermeture en haut, zone @container scrollable où le composant démo
 * adopte de lui-même son layout compact. Le dvh est légal ici : l'overlay
 * appartient au shell Core, pas aux démos. Une entrée d'historique est
 * poussée à l'ouverture pour que le bouton retour (Android) ferme l'overlay
 * au lieu de quitter la page.
 */
export default function DemoOverlay({
  title,
  onClose,
  switcher,
  children,
}: {
  title: string;
  onClose: () => void;
  /** Barre optionnelle sous la démo (ex. pilules de changement de marque). */
  switcher?: React.ReactNode;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // L'entrée n'est poussée que si elle n'existe pas déjà et n'est retirée que
  // dans le chemin de fermeture explicite (handleClose) — jamais au cleanup :
  // un history.back() de cleanup se déclencherait au double-montage
  // StrictMode et refermerait l'overlay sitôt ouvert.
  useEffect(() => {
    if (!window.history.state?.coreDemoOverlay) {
      window.history.pushState({ coreDemoOverlay: true }, "");
    }
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /** Fermeture explicite (Fermer, Échap) : retire aussi l'entrée d'historique. */
  function handleClose() {
    if (window.history.state?.coreDemoOverlay) window.history.back();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-label={`Démo ${title} en plein écran`}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-zinc-950 p-0 backdrop:bg-transparent"
    >
      <div className="flex h-dvh flex-col">
        <div className="flex items-center justify-between gap-3 px-4 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] text-white">
          <p className="min-w-0 truncate text-sm text-zinc-300">
            Démo — <span className="font-medium text-white">{title}</span>
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-white transition hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-4 w-4" aria-hidden />
            Fermer
          </button>
        </div>
        <div className="@container isolate min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background">
          {children}
        </div>
        {switcher && (
          <div className="px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {switcher}
          </div>
        )}
      </div>
    </dialog>
  );
}
