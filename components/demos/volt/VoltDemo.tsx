"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FlaskConical, MapPin, X, Zap } from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import { MARQUEE, NUTRITION, SAVEURS } from "@/components/demos/volt/data";

/**
 * Démo « Site vitrine » : marque de boisson énergisante. Thème sombre propre
 * à la marque (indépendant du thème du site), sélecteur de saveurs qui
 * rethème toute la page, panneau composition et bandeau défilant.
 */
export default function VoltDemo() {
  const [saveurId, setSaveurId] = useState(SAVEURS[0].id);
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const saveur = SAVEURS.find((s) => s.id === saveurId) ?? SAVEURS[0];

  // Échap ferme le panneau composition.
  useEffect(() => {
    if (!nutritionOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNutritionOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nutritionOpen]);

  // Le toast « revendeur » disparaît tout seul.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <BrowserFrame url="https://volt-energy.fr">
      <div className="relative flex min-h-[560px] flex-col overflow-hidden bg-zinc-950 text-zinc-100">
        {/* Halo coloré derrière le héros, suit la saveur active */}
        <div
          aria-hidden
          className={`absolute right-0 top-0 h-full w-2/3 bg-radial ${saveur.halo} to-transparent transition-colors duration-500`}
        />

        {/* En-tête de la marque */}
        <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
          <p className="flex items-center gap-1 font-display text-xl font-bold tracking-tight">
            <Zap className={`h-5 w-5 ${saveur.accentText}`} aria-hidden />
            VOLT
          </p>
          <button
            type="button"
            onClick={() => setToast(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Trouver un revendeur
          </button>
        </header>

        {/* Héros : copie à gauche, canette à droite */}
        <div className="relative z-10 grid flex-1 items-center gap-6 px-5 pb-6 sm:grid-cols-[1.1fr_1fr] sm:px-8">
          <div key={`copy-${saveur.id}`} className="screen-in">
            <p
              className={`text-xs font-bold uppercase tracking-[0.3em] ${saveur.accentText}`}
            >
              {saveur.sousTitre}
            </p>
            <h4 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
              L&apos;énergie
              <br />
              brute<span className={saveur.accentText}>.</span>
            </h4>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              {saveur.description}
            </p>

            {/* Sélecteur de saveurs */}
            <div
              role="tablist"
              aria-label="Choisir une saveur"
              className="mt-6 flex flex-wrap gap-2"
            >
              {SAVEURS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={s.id === saveurId}
                  onClick={() => setSaveurId(s.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                    s.id === saveurId
                      ? s.pill
                      : "border border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-white"
                  }`}
                >
                  {s.nom}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setNutritionOpen(true)}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition hover:text-white hover:decoration-zinc-300"
            >
              <FlaskConical className="h-3.5 w-3.5" aria-hidden />
              Voir la composition
            </button>
          </div>

          <div
            key={`can-${saveur.id}`}
            className="screen-in relative mx-auto aspect-square w-full max-w-64 sm:max-w-xs"
          >
            <Image
              src={saveur.image}
              alt={`Canette VOLT ${saveur.nom}`}
              fill
              sizes="(min-width: 640px) 320px, 256px"
              className={`rounded-3xl object-cover ${saveur.glow} transition-shadow duration-500`}
            />
          </div>
        </div>

        {/* Bandeau défilant */}
        <div
          aria-hidden
          className="relative z-10 overflow-hidden border-t border-zinc-800 bg-zinc-900/60 py-2.5"
        >
          <div className="animate-marquee flex w-max">
            {[0, 1].map((copy) => (
              <p key={copy} className="flex shrink-0">
                {MARQUEE.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500"
                  >
                    <Zap className={`h-3 w-3 ${saveur.accentText}`} />
                    {item}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>

        {/* Panneau composition */}
        {nutritionOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Composition de VOLT ${saveur.nom}`}
            className="absolute inset-0 z-20 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center sm:p-8"
          >
            <div className="screen-in w-full rounded-t-2xl border border-zinc-800 bg-zinc-900 p-6 sm:max-w-md sm:rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-[11px] font-bold uppercase tracking-[0.25em] ${saveur.accentText}`}
                  >
                    VOLT {saveur.nom}
                  </p>
                  <h5 className="mt-1 font-display text-lg font-bold">
                    Composition · 250 ml
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setNutritionOpen(false)}
                  aria-label="Fermer la composition"
                  className="rounded-full border border-zinc-700 p-1.5 text-zinc-400 transition hover:border-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <dl className="mt-4 divide-y divide-zinc-800">
                {NUTRITION.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <dt className="text-sm text-zinc-400">{row.label}</dt>
                    <dd className="text-sm font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
                Teneur élevée en caféine — déconseillé aux enfants et aux
                femmes enceintes. À consommer avec modération.
              </p>
            </div>
          </div>
        )}

        {/* Toast revendeur */}
        {toast && (
          <p
            role="status"
            className="screen-in absolute bottom-14 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 shadow-overlay"
          >
            Bientôt disponible près de chez vous ⚡
          </p>
        )}
      </div>
    </BrowserFrame>
  );
}
