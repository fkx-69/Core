"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock, Maximize2 } from "lucide-react";

/**
 * Largeur virtuelle du rendu : un vrai viewport de téléphone. La démo se met
 * en page pour 390 px (comme dans l'overlay plein écran) puis la miniature
 * est obtenue par scale — sans ça, le site se rendrait à la largeur réelle du
 * cadre (~280 px), un cran SOUS le layout téléphone : typo disproportionnée,
 * libellés qui replient, rien à voir avec le rendu réel.
 */
const VIRTUAL_WIDTH = 390;

/**
 * Aperçu mobile d'une démo au format téléphone : le vrai composant est rendu
 * inerte (aucun double scroll, aucun focus volé) à 390 px de large puis réduit
 * à l'échelle du cadre — une vraie miniature d'écran, fidèle à ce que le
 * plein écran ouvrira. Le déclencheur est un calque interactif posé sur tout
 * le cadre — et non un contrôle englobant, qui imbriquerait les contrôles de
 * la démo dans un autre contrôle. Le dimensionnement externe (aspect ratio,
 * hauteur) vient du parent via `className`.
 */
export default function PhonePreview({
  label,
  url,
  onOpen,
  href,
  className = "",
  children,
}: {
  /** Nom de la démo, pour le libellé accessible du contrôle. */
  label: string;
  /** Fausse URL affichée dans la fine barre du haut. */
  url?: string;
  /** Action locale, par exemple l'ouverture d'un overlay. */
  onOpen?: () => void;
  /** Route complète à ouvrir dans un nouvel onglet. */
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(
        Math.round((entry.contentRect.width / VIRTUAL_WIDTH) * 1000) / 1000,
      );
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const actionClassName =
    "group absolute inset-0 flex items-end justify-center rounded-[inherit] pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
  const actionContent = (
    <span
      aria-hidden
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-zinc-950/70 px-4 py-2 text-xs font-medium text-white backdrop-blur transition group-active:scale-95"
    >
      <Maximize2 className="h-3.5 w-3.5" aria-hidden />
      Ouvrir l’application en entier
    </span>
  );

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface-raised shadow-raised ${className}`}
    >
      {url && (
        <span className="flex items-center justify-center gap-1.5 border-b border-line bg-surface px-3 py-1.5 text-[10px] text-muted">
          <Lock className="h-2.5 w-2.5 shrink-0" aria-hidden />
          <span className="truncate">{url}</span>
        </span>
      )}
      <div ref={frameRef} inert className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="@container isolate absolute left-0 top-0 origin-top-left"
          style={{
            width: VIRTUAL_WIDTH,
            transform: scale ? `scale(${scale})` : undefined,
            height: scale ? `calc(100% / ${scale})` : "100%",
          }}
        >
          {children}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/50 to-transparent"
      />
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener"
          prefetch={false}
          aria-label={`Ouvrir l’application en entier — ${label}`}
          className={actionClassName}
        >
          {actionContent}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Ouvrir l’application en entier — ${label}`}
          className={actionClassName}
        >
          {actionContent}
        </button>
      )}
    </div>
  );
}
