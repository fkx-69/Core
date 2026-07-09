"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import { GALLERY } from "./data";

/**
 * Section « Galerie » : pattern « image vedette » — la photo choisie dans la
 * bande de vignettes s'affiche en grand, sans lightbox ni portal.
 */
export default function GalerieSection() {
  const [index, setIndex] = useState(0);
  const current = GALLERY[index];

  const previous = () =>
    setIndex((index + GALLERY.length - 1) % GALLERY.length);
  const next = () => setIndex((index + 1) % GALLERY.length);

  return (
    <section
      id="galerie"
      aria-labelledby="galerie-titre"
      className="scroll-mt-24 bg-[#faf6ef] py-16 @3xl:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 @3xl:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-800">
              Galerie
            </p>
            <h2
              id="galerie-titre"
              className="mt-4 text-4xl leading-[1.05] @3xl:text-5xl [font-family:var(--font-td-serif)]"
            >
              La maison <span className="italic text-amber-700">en images</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Photo précédente"
              className="rounded-full border border-[#d8c9ac] p-2.5 text-[#221a12] transition hover:border-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ef]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Photo suivante"
              className="rounded-full border border-[#d8c9ac] p-2.5 text-[#221a12] transition hover:border-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ef]"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </Reveal>

        {/* Image vedette */}
        <Reveal className="mt-10" delay={60}>
          <figure aria-live="polite">
            <div
              key={current.src}
              className="screen-in relative aspect-[16/10] overflow-hidden @3xl:aspect-[16/9]"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="(min-width: 1152px) 1088px, 94vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-b border-[#e4d9c6] pb-4">
              <span className="text-base italic text-[#6b5c4a] [font-family:var(--font-td-serif)] @2xl:text-lg">
                {current.caption}
              </span>
              <span className="shrink-0 text-xs tabular-nums tracking-[0.2em] text-[#a2937e]">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(GALLERY.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Vignettes */}
        <ul className="mt-5 grid grid-cols-3 gap-2.5 @2xl:grid-cols-6 @3xl:gap-3">
          {GALLERY.map((item, i) => (
            <li key={item.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                aria-label={`Afficher : ${item.caption}`}
                className={`group relative block aspect-[4/3] w-full overflow-hidden transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ef] ${
                  i === index
                    ? "ring-2 ring-amber-700 ring-offset-2 ring-offset-[#faf6ef]"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(min-width: 672px) 15vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
