"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarCheck, Check, ChevronLeft, Sparkles } from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import {
  CATEGORIES_PRESTATIONS,
  CATEGORIE_IMAGES,
  CRENEAUX,
  CRENEAUX_PRIS,
  JOURS,
  PRESTATIONS,
  formatEur,
  type CategoriePrestation,
  type Prestation,
} from "@/components/demos/salon/data";

type Section = "accueil" | "prestations" | "reserver";
type Jour = (typeof JOURS)[number];

/**
 * Démo « Site vitrine » : salon de beauté. Thème rosé propre à la marque,
 * carte des prestations par univers et vraie prise de rendez-vous en trois
 * étapes (prestation → créneau → confirmation).
 */
export default function SalonDemo() {
  const [section, setSection] = useState<Section>("accueil");
  const [categorie, setCategorie] = useState<CategoriePrestation>("coiffure");

  // Réservation en cours
  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [jour, setJour] = useState<Jour | null>(null);
  const [creneau, setCreneau] = useState<string | null>(null);
  const [confirme, setConfirme] = useState(false);

  function startBooking(p?: Prestation) {
    setPrestation(p ?? null);
    setJour(null);
    setCreneau(null);
    setConfirme(false);
    setSection("reserver");
  }

  const etape = confirme ? 3 : prestation === null ? 1 : 2;

  const navButton = (target: Section, label: string) => (
    <button
      type="button"
      onClick={() => (target === "reserver" ? startBooking() : setSection(target))}
      aria-current={section === target ? "page" : undefined}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        section === target
          ? "bg-rose-100 text-rose-900"
          : "text-stone-500 hover:text-stone-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <BrowserFrame url="https://lecrin-beaute.fr">
      <div className="flex min-h-[560px] flex-col bg-[#fdf9f7] text-stone-800">
        {/* En-tête du salon */}
        <header className="flex items-center justify-between border-b border-rose-100 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-1.5 font-display text-lg font-bold tracking-tight text-stone-900">
            <Sparkles className="h-4 w-4 text-rose-400" aria-hidden />
            L&apos;Écrin
          </p>
          <nav aria-label="Navigation du site L'Écrin" className="flex items-center gap-1">
            {navButton("accueil", "Accueil")}
            {navButton("prestations", "Prestations")}
            {navButton("reserver", "Réserver")}
          </nav>
        </header>

        {/* Accueil */}
        {section === "accueil" && (
          <div className="screen-in flex flex-1 flex-col p-4 sm:p-6">
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <Image
                src="/assets/demos/salon/hero.webp"
                alt="Intérieur du salon L'Écrin"
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-stone-950/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-200">
                  Salon de beauté · Bordeaux
                </p>
                <h4 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  Prenez une heure pour vous
                </h4>
                <p className="mt-1.5 max-w-md text-sm text-white/85">
                  Coiffure, ongles et soins du visage dans un écrin de douceur,
                  au cœur des Chartrons.
                </p>
                <button
                  type="button"
                  onClick={() => startBooking()}
                  className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-rose-50"
                >
                  Réserver un rendez-vous
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
              {[
                "Produits clean & vegan",
                "Sans engagement, annulation 24 h",
                "Thé et douceurs offerts",
              ].map((point) => (
                <p
                  key={point}
                  className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-4 py-3"
                >
                  <Check className="h-4 w-4 shrink-0 text-rose-400" aria-hidden />
                  {point}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Prestations */}
        {section === "prestations" && (
          <div className="screen-in flex-1 p-4 sm:p-6">
            <div role="tablist" aria-label="Univers de prestations" className="flex gap-2">
              {(Object.keys(CATEGORIES_PRESTATIONS) as CategoriePrestation[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={categorie === cat}
                    onClick={() => setCategorie(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      categorie === cat
                        ? "bg-stone-900 text-white"
                        : "border border-rose-200 bg-white text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {CATEGORIES_PRESTATIONS[cat]}
                  </button>
                ),
              )}
            </div>
            <div
              key={categorie}
              className="screen-in mt-4 grid gap-4 sm:grid-cols-[1fr_1.3fr]"
            >
              <div className="relative min-h-44 overflow-hidden rounded-2xl">
                <Image
                  src={CATEGORIE_IMAGES[categorie]}
                  alt={`Prestation ${CATEGORIES_PRESTATIONS[categorie]} au salon`}
                  fill
                  sizes="(min-width: 640px) 35vw, 90vw"
                  className="object-cover"
                />
              </div>
              <ul className="space-y-2.5">
                {PRESTATIONS[categorie].map((p) => (
                  <li
                    key={p.nom}
                    className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{p.nom}</p>
                      <p className="text-xs text-stone-500">
                        {p.duree} · {formatEur(p.prix)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startBooking(p)}
                      className="shrink-0 rounded-full bg-rose-100 px-3.5 py-1.5 text-xs font-semibold text-rose-900 transition hover:bg-rose-200"
                    >
                      Réserver
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Réservation */}
        {section === "reserver" && (
          <div className="screen-in flex-1 p-4 sm:p-6">
            {/* Fil d'étapes */}
            <ol
              aria-label="Étapes de la réservation"
              className="flex items-center gap-2 text-[11px] font-medium text-stone-500"
            >
              {["Prestation", "Créneau", "Confirmation"].map((label, i) => {
                const num = i + 1;
                const done = etape > num;
                const current = etape === num;
                return (
                  <li key={label} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden className="h-px w-6 bg-rose-200" />}
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                        current
                          ? "bg-stone-900 text-white"
                          : done
                            ? "bg-rose-100 text-rose-900"
                            : "bg-white text-stone-400 border border-rose-100"
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" aria-hidden /> : `${num}.`}
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Étape 1 : choix de la prestation */}
            {etape === 1 && (
              <div className="screen-in mt-5 space-y-4">
                {(Object.keys(PRESTATIONS) as CategoriePrestation[]).map((cat) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      {CATEGORIES_PRESTATIONS[cat]}
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {PRESTATIONS[cat].map((p) => (
                        <button
                          key={p.nom}
                          type="button"
                          onClick={() => setPrestation(p)}
                          className="rounded-xl border border-rose-100 bg-white px-3.5 py-2.5 text-left transition hover:border-rose-300"
                        >
                          <span className="block text-sm font-semibold text-stone-900">
                            {p.nom}
                          </span>
                          <span className="block text-xs text-stone-500">
                            {p.duree} · {formatEur(p.prix)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Étape 2 : choix du créneau */}
            {etape === 2 && prestation && (
              <div className="screen-in mt-5">
                <button
                  type="button"
                  onClick={() => setPrestation(null)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 transition hover:text-stone-800"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  Changer de prestation
                </button>
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-stone-900">{prestation.nom}</span>{" "}
                  <span className="text-stone-500">
                    · {prestation.duree} · {formatEur(prestation.prix)}
                  </span>
                </p>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {JOURS.map((j) => (
                    <button
                      key={j}
                      type="button"
                      aria-pressed={jour === j}
                      onClick={() => {
                        setJour(j);
                        setCreneau(null);
                      }}
                      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        jour === j
                          ? "bg-stone-900 text-white"
                          : "border border-rose-200 bg-white text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>

                {jour ? (
                  <div key={jour} className="screen-in mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {CRENEAUX.map((c) => {
                      const pris = CRENEAUX_PRIS[jour].includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          disabled={pris}
                          aria-pressed={creneau === c}
                          onClick={() => setCreneau(c)}
                          className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                            pris
                              ? "cursor-not-allowed border-rose-50 bg-rose-50/50 text-stone-300 line-through"
                              : creneau === c
                                ? "border-stone-900 bg-stone-900 text-white"
                                : "border-rose-100 bg-white text-stone-700 hover:border-rose-300"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-stone-500">
                    Choisissez un jour pour voir les créneaux disponibles.
                  </p>
                )}

                <button
                  type="button"
                  disabled={!jour || !creneau}
                  onClick={() => setConfirme(true)}
                  className="mt-5 w-full rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-stone-700 disabled:opacity-40"
                >
                  Confirmer le rendez-vous
                </button>
              </div>
            )}

            {/* Étape 3 : confirmation */}
            {etape === 3 && prestation && jour && creneau && (
              <div className="screen-in mt-8 flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
                  <CalendarCheck className="h-7 w-7 text-rose-500" aria-hidden />
                </span>
                <h4 className="mt-4 font-display text-xl font-bold text-stone-900">
                  C&apos;est noté !
                </h4>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-600">
                  Votre rendez-vous <strong>{prestation.nom}</strong> est réservé
                  le <strong>{jour} juillet</strong> à <strong>{creneau}</strong>.
                  Un SMS de rappel vous sera envoyé la veille.
                </p>
                <p className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs text-stone-500 border border-rose-100">
                  {prestation.duree} · {formatEur(prestation.prix)} — réglable au salon
                </p>
                <button
                  type="button"
                  onClick={() => startBooking()}
                  className="mt-6 text-xs font-semibold text-rose-500 underline decoration-rose-300 underline-offset-4 transition hover:text-rose-700"
                >
                  Prendre un autre rendez-vous
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
