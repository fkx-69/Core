"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, RotateCcw } from "lucide-react";
import Badge from "@/components/ui/Badge";

/**
 * Enveloppe commune des démos : la démo occupe les deux tiers, la légende
 * (numéral, description, stack, reset, lien service) le tiers restant — côté
 * alterné par `flip` (réf 7). Le reset remonte la démo via un changement de
 * `key` — l'état repart de zéro sans logique dédiée.
 */
export default function DemoShell({
  index,
  kind,
  title,
  description,
  stack,
  serviceHref,
  serviceLabel,
  flip = false,
  illustration,
  switcher,
  children,
}: {
  index: number;
  kind: string;
  title: string;
  description: string;
  stack: string[];
  serviceHref: string;
  serviceLabel: string;
  flip?: boolean;
  illustration?: string;
  /** Sélecteur de projet affiché au-dessus de la démo (catégories multi-démos). */
  switcher?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [resetKey, setResetKey] = useState(0);
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`grid items-start gap-6 md:gap-10 ${
        flip
          ? "lg:grid-cols-[1fr_1.7fr]"
          : "lg:grid-cols-[1.7fr_1fr]"
      }`}
    >
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        {switcher}
        <div key={resetKey}>{children}</div>
      </div>
      <div className={`min-w-0 lg:sticky lg:top-24 ${flip ? "lg:order-1" : ""}`}>
        {illustration && (
          <div className="relative mx-auto mb-4 aspect-video w-full max-w-56 md:mb-6 md:max-w-none">
            <Image
              src={illustration}
              alt=""
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-contain"
              aria-hidden
            />
          </div>
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {numeral} — {kind}
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <details className="group/details mt-5 overflow-hidden rounded-card border border-line bg-surface-raised md:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold marker:hidden">
            Détails du projet
            <span
              aria-hidden
              className="text-xl font-light text-accent transition group-open/details:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-line px-4 pb-4">
            <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Ce projet illustre notre service
            </p>
            <Link
              href={serviceHref}
              className="mt-1 inline-flex min-h-11 items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {serviceLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </details>
        <div className="hidden md:block">
          <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:mt-8 md:min-h-0 md:w-auto md:justify-start"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Réinitialiser la démo
        </button>
        <p className="mt-6 hidden text-sm text-muted md:block">
          Ce projet illustre notre service{" "}
          <Link
            href={serviceHref}
            className="inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            {serviceLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </p>
      </div>
    </div>
  );
}
