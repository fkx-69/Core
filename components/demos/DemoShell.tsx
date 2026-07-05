"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
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
  illustration?: StaticImageData;
  children: React.ReactNode;
}) {
  const [resetKey, setResetKey] = useState(0);
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`grid items-start gap-10 ${
        flip
          ? "lg:grid-cols-[1fr_1.7fr]"
          : "lg:grid-cols-[1.7fr_1fr]"
      }`}
    >
      <div key={resetKey} className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        {children}
      </div>
      <div className={`lg:sticky lg:top-24 ${flip ? "lg:order-1" : ""}`}>
        {illustration && (
          <div className="mb-6 aspect-video relative w-full">
            <Image
              src={illustration}
              alt=""
              fill
              className="object-contain"
              aria-hidden
            />
          </div>
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Démo {numeral} — {kind}
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Réinitialiser la démo
        </button>
        <p className="mt-6 text-sm text-muted">
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
