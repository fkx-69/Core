"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import {
  CATEGORY_LABELS,
  MENU,
  TASTING_MENU,
  type MenuCategory,
} from "./data";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as MenuCategory[];

/** Section « La carte » : onglets, points de conduite, menu dégustation. */
export default function CarteSection() {
  const [category, setCategory] = useState<MenuCategory>("entrees");

  return (
    <section
      id="carte"
      aria-labelledby="carte-titre"
      className="scroll-mt-24 bg-[#f2ead9] py-16 @3xl:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
        {/* En-tête de section */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-800">
            La carte
          </p>
          <h2
            id="carte-titre"
            className="mt-4 text-4xl leading-[1.05] @3xl:text-5xl [font-family:var(--font-td-serif)]"
          >
            Une cuisine d&apos;inspiration ouest-africaine,
            <br />
            <span className="italic text-amber-700">dressée à l&apos;assiette</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[#6b5c4a]">
            Une carte courte, réécrite au fil des marées et des récoltes.
            Chaque plat part d&apos;un classique du pays — yassa, mafé, thiakry —
            et le pousse un cran plus loin.
          </p>
        </Reveal>

        {/* Onglets */}
        <Reveal className="scrollbar-none mt-10 flex w-full snap-x snap-mandatory justify-start overflow-x-auto pb-2 @sm:justify-center" delay={80}>
          <div
            role="group"
            aria-label="Catégories de la carte"
            className="inline-flex w-max rounded-full border border-[#d8c9ac] bg-[#faf6ef] p-1"
          >
            {CATEGORIES.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={category === key}
                onClick={() => setCategory(key)}
                className={`min-h-11 snap-start rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ef] @2xl:px-7 ${
                  category === key
                    ? "bg-[#221a12] text-[#f3ecdd]"
                    : "text-[#6b5c4a] hover:text-[#221a12]"
                }`}
              >
                {CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Plats — points de conduite */}
        <ul
          key={category}
          className="screen-in mx-auto mt-12 grid max-w-4xl gap-x-16 gap-y-9 @4xl:grid-cols-2"
        >
          {MENU[category].map((item) => (
            <li key={item.name}>
              <div className="flex items-baseline gap-3">
                <h3 className="text-xl leading-snug [font-family:var(--font-td-serif)]">
                  {item.name}
                  {item.signature && (
                    <span className="ml-2 inline-flex translate-y-[-1px] items-center gap-1 align-middle text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800 [font-family:var(--font-td-sans)]">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Signature
                    </span>
                  )}
                </h3>
                <span
                  aria-hidden
                  className="min-w-6 grow self-end border-b border-dotted border-[#b9a888] pb-[5px]"
                />
                <p className="shrink-0 text-lg font-medium text-amber-800 [font-family:var(--font-td-serif)]">
                  {item.price}
                </p>
              </div>
              <p className="mt-1.5 max-w-md pr-6 text-sm leading-relaxed text-[#6b5c4a]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>

        {/* Menu dégustation */}
        <Reveal className="mt-16" delay={100}>
          <div className="relative mx-auto max-w-4xl overflow-hidden bg-[#211a12] px-6 py-10 text-[#f3ecdd] @2xl:px-10 @4xl:px-14 @4xl:py-12">
            {/* Filet doré décoratif */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent"
            />
            <div className="flex flex-col gap-8 @3xl:flex-row @3xl:items-end @3xl:justify-between">
              <div className="max-w-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
                  L&apos;expérience complète
                </p>
                <h3 className="mt-3 text-3xl @3xl:text-4xl [font-family:var(--font-td-serif)]">
                  {TASTING_MENU.name}
                </h3>
                <p className="mt-1 text-sm italic text-[#cbbda3] [font-family:var(--font-td-serif)] @3xl:text-base">
                  {TASTING_MENU.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#b3a48e]">
                  {TASTING_MENU.description}
                </p>
              </div>
              <div className="shrink-0 @3xl:text-right">
                <p className="text-4xl text-amber-400 [font-family:var(--font-td-serif)]">
                  {TASTING_MENU.price}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#b3a48e]">
                  {TASTING_MENU.priceNote}
                </p>
                <a
                  href="#reserver"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#211a12]"
                >
                  Réserver ce menu
                </a>
              </div>
            </div>
            <ul className="mt-8 flex flex-col gap-2 border-t border-[#3a3226] pt-6 text-sm text-[#b3a48e] @3xl:flex-row @3xl:gap-10">
              {TASTING_MENU.pairings.map((pairing) => (
                <li key={pairing} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500"
                  />
                  {pairing}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
