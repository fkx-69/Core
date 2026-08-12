"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import useIsMobile from "@/components/demos/useIsMobile";
import { HERO_SITES, type HeroSiteId } from "./sites";
import HeroDesktopStage from "./HeroDesktopStage";
import HeroMobileStage, {
  type HeroMobileStageHandle,
} from "./HeroMobileStage";
import HeroOverlay from "./HeroOverlay";
import HeroTabs from "./HeroTabs";
import type { Autoplay } from "./types";

const ORDER = HERO_SITES.map((s) => s.id);

function nextOf(id: HeroSiteId): HeroSiteId {
  return ORDER[(ORDER.indexOf(id) + 1) % ORDER.length];
}

/**
 * Héro-scène immersif : un titre, les onglets, la démo — et le héro entier
 * (fond, encre, accent) prend les couleurs de la marque affichée via les
 * classes .hero-theme-* de globals.css.
 *
 * Desktop (≥lg) : grand navigateur 16:9 interactif, auto-rotation (5 s par
 * site) cadencée par la barre de progression de l'onglet actif
 * (animationend → démo suivante) ; toute interaction l'arrête pour de bon.
 *
 * Mobile (<lg) : le swipe remplace l'auto-rotation — carrousel snap
 * d'aperçus inertes au format téléphone (le thème suit la slide centrée),
 * et le tap ouvre la démo en plein écran (DemoOverlay) où tout réagit.
 * Les deux scènes sont dans le DOM (CSS décide, zéro layout shift) mais
 * une seule monte les sites, via isMobile.
 *
 * Composant client, mais le titre et la légende sont bien prérendus (seuls
 * les sites en ssr:false ne le sont pas).
 */
export default function HeroShowcase() {
  const [active, setActive] = useState<HeroSiteId>("table-doree");
  const [visited, setVisited] = useState<HeroSiteId[]>(["table-doree"]);
  const [autoplay, setAutoplay] = useState<Autoplay>("idle");
  const [overlay, setOverlay] = useState(false);
  const isMobile = useIsMobile("(max-width: 1023px)");
  const sceneRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HeroMobileStageHandle>(null);
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

  // Reflète le thème de marque actif sur <html> : le header, hors de cette
  // arborescence, peint les mêmes vars --hero-* tant qu'on est en haut de la
  // home (la section, elle, porte l'attribut dès le SSR).
  useEffect(() => {
    document.documentElement.dataset.heroTheme = active;
    return () => {
      delete document.documentElement.dataset.heroTheme;
    };
  }, [active]);

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

  function select(id: HeroSiteId, scrollBehavior: ScrollBehavior = "smooth") {
    setAutoplay("stopped");
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
    setActive(id);
    mobileStageRef.current?.scrollTo(id, scrollBehavior);
  }

  function toggleAutoplay() {
    setAutoplay((p) => (p === "playing" || p === "paused" ? "stopped" : "playing"));
  }

  /** Interaction directe avec les démos : l'auto-rotation s'arrête pour de bon. */
  function stop() {
    setAutoplay("stopped");
  }

  function openOverlay(id: HeroSiteId) {
    select(id, "auto");
    setOverlay(true);
  }

  return (
    <section
      data-hero-theme={active}
      className="relative overflow-hidden bg-[color:var(--hero-bg)] transition-colors duration-700 lg:min-h-[calc(100svh-4rem)]"
    >
      {/* Halo de marque — couleur pleine + blur (transitionnable). Premier
          enfant, sans z négatif : derrière le contenu, devant le fond. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[46rem] max-w-none -translate-x-1/2 rounded-full bg-[color:var(--hero-halo)] blur-3xl transition-[background-color] duration-700"
      />
      <Container className="relative flex flex-col items-center pt-8 pb-9 sm:pt-14 sm:pb-12">
        <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hero-line)] bg-[color:var(--hero-surface)] px-3 py-1.5 text-xs text-[color:var(--hero-muted)] transition-colors duration-700 sm:gap-2.5 sm:px-4 sm:text-sm">
          <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[color:var(--hero-accent)] transition-colors duration-700" aria-hidden />
          Basée à Bamako, Mali
        </p>
        {/* Le positionnement explicite rend l'offre compréhensible avant la
            démonstration, tout en gardant le slogan comme signature éditoriale. */}
        <h1 className="mt-5 text-center font-display text-[2.05rem] leading-[1.1] font-bold tracking-tight text-[color:var(--hero-ink)] transition-colors duration-700 sm:mt-6 sm:text-5xl lg:text-6xl xl:text-7xl">
          Agence de développement logiciel à Bamako
        </h1>
        <p className="mt-5 max-w-2xl text-center text-base leading-relaxed text-[color:var(--hero-muted)] transition-colors duration-700 sm:text-lg">
          Sites web, applications web, applications mobiles et logiciels métier sur mesure au Mali.
        </p>
        <p className="mt-3 text-center font-display text-lg font-semibold text-[color:var(--hero-accent)] transition-colors duration-700 sm:text-xl">
          Le logiciel sur mesure, la preuve à l&apos;écran.
        </p>
        <HeroTabs
          active={active}
          visited={visited}
          autoplay={autoplay}
          onSelect={select}
          onProgressEnd={advance}
          onToggleAutoplay={toggleAutoplay}
        />

        <HeroDesktopStage
          active={active}
          enabled={!isMobile}
          visited={visited}
          url={site.url}
          sceneRef={sceneRef}
          onPause={() =>
            setAutoplay((current) =>
              current === "playing" ? "paused" : current,
            )
          }
          onResume={() =>
            setAutoplay((current) =>
              current === "paused" ? "playing" : current,
            )
          }
          onStop={stop}
        />

        <HeroMobileStage
          ref={mobileStageRef}
          active={active}
          enabled={isMobile}
          overlayOpen={overlay}
          onActiveChange={setActive}
          onOpen={openOverlay}
          onSelect={select}
        />

        <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 lg:mt-3">
          <p className="text-xs text-[color:var(--hero-muted)] transition-colors duration-700">
            <span className="lg:hidden">
              {site.secteur} — touchez l&apos;aperçu pour l&apos;essayer en plein écran.
            </span>
            <span className="hidden lg:inline">
              {site.secteur} — aperçu interactif, tout réagit.
            </span>
          </p>
          {/* Le héro convainc, cette paire convertit : visite complète en
              secondaire (desktop — en mobile l'overlay joue ce rôle),
              « Démarrer un projet » en primaire aux couleurs de la marque. */}
          <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Link
              href={site.href}
              target="_blank"
              rel="noopener"
              className="hidden min-h-11 items-center justify-center gap-1.5 rounded-full border border-[color:var(--hero-line)] bg-[color:var(--hero-surface)] px-3 py-2 text-xs font-medium text-[color:var(--hero-muted)] shadow-card transition-colors duration-300 hover:border-[color:var(--hero-accent)] hover:text-[color:var(--hero-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hero-accent)] lg:inline-flex lg:min-h-0 lg:justify-start lg:py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Visiter le site en entier
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[color:var(--hero-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--hero-accent-ink)] shadow-card transition-colors duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hero-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--hero-bg)] sm:min-h-0 sm:py-1.5"
            >
              Démarrer un projet
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
        <p aria-live="polite" className="sr-only">
          Démo affichée : {site.nom} — {site.secteur}
        </p>
      </Container>

      {overlay && (
        <HeroOverlay
          active={active}
          onClose={() => setOverlay(false)}
          onSelect={(id) => select(id, "auto")}
        />
      )}
    </section>
  );
}
