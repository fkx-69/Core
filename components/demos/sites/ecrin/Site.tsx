"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  AtSign,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  Flower2,
  GraduationCap,
  Hand,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { fraunces, karla } from "./fonts";
import {
  AVIS,
  CHIFFRES,
  CONTACT,
  CRENEAUX,
  CRENEAUX_PRIS,
  GALERIE,
  HORAIRES,
  JOURS,
  NAV,
  UNIVERS,
  VALEURS,
  formatFcfa,
  type Prestation,
  type UniversId,
} from "./data";

/** Icônes d'univers de prestations. */
const UNIVERS_ICONS: Record<UniversId, typeof Scissors> = {
  coiffure: Scissors,
  soins: Flower2,
  onglerie: Hand,
};

const VALEUR_ICONS = [Leaf, ShieldCheck, GraduationCap];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c96f4a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf5f1]";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#3d2c29] px-6 py-3 text-sm font-semibold text-[#faf5f1] transition-colors hover:bg-[#52403c] " +
  focusRing;

const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c3b3] bg-transparent px-6 py-3 text-sm font-semibold text-[#3d2c29] transition-colors hover:border-[#3d2c29] hover:bg-[#f3e7de] " +
  focusRing;

// —— Petits composants réutilisables ————————————————————————————————————————

/** Révélation douce au scroll (IntersectionObserver, respecte reduced-motion). */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // La variante motion-reduce force l'état final : ni translation ni fondu.
  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        shown
          ? "translate-y-0 opacity-100"
          : "translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8482a]">
      <span aria-hidden className="h-px w-6 bg-[#c96f4a]" />
      {children}
    </p>
  );
}

function Stars({ note, className = "" }: { note: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`Note de ${note} sur 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= note
              ? "fill-[#c98a3c] text-[#c98a3c]"
              : "fill-[#e6d5c6] text-[#e6d5c6]"
          }`}
          aria-hidden
        />
      ))}
    </span>
  );
}

/** Conteneur centré à gouttières fluides. */
function Bloc({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1200px] px-5 @xl:px-8 @3xl:px-12 @5xl:px-16 ${className}`}
    >
      {children}
    </div>
  );
}

// —— Site ————————————————————————————————————————————————————————————————————

/**
 * Site vitrine complet du salon « L'Écrin » (Le Plateau, Abidjan). Rendu à
 * l'identique en pleine page (/demos/ecrin) et en aperçu embarqué dans le
 * portfolio : toute la mise en page passe par des container queries Tailwind
 * (@sm…@7xl), jamais par les breakpoints d'écran.
 */
export default function Site() {
  const [univers, setUnivers] = useState<UniversId>("coiffure");

  // Parcours de réservation
  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [jourId, setJourId] = useState<string | null>(null);
  const [creneau, setCreneau] = useState<string | null>(null);
  const [confirme, setConfirme] = useState(false);

  const jour = JOURS.find((j) => j.id === jourId) ?? null;
  const etape = confirme ? 3 : prestation ? 2 : 1;
  const universActif = UNIVERS.find((u) => u.id === univers) ?? UNIVERS[0];

  function goTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function reserver(p?: Prestation) {
    setPrestation(p ?? null);
    setJourId(null);
    setCreneau(null);
    setConfirme(false);
    goTo("ecrin-rendez-vous");
  }

  const acompte = prestation
    ? Math.round((prestation.prix * 0.3) / 500) * 500
    : 0;

  return (
    <div
      className={`${fraunces.variable} ${karla.variable} @container [font-family:var(--font-ecrin-sans)] bg-[#faf5f1] text-[#3d2c29] antialiased`}
    >
      <style>{`
        @keyframes ecr-float {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .ecr-float { animation: ecr-float 7s ease-in-out infinite alternate; }
        }
      `}</style>

      {/* Bandeau utilitaire (non collant) */}
      <div className="border-b border-[#ecdccf] bg-[#f3e7de]">
        <Bloc className="flex items-center justify-between gap-4 py-2 text-[11px] tracking-wide text-[#7a635c] @3xl:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#c96f4a]" aria-hidden />
            <span className="truncate">{CONTACT.ville}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#c96f4a]" aria-hidden />
            <span className="hidden @sm:inline">Ouvert aujourd&apos;hui&nbsp;·&nbsp;</span>
            9 h – 19 h
          </span>
        </Bloc>
      </div>

      {/* En-tête collant */}
      <header className="sticky top-0 z-30 border-b border-[#ecdccf] bg-[#faf5f1]/85 backdrop-blur-md">
        <Bloc className="flex items-center justify-between gap-4 py-3.5">
          <a
            href="#ecrin-top"
            onClick={(e) => {
              e.preventDefault();
              goTo("ecrin-top");
            }}
            className={`group inline-flex items-baseline gap-1.5 ${focusRing} rounded-md`}
          >
            <span className="[font-family:var(--font-ecrin-serif)] text-[1.35rem] font-medium leading-none tracking-tight text-[#3d2c29] @3xl:text-2xl">
              L&apos;Écrin
            </span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#c96f4a]" />
          </a>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 @3xl:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item.id);
                }}
                className={`rounded-full px-3.5 py-2 text-sm font-medium text-[#6b544e] transition-colors hover:bg-[#f3e7de] hover:text-[#3d2c29] ${focusRing}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${CONTACT.telephoneLien}`}
              className={`hidden items-center gap-1.5 rounded-full border border-[#d9c3b3] px-3.5 py-2 text-sm font-medium text-[#3d2c29] transition-colors hover:border-[#3d2c29] @sm:inline-flex @3xl:mr-1 ${focusRing}`}
            >
              <Phone className="h-3.5 w-3.5 text-[#c96f4a]" aria-hidden />
              <span className="hidden @2xl:inline">{CONTACT.telephone}</span>
              <span className="@2xl:hidden">Appeler</span>
            </a>
            <button
              type="button"
              onClick={() => reserver()}
              className={`inline-flex items-center gap-1.5 rounded-full bg-[#3d2c29] px-4 py-2 text-sm font-semibold text-[#faf5f1] transition-colors hover:bg-[#52403c] ${focusRing}`}
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              <span className="hidden @sm:inline">Rendez-vous</span>
              <span className="@sm:hidden">RDV</span>
            </button>
          </div>
        </Bloc>
      </header>

      <main id="ecrin-top" className="scroll-mt-[80px]">
        {/* ——— Hero ——— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="ecr-float pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-[#f0ddd0] opacity-70 blur-2xl"
          />
          <Bloc className="relative py-12 @3xl:py-16 @5xl:py-24">
            <div className="grid items-center gap-10 @5xl:grid-cols-[1.02fr_1fr] @5xl:gap-14">
              <div className="screen-in">
                <Eyebrow>Salon de beauté — Le Plateau, Abidjan</Eyebrow>
                <h1 className="mt-5 [font-family:var(--font-ecrin-serif)] text-[2.4rem] font-light leading-[1.02] tracking-[-0.02em] text-[#3d2c29] @xl:text-[3rem] @3xl:text-[3.6rem] @5xl:text-[4.1rem]">
                  Prenez le temps
                  <br />
                  d&apos;être{" "}
                  <em className="font-normal italic text-[#c96f4a]">rayonnante</em>.
                </h1>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#6b544e] @3xl:text-base">
                  Coiffure, soins du visage et onglerie d&apos;exception, dans un
                  salon feutré au cœur du Plateau. Une équipe experte, des produits
                  naturels et toute l&apos;attention que vous méritez.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => reserver()} className={btnPrimary}>
                    Prendre rendez-vous
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                  <a
                    href="#ecrin-prestations"
                    onClick={(e) => {
                      e.preventDefault();
                      goTo("ecrin-prestations");
                    }}
                    className={btnGhost}
                  >
                    Découvrir les prestations
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#6b544e]">
                  <span className="inline-flex items-center gap-2">
                    <Stars note={5} />
                    <span className="font-semibold text-[#3d2c29]">4,9/5</span>
                    <span className="text-[#8a746c]">· 320 avis</span>
                  </span>
                  <span aria-hidden className="hidden h-4 w-px bg-[#e0cbbb] @sm:block" />
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#c96f4a]" aria-hidden />
                    Produits au karité de Korhogo
                  </span>
                </div>
              </div>

              {/* Photo en arche + cadre décalé + carte flottante */}
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border border-[#d9b8a4] @3xl:rounded-[2.75rem]"
                />
                <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] ring-1 ring-[#e6d2c4] @xl:min-h-[380px] @3xl:min-h-[440px] @3xl:rounded-[2.75rem] @5xl:min-h-[520px]">
                  <Image
                    src="/assets/demos/salon/hero.webp"
                    alt="Salle d'accueil chaleureuse du salon L'Écrin, au Plateau"
                    fill
                    sizes="660px"
                    preload
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#2a1c1a]/45 via-transparent to-transparent"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-white/50 bg-[#faf5f1]/90 px-4 py-3 shadow-sm backdrop-blur-sm @3xl:bottom-5 @3xl:left-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3d2c29] text-[#faf5f1]">
                      <Flower2 className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight text-[#3d2c29]">
                        Sur rendez-vous
                      </p>
                      <p className="text-xs leading-tight text-[#7a635c]">
                        6 jours sur 7, dès 9 h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Bloc>
        </section>

        {/* ——— Prestations ——— */}
        <section id="ecrin-prestations" className="scroll-mt-[80px] bg-[#f5ebe3] py-14 @3xl:py-20 @5xl:py-28">
          <Bloc>
            <Reveal className="max-w-2xl">
              <Eyebrow>Nos prestations</Eyebrow>
              <h2 className="mt-4 [font-family:var(--font-ecrin-serif)] text-[1.9rem] font-light leading-[1.05] tracking-[-0.01em] text-[#3d2c29] @xl:text-[2.3rem] @3xl:text-[2.8rem]">
                Trois univers, un même soin du détail
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#6b544e]">
                Chaque prestation est réalisée avec des produits professionnels et
                un matériel stérilisé. Choisissez un univers pour découvrir les
                tarifs et les durées.
              </p>
            </Reveal>

            {/* Onglets d'univers */}
            <div
              role="tablist"
              aria-label="Univers de prestations"
              className="mt-8 flex flex-wrap gap-2"
            >
              {UNIVERS.map((u) => {
                const Icon = UNIVERS_ICONS[u.id];
                const actif = u.id === univers;
                return (
                  <button
                    key={u.id}
                    type="button"
                    role="tab"
                    aria-selected={actif}
                    onClick={() => setUnivers(u.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
                      actif
                        ? "bg-[#3d2c29] text-[#faf5f1]"
                        : "border border-[#e0cbbb] bg-[#fffdfb] text-[#6b544e] hover:border-[#c96f4a] hover:text-[#3d2c29]"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {u.nom}
                  </button>
                );
              })}
            </div>

            <div
              key={univers}
              className="screen-in mt-6 grid gap-5 @xl:grid-cols-[0.82fr_1fr] @xl:gap-8"
            >
              {/* Visuel de l'univers */}
              <div className="relative min-h-[240px] overflow-hidden rounded-[1.75rem] ring-1 ring-[#e6d2c4] @xl:min-h-[360px]">
                <Image
                  src={universActif.image}
                  alt={universActif.imageAlt}
                  fill
                  sizes="520px"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#2a1c1a]/40 to-transparent"
                />
                <p className="absolute bottom-4 left-4 max-w-[15rem] text-sm font-medium leading-snug text-[#faf5f1]">
                  {universActif.intro}
                </p>
              </div>

              {/* Carte tarifaire */}
              <div className="rounded-[1.75rem] border border-[#ecdccf] bg-[#fffdfb] p-5 @3xl:p-7">
                <ul className="divide-y divide-[#f0e3d8]">
                  {universActif.prestations.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3.5 first:pt-0 last:pb-0"
                    >
                      <span className="text-[15px] font-semibold text-[#3d2c29]">
                        {p.nom}
                      </span>
                      {/* Points de conduite */}
                      <span
                        aria-hidden
                        className="mx-1 hidden min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-[#d8c4b4] @sm:block"
                      />
                      <span className="ml-auto whitespace-nowrap text-[15px] font-semibold tabular-nums text-[#a8482a] @sm:ml-0">
                        {formatFcfa(p.prix)}
                      </span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-[#8a746c]">
                        <Clock className="h-3 w-3" aria-hidden />
                        {p.duree}
                      </span>
                      <span className="basis-full text-[13px] leading-relaxed text-[#7a635c]">
                        {p.description}
                      </span>
                      <button
                        type="button"
                        onClick={() => reserver(p)}
                        className={`mt-1 inline-flex items-center gap-1 rounded-full bg-[#f3e0d5] px-3 py-1.5 text-xs font-semibold text-[#a8482a] transition-colors hover:bg-[#eccdbd] ${focusRing}`}
                      >
                        Réserver
                        <ArrowRight className="h-3 w-3" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Bloc>
        </section>

        {/* ——— Le salon ——— */}
        <section id="ecrin-salon" className="scroll-mt-[80px] py-14 @3xl:py-20 @5xl:py-28">
          <Bloc>
            <div className="grid gap-10 @5xl:grid-cols-[1fr_0.9fr] @5xl:items-center @5xl:gap-16">
              <Reveal>
                <Eyebrow>Le salon</Eyebrow>
                <h2 className="mt-4 [font-family:var(--font-ecrin-serif)] text-[1.9rem] font-light leading-[1.05] tracking-[-0.01em] text-[#3d2c29] @xl:text-[2.3rem] @3xl:text-[2.8rem]">
                  Une maison de beauté pensée comme un cocon
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-[#6b544e]">
                  Née en 2016 d&apos;une envie simple — offrir aux Abidjanaises un
                  lieu où l&apos;on prend vraiment soin d&apos;elles — L&apos;Écrin
                  réunit aujourd&apos;hui coiffeuses, esthéticiennes et prothésistes
                  autour d&apos;une même exigence.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#6b544e]">
                  Ici, pas de précipitation : chaque rendez-vous est un moment
                  suspendu, entre matières naturelles, gestes précis et une
                  hospitalité toute ivoirienne.
                </p>

                <ul className="mt-8 grid gap-4 @xl:grid-cols-3">
                  {VALEURS.map((v, i) => {
                    const Icon = VALEUR_ICONS[i];
                    return (
                      <li
                        key={v.titre}
                        className="rounded-2xl border border-[#ecdccf] bg-[#fffdfb] p-4"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e0d5] text-[#a8482a]">
                          <Icon className="h-4.5 w-4.5" aria-hidden />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-[#3d2c29]">
                          {v.titre}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-[#7a635c]">
                          {v.texte}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              <Reveal delay={120}>
                <div className="grid grid-cols-2 gap-4">
                  {CHIFFRES.map((c) => (
                    <div
                      key={c.label}
                      className="rounded-2xl border border-[#ecdccf] bg-[#fffdfb] p-5 text-center @3xl:p-6"
                    >
                      <p className="[font-family:var(--font-ecrin-serif)] text-[2rem] font-light leading-none text-[#c96f4a] @3xl:text-[2.6rem]">
                        {c.valeur}
                      </p>
                      <p className="mt-2 text-[13px] leading-snug text-[#6b544e]">
                        {c.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Bloc>
        </section>

        {/* ——— Galerie ——— */}
        <section
          id="ecrin-galerie"
          className="scroll-mt-[80px] overflow-hidden bg-[#3d2c29] py-14 text-[#faf5f1] @3xl:py-20 @5xl:py-28"
        >
          <Bloc>
            <Reveal className="max-w-2xl">
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e6a988]">
                <span aria-hidden className="h-px w-6 bg-[#c96f4a]" />
                Galerie
              </p>
              <h2 className="mt-4 [font-family:var(--font-ecrin-serif)] text-[1.9rem] font-light leading-[1.05] tracking-[-0.01em] text-[#faf5f1] @xl:text-[2.3rem] @3xl:text-[2.8rem]">
                L&apos;atmosphère de L&apos;Écrin
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#e4d3c9]">
                Quelques instants capturés au salon — l&apos;accueil, les gestes,
                les finitions.
              </p>
            </Reveal>

            <div className="mt-9 grid grid-cols-2 gap-4 @3xl:grid-cols-4 @3xl:gap-5">
              {GALERIE.map((g, i) => (
                <Reveal
                  key={g.image + i}
                  delay={i * 90}
                  className={i % 2 === 1 ? "@3xl:translate-y-8" : ""}
                >
                  <figure className="group">
                    <div className="relative h-[210px] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] ring-1 ring-white/15 @xl:h-[250px] @3xl:h-[290px]">
                      <Image
                        src={g.image}
                        alt={g.alt}
                        fill
                        sizes="360px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="mt-3 text-center text-[13px] text-[#e4d3c9]">
                      {g.legende}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Bloc>
        </section>

        {/* ——— Avis ——— */}
        <section id="ecrin-avis" className="scroll-mt-[80px] py-14 @3xl:py-20 @5xl:py-28">
          <Bloc>
            <Reveal className="max-w-2xl">
              <Eyebrow>Elles nous font confiance</Eyebrow>
              <h2 className="mt-4 [font-family:var(--font-ecrin-serif)] text-[1.9rem] font-light leading-[1.05] tracking-[-0.01em] text-[#3d2c29] @xl:text-[2.3rem] @3xl:text-[2.8rem]">
                Le mot de nos clientes
              </h2>
            </Reveal>

            <div className="mt-9 grid gap-5 @2xl:grid-cols-2">
              {AVIS.map((a, i) => (
                <Reveal key={a.nom} delay={i * 80}>
                  <figure className="flex h-full flex-col rounded-[1.5rem] border border-[#ecdccf] bg-[#fffdfb] p-6">
                    <Stars note={a.note} />
                    <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#4c3a35]">
                      « {a.texte} »
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-[#f0e3d8] pt-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e0d5] text-sm font-semibold text-[#a8482a]">
                        {a.nom.charAt(0)}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#3d2c29]">
                          {a.nom}
                        </span>
                        <span className="block text-xs text-[#8a746c]">
                          {a.quartier}, Abidjan
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Bloc>
        </section>

        {/* ——— Rendez-vous ——— */}
        <section
          id="ecrin-rendez-vous"
          className="scroll-mt-[80px] bg-[#f5ebe3] py-14 @3xl:py-20 @5xl:py-28"
        >
          <Bloc>
            <Reveal className="max-w-2xl">
              <Eyebrow>Prendre rendez-vous</Eyebrow>
              <h2 className="mt-4 [font-family:var(--font-ecrin-serif)] text-[1.9rem] font-light leading-[1.05] tracking-[-0.01em] text-[#3d2c29] @xl:text-[2.3rem] @3xl:text-[2.8rem]">
                Réservez votre parenthèse en trois étapes
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#6b544e]">
                Choisissez votre prestation, votre jour et votre créneau. Nous vous
                confirmons tout de suite.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-5 @5xl:grid-cols-[0.82fr_1.18fr] @5xl:gap-7">
              {/* Panneau de réassurance + récap live */}
              <aside className="rounded-[1.75rem] bg-[#3d2c29] p-6 text-[#faf5f1] @3xl:p-8">
                <p className="[font-family:var(--font-ecrin-serif)] text-xl font-light @3xl:text-2xl">
                  Un moment rien qu&apos;à vous
                </p>
                <ul className="mt-5 space-y-3 text-[13px] text-[#e4d3c9]">
                  {[
                    "Réservation en 2 minutes, sans compte à créer",
                    "Acompte de 30 % via Wave ou Orange Money",
                    "Annulation gratuite jusqu'à 24 h avant",
                    "SMS de rappel envoyé la veille",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#e6a988]" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e6a988]">
                    Votre sélection
                  </p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#c9b3aa]">Prestation</dt>
                      <dd className="text-right font-medium text-[#faf5f1]">
                        {prestation ? prestation.nom : "—"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#c9b3aa]">Jour</dt>
                      <dd className="text-right font-medium text-[#faf5f1]">
                        {jour ? `${jour.jourLong} ${jour.date}` : "—"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#c9b3aa]">Heure</dt>
                      <dd className="text-right font-medium text-[#faf5f1]">
                        {creneau ?? "—"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
                      <dt className="text-[#c9b3aa]">Total</dt>
                      <dd className="text-right font-semibold text-[#faf5f1]">
                        {prestation ? formatFcfa(prestation.prix) : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>

              {/* Module de réservation */}
              <div className="rounded-[1.75rem] border border-[#ecdccf] bg-[#fffdfb] p-6 @3xl:p-8">
                {/* Fil d'étapes */}
                <ol
                  aria-label="Étapes de la réservation"
                  className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-medium @3xl:text-xs"
                >
                  {["Prestation", "Date & heure", "Confirmation"].map((label, i) => {
                    const num = i + 1;
                    const done = etape > num;
                    const current = etape === num;
                    return (
                      <li key={label} className="flex items-center gap-2">
                        {i > 0 && (
                          <span aria-hidden className="h-px w-4 bg-[#e0cbbb] @sm:w-6" />
                        )}
                        <span
                          aria-current={current ? "step" : undefined}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                            current
                              ? "bg-[#3d2c29] text-[#faf5f1]"
                              : done
                                ? "bg-[#f3e0d5] text-[#a8482a]"
                                : "border border-[#ecdccf] bg-[#faf5f1] text-[#a08a82]"
                          }`}
                        >
                          <span
                            aria-hidden
                            className="inline-flex h-4 w-4 items-center justify-center"
                          >
                            {done ? <Check className="h-3.5 w-3.5" /> : num}
                          </span>
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-6">
                  {/* Étape 1 — prestation */}
                  {etape === 1 && (
                    <div className="screen-in space-y-6">
                      {UNIVERS.map((u) => {
                        const Icon = UNIVERS_ICONS[u.id];
                        return (
                          <div key={u.id}>
                            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a8482a]">
                              <Icon className="h-3.5 w-3.5" aria-hidden />
                              {u.nom}
                            </p>
                            <div className="mt-3 grid gap-2.5 @xl:grid-cols-2">
                              {u.prestations.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setPrestation(p)}
                                  className={`group flex items-center justify-between gap-3 rounded-2xl border border-[#ecdccf] bg-[#faf5f1] px-4 py-3 text-left transition-colors hover:border-[#c96f4a] hover:bg-[#fbeee6] ${focusRing}`}
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-[#3d2c29]">
                                      {p.nom}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-[#8a746c]">
                                      {p.duree} · {formatFcfa(p.prix)}
                                    </span>
                                  </span>
                                  <ArrowRight
                                    className="h-4 w-4 shrink-0 text-[#c9b3aa] transition-colors group-hover:text-[#c96f4a]"
                                    aria-hidden
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Étape 2 — date & heure */}
                  {etape === 2 && prestation && (
                    <div className="screen-in">
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5ebe3] px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#3d2c29]">
                            {prestation.nom}
                          </p>
                          <p className="text-xs text-[#8a746c]">
                            {prestation.duree} · {formatFcfa(prestation.prix)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPrestation(null)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-[#a8482a] transition-colors hover:text-[#3d2c29] ${focusRing}`}
                        >
                          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                          Changer
                        </button>
                      </div>

                      <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8a746c]">
                        Choisissez un jour
                      </p>
                      <div
                        role="group"
                        aria-label="Jour du rendez-vous"
                        className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
                      >
                        {JOURS.map((j) => {
                          const selected = jourId === j.id;
                          return (
                            <button
                              key={j.id}
                              type="button"
                              disabled={j.ferme}
                              aria-pressed={selected}
                              onClick={() => {
                                setJourId(j.id);
                                setCreneau(null);
                              }}
                              className={`flex shrink-0 flex-col items-center rounded-2xl border px-3.5 py-2 text-center transition-colors ${focusRing} ${
                                j.ferme
                                  ? "cursor-not-allowed border-[#eee0d5] bg-[#f7ece4] text-[#c3b1a8]"
                                  : selected
                                    ? "border-[#3d2c29] bg-[#3d2c29] text-[#faf5f1]"
                                    : "border-[#e0cbbb] bg-[#faf5f1] text-[#6b544e] hover:border-[#c96f4a] hover:text-[#3d2c29]"
                              }`}
                            >
                              <span className="text-xs font-medium">{j.jourCourt}</span>
                              <span className="text-sm font-semibold">{j.date}</span>
                              {j.ferme && (
                                <span className="text-[10px] font-medium uppercase tracking-wide">
                                  Fermé
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {jour ? (
                        <div key={jour.id} className="screen-in mt-6">
                          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8a746c]">
                            Créneaux disponibles
                          </p>
                          <div
                            role="group"
                            aria-label="Créneau horaire"
                            className="mt-3 grid grid-cols-3 gap-2.5 @xl:grid-cols-4"
                          >
                            {CRENEAUX.map((c) => {
                              const pris = (CRENEAUX_PRIS[jour.id] ?? []).includes(c);
                              const selected = creneau === c;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  disabled={pris}
                                  aria-pressed={selected}
                                  aria-label={
                                    pris ? `${c} — complet` : `Réserver à ${c}`
                                  }
                                  onClick={() => setCreneau(c)}
                                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium tabular-nums transition-colors ${focusRing} ${
                                    pris
                                      ? "cursor-not-allowed border-[#f0e3d8] bg-[#f7ece4] text-[#c3b1a8] line-through"
                                      : selected
                                        ? "border-[#3d2c29] bg-[#3d2c29] text-[#faf5f1]"
                                        : "border-[#e0cbbb] bg-[#faf5f1] text-[#4c3a35] hover:border-[#c96f4a]"
                                  }`}
                                >
                                  {c}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-6 rounded-2xl border border-dashed border-[#e0cbbb] px-4 py-6 text-center text-sm text-[#8a746c]">
                          Sélectionnez un jour pour afficher les créneaux.
                        </p>
                      )}

                      <button
                        type="button"
                        disabled={!jour || !creneau}
                        onClick={() => setConfirme(true)}
                        className={`mt-6 w-full rounded-full bg-[#3d2c29] px-6 py-3 text-sm font-semibold text-[#faf5f1] transition-colors enabled:hover:bg-[#52403c] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
                      >
                        Confirmer le rendez-vous
                      </button>
                    </div>
                  )}

                  {/* Étape 3 — confirmation */}
                  {etape === 3 && prestation && jour && creneau && (
                    <div className="screen-in text-center">
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e0d5] text-[#a8482a]">
                        <CalendarCheck className="h-8 w-8" aria-hidden />
                      </span>
                      <h3 className="mt-5 [font-family:var(--font-ecrin-serif)] text-2xl font-light text-[#3d2c29]">
                        C&apos;est confirmé !
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6b544e]">
                        Nous vous attendons pour votre{" "}
                        <strong className="font-semibold text-[#3d2c29]">
                          {prestation.nom}
                        </strong>
                        . Un SMS de rappel vous sera envoyé la veille.
                      </p>

                      <dl className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-2xl border border-[#ecdccf] bg-[#faf5f1] p-5 text-left text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-[#8a746c]">Jour</dt>
                          <dd className="font-semibold text-[#3d2c29]">
                            {jour.jourLong} {jour.date}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-[#8a746c]">Heure</dt>
                          <dd className="font-semibold text-[#3d2c29]">{creneau}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-[#8a746c]">Durée</dt>
                          <dd className="font-semibold text-[#3d2c29]">
                            {prestation.duree}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-[#ecdccf] pt-2.5">
                          <dt className="text-[#8a746c]">Total</dt>
                          <dd className="font-semibold text-[#3d2c29]">
                            {formatFcfa(prestation.prix)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-[#8a746c]">Acompte Wave / OM</dt>
                          <dd className="font-semibold text-[#a8482a]">
                            {formatFcfa(acompte)}
                          </dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        onClick={() => reserver()}
                        className={`mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#d9c3b3] px-5 py-2.5 text-xs font-semibold text-[#3d2c29] transition-colors hover:border-[#3d2c29] hover:bg-[#f3e7de] ${focusRing}`}
                      >
                        Prendre un autre rendez-vous
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Bloc>
        </section>

        {/* ——— Infos pratiques ——— */}
        <section id="ecrin-infos" className="scroll-mt-[80px] py-14 @3xl:py-20 @5xl:py-24">
          <Bloc>
            <div className="grid gap-8 @2xl:grid-cols-2 @5xl:grid-cols-3">
              <Reveal>
                <Eyebrow>Nous trouver</Eyebrow>
                <p className="mt-4 flex items-start gap-3 text-[15px] leading-relaxed text-[#4c3a35]">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#c96f4a]" aria-hidden />
                  <span>
                    {CONTACT.adresse}
                    <br />
                    {CONTACT.ville}
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-3 text-[15px] text-[#4c3a35]">
                  <Phone className="h-5 w-5 shrink-0 text-[#c96f4a]" aria-hidden />
                  <a
                    href={`tel:${CONTACT.telephoneLien}`}
                    className={`rounded transition-colors hover:text-[#a8482a] ${focusRing}`}
                  >
                    {CONTACT.telephone}
                  </a>
                </p>
                <p className="mt-4 flex items-center gap-3 text-[15px] text-[#4c3a35]">
                  <Mail className="h-5 w-5 shrink-0 text-[#c96f4a]" aria-hidden />
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className={`rounded transition-colors hover:text-[#a8482a] ${focusRing}`}
                  >
                    {CONTACT.email}
                  </a>
                </p>
              </Reveal>

              <Reveal delay={90}>
                <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8482a]">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  Horaires
                </p>
                <ul className="mt-4 space-y-2.5">
                  {HORAIRES.map((h) => (
                    <li
                      key={h.jour}
                      className="flex items-center justify-between gap-4 border-b border-[#f0e3d8] pb-2.5 text-[15px] last:border-0"
                    >
                      <span className="text-[#4c3a35]">{h.jour}</span>
                      <span
                        className={`font-medium ${
                          h.heures === "Fermé" ? "text-[#b09a91]" : "text-[#3d2c29]"
                        }`}
                      >
                        {h.heures}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={180} className="@2xl:col-span-2 @5xl:col-span-1">
                <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8482a]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Réservez maintenant
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-[#6b544e]">
                  Offrez-vous un moment de douceur. Prenez rendez-vous en ligne ou
                  écrivez-nous sur WhatsApp.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={() => reserver()} className={btnPrimary}>
                    Prendre rendez-vous
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhost}
                  >
                    <MessageCircle className="h-4 w-4 text-[#c96f4a]" aria-hidden />
                    WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>
          </Bloc>
        </section>
      </main>

      {/* ——— Pied de page ——— */}
      <footer className="border-t border-[#ecdccf] bg-[#f3e7de]">
        <Bloc className="py-10">
          <div className="flex flex-col gap-8 @3xl:flex-row @3xl:items-start @3xl:justify-between">
            <div className="max-w-sm">
              <p className="[font-family:var(--font-ecrin-serif)] text-2xl font-medium tracking-tight text-[#3d2c29]">
                L&apos;Écrin
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#7a635c]">
                Salon de beauté au cœur du Plateau. Coiffure, soins et onglerie,
                avec le soin du détail qui change tout.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`https://instagram.com/${CONTACT.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de L'Écrin"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#d9c3b3] text-[#6b544e] transition-colors hover:border-[#3d2c29] hover:text-[#3d2c29] ${focusRing}`}
                >
                  <AtSign className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp de L'Écrin"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#d9c3b3] text-[#6b544e] transition-colors hover:border-[#3d2c29] hover:text-[#3d2c29] ${focusRing}`}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>

            <nav
              aria-label="Pied de page"
              className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm @sm:grid-cols-3"
            >
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.id);
                  }}
                  className={`rounded text-[#6b544e] transition-colors hover:text-[#3d2c29] ${focusRing}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[#e2cdbc] pt-6 text-xs text-[#8a746c] @sm:flex-row @sm:items-center @sm:justify-between">
            <p>© 2026 L&apos;Écrin — {CONTACT.ville}.</p>
            <p className="italic">
              Site fictif de démonstration, réalisé par Core.
            </p>
          </div>
        </Bloc>
      </footer>
    </div>
  );
}
