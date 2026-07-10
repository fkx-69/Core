"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import { HERO_SITES, type HeroSiteId } from "./sites";
import HeroTabs from "./HeroTabs";

export type Autoplay = "idle" | "playing" | "paused" | "stopped";

/** Squelette de page web pendant le chargement du bundle d'un site. */
function SiteSkeleton() {
  return (
    <div aria-hidden className="h-full animate-pulse p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="h-3 w-24 rounded-full bg-line" />
        <span className="hidden h-2.5 w-48 rounded-full bg-line sm:block" />
      </div>
      <div className="mt-14 space-y-3">
        <span className="block h-7 w-4/5 rounded-full bg-line" />
        <span className="block h-7 w-3/5 rounded-full bg-line" />
      </div>
      <div className="mt-6 space-y-2.5">
        <span className="block h-2.5 w-2/3 rounded-full bg-line/70" />
        <span className="block h-2.5 w-1/2 rounded-full bg-line/70" />
      </div>
      <div className="mt-10 grid grid-cols-3 gap-4">
        <span className="h-28 rounded-card bg-line/50" />
        <span className="h-28 rounded-card bg-line/50" />
        <span className="h-28 rounded-card bg-line/50" />
      </div>
    </div>
  );
}

/*
 * Chaque site n'est téléchargé qu'à sa première activation (ssr: false —
 * légal ici car composant client), puis reste monté dans la pile : revenir
 * dessus est instantané et son état interne (saveur VOLT, réservation…)
 * survit aux changements.
 */
const SITE_COMPONENTS: Record<HeroSiteId, ComponentType> = {
  "table-doree": dynamic(
    () => import("@/components/demos/sites/table-doree/Site"),
    { ssr: false, loading: () => <SiteSkeleton /> },
  ),
  volt: dynamic(() => import("@/components/demos/sites/volt/Site"), {
    ssr: false,
    loading: () => <SiteSkeleton />,
  }),
  elixir: dynamic(() => import("@/components/demos/sites/elixir/Site"), {
    ssr: false,
    loading: () => <SiteSkeleton />,
  }),
  ecrin: dynamic(() => import("@/components/demos/sites/ecrin/Site"), {
    ssr: false,
    loading: () => <SiteSkeleton />,
  }),
};

const ORDER = HERO_SITES.map((s) => s.id);

function nextOf(id: HeroSiteId): HeroSiteId {
  return ORDER[(ORDER.indexOf(id) + 1) % ORDER.length];
}

/**
 * Héro-scène immersif : un titre, les onglets, un grand navigateur — et le
 * héro entier (fond, encre, accent) prend les couleurs de la marque affichée
 * via les classes .hero-theme-* de globals.css. L'auto-rotation (5 s par
 * site) est cadencée par la barre de progression de l'onglet actif
 * (animationend → démo suivante) ; toute interaction l'arrête pour de bon.
 * Composant client, mais le titre et la légende sont bien prérendus (seuls
 * les sites en ssr:false ne le sont pas).
 */
export default function HeroShowcase() {
  const [active, setActive] = useState<HeroSiteId>("table-doree");
  const [visited, setVisited] = useState<HeroSiteId[]>(["table-doree"]);
  const [autoplay, setAutoplay] = useState<Autoplay>("idle");
  const sceneRef = useRef<HTMLDivElement>(null);
  const site = HERO_SITES.find((s) => s.id === active) ?? HERO_SITES[0];

  // idle → playing : à l'idle du navigateur, quand la scène est visible, en
  // desktop seulement, hors reduced-motion et hors mode économie de données.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    let observer: IntersectionObserver | undefined;
    const arm = () => {
      const node = sceneRef.current;
      if (!node) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          setAutoplay((prev) => {
            if (prev === "stopped") return prev;
            if (entry.isIntersecting) return prev === "idle" ? "playing" : prev;
            return prev === "playing" || prev === "paused" ? "idle" : prev;
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(node);
    };
    const hasIdle = "requestIdleCallback" in window;
    const id = hasIdle
      ? window.requestIdleCallback(arm)
      : window.setTimeout(arm, 1200);
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      observer?.disconnect();
    };
  }, []);

  // Onglet de navigateur masqué : pause (le animationend pourrait sinon
  // partir en différé au retour et provoquer un switch fantôme).
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setAutoplay((p) => (p === "playing" ? "paused" : p));
      } else {
        setAutoplay((p) => (p === "paused" ? "playing" : p));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Préchargement anticipé : à mi-cycle, la démo suivante se monte cachée —
  // le switch crossfade vers du vrai contenu, pas vers un skeleton.
  useEffect(() => {
    if (autoplay !== "playing") return;
    const t = window.setTimeout(() => {
      const n = nextOf(active);
      setVisited((v) => (v.includes(n) ? v : [...v, n]));
    }, 2500);
    return () => window.clearTimeout(t);
  }, [autoplay, active]);

  function advance() {
    const n = nextOf(active);
    setVisited((v) => (v.includes(n) ? v : [...v, n]));
    setActive(n);
  }

  function select(id: HeroSiteId) {
    setAutoplay("stopped");
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
    setActive(id);
  }

  function toggleAutoplay() {
    setAutoplay((p) => (p === "playing" || p === "paused" ? "stopped" : "playing"));
  }

  /** Interaction directe avec les démos : l'auto-rotation s'arrête pour de bon. */
  function stop() {
    setAutoplay("stopped");
  }

  return (
    <section
      className={`hero-theme-${active} relative overflow-hidden bg-[color:var(--hero-bg)] transition-colors duration-700 lg:min-h-[calc(100svh-4rem)]`}
    >
      {/* Halo de marque — couleur pleine + blur (transitionnable). Premier
          enfant, sans z négatif : derrière le contenu, devant le fond. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[46rem] max-w-none -translate-x-1/2 rounded-full bg-[color:var(--hero-halo)] blur-3xl transition-[background-color] duration-700"
      />
      <Container className="relative flex flex-col items-center pt-10 pb-10 sm:pt-14 sm:pb-12">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--hero-line)] bg-[color:var(--hero-surface)] px-4 py-1.5 text-sm text-[color:var(--hero-muted)] transition-colors duration-700">
          <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[color:var(--hero-accent)] transition-colors duration-700" aria-hidden />
          Disponibles — Dakar · Abidjan · à distance
        </p>
        {/* Deux lignes poster, centrées (largeurs mesurées en Space Grotesk bold) */}
        <h1 className="mt-6 text-center font-display text-[2.125rem] leading-[1.1] font-bold tracking-tight text-[color:var(--hero-ink)] transition-colors duration-700 sm:text-5xl lg:text-6xl xl:text-7xl">
          Le logiciel sur mesure,
          <span className="block text-[color:var(--hero-accent)] transition-colors duration-700">
            la preuve à l&apos;écran.
          </span>
        </h1>
        <HeroTabs
          active={active}
          autoplay={autoplay}
          onSelect={select}
          onProgressEnd={advance}
          onToggleAutoplay={toggleAutoplay}
        />
        <div
          ref={sceneRef}
          aria-roledescription="carrousel"
          aria-label="Aperçus interactifs des sites vitrines"
          onPointerEnter={() => setAutoplay((p) => (p === "playing" ? "paused" : p))}
          onPointerLeave={() => setAutoplay((p) => (p === "paused" ? "playing" : p))}
          onPointerDownCapture={stop}
          onWheelCapture={stop}
          onKeyDownCapture={stop}
          onFocusCapture={stop}
          className="mt-5 w-full"
        >
          <BrowserFrame url={site.url}>
            {/* isolate : les z-index internes des sites démos (headers sticky
                z-50…) restent confinés au cadre. En desktop la zone d'aperçu
                est un vrai écran 16:9 ; en mobile, hauteur fixe plus haute
                que large (16:9 y serait illisible). */}
            <div className="isolate grid lg:aspect-video">
              {HERO_SITES.filter((s) => visited.includes(s.id)).map((s) => {
                const Site = SITE_COMPONENTS[s.id];
                return (
                  <div
                    key={s.id}
                    role="tabpanel"
                    id={`hero-panel-${s.id}`}
                    aria-labelledby={`hero-tab-${s.id}`}
                    inert={s.id !== active || undefined}
                    className={`@container scrollbar-none col-start-1 row-start-1 h-[420px] overflow-y-auto overscroll-contain lg:h-full motion-safe:transition-[opacity,transform] motion-safe:duration-500 ${
                      s.id === active
                        ? "opacity-100"
                        : "pointer-events-none opacity-0 motion-safe:translate-y-2 motion-safe:scale-[0.99]"
                    }`}
                  >
                    <Site />
                  </div>
                );
              })}
            </div>
          </BrowserFrame>
        </div>
        <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-xs text-[color:var(--hero-muted)] transition-colors duration-700">
            {site.secteur} — aperçu interactif, tout réagit.
          </p>
          <Link
            href={site.href}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hero-line)] bg-[color:var(--hero-surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--hero-muted)] shadow-card transition-colors duration-300 hover:border-[color:var(--hero-accent)] hover:text-[color:var(--hero-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hero-accent)]"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Visiter le site en entier
          </Link>
        </div>
        <p aria-live="polite" className="sr-only">
          Démo affichée : {site.nom} — {site.secteur}
        </p>
      </Container>
    </section>
  );
}
