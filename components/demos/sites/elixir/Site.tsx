"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { displaySerif, microSans } from "./fonts";
import {
  BOUTIQUE,
  CHIFFRES,
  CONTENANCES,
  ETAPES,
  MATIERES,
  PARFUMS,
  PRESSE,
  TIERS,
  formatFcfa,
  type Contenance,
  type Parfum,
} from "./data";

/* ------------------------------------------------------------------ */
/*  Utilitaires : mouvement réduit + révélation au scroll             */
/* ------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** Fondu-montée à l'entrée dans le champ, sans mouvement si l'utilisateur le refuse. */
function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // La variante motion-reduce force l'état final : ni translation ni fondu.
  const motion = `transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
    shown
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0"
  }`;

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement & HTMLLIElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${motion} ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Blocs de mise en page réutilisés                                  */
/* ------------------------------------------------------------------ */

/** Gouttières éditoriales, largeur maximale et marges généreuses. */
function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-6 @sm:px-8 @3xl:px-14 @5xl:px-20 @7xl:px-28 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

/** Sur-titre : numéro de section, filet or, libellé en capitales espacées. */
function Eyebrow({
  index,
  children,
  tone = "ivoire",
}: {
  index?: string;
  children: ReactNode;
  tone?: "ivoire" | "encre";
}) {
  const label = tone === "encre" ? "text-[#c9a877]" : "text-[#7d5f31]";
  const line = tone === "encre" ? "bg-[#c9a877]/50" : "bg-[#b08d57]";
  return (
    <p
      className={`flex items-center gap-3 text-[10px] @2xl:text-[11px] uppercase tracking-[0.38em] ${label}`}
    >
      {index && (
        <span className="[font-family:var(--font-elixir-display)] text-sm tracking-normal">
          {index}
        </span>
      )}
      <span className={`h-px w-7 @3xl:w-9 ${line}`} aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Coffret (commande simulée)                                        */
/* ------------------------------------------------------------------ */

type Ligne = { key: number; parfum: Parfum; contenance: Contenance; prix: number };

/* ------------------------------------------------------------------ */
/*  Site                                                              */
/* ------------------------------------------------------------------ */

export default function Site() {
  const reduce = usePrefersReducedMotion();

  // Sélection / fiche produit
  const [selection, setSelection] = useState<Parfum>(PARFUMS[0]);
  const [contenance, setContenance] = useState<Contenance>("50");
  const [ajoute, setAjoute] = useState(false);

  // Coffret
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [commande, setCommande] = useState(false);
  const cleRef = useRef(0);

  // Ancres de navigation : boutons + scrollIntoView sur des ids préfixés
  // « elx- » (uniques dans la page hôte), sans changer l'URL.
  const scrollTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduce],
  );

  // La pastille « Ajouté » retombe seule.
  useEffect(() => {
    if (!ajoute) return;
    const t = window.setTimeout(() => setAjoute(false), 1900);
    return () => window.clearTimeout(t);
  }, [ajoute]);

  function choisir(parfum: Parfum) {
    setSelection(parfum);
    setContenance("50");
    scrollTo("elx-fiche");
  }

  function ajouterAuCoffret() {
    const ligne: Ligne = {
      key: cleRef.current++,
      parfum: selection,
      contenance,
      prix: selection.prix[contenance],
    };
    setLignes((prev) => [...prev, ligne]);
    setCommande(false);
    setAjoute(true);
  }

  function retirer(key: number) {
    setLignes((prev) => prev.filter((l) => l.key !== key));
    setCommande(false);
  }

  const total = lignes.reduce((sum, l) => sum + l.prix, 0);
  const count = lignes.length;

  const nav: { label: string; id: string }[] = [
    { label: "La collection", id: "elx-collection" },
    { label: "La maison", id: "elx-maison" },
    { label: "Savoir-faire", id: "elx-savoir" },
    { label: "La boutique", id: "elx-boutique" },
  ];

  const acc = selection.accent;
  const ficheStyle = {
    "--elx-accent": acc.text,
    "--elx-deep": acc.deep,
    "--elx-soft": acc.soft,
  } as CSSProperties;

  return (
    <div
      className={`@container ${displaySerif.variable} ${microSans.variable} [font-family:var(--font-elixir-sans)] bg-[#f7f3ec] text-[#2c241b] antialiased [font-feature-settings:'ss01'] selection:bg-[#e7d8bd] selection:text-[#2c241b]`}
    >
      <style>{`
        .elx-rule {
          background-image: linear-gradient(90deg, transparent, #b08d57 18%, #e9d3a8 50%, #b08d57 82%, transparent);
          background-size: 200% 100%;
          animation: elx-sheen 6.5s ease-in-out infinite;
        }
        @keyframes elx-sheen {
          0% { background-position: 150% 0; }
          100% { background-position: -150% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .elx-rule { animation: none; }
        }
      `}</style>

      {/* ============================ HEADER ============================ */}
      <header className="sticky top-0 z-30 border-b border-[#e4dac7] bg-[#f7f3ec]/88 backdrop-blur-md">
        <Shell className="flex items-center justify-between gap-4 py-4 @3xl:py-5">
          <button
            type="button"
            onClick={() => scrollTo("elx-collection")}
            className="group -m-1 flex flex-col p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
            aria-label="Maison Élixir — retour à la collection"
          >
            <span className="[font-family:var(--font-elixir-display)] text-lg @3xl:text-xl font-medium leading-none tracking-[0.34em] text-[#241d15]">
              MAISON&nbsp;ÉLIXIR
            </span>
            <span className="mt-1 hidden text-[8px] uppercase tracking-[0.5em] text-[#9a8b73] @3xl:block">
              Haute parfumerie · Abidjan
            </span>
          </button>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-8 @3xl:flex"
          >
            {nav.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-[11px] uppercase tracking-[0.22em] text-[#5f5545] transition-colors hover:text-[#8a5a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => scrollTo("elx-coffret")}
            className="group inline-flex items-center gap-2 rounded-full border border-[#241d15] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#241d15] transition-colors hover:bg-[#241d15] hover:text-[#f7f3ec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
          >
            Coffret
            <span
              className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-medium transition-colors ${
                count > 0
                  ? "bg-[#b08d57] text-[#1a140c] group-hover:bg-[#f7f3ec]"
                  : "bg-[#e4dac7] text-[#6f6455] group-hover:bg-[#3a3025] group-hover:text-[#cbbfa8]"
              }`}
            >
              {count}
            </span>
          </button>
        </Shell>
      </header>

      <main>
        {/* ============================ HERO ============================ */}
        <section className="relative overflow-hidden border-b border-[#e4dac7]">
          <div className="relative flex min-h-[580px] flex-col justify-end bg-[#17130d] @3xl:min-h-[680px] @5xl:min-h-[760px]">
            <Image
              src="/assets/demos/parfum/hero.webp"
              alt="Flacon d'eau de parfum Maison Élixir posé sur une pierre de travertin, drapé de soie dorée"
              fill
              preload
              sizes="100vw"
              /* Le flacon est à ~65 % de la largeur de la source : en cadre
                 étroit, le crop centré le sortirait du champ. */
              className="object-cover object-[62%_50%] @3xl:object-center"
            />
            {/* Voile pour la lisibilité : dense en pied de section, renforcé
                sur la colonne de texte à gauche. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#17130d]/90 via-[#17130d]/40 to-[#17130d]/25"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#17130d]/65 via-[#17130d]/25 to-transparent"
            />
            <span
              className="pointer-events-none absolute inset-3 border border-[#f7f3ec]/20 @3xl:inset-5"
              aria-hidden
            />

            <Shell className="relative pt-28 pb-12 @3xl:pt-40 @3xl:pb-16">
              <div className="screen-in max-w-2xl">
                <Eyebrow tone="encre">Haute parfumerie · Cocody</Eyebrow>
                <h1 className="mt-6 [font-family:var(--font-elixir-display)] font-light leading-[0.9] tracking-[-0.01em] text-[#f4ecdd]">
                  <span className="block text-[3.6rem] @sm:text-7xl @2xl:text-8xl @5xl:text-[7.5rem]">
                    Maison
                  </span>
                  <span className="mt-1 block text-[3.6rem] italic text-[#e9d3a8] @sm:text-7xl @2xl:text-8xl @5xl:text-[7.5rem]">
                    Élixir
                  </span>
                </h1>
                <div className="elx-rule mt-6 h-px w-40 @3xl:w-52" aria-hidden />
                <p className="mt-6 max-w-md [font-family:var(--font-elixir-display)] text-xl leading-relaxed text-[#e9e0cf] @2xl:text-2xl">
                  Trois eaux de parfum composées à la main, à partir des matières
                  premières de l&apos;Afrique de l&apos;Ouest — vétiver, karité,
                  bissap, fleur d&apos;oranger.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    type="button"
                    onClick={() => scrollTo("elx-collection")}
                    className="inline-flex items-center bg-[#f4ecdd] px-7 py-3.5 text-[11px] uppercase tracking-[0.24em] text-[#241d15] transition-colors hover:bg-[#e9d3a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17130d]"
                  >
                    Découvrir la collection
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo("elx-maison")}
                    className="border-b border-[#f4ecdd]/40 pb-1 text-[11px] uppercase tracking-[0.24em] text-[#e9e0cf] transition-colors hover:border-[#c9a877] hover:text-[#c9a877] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                  >
                    La maison
                  </button>
                </div>
              </div>

              <div className="screen-in mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-[#f4ecdd]/20 pt-6 @3xl:mt-12">
                <dl className="flex gap-8 text-[10px] uppercase tracking-[0.22em] text-[#cbbfa8]">
                  <div>
                    <dt className="sr-only">Fondée en</dt>
                    <dd>
                      <span className="[font-family:var(--font-elixir-display)] text-2xl tracking-normal text-[#f4ecdd]">
                        2019
                      </span>
                      <span className="mt-1 block">Fondée à Abidjan</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Nombre de parfums</dt>
                    <dd>
                      <span className="[font-family:var(--font-elixir-display)] text-2xl tracking-normal text-[#f4ecdd]">
                        3
                      </span>
                      <span className="mt-1 block">Eaux de parfum</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Production</dt>
                    <dd>
                      <span className="[font-family:var(--font-elixir-display)] text-2xl tracking-normal text-[#f4ecdd]">
                        100 %
                      </span>
                      <span className="mt-1 block">Assemblé en atelier</span>
                    </dd>
                  </div>
                </dl>
                <p className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#cbbfa8] @xl:flex">
                  <span>Collection Signature</span>
                  <span className="h-px w-7 bg-[#c9a877]/50" aria-hidden />
                  <span>N° 01 — 03</span>
                </p>
              </div>
            </Shell>
          </div>
        </section>

        {/* ========================= LA COLLECTION ========================= */}
        <section id="elx-collection" className="scroll-mt-[84px] border-b border-[#e4dac7]">
          <Shell className="py-16 @3xl:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow index="N° 01">La collection</Eyebrow>
              <h2 className="mt-5 [font-family:var(--font-elixir-display)] text-4xl font-light leading-[1.02] text-[#241d15] @2xl:text-5xl @5xl:text-6xl">
                Trois eaux de parfum,
                <br />
                <span className="italic text-[#3a2f22]">une même signature.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#5f5545]">
                Chaque parfum raconte une matière de la région. Choisissez une
                fragrance pour en découvrir la pyramide olfactive.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 @xl:grid-cols-3">
              {PARFUMS.map((parfum, i) => {
                const active = parfum.id === selection.id;
                return (
                  <Reveal key={parfum.id} delay={i * 90}>
                    <button
                      type="button"
                      onClick={() => choisir(parfum)}
                      aria-pressed={active}
                      style={
                        { "--elx-accent": parfum.accent.text } as CSSProperties
                      }
                      className="group flex w-full flex-col text-left focus-visible:outline-none"
                    >
                      <span className="relative block aspect-[3/4] overflow-hidden bg-[#e9e0cf] ring-1 ring-inset ring-[#e4dac7] transition-[box-shadow] duration-500 group-focus-visible:ring-2 group-focus-visible:ring-[#b08d57]">
                        <Image
                          src={parfum.image}
                          alt={`Flacon ${parfum.nom}`}
                          fill
                          /* Cadre 3/4 sur source carrée : ~75 % visible. */
                          sizes="(min-width: 576px) 44vw, 100vw"
                          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                        />
                        <span
                          className="absolute left-4 top-4 [font-family:var(--font-elixir-display)] text-sm text-[#f7f3ec] mix-blend-difference"
                          aria-hidden
                        >
                          0{i + 1}
                        </span>
                      </span>
                      <span className="mt-5 flex items-baseline justify-between gap-3">
                        <span className="[font-family:var(--font-elixir-display)] text-2xl leading-none text-[#241d15]">
                          {parfum.nom}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a7c66]">
                          {parfum.famille}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm text-[#5f5545]">
                        {parfum.accroche}
                      </span>
                      <span className="mt-4 flex items-center justify-between border-t border-[#e4dac7] pt-3">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-[#6f6455]">
                          dès {formatFcfa(parfum.prix["50"])}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--elx-accent)] transition-colors group-hover:text-[#241d15]">
                          Découvrir →
                        </span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </Shell>
        </section>

        {/* ========================= FICHE PARFUM ========================= */}
        <section
          id="elx-fiche"
          style={ficheStyle}
          className="scroll-mt-[84px] border-b border-[#e4dac7] bg-[var(--elx-soft)] transition-colors duration-700"
        >
          <Shell className="grid grid-cols-1 gap-10 py-16 @xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] @xl:gap-12 @3xl:py-24 @5xl:gap-20">
            {/* Image du flacon */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe6d5] @xl:sticky @xl:top-24">
                <Image
                  key={selection.image}
                  src={selection.image}
                  alt={`Flacon ${selection.nom} — eau de parfum Maison Élixir`}
                  fill
                  /* Cadre 4/5 sur source carrée : ~80 % visible. */
                  sizes="(min-width: 576px) 53vw, 100vw"
                  className="screen-in object-cover"
                />
                <span
                  className="pointer-events-none absolute inset-4 border border-[var(--elx-accent)]/25"
                  aria-hidden
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-[#f7f3ec]/85 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--elx-deep)] backdrop-blur-sm">
                  {selection.famille}
                </span>
              </div>
            </div>

            {/* Détails */}
            <div>
              <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[var(--elx-accent)]">
                <span>
                  0{PARFUMS.findIndex((p) => p.id === selection.id) + 1} / 03
                </span>
                <span className="h-px w-8 bg-[var(--elx-accent)]/40" aria-hidden />
                Eau de parfum
              </p>
              <h2 className="mt-4 [font-family:var(--font-elixir-display)] text-5xl font-light leading-none text-[#241d15] @2xl:text-6xl">
                {selection.nom}
              </h2>
              <p className="mt-5 max-w-xl [font-family:var(--font-elixir-display)] text-lg leading-relaxed text-[#4a4034] @2xl:text-xl">
                {selection.recit}
              </p>

              {/* Pyramide olfactive */}
              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7c66]">
                  Pyramide olfactive
                </p>
                <dl className="mt-3 border-t border-[#e0d5bf]">
                  {TIERS.map((tier, i) => (
                    <div
                      key={tier.key}
                      className="grid grid-cols-[3.4rem_1fr] items-baseline gap-4 border-b border-[#e0d5bf] py-4 @2xl:grid-cols-[4.5rem_1fr]"
                    >
                      <dt className="flex items-baseline gap-2">
                        <span className="[font-family:var(--font-elixir-display)] text-lg text-[#b08d57]">
                          0{i + 1}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--elx-accent)]">
                          {tier.label}
                        </span>
                      </dt>
                      <dd className="[font-family:var(--font-elixir-display)] text-lg leading-snug text-[#2c241b] @2xl:text-xl">
                        {selection.notes[tier.key].join(" · ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Contenance + prix */}
              <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                    Contenance
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Choisir une contenance"
                    className="mt-3 flex gap-2.5"
                  >
                    {CONTENANCES.map((c) => {
                      const on = contenance === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setContenance(c)}
                          className={`min-w-16 border px-4 py-2 text-xs tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57] ${
                            on
                              ? "border-[var(--elx-accent)] bg-[var(--elx-accent)] text-[#f7f3ec]"
                              : "border-[#d9cdb5] text-[#5f5545] hover:border-[var(--elx-accent)]"
                          }`}
                        >
                          {c} ml
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                    Prix
                  </p>
                  <p className="mt-1 [font-family:var(--font-elixir-display)] text-3xl leading-none text-[#241d15]">
                    {formatFcfa(selection.prix[contenance])}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={ajouterAuCoffret}
                className="mt-7 flex w-full items-center justify-center gap-2 bg-[#241d15] py-4 text-[11px] uppercase tracking-[0.24em] text-[#f4ecdd] transition-colors hover:bg-[#3a2f22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--elx-soft)]"
              >
                {ajoute ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden />
                    Ajouté au coffret
                  </>
                ) : (
                  <>Ajouter au coffret — {selection.nom}</>
                )}
              </button>
              <p className="mt-4 text-center text-[11px] tracking-[0.02em] text-[#6f6455]">
                Échantillon 2 ml offert · Livraison à Abidjan sous 48 h · Wave
                &amp; Orange Money
              </p>
            </div>
          </Shell>
        </section>

        {/* ===================== BANDEAU MATIÈRES ===================== */}
        <div
          className="marquee-pausable overflow-hidden border-b border-[#2a2118] bg-[#17130d] py-5 @3xl:py-7"
          aria-hidden
        >
          <div className="scrollbar-none flex w-max animate-marquee-slow">
            {[0, 1].map((dup) => (
              <ul key={dup} className="flex shrink-0 items-center">
                {MATIERES.map((m) => (
                  <li
                    key={`${dup}-${m}`}
                    className="flex items-center [font-family:var(--font-elixir-display)] text-xl text-[#cbbfa8] @3xl:text-2xl"
                  >
                    <span className="px-6 @3xl:px-9">{m}</span>
                    <span className="text-[#b08d57]">·</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ===================== LA MAISON / SAVOIR-FAIRE ===================== */}
        <section
          id="elx-maison"
          className="scroll-mt-[84px] bg-[#17130d] text-[#e9e0cf]"
        >
          <Shell className="py-16 @3xl:py-24 @5xl:py-28">
            <div className="grid gap-10 @3xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] @3xl:gap-16">
              <Reveal>
                <Eyebrow index="N° 02" tone="encre">
                  La maison
                </Eyebrow>
                <h2 className="mt-5 [font-family:var(--font-elixir-display)] text-4xl font-light leading-[1.04] text-[#f4ecdd] @2xl:text-5xl @5xl:text-6xl">
                  Le parfum comme
                  <br />
                  <span className="italic text-[#c9a877]">un geste d&apos;artisan.</span>
                </h2>
              </Reveal>
              <Reveal delay={120} className="self-end">
                <p className="[font-family:var(--font-elixir-display)] text-lg leading-relaxed text-[#cbbfa8] @2xl:text-xl">
                  Chez Maison Élixir, chaque essence naît d&apos;une rencontre
                  entre un parfumeur et une matière : le vétiver des plateaux, le
                  beurre de karité du nord, l&apos;hibiscus des marchés
                  d&apos;Abidjan, la fleur d&apos;oranger des jardins de Cocody.
                  Nous ne composons que trois parfums — mais nous les composons
                  sans le moindre compromis, en petites séries, à la main.
                </p>
              </Reveal>
            </div>

            {/* Étapes de création */}
            <section
              id="elx-savoir"
              aria-label="Savoir-faire"
              className="scroll-mt-[84px] mt-16 @3xl:mt-24"
            >
              <Eyebrow tone="encre">Savoir-faire · quatre gestes</Eyebrow>
              <ol className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-[#2f261a] bg-[#2f261a] @xl:grid-cols-2 @5xl:grid-cols-4">
                {ETAPES.map((etape, i) => (
                  <Reveal
                    as="li"
                    key={etape.titre}
                    delay={i * 90}
                    className="flex flex-col bg-[#17130d] p-7 @3xl:p-8"
                  >
                    <span className="[font-family:var(--font-elixir-display)] text-4xl font-light text-[#b08d57]">
                      0{i + 1}
                    </span>
                    <h3 className="mt-4 [font-family:var(--font-elixir-display)] text-2xl text-[#f4ecdd]">
                      {etape.titre}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#a99d86]">
                      {etape.texte}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </section>

            {/* Chiffres */}
            <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-[#2f261a] pt-10 @3xl:grid-cols-4">
              {CHIFFRES.map((c) => (
                <div key={c.label}>
                  <dt className="sr-only">{c.label}</dt>
                  <dd>
                    <span className="[font-family:var(--font-elixir-display)] text-5xl font-light text-[#f4ecdd] @2xl:text-6xl">
                      {c.valeur}
                    </span>
                    <span className="mt-2 block text-[11px] uppercase tracking-[0.18em] text-[#a99d86]">
                      {c.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Shell>
        </section>

        {/* ========================= LA BOUTIQUE ========================= */}
        <section
          id="elx-boutique"
          className="scroll-mt-[84px] border-b border-[#e4dac7]"
        >
          <Shell className="py-16 @3xl:py-24">
            <Reveal className="max-w-2xl">
              <Eyebrow index="N° 03">La boutique</Eyebrow>
              <h2 className="mt-5 [font-family:var(--font-elixir-display)] text-4xl font-light leading-[1.02] text-[#241d15] @2xl:text-5xl @5xl:text-6xl">
                Cocody, Abidjan.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#5f5545]">
                Notre atelier-boutique vous accueille pour un conseil olfactif
                personnalisé. Sur rendez-vous, découvrez les trois parfums
                accompagnés d&apos;un thé de bissap.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 @xl:grid-cols-3">
              <Reveal className="border-t border-[#241d15] pt-5">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                  Adresse
                </h3>
                <p className="mt-3 [font-family:var(--font-elixir-display)] text-xl leading-snug text-[#241d15]">
                  {BOUTIQUE.adresse.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm text-[#5f5545]">
                  <a
                    href={`tel:${BOUTIQUE.telephone.replace(/\s/g, "")}`}
                    className="border-b border-[#d9cdb5] pb-0.5 transition-colors hover:border-[#8a5a24] hover:text-[#8a5a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                  >
                    {BOUTIQUE.telephone}
                  </a>
                </p>
                <p className="mt-2 text-sm text-[#5f5545]">
                  <a
                    href={`mailto:${BOUTIQUE.email}`}
                    className="border-b border-[#d9cdb5] pb-0.5 transition-colors hover:border-[#8a5a24] hover:text-[#8a5a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                  >
                    {BOUTIQUE.email}
                  </a>
                </p>
              </Reveal>

              <Reveal delay={90} className="border-t border-[#241d15] pt-5">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                  Horaires
                </h3>
                <dl className="mt-3 space-y-3">
                  {BOUTIQUE.horaires.map((h) => (
                    <div key={h.jours}>
                      <dt className="[font-family:var(--font-elixir-display)] text-xl leading-none text-[#241d15]">
                        {h.jours}
                      </dt>
                      <dd className="mt-1 text-sm text-[#5f5545]">{h.heures}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={180} className="border-t border-[#241d15] pt-5">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                  Livraison &amp; paiement
                </h3>
                <p className="mt-3 [font-family:var(--font-elixir-display)] text-xl leading-snug text-[#241d15]">
                  {BOUTIQUE.livraison}
                </p>
                <p className="mt-3 text-sm text-[#5f5545]">{BOUTIQUE.paiement}</p>
              </Reveal>
            </div>

            {/* Presse */}
            <div className="mt-14 grid grid-cols-1 gap-8 border-t border-[#e4dac7] pt-10 @xl:grid-cols-3">
              {PRESSE.map((p, i) => (
                <Reveal key={p.source} delay={i * 90}>
                  <blockquote>
                    <p className="[font-family:var(--font-elixir-display)] text-xl italic leading-snug text-[#3a2f22] @2xl:text-2xl">
                      «&nbsp;{p.citation}&nbsp;»
                    </p>
                    <footer className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                      {p.source}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>

        {/* ========================= LE COFFRET ========================= */}
        <section
          id="elx-coffret"
          className="scroll-mt-[84px] bg-[#efe7d9]"
        >
          <Shell className="grid grid-cols-1 gap-10 py-16 @xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] @xl:gap-14 @3xl:py-24">
            <Reveal>
              <Eyebrow index="N° 04">Votre coffret</Eyebrow>
              <h2 className="mt-5 [font-family:var(--font-elixir-display)] text-4xl font-light leading-[1.02] text-[#241d15] @2xl:text-5xl">
                Composez votre
                <br />
                <span className="italic text-[#3a2f22]">coffret signature.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#5f5545]">
                Chaque coffret est présenté dans un écrin de coton, gravé à vos
                initiales sur demande. Un conseiller confirme votre commande par
                téléphone — aucun paiement en ligne n&apos;est requis.
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#8a7c66]">
                Livraison offerte à Abidjan
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="border border-[#d9cdb5] bg-[#f7f3ec] p-6 @3xl:p-8">
                {commande ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#b08d57] text-[#b08d57]">
                      <Check className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 [font-family:var(--font-elixir-display)] text-3xl text-[#241d15]">
                      Coffret réservé
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5f5545]">
                      Merci. Un conseiller Maison Élixir vous contactera au{" "}
                      {BOUTIQUE.telephone} pour finaliser votre commande et
                      organiser la livraison.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLignes([]);
                        setCommande(false);
                      }}
                      className="mt-7 border-b border-[#c3b596] pb-1 text-[11px] uppercase tracking-[0.24em] text-[#5f5545] transition-colors hover:border-[#8a5a24] hover:text-[#8a5a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                    >
                      Composer un nouveau coffret
                    </button>
                  </div>
                ) : count === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <p className="[font-family:var(--font-elixir-display)] text-2xl text-[#241d15]">
                      Votre coffret est vide.
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-[#5f5545]">
                      Ajoutez une eau de parfum depuis la collection pour
                      commencer votre écrin.
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollTo("elx-collection")}
                      className="mt-6 bg-[#241d15] px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-[#f4ecdd] transition-colors hover:bg-[#3a2f22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                    >
                      Découvrir la collection
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                      {count} flacon{count > 1 ? "s" : ""}
                    </p>
                    <ul className="mt-4 divide-y divide-[#e4dac7]">
                      {lignes.map((l) => (
                        <li
                          key={l.key}
                          className="flex items-center justify-between gap-4 py-4"
                        >
                          <div className="min-w-0">
                            <p className="[font-family:var(--font-elixir-display)] text-xl leading-none text-[#241d15]">
                              {l.parfum.nom}
                            </p>
                            <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8a7c66]">
                              Eau de parfum · {l.contenance} ml
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-[#3a2f22]">
                              {formatFcfa(l.prix)}
                            </span>
                            <button
                              type="button"
                              onClick={() => retirer(l.key)}
                              aria-label={`Retirer ${l.parfum.nom} du coffret`}
                              className="text-[#a99d86] transition-colors hover:text-[#8a5a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                            >
                              <X className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-5 space-y-2 border-t border-[#241d15] pt-5 text-sm">
                      <div className="flex justify-between text-[#5f5545]">
                        <dt>Sous-total</dt>
                        <dd>{formatFcfa(total)}</dd>
                      </div>
                      <div className="flex justify-between text-[#5f5545]">
                        <dt>Livraison — Abidjan</dt>
                        <dd className="uppercase tracking-[0.14em] text-[#8a5a24]">
                          Offerte
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between pt-2">
                        <dt className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                          Total
                        </dt>
                        <dd className="[font-family:var(--font-elixir-display)] text-3xl leading-none text-[#241d15]">
                          {formatFcfa(total)}
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={() => setCommande(true)}
                      className="mt-6 flex w-full items-center justify-center gap-2 bg-[#241d15] py-4 text-[11px] uppercase tracking-[0.24em] text-[#f4ecdd] transition-colors hover:bg-[#3a2f22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f3ec]"
                    >
                      Commander le coffret
                    </button>
                    <p className="mt-3 text-center text-[11px] text-[#6f6455]">
                      Paiement à la confirmation · Wave, Orange Money ou en
                      boutique
                    </p>
                  </>
                )}
              </div>
            </Reveal>
          </Shell>
        </section>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="bg-[#17130d] text-[#cbbfa8]">
        <Shell className="py-14 @3xl:py-20">
          <div className="grid grid-cols-1 gap-10 @xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] @xl:gap-12">
            <div>
              <p className="[font-family:var(--font-elixir-display)] text-2xl tracking-[0.28em] text-[#f4ecdd]">
                MAISON ÉLIXIR
              </p>
              <p className="mt-4 max-w-xs [font-family:var(--font-elixir-display)] text-lg leading-relaxed text-[#a99d86]">
                Haute parfumerie composée à Cocody, à partir des matières de
                l&apos;Afrique de l&apos;Ouest.
              </p>
              <div className="elx-rule mt-6 h-px w-28" aria-hidden />
            </div>

            <nav aria-label="Navigation pied de page">
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                Explorer
              </h3>
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className="text-sm text-[#cbbfa8] transition-colors hover:text-[#f4ecdd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#8a7c66]">
                Nous suivre
              </h3>
              <ul className="mt-4 space-y-2.5">
                {["Instagram", "Pinterest", "WhatsApp"].map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      aria-label={`${r} — Maison Élixir (démonstration)`}
                      className="text-sm text-[#cbbfa8] transition-colors hover:text-[#f4ecdd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57]"
                    >
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[#a99d86]">{BOUTIQUE.telephone}</p>
              <p className="text-sm text-[#a99d86]">{BOUTIQUE.email}</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[#2f261a] pt-6 text-[11px] text-[#8a7c66] @xl:flex-row @xl:items-center @xl:justify-between">
            <p>© 2026 Maison Élixir — Abidjan. Tous droits réservés.</p>
            <p className="uppercase tracking-[0.2em]">
              Site fictif de démonstration
            </p>
          </div>
        </Shell>
      </footer>
    </div>
  );
}
