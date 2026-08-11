"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";
import ecrinMobilePreview from "@/public/assets/demos/previews/ecrin-mobile.webp";
import elixirMobilePreview from "@/public/assets/demos/previews/elixir-mobile.webp";
import tableDoreeMobilePreview from "@/public/assets/demos/previews/table-doree-mobile.webp";
import voltMobilePreview from "@/public/assets/demos/previews/volt-mobile.webp";
import type { HeroSiteId } from "./sites";

export function SiteSkeleton() {
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

/** Les sites sont téléchargés à leur première activation puis restent montés. */
export const SITE_COMPONENTS: Record<
  HeroSiteId,
  ComponentType<{ embedded?: boolean }>
> = {
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

/** Le rail mobile utilise des captures légères, pas quatre sites interactifs. */
export const MOBILE_PREVIEWS: Record<HeroSiteId, StaticImageData> = {
  "table-doree": tableDoreeMobilePreview,
  volt: voltMobilePreview,
  elixir: elixirMobilePreview,
  ecrin: ecrinMobilePreview,
};
