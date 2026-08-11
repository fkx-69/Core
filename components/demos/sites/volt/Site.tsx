"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  Flame,
  Fuel,
  Leaf,
  Mail,
  MapPin,
  Martini,
  Phone,
  Sparkles,
  Store,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { voltBody, voltDisplay } from "./fonts";
import {
  AVANTAGES_DISTRIBUTEUR,
  AVERTISSEMENT,
  COMMUNES,
  COMPOSITION,
  CONTACT,
  EXPANSION,
  IMAGE_MARQUE,
  MANIFESTE,
  MARQUEE,
  NAV,
  ORIGINES,
  POINTS_DE_VENTE,
  PRIX,
  RESEAUX,
  SAVEURS,
  STATS_MARQUE,
  TYPES_COMMERCE,
  type Saveur,
  type SaveurId,
} from "./data";

/* ------------------------------------------------------------------ */
/* Classes partagées (littérales, pour le compilateur Tailwind).       */
/* ------------------------------------------------------------------ */

const display = "[font-family:var(--font-volt-display)]";

const conteneur = "mx-auto w-full max-w-[76rem] px-5 @2xl:px-8 @5xl:px-12";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--volt-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0e]";

const btnPrimaire = `${focusRing} inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--volt-accent)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0a0a0e] shadow-[0_12px_40px_-12px_var(--volt-glow)] transition-[background-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 @2xl:text-sm`;

const btnFantome = `${focusRing} inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:border-white/40 hover:text-white @2xl:text-sm`;

const etiquette =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400";

const champ = `${focusRing} min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-base text-white placeholder:text-zinc-600 transition-colors focus:border-[color:var(--volt-accent)] focus:outline-none md:text-sm`;

const ICONES_ORIGINES: Record<string, LucideIcon> = {
  kola: Flame,
  gingembre: Leaf,
  guarana: Sparkles,
};

const ICONES_POINTS: Record<string, LucideIcon> = {
  superettes: Store,
  stations: Fuel,
  maquis: Martini,
  livraison: Bike,
};

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

/**
 * Site vitrine complet de VOLT, boisson énergisante fictive présentée à titre
 * de démonstration.
 * Rendu en pleine page sur /demos/volt et embarqué dans un mockup
 * navigateur sur /portfolio : tout le responsive est en container queries,
 * calées sur le `@container` porté par ce root. Le sélecteur de saveur
 * rethème l'intégralité de la page via les variables CSS --volt-*.
 */
export default function Site({ embedded = false }: { embedded?: boolean }) {
  const [saveurId, setSaveurId] = useState<SaveurId>(SAVEURS[0].id);
  const saveur = SAVEURS.find((s) => s.id === saveurId) ?? SAVEURS[0];
  const Main = embedded ? "div" : "main";

  const theme = {
    "--volt-accent": saveur.accent,
    "--volt-glow": saveur.glow,
    "--volt-halo": saveur.halo,
  } as CSSProperties;

  return (
    <div
      style={theme}
      className={`${voltDisplay.variable} ${voltBody.variable} demo-touch @container relative isolate bg-[#0a0a0e] text-zinc-100 [font-family:var(--font-volt-body)] selection:bg-[color:var(--volt-accent)] selection:text-[#0a0a0e]`}
    >
      <style>{`
        @keyframes volt-float {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        .volt-float { animation: volt-float 4.5s ease-in-out infinite alternate; }
        @keyframes volt-pulse {
          50% { opacity: 0.35; }
        }
        .volt-pulse { animation: volt-pulse 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .volt-float, .volt-pulse { animation: none; }
        }
      `}</style>

      <EnTete />
      <Main>
        <Hero saveur={saveur} onSelect={setSaveurId} embedded={embedded} />
        <Bandeau />
        <Saveurs saveur={saveur} onSelect={setSaveurId} />
        <Ingredients />
        <Marque />
        <PointsDeVente />
        <Distributeurs />
      </Main>
      <PiedDePage />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chrome du site                                                      */
/* ------------------------------------------------------------------ */

function EnTete() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0e]/90 backdrop-blur-md">
        {/* Filet « haute tension » qui suit la saveur active */}
        <div
          aria-hidden
          className="h-0.5 bg-[color:var(--volt-accent)] transition-colors duration-500"
        />
        <div
          className={`${conteneur} flex h-14 items-center justify-between gap-4 @3xl:h-16`}
        >
          <a
            href="#haut"
            className={`${focusRing} flex items-center gap-1.5 rounded-md`}
          >
            <Zap
              className="h-5 w-5 fill-current text-[color:var(--volt-accent)] transition-colors duration-500"
              aria-hidden
            />
            <span className={`${display} text-xl uppercase tracking-wide @3xl:text-2xl`}>
              Volt
            </span>
            <span className="sr-only">— retour en haut de page</span>
          </a>
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-6 @3xl:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${focusRing} rounded-md text-[13px] font-semibold text-zinc-400 transition-colors hover:text-white`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#distributeurs"
            className={`${focusRing} inline-flex min-h-11 items-center rounded-full bg-[color:var(--volt-accent)] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0a0a0e] transition-[background-color,filter] duration-500 hover:brightness-110 @2xl:text-xs`}
          >
            <span className="hidden @xl:inline">Devenir distributeur</span>
            <span className="@xl:hidden">Distributeur</span>
          </a>
        </div>
      </header>

      {/* Ancres rapides quand la navigation inline n'a pas la place */}
      <nav
        aria-label="Accès rapide aux sections"
        className="relative border-b border-white/[0.06] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-linear-to-l after:from-[#0a0a0e] after:to-transparent @3xl:hidden"
      >
        <div
          className={`${conteneur} scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto py-2.5 pr-10`}
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${focusRing} inline-flex min-h-11 shrink-0 snap-start items-center whitespace-nowrap rounded-full border border-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:border-white/30 hover:text-white`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

function PiedDePage() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#08080c]">
      <div className={`${conteneur} py-12 @3xl:py-16`}>
        <div className="grid gap-10 @2xl:grid-cols-2 @5xl:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-1.5">
              <Zap
                className="h-5 w-5 fill-current text-[color:var(--volt-accent)] transition-colors duration-500"
                aria-hidden
              />
              <span className={`${display} text-xl uppercase tracking-wide`}>
                Volt
              </span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              L’énergie d’une ville en mouvement. Zéro sucre, kola et guarana — trois saveurs
              taillées pour la ville qui ne dort pas.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Réseaux sociaux">
              {RESEAUX.map((reseau) => (
                <li key={reseau}>
                  <a
                    href="#haut"
                    className={`${focusRing} inline-block rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:border-[color:var(--volt-accent)] hover:text-[color:var(--volt-accent)]`}
                  >
                    {reseau}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Navigation pied de page">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
              Explorer
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`${focusRing} rounded-md text-sm text-zinc-400 transition-colors hover:text-white`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--volt-accent)] transition-colors duration-500"
                  aria-hidden
                />
                {CONTACT.adresse}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="h-4 w-4 shrink-0 text-[color:var(--volt-accent)] transition-colors duration-500"
                  aria-hidden
                />
                <a
                  href={CONTACT.telephoneLien}
                  className={`${focusRing} rounded-md transition-colors hover:text-white`}
                >
                  {CONTACT.telephone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail
                  className="h-4 w-4 shrink-0 text-[color:var(--volt-accent)] transition-colors duration-500"
                  aria-hidden
                />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={`${focusRing} rounded-md transition-colors hover:text-white`}
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 space-y-2 border-t border-white/[0.06] pt-6 text-[11px] leading-relaxed text-zinc-500">
          <p>{AVERTISSEMENT}</p>
          <p>
            © 2026 VOLT Beverages — Démonstration conceptuelle. VOLT est une marque
            fictive : ce site est une démonstration réalisée par l’agence Core.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero({
  saveur,
  onSelect,
  embedded,
}: {
  saveur: Saveur;
  onSelect: (id: SaveurId) => void;
  embedded: boolean;
}) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <section id="haut" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl transition-colors duration-700"
        style={{ backgroundColor: "var(--volt-halo)" }}
      />
      {/* Mot géant en fond, teinté par la saveur active */}
      <p
        aria-hidden
        className={`${display} pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap text-[6rem] uppercase italic leading-none opacity-[0.05] transition-colors duration-700 @2xl:text-[9rem] @5xl:-bottom-10 @5xl:text-[13rem]`}
        style={{ color: "var(--volt-accent)" }}
      >
        Haute tension
      </p>

      <div
        className={`${conteneur} relative grid items-center gap-10 py-12 @xl:grid-cols-[1.05fr_0.95fr] @xl:gap-8 @2xl:py-16 @5xl:gap-14 @5xl:py-24 ${
          embedded
            ? ""
            : "@3xl:min-h-[max(640px,calc(100dvh-67px))] @5xl:min-h-[max(695px,calc(100dvh-67px))]"
        }`}
      >
        <div>
          <p
            key={saveur.id}
            className="screen-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--volt-accent)] transition-colors duration-500"
          >
            <span
              aria-hidden
              className="volt-pulse h-1.5 w-1.5 rounded-full bg-current"
            />
            Volt {saveur.nom} — {saveur.accroche}
          </p>
          <Heading
            className={`${display} mt-5 text-5xl uppercase leading-[0.92] tracking-tight @sm:text-6xl @xl:text-5xl @2xl:text-6xl @5xl:text-7xl @7xl:text-8xl`}
          >
            L’énergie
            <br />
            <span className="italic text-[color:var(--volt-accent)] transition-colors duration-500 [text-shadow:0_0_50px_var(--volt-glow)]">
              de Bamako.
            </span>
          </Heading>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400 @2xl:text-base">
            Boisson énergisante sans sucre, montée sur la noix de kola et le
            guarana. Préparée et embouteillée pour la démonstration, taillée pour les
            journées longues et les nuits encore plus longues.
          </p>
          <div className="mt-6">
            <SelecteurSaveurs actif={saveur.id} onSelect={onSelect} />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#saveurs" className={btnPrimaire}>
              Découvrir les saveurs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#points-de-vente" className={btnFantome}>
              Où en trouver
            </a>
          </div>
          <p className="mt-5 text-xs text-zinc-500">{PRIX.mention} · 100 % vegan</p>
        </div>

        <div className="relative mx-auto w-full max-w-[320px] @xl:max-w-none @5xl:max-w-[440px]">
          <div
            aria-hidden
            className="absolute inset-4 rounded-full blur-3xl transition-colors duration-700"
            style={{ backgroundColor: "var(--volt-halo)" }}
          />
          <div className="volt-float relative aspect-square overflow-hidden rounded-[2rem] shadow-[0_40px_120px_-40px_var(--volt-glow)] ring-1 ring-white/10 transition-shadow duration-700">
            {/* Les trois canettes restent montées : le changement de saveur
                se fait en fondu, sans rechargement d'image. */}
            {SAVEURS.map((s) => (
              <Image
                key={s.id}
                src={s.image}
                alt={
                  s.id === saveur.id
                    ? `Canette VOLT ${s.nom}, éclairée au néon`
                    : ""
                }
                fill
                preload={s.id === "original"}
                sizes="440px"
                className={`object-cover transition-opacity duration-500 ${
                  s.id === saveur.id ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <p className="absolute -right-2 top-5 rotate-3 rounded-full bg-[color:var(--volt-accent)] px-3.5 py-1.5 text-xs font-black uppercase tracking-wide text-[#0a0a0e] shadow-lg transition-colors duration-500">
            {PRIX.montant} {PRIX.devise}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Bandeau défilant, rethémé par la saveur active. */
function Bandeau() {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-3"
    >
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copie) => (
          <p key={copie} className="flex shrink-0 items-center">
            {MARQUEE.map((mot) => (
              <span
                key={mot}
                className={`${display} flex items-center gap-3 px-5 text-sm uppercase tracking-[0.18em] text-zinc-400`}
              >
                <Zap className="h-3.5 w-3.5 fill-current text-[color:var(--volt-accent)] transition-colors duration-500" />
                {mot}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

function Saveurs({
  saveur,
  onSelect,
}: {
  saveur: Saveur;
  onSelect: (id: SaveurId) => void;
}) {
  return (
    <section id="saveurs" className="scroll-mt-20 @3xl:scroll-mt-24">
      <div className={`${conteneur} py-14 @2xl:py-16 @5xl:py-24`}>
        <TitreSection
          kicker="La gamme"
          titre="Trois saveurs, un seul voltage."
          texte="Chaque canette est un réglage différent de la même machine : choisissez votre courant, la page s’allume avec."
        />

        <div className="mt-10 grid gap-3 @sm:grid-cols-3 @2xl:gap-4">
          {SAVEURS.map((s) => {
            const estActive = s.id === saveur.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={estActive}
                onClick={() => onSelect(s.id)}
                className={`${focusRing} group relative overflow-hidden rounded-2xl border text-left transition-[border-color,box-shadow,transform] duration-500 ${
                  estActive
                    ? "-translate-y-1 border-[color:var(--volt-accent)] shadow-[0_24px_80px_-32px_var(--volt-glow)]"
                    : "border-white/10 hover:-translate-y-0.5 hover:border-white/30"
                }`}
              >
                <span className="relative block aspect-square">
                  <Image
                    src={s.image}
                    alt={`Canette VOLT ${s.nom}`}
                    fill
                    sizes="(min-width: 48rem) 380px, 240px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="block p-4 @2xl:p-5">
                  <span className={`${display} block text-lg uppercase @2xl:text-xl`}>
                    {s.nom}
                  </span>
                  <span className="mt-1 block text-xs text-zinc-400">
                    {s.accroche}
                  </span>
                </span>
                {estActive && (
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--volt-accent)] text-[#0a0a0e]"
                  >
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Fiche de la saveur active */}
        <div
          key={saveur.id}
          className="screen-in mt-6 grid gap-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 @2xl:mt-8 @2xl:p-8 @3xl:grid-cols-[1.25fr_1fr] @3xl:gap-12"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[color:var(--volt-accent)] transition-colors duration-500">
              {saveur.accroche}
            </p>
            <h3 className={`${display} mt-2 text-2xl uppercase @2xl:text-3xl`}>
              Volt {saveur.nom}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400 @2xl:text-[15px]">
              {saveur.description}
            </p>
            <dl className="mt-6 max-w-md space-y-3">
              {saveur.notes.map((note) => (
                <div key={note.label} className="flex items-center gap-4">
                  <dt className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {note.label}
                  </dt>
                  <dd className="flex flex-1 items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((cran) => (
                      <span
                        key={cran}
                        aria-hidden
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                          cran <= note.niveau
                            ? "bg-[color:var(--volt-accent)]"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                    <span className="sr-only">{note.niveau} sur 5</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-6 @3xl:border-l @3xl:border-t-0 @3xl:pl-10 @3xl:pt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Prix conseillé
              </p>
              <p
                className={`${display} mt-2 whitespace-nowrap text-5xl uppercase text-[color:var(--volt-accent)] transition-colors duration-500 @5xl:text-6xl`}
              >
                {PRIX.montant}{" "}
                <span className="text-2xl @5xl:text-3xl">{PRIX.devise}</span>
              </p>
              <p className="mt-2 text-xs text-zinc-500">{PRIX.mention}</p>
            </div>
            <div>
              <a href="#points-de-vente" className={btnFantome}>
                Où en trouver
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ingredients() {
  return (
    <section
      id="ingredients"
      className="scroll-mt-20 border-t border-white/[0.05] @3xl:scroll-mt-24"
    >
      <div className={`${conteneur} py-14 @2xl:py-16 @5xl:py-24`}>
        <TitreSection
          kicker="Composition"
          titre="Du carburant propre."
          texte="Pas de recette mystère : de la caféine végétale, des plantes d’ici, zéro sucre. Tout ce qui entre dans la canette tient sur une étagère."
        />

        <div className="mt-10 grid gap-3 @sm:grid-cols-2 @2xl:gap-4 @5xl:grid-cols-4">
          {COMPOSITION.map((bloc) => (
            <article
              key={bloc.titre}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 @2xl:p-6"
            >
              <p
                className={`${display} text-4xl text-[color:var(--volt-accent)] transition-colors duration-500 @2xl:text-5xl`}
              >
                {bloc.valeur}
                {bloc.unite ? (
                  <span className="ml-1 text-xl @2xl:text-2xl">{bloc.unite}</span>
                ) : null}
              </p>
              <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-white">
                {bloc.titre}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {bloc.texte}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 @2xl:grid-cols-3 @2xl:gap-4">
          {ORIGINES.map((origine) => {
            const Icone = ICONES_ORIGINES[origine.id] ?? Leaf;
            return (
              <article
                key={origine.id}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[color:var(--volt-accent)] transition-colors duration-500"
                >
                  <Icone className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{origine.titre}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {origine.texte}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-zinc-500">
          {AVERTISSEMENT}
        </p>
      </div>
    </section>
  );
}

function Marque() {
  return (
    <section
      id="marque"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/[0.05] @3xl:scroll-mt-24"
    >
      <Image
        src={IMAGE_MARQUE}
        alt="Canette VOLT Original au milieu d’éclaboussures d’eau glacée"
        fill
        sizes="(min-width: 80rem) 1280px, 100vw"
        className="object-cover opacity-35 saturate-[0.85]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0a0a0e] via-[#0a0a0e]/80 to-[#0a0a0e]/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay transition-colors duration-700"
        style={{ backgroundColor: "var(--volt-halo)" }}
      />
      <div className={`${conteneur} relative py-16 @2xl:py-20 @5xl:py-28`}>
        <TitreSection
          kicker="La marque"
          titre="Née dans le bruit d’une ville en mouvement."
        />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-300 @2xl:text-base">
          {MANIFESTE}
        </p>
        <div className="mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 @3xl:grid-cols-4">
          {STATS_MARQUE.map((stat) => (
            <div key={stat.label}>
              <p
                className={`${display} text-3xl text-[color:var(--volt-accent)] transition-colors duration-500 @2xl:text-4xl`}
              >
                {stat.valeur}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PointsDeVente() {
  return (
    <section
      id="points-de-vente"
      className="scroll-mt-20 border-t border-white/[0.05] @3xl:scroll-mt-24"
    >
      <div className={`${conteneur} py-14 @2xl:py-16 @5xl:py-24`}>
        <TitreSection
          kicker="Où nous trouver"
          titre="Partout où la ville veille."
          texte="Un parcours de distribution présenté à titre conceptuel. Repérez l’éclair : il n’est jamais bien loin."
        />

        <div className="mt-10 grid gap-3 @sm:grid-cols-2 @2xl:gap-4 @5xl:grid-cols-4">
          {POINTS_DE_VENTE.map((point) => {
            const Icone = ICONES_POINTS[point.id] ?? Store;
            return (
              <article
                key={point.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 @2xl:p-6"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[color:var(--volt-accent)] transition-colors duration-500"
                >
                  <Icone className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-white">
                  {point.titre}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  {point.texte}
                </p>
              </article>
            );
          })}
        </div>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Communes desservies">
          {COMMUNES.map((commune) => (
            <li
              key={commune}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300"
            >
              <MapPin
                className="h-3 w-3 text-[color:var(--volt-accent)] transition-colors duration-500"
                aria-hidden
              />
              {commune}
            </li>
          ))}
          <li className="inline-flex items-center rounded-full border border-dashed border-[color:var(--volt-accent)] px-3 py-1.5 text-xs font-semibold text-[color:var(--volt-accent)] transition-colors duration-500">
            {EXPANSION}
          </li>
        </ul>
      </div>
    </section>
  );
}

function Distributeurs() {
  return (
    <section
      id="distributeurs"
      className="scroll-mt-20 border-t border-white/[0.05] @3xl:scroll-mt-24"
    >
      <div
        className={`${conteneur} grid gap-10 py-14 @2xl:py-16 @3xl:grid-cols-[1fr_1.05fr] @3xl:items-start @5xl:gap-16 @5xl:py-24`}
      >
        <div>
          <TitreSection
            kicker="Distribution"
            titre="Vendez l’énergie."
            texte="Superette, station, maquis ou grossiste : rejoignez le réseau VOLT et faites tourner le frigo le plus rentable de votre rayon."
          />
          <ul className="mt-8 space-y-3.5">
            {AVANTAGES_DISTRIBUTEUR.map((avantage) => (
              <li
                key={avantage}
                className="flex items-start gap-3 text-sm text-zinc-300"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--volt-accent)] transition-colors duration-500"
                  aria-hidden
                />
                {avantage}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-zinc-400">
            Une question ? Appelez-nous au{" "}
            <a
              href={CONTACT.telephoneLien}
              className={`${focusRing} whitespace-nowrap rounded-md font-semibold text-[color:var(--volt-accent)] transition-colors duration-500 hover:underline`}
            >
              {CONTACT.telephone}
            </a>{" "}
            — WhatsApp compris.
          </p>
        </div>

        <FormulaireDistributeur />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Briques interactives                                                */
/* ------------------------------------------------------------------ */

function TitreSection({
  kicker,
  titre,
  texte,
}: {
  kicker: string;
  titre: string;
  texte?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[color:var(--volt-accent)] transition-colors duration-500">
        {kicker}
      </p>
      <h2
        className={`${display} mt-3 text-3xl uppercase leading-[0.95] @2xl:text-4xl @5xl:text-5xl`}
      >
        {titre}
      </h2>
      {texte ? (
        <p className="mt-4 text-sm leading-relaxed text-zinc-400 @2xl:text-base">
          {texte}
        </p>
      ) : null}
    </div>
  );
}

function SelecteurSaveurs({
  actif,
  onSelect,
}: {
  actif: SaveurId;
  onSelect: (id: SaveurId) => void;
}) {
  return (
    <div role="group" aria-label="Choisir une saveur" className="flex flex-wrap gap-2">
      {SAVEURS.map((s) => {
        const estActive = s.id === actif;
        return (
          <button
            key={s.id}
            type="button"
            aria-pressed={estActive}
            onClick={() => onSelect(s.id)}
            className={`${focusRing} inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
              estActive
                ? "border-transparent bg-[color:var(--volt-accent)] text-[#0a0a0e]"
                : "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white"
            }`}
          >
            {/* Pastille couleur : chaque saveur annonce son néon */}
            <span
              aria-hidden
              className="h-2 w-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: estActive ? "#0a0a0e" : s.accent }}
            />
            {s.nom}
          </button>
        );
      })}
    </div>
  );
}

/** Formulaire « Devenir distributeur » — simulation 100 % côté client. */
function FormulaireDistributeur() {
  const [envoye, setEnvoye] = useState(false);

  const soumettre = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnvoye(true);
  };

  return (
    <div aria-live="polite">
      {envoye ? (
        <div className="screen-in flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <span
            aria-hidden
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--volt-accent)] text-[#0a0a0e] transition-colors duration-500"
          >
            <Check className="h-7 w-7" />
          </span>
          <h3 className={`${display} mt-5 text-2xl uppercase`}>
            Demande envoyée !
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
            Notre équipe commerciale vous rappelle sous 24 h ouvrées pour
            préparer votre première commande. Paiement à la livraison, Wave ou
            Orange Money.
          </p>
          <button
            type="button"
            onClick={() => setEnvoye(false)}
            className={`${btnFantome} mt-7`}
          >
            Envoyer une autre demande
          </button>
        </div>
      ) : (
        <form
          onSubmit={soumettre}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 @2xl:p-8"
        >
          <h3 className={`${display} text-xl uppercase @2xl:text-2xl`}>
            Devenir distributeur
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Réponse sous 24 h ouvrées. Première commande dès 5 packs, sans
            engagement.
          </p>
          <div className="mt-6 grid gap-4 @xl:grid-cols-2">
            <label className="block @xl:col-span-2">
              <span className={etiquette}>Nom complet</span>
              <input
                name="nom"
                type="text"
                required
                autoComplete="name"
                placeholder="Aya Koné"
                className={champ}
              />
            </label>
            <label className="block">
              <span className={etiquette}>Téléphone</span>
              <input
                name="telephone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+225 07 00 00 00 00"
                className={champ}
              />
            </label>
            <label className="block">
              <span className={etiquette}>Commune / ville</span>
              <input
                name="ville"
                type="text"
                required
                placeholder="Ville (démonstration)"
                className={champ}
              />
            </label>
            <label className="block @xl:col-span-2">
              <span className={etiquette}>Type de commerce</span>
              <span className="relative block">
                <select
                  name="type"
                  required
                  defaultValue=""
                  className={`${champ} appearance-none pr-10 [color-scheme:dark]`}
                >
                  <option value="" disabled>
                    Sélectionnez votre activité
                  </option>
                  {TYPES_COMMERCE.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden
                />
              </span>
            </label>
          </div>
          <button type="submit" className={`${btnPrimaire} mt-6 w-full`}>
            <Zap className="h-4 w-4 fill-current" aria-hidden />
            Envoyer ma demande
          </button>
          <p className="mt-3 text-center text-[11px] text-zinc-500">
            En envoyant ce formulaire, vous acceptez d’être recontacté par
            l’équipe VOLT.
          </p>
        </form>
      )}
    </div>
  );
}
