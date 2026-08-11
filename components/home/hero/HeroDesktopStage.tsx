"use client";

import type { RefObject } from "react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import { HERO_SITES, type HeroSiteId } from "./sites";
import { SITE_COMPONENTS } from "./demoRegistry";

export default function HeroDesktopStage({
  active,
  enabled,
  visited,
  url,
  sceneRef,
  onPause,
  onResume,
  onStop,
}: {
  active: HeroSiteId;
  enabled: boolean;
  visited: readonly HeroSiteId[];
  url: string;
  sceneRef: RefObject<HTMLDivElement | null>;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}) {
  return (
    <div
      ref={sceneRef}
      aria-roledescription="carrousel"
      aria-label="Aperçus interactifs des sites vitrines"
      onPointerEnter={onPause}
      onPointerLeave={onResume}
      onPointerDownCapture={onStop}
      onWheelCapture={onStop}
      onKeyDownCapture={onStop}
      onFocusCapture={onStop}
      className="mt-5 hidden w-full lg:block"
    >
      <BrowserFrame url={url}>
        <div className="isolate grid aspect-video">
          {HERO_SITES.filter((site) => visited.includes(site.id)).map((site) => {
            const Site = SITE_COMPONENTS[site.id];
            return (
              <div
                key={site.id}
                role="tabpanel"
                id={`hero-panel-${site.id}`}
                aria-labelledby={`hero-tab-${site.id}`}
                inert={site.id !== active || undefined}
                className={`@container scrollbar-none col-start-1 row-start-1 h-full overflow-y-auto overscroll-contain motion-safe:transition-[opacity,transform] motion-safe:duration-500 ${
                  site.id === active
                    ? "opacity-100"
                    : "pointer-events-none opacity-0 motion-safe:translate-y-2 motion-safe:scale-[0.99]"
                }`}
              >
                {enabled && <Site embedded />}
              </div>
            );
          })}
        </div>
      </BrowserFrame>
    </div>
  );
}
