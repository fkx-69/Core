"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import PhonePreview from "@/components/demos/PhonePreview";
import { MOBILE_PREVIEWS } from "./demoRegistry";
import { HERO_SITES, type HeroSiteId } from "./sites";

export type HeroMobileStageHandle = {
  scrollTo: (id: HeroSiteId, behavior?: ScrollBehavior) => void;
};

const HeroMobileStage = forwardRef<
  HeroMobileStageHandle,
  {
    active: HeroSiteId;
    enabled: boolean;
    overlayOpen: boolean;
    onActiveChange: (id: HeroSiteId) => void;
    onOpen: (id: HeroSiteId) => void;
    onSelect: (id: HeroSiteId) => void;
  }
>(function HeroMobileStage(
  { active, enabled, overlayOpen, onActiveChange, onOpen, onSelect },
  ref,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Partial<Record<HeroSiteId, HTMLDivElement | null>>>({});

  function scrollTo(id: HeroSiteId, behavior: ScrollBehavior = "smooth") {
    const track = trackRef.current;
    const slide = slideRefs.current[id];
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
      behavior,
    });
  }

  useImperativeHandle(ref, () => ({ scrollTo }));

  useEffect(() => {
    if (!enabled || overlayOpen) return;
    const track = trackRef.current;
    if (!track) return;
    let settleTimer = 0;

    const syncActiveSlide = () => {
      window.clearTimeout(settleTimer);
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearest: HTMLDivElement | undefined;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const slide of Object.values(slideRefs.current)) {
        if (!slide) continue;
        const distance = Math.abs(
          slide.offsetLeft + slide.offsetWidth / 2 - trackCenter,
        );
        if (distance < nearestDistance) {
          nearest = slide;
          nearestDistance = distance;
        }
      }
      const id = nearest?.dataset.site as HeroSiteId | undefined;
      if (id) onActiveChange(id);
    };
    const scheduleSync = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(syncActiveSlide, 120);
    };

    track.addEventListener("scroll", scheduleSync, { passive: true });
    track.addEventListener("scrollend", syncActiveSlide);
    return () => {
      window.clearTimeout(settleTimer);
      track.removeEventListener("scroll", scheduleSync);
      track.removeEventListener("scrollend", syncActiveSlide);
    };
  }, [enabled, overlayOpen, onActiveChange]);

  return (
    <div className="mt-4 w-full lg:hidden">
      <div
        ref={trackRef}
        aria-label="Aperçus des sites vitrines — balayez pour changer, touchez pour essayer"
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto py-4 sm:-mx-6"
        style={{
          paddingInline: "calc(50vw - min(38vw, 18.5svh, 160px))",
        }}
      >
        {HERO_SITES.map((site) => (
          <div
            key={site.id}
            ref={(element) => {
              slideRefs.current[site.id] = element;
            }}
            data-site={site.id}
            className={`hero-carousel-slide shrink-0 snap-center ${
              site.id === active ? "z-10" : ""
            }`}
          >
            <PhonePreview
              label={site.nom}
              onOpen={() => onOpen(site.id)}
              className="aspect-[9/18] w-[min(76vw,37svh,320px)]"
            >
              <Image
                src={MOBILE_PREVIEWS[site.id]}
                alt=""
                fill
                loading={site.id === HERO_SITES[0].id ? "eager" : "lazy"}
                fetchPriority={site.id === HERO_SITES[0].id ? "high" : undefined}
                sizes="min(76vw, 37svh, 320px)"
                draggable={false}
                className="object-cover object-top"
              />
            </PhonePreview>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {HERO_SITES.map((site) => (
          <button
            key={site.id}
            type="button"
            aria-label={`Afficher ${site.nom}`}
            aria-current={site.id === active || undefined}
            onClick={() => onSelect(site.id)}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
          >
            <span
              aria-hidden
              className={`block h-2.5 rounded-full transition-all duration-300 ${
                site.id === active
                  ? "w-6 bg-[color:var(--hero-accent)]"
                  : "w-2.5 bg-[color:var(--hero-line)]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
});

export default HeroMobileStage;
