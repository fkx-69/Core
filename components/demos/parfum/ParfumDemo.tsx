"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import {
  CONTENANCES,
  PARFUMS,
  formatEur,
  type Contenance,
  type Parfum,
} from "@/components/demos/parfum/data";

type Vue = { nom: "maison" } | { nom: "collection" } | { nom: "produit"; parfum: Parfum };

/**
 * Démo « Site vitrine » : maison de parfum. Thème crème éditorial propre à la
 * marque, collection cliquable, fiche produit avec pyramide olfactive et
 * sélecteur de contenance, panier symbolique.
 */
export default function ParfumDemo() {
  const [vue, setVue] = useState<Vue>({ nom: "collection" });
  const [contenance, setContenance] = useState<Contenance>("50");
  const [panier, setPanier] = useState(0);
  const [ajoute, setAjoute] = useState(false);

  // La pastille « Ajouté » retombe seule.
  useEffect(() => {
    if (!ajoute) return;
    const timer = window.setTimeout(() => setAjoute(false), 1800);
    return () => window.clearTimeout(timer);
  }, [ajoute]);

  function openProduit(parfum: Parfum) {
    setContenance("50");
    setVue({ nom: "produit", parfum });
  }

  const navButton = (label: string, target: "collection" | "maison") => {
    const active =
      vue.nom === target || (target === "collection" && vue.nom === "produit");
    return (
      <button
        type="button"
        onClick={() => setVue({ nom: target })}
        aria-current={active ? "page" : undefined}
        className={`border-b pb-0.5 text-xs uppercase tracking-[0.25em] transition ${
          active
            ? "border-stone-800 text-stone-900"
            : "border-transparent text-stone-500 hover:text-stone-800"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <BrowserFrame url="https://maison-elixir.fr">
      <div className="flex min-h-[560px] flex-col bg-[#faf7f1] text-stone-900">
        {/* En-tête de la maison */}
        <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-8">
          <nav aria-label="Navigation Maison Élixir" className="flex gap-5">
            {navButton("Collection", "collection")}
            {navButton("La Maison", "maison")}
          </nav>
          <p className="font-display text-lg font-bold tracking-[0.2em]">
            ÉLIXIR
          </p>
          <p
            className="relative text-stone-500"
            aria-label={`${panier} article${panier > 1 ? "s" : ""} dans le coffret`}
          >
            <ShoppingBag className="h-4.5 w-4.5" aria-hidden />
            {panier > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[9px] font-bold text-stone-50">
                {panier}
              </span>
            )}
          </p>
        </header>

        {/* Collection */}
        {vue.nom === "collection" && (
          <div className="screen-in flex-1 px-5 py-6 sm:px-8">
            <p className="text-center text-[11px] uppercase tracking-[0.3em] text-stone-500">
              Trois eaux de parfum
            </p>
            <h4 className="mt-2 text-center font-display text-2xl font-bold sm:text-3xl">
              La collection
            </h4>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {PARFUMS.map((parfum) => (
                <button
                  key={parfum.id}
                  type="button"
                  onClick={() => openProduit(parfum)}
                  className="group flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <span className="relative block aspect-4/5 shrink-0 overflow-hidden bg-stone-200">
                    <Image
                      src={parfum.image}
                      alt={`Flacon ${parfum.nom}`}
                      fill
                      sizes="(min-width: 640px) 30vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-3 block font-display text-base font-semibold">
                    {parfum.nom}
                  </span>
                  <span className="mt-0.5 block min-h-8 text-xs text-stone-500">
                    {parfum.accroche}
                  </span>
                  <span className="mt-1 block text-sm font-medium">
                    dès {formatEur(parfum.prix["30"])}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* La Maison */}
        {vue.nom === "maison" && (
          <div className="screen-in flex-1 px-5 py-6 sm:px-8">
            <div className="relative aspect-21/9 overflow-hidden bg-stone-200">
              <Image
                src="/assets/demos/parfum/hero.webp"
                alt="Flacon Élixir posé sur une pierre de travertin"
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="mx-auto mt-6 max-w-md text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                Grasse · depuis 1987
              </p>
              <h4 className="mt-2 font-display text-2xl font-bold">
                Le parfum comme un artisanat
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Chaque essence est composée dans notre atelier de Grasse,
                macérée six semaines et mise en flacon à la main. Nous ne
                produisons que trois parfums — mais nous les produisons sans
                aucun compromis.
              </p>
              <button
                type="button"
                onClick={() => setVue({ nom: "collection" })}
                className="mt-5 border-b border-stone-800 pb-0.5 text-xs font-semibold uppercase tracking-[0.25em] transition hover:text-stone-600"
              >
                Découvrir la collection
              </button>
            </div>
          </div>
        )}

        {/* Fiche produit */}
        {vue.nom === "produit" && (
          <div className="screen-in grid flex-1 gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8">
            <div className="relative aspect-4/5 overflow-hidden bg-stone-200 sm:aspect-auto">
              <Image
                src={vue.parfum.image}
                alt={`Flacon ${vue.parfum.nom}`}
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setVue({ nom: "collection" })}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-stone-500 transition hover:text-stone-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Collection
              </button>
              <h4 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                {vue.parfum.nom}
              </h4>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                Eau de parfum · {vue.parfum.accroche}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {vue.parfum.description}
              </p>

              {/* Pyramide olfactive */}
              <dl className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
                {(
                  [
                    ["Notes de tête", vue.parfum.notes.tete],
                    ["Notes de cœur", vue.parfum.notes.coeur],
                    ["Notes de fond", vue.parfum.notes.fond],
                  ] as const
                ).map(([label, valeur]) => (
                  <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {label}
                    </dt>
                    <dd className="text-xs leading-relaxed text-stone-700">
                      {valeur}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Contenance & prix */}
              <div
                role="radiogroup"
                aria-label="Choisir une contenance"
                className="mt-4 flex gap-2"
              >
                {CONTENANCES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={contenance === c}
                    onClick={() => setContenance(c)}
                    className={`rounded-none border px-3.5 py-1.5 text-xs font-semibold transition ${
                      contenance === c
                        ? "border-stone-900 bg-stone-900 text-stone-50"
                        : "border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {c} ml
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPanier((n) => n + 1);
                  setAjoute(true);
                }}
                className="mt-5 w-full bg-stone-900 py-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-50 transition hover:bg-stone-700"
              >
                {ajoute
                  ? "Ajouté au coffret ✓"
                  : `Ajouter au coffret — ${formatEur(vue.parfum.prix[contenance])}`}
              </button>
              <p className="mt-3 text-center text-[11px] text-stone-500">
                Échantillon 2 ml offert · livraison soignée sous 48 h
              </p>
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
