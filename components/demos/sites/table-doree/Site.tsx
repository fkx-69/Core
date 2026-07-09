"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  AtSign,
  Clock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";

import { tdSans, tdSerif } from "./fonts";
import {
  FEATURES,
  HOURS,
  IMAGES,
  NAV_LINKS,
  SITE,
  SOURCING,
  STATS,
  STORY,
} from "./data";
import Reveal from "./Reveal";
import CarteSection from "./CarteSection";
import GalerieSection from "./GalerieSection";
import ReservationSection from "./ReservationSection";

/* ------------------------------------------------------------------ */
/*  Ancres — résolues depuis NAV_LINKS pour rester strictement         */
/*  synchrones avec la navigation.                                     */
/* ------------------------------------------------------------------ */

function hrefFor(fragment: string, fallback: string) {
  return (
    NAV_LINKS.find((l) => l.href.toLowerCase().includes(fragment))?.href ??
    fallback
  );
}

const MAISON_HREF = hrefFor("maison", "#maison");
const CARTE_HREF = hrefFor("carte", "#carte");
const RESERVATION_HREF = hrefFor("reserv", "#reserver");
const INFOS_HREF = hrefFor("infos", "#infos");

const MAISON_ID = MAISON_HREF.slice(1);
const INFOS_ID = INFOS_HREF.slice(1);

/* ------------------------------------------------------------------ */
/*  Blocs de mise en page réutilisés                                   */
/* ------------------------------------------------------------------ */

/** Gouttières éditoriales alignées sur les sections existantes. */
function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 @3xl:px-8 ${className ?? ""}`}>
      {children}
    </div>
  );
}

/** Sur-titre : filet doré + libellé en capitales espacées. */
function Eyebrow({
  children,
  tone = "clair",
}: {
  children: ReactNode;
  tone?: "clair" | "sombre";
}) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] ${
        tone === "sombre" ? "text-amber-400" : "text-amber-800"
      }`}
    >
      <span
        aria-hidden
        className={`h-px w-8 ${tone === "sombre" ? "bg-amber-400/60" : "bg-amber-700/50"}`}
      />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Site                                                               */
/* ------------------------------------------------------------------ */

export default function Site() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fermeture du panneau mobile à la touche Échap.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const telHref = `tel:${SITE.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div
      className={`${tdSerif.variable} ${tdSans.variable} @container bg-[#faf6ef] text-[#241d16] antialiased [font-family:var(--font-td-sans)] selection:bg-[#ead9b8] selection:text-[#241d16]`}
    >
      {/* ============================ HEADER ============================ */}
      <header className="sticky top-0 z-40 border-b border-[#e3d8c2] bg-[#faf6ef]/90 backdrop-blur-md">
        <div className="relative">
          <Shell className="flex items-center justify-between gap-4 py-4 @3xl:py-5">
            {/* Logotype */}
            <a
              href={MAISON_HREF}
              className="-m-1 flex flex-col p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-label={`${SITE.name} — aller à la présentation de la maison`}
            >
              <span className="text-xl leading-none tracking-[0.02em] @3xl:text-2xl [font-family:var(--font-td-serif)]">
                {SITE.name}
              </span>
              <span className="mt-1 hidden text-[9px] uppercase tracking-[0.42em] text-[#8a7a63] @3xl:block">
                Les Almadies · Dakar
              </span>
            </a>

            {/* Navigation desktop */}
            <nav
              aria-label="Navigation principale"
              className="hidden items-center gap-7 @3xl:flex"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#6b5c4a] transition-colors hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* Téléphone */}
              <a
                href={telHref}
                className="hidden items-center gap-2 text-sm text-[#6b5c4a] transition-colors hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 @4xl:inline-flex"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {SITE.phone}
              </a>

              <a
                href={RESERVATION_HREF}
                className="hidden items-center rounded-full bg-[#221a12] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3ecdd] transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ef] @3xl:inline-flex"
              >
                Réserver
              </a>

              {/* Bouton menu — visible sous @3xl */}
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="td-nav-mobile"
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c9ac] text-[#241d16] transition-colors hover:border-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 @3xl:hidden"
              >
                {menuOpen ? (
                  <X className="h-4.5 w-4.5" aria-hidden />
                ) : (
                  <Menu className="h-4.5 w-4.5" aria-hidden />
                )}
              </button>
            </div>
          </Shell>

          {/* Panneau mobile — absolu sous le header, jamais fixed */}
          {menuOpen && (
            <nav
              id="td-nav-mobile"
              aria-label="Menu"
              className="absolute inset-x-0 top-full border-b border-[#e3d8c2] bg-[#faf6ef] shadow-[0_24px_40px_-28px_rgba(36,29,22,0.45)] @3xl:hidden"
            >
              <Shell className="flex flex-col py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-[#efe6d3] py-3.5 text-base text-[#241d16] transition-colors hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 [font-family:var(--font-td-serif)]"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 pb-2">
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 text-sm text-[#6b5c4a] hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {SITE.phone}
                  </a>
                  <a
                    href={RESERVATION_HREF}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center rounded-full bg-[#221a12] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3ecdd] transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  >
                    Réserver une table
                  </a>
                </div>
              </Shell>
            </nav>
          )}
        </div>
      </header>

      <main>
        {/* ============================ HERO ============================ */}
        <section aria-label="Présentation" className="relative">
          <div className="relative flex min-h-[540px] flex-col justify-end overflow-hidden @3xl:min-h-[640px] @5xl:min-h-[720px]">
            <Image
              src={IMAGES.hero.src}
              alt={IMAGES.hero.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#150e07]/90 via-[#150e07]/40 to-[#241d16]/15"
            />

            <Shell className="relative pt-32 pb-12 @3xl:pb-16">
              <Reveal>
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-300">
                  <span aria-hidden className="h-px w-8 bg-amber-300/70" />
                  Restaurant gastronomique · Les Almadies, Dakar
                </p>
                <h1 className="mt-5 max-w-3xl text-[2.75rem] leading-[1.04] text-[#f7f1e4] @2xl:text-6xl @5xl:text-7xl [font-family:var(--font-td-serif)]">
                  La grande cuisine sénégalaise,
                  <br />
                  <span className="italic text-amber-300">
                    servie face à l’océan.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={120} className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={RESERVATION_HREF}
                  className="inline-flex items-center rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#150e07]"
                >
                  Réserver une table
                </a>
                <a
                  href={CARTE_HREF}
                  className="inline-flex items-center rounded-full border border-[#f7f1e4]/40 px-7 py-3 text-sm font-medium text-[#f7f1e4] transition-colors hover:border-amber-300 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#150e07]"
                >
                  Découvrir la carte
                </a>
              </Reveal>

              <Reveal
                delay={200}
                className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#f7f1e4]/15 pt-5 text-sm text-[#e8dfc9]/85"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                  {SITE.address}
                </span>
                <a
                  href={telHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <Phone className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                  {SITE.phone}
                </a>
              </Reveal>
            </Shell>
          </div>
        </section>

        {/* ========================== LA MAISON ========================== */}
        <section
          id={MAISON_ID}
          aria-labelledby="maison-titre"
          className="scroll-mt-24 py-16 @3xl:py-24 @5xl:py-28"
        >
          <Shell>
            <div className="grid gap-12 @3xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] @3xl:gap-16 @5xl:gap-20">
              {/* Colonne récit */}
              <div>
                <Reveal>
                  <Eyebrow>La maison</Eyebrow>
                  <h2
                    id="maison-titre"
                    className="mt-4 text-4xl leading-[1.05] @3xl:text-5xl [font-family:var(--font-td-serif)]"
                  >
                    {STORY.title}
                  </h2>
                </Reveal>
                <div className="mt-6 max-w-xl space-y-5 text-[15px] leading-relaxed text-[#6b5c4a]">
                  {STORY.paragraphs.map((paragraph, i) => (
                    <Reveal key={i} delay={80 + i * 70}>
                      <p>{paragraph}</p>
                    </Reveal>
                  ))}
                </div>

                {/* Chiffres */}
                <Reveal delay={160}>
                  <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#e3d8c2] pt-8">
                    {STATS.map((stat) => (
                      <div key={stat.label}>
                        <dt className="sr-only">{stat.label}</dt>
                        <dd>
                          <span className="block text-3xl font-light text-[#241d16] @2xl:text-4xl [font-family:var(--font-td-serif)]">
                            {stat.value}
                          </span>
                          <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-[#8a7a63] @2xl:text-[11px]">
                            {stat.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>

              {/* Colonne portrait + sourcing — décalée pour un rythme éditorial */}
              <div className="@3xl:mt-14">
                <Reveal delay={120}>
                  <figure>
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#e9dfc9]">
                      <Image
                        src={IMAGES.chef.src}
                        alt={IMAGES.chef.alt}
                        fill
                        sizes="(min-width: 1024px) 440px, (min-width: 768px) 45vw, 100vw"
                        className="object-cover"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-3 border border-[#faf6ef]/30"
                      />
                    </div>
                    <figcaption className="mt-3 flex items-baseline justify-between text-[10px] uppercase tracking-[0.26em] text-[#8a7a63]">
                      <span>Le chef, en cuisine</span>
                      <span>Les Almadies</span>
                    </figcaption>
                  </figure>
                </Reveal>

                {/* Sourcing */}
                <Reveal delay={180} className="mt-10">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-800">
                    Produits locaux
                  </h3>
                  <ul className="mt-4 divide-y divide-[#e3d8c2] border-t border-[#e3d8c2]">
                    {SOURCING.map((item) => (
                      <li key={item.title} className="py-4">
                        <p className="text-lg leading-snug [font-family:var(--font-td-serif)]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#6b5c4a]">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </Shell>
        </section>

        {/* =========================== LA CARTE =========================== */}
        <CarteSection />

        {/* =========================== GALERIE ============================ */}
        <GalerieSection />

        {/* ======================= INFOS PRATIQUES ======================== */}
        <section
          id={INFOS_ID}
          aria-labelledby="infos-titre"
          className="scroll-mt-24 border-y border-[#e3d8c2] bg-[#f6f0e3] py-16 @3xl:py-24"
        >
          <Shell>
            <Reveal className="max-w-2xl">
              <Eyebrow>Infos pratiques</Eyebrow>
              <h2
                id="infos-titre"
                className="mt-4 text-4xl leading-[1.05] @3xl:text-5xl [font-family:var(--font-td-serif)]"
              >
                Avant de venir{" "}
                <span className="italic text-amber-700">aux Almadies</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-10 @xl:grid-cols-3 @xl:gap-8">
              {/* Horaires */}
              <Reveal className="border-t border-[#241d16] pt-5">
                <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a7a63]">
                  <Clock className="h-3.5 w-3.5 text-amber-700" aria-hidden />
                  Horaires
                </h3>
                <dl className="mt-4 space-y-4">
                  {HOURS.map((slot) => (
                    <div key={slot.days}>
                      <dt className="text-lg leading-snug [font-family:var(--font-td-serif)]">
                        {slot.days}
                      </dt>
                      <dd className="mt-0.5 text-sm text-[#6b5c4a]">
                        {slot.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              {/* Adresse & contact */}
              <Reveal delay={90} className="border-t border-[#241d16] pt-5">
                <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a7a63]">
                  <MapPin className="h-3.5 w-3.5 text-amber-700" aria-hidden />
                  Adresse
                </h3>
                <p className="mt-4 text-lg leading-snug [font-family:var(--font-td-serif)]">
                  {SITE.address}
                </p>
                <p className="mt-4 text-sm text-[#6b5c4a]">
                  <a
                    href={telHref}
                    className="border-b border-[#d8c9ac] pb-0.5 transition-colors hover:border-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  >
                    {SITE.phone}
                  </a>
                </p>
                <p className="mt-2 text-sm text-[#6b5c4a]">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="border-b border-[#d8c9ac] pb-0.5 transition-colors hover:border-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  >
                    {SITE.email}
                  </a>
                </p>
              </Reveal>

              {/* Services */}
              <Reveal delay={180} className="border-t border-[#241d16] pt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8a7a63]">
                  À savoir
                </h3>
                <ul className="mt-4 space-y-3">
                  {FEATURES.map((feature) => (
                    <li
                      key={feature.title}
                      className="flex items-start gap-3 text-sm leading-relaxed text-[#6b5c4a]"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-amber-700"
                      />
                      <span>
                        <span className="font-semibold text-[#443728]">
                          {feature.title}.
                        </span>{" "}
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Shell>
        </section>

        {/* ========================= RÉSERVATION ========================== */}
        <ReservationSection />
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="relative bg-[#1c150e] text-[#cbbda3]">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
        />
        <Shell className="py-14 @3xl:py-20">
          <div className="grid gap-10 @xl:grid-cols-2 @4xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] @4xl:gap-8">
            {/* Marque + contact */}
            <div>
              <p className="text-2xl text-[#f3ecdd] [font-family:var(--font-td-serif)]">
                {SITE.name}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#a3937b]">
                Restaurant gastronomique aux Almadies — la mémoire culinaire du
                Sénégal, dressée à l’assiette.
              </p>
              <address className="mt-6 space-y-2 text-sm not-italic text-[#cbbda3]">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
                  {SITE.address}
                </p>
                <p>
                  <a
                    href={telHref}
                    className="transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    {SITE.phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    {SITE.email}
                  </a>
                </p>
              </address>
            </div>

            {/* Horaires */}
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8a7a63]">
                Horaires
              </h3>
              <dl className="mt-4 space-y-3">
                {HOURS.map((slot) => (
                  <div key={slot.days}>
                    <dt className="text-sm text-[#e8dfc9]">{slot.days}</dt>
                    <dd className="text-sm text-[#a3937b]">{slot.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Navigation */}
            <nav aria-label="Navigation pied de page">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8a7a63]">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={RESERVATION_HREF}
                    className="text-sm text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    Réserver une table
                  </a>
                </li>
              </ul>
            </nav>

            {/* Réseaux */}
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8a7a63]">
                Nous suivre
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <button
                    type="button"
                    aria-label={`Instagram — ${SITE.name} (démonstration)`}
                    className="inline-flex items-center gap-2.5 text-sm transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <AtSign className="h-4 w-4 text-amber-500" aria-hidden />
                    Instagram
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    aria-label={`WhatsApp — ${SITE.name} (démonstration)`}
                    className="inline-flex items-center gap-2.5 text-sm transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <MessageCircle className="h-4 w-4 text-amber-500" aria-hidden />
                    WhatsApp
                  </button>
                </li>
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-[#8a7a63]">
                Tenue élégante appréciée. Réservation conseillée le week-end.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[#332a1e] pt-6 text-[11px] text-[#8a7a63] @xl:flex-row @xl:items-center @xl:justify-between">
            <p>© 2026 {SITE.name} — Dakar. Tous droits réservés.</p>
            <p className="uppercase tracking-[0.2em]">
              Site fictif de démonstration
            </p>
          </div>
        </Shell>
      </footer>
    </div>
  );
}
