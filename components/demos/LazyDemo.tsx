"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";

function Skeleton({ minH }: { minH: string }) {
  return (
    <div
      aria-hidden
      className={`${minH} animate-pulse rounded-card border border-line bg-surface`}
    />
  );
}

/*
 * Les démos sont chargées dynamiquement (ssr: false — légal ici car composant
 * client) et montées à l'approche du viewport. Les hauteurs des skeletons
 * approchent celles des démos réelles pour que les ancres ne sautent pas.
 * Les sites vitrines et applications web pointent vers leurs aperçus dédiés :
 * en mobile, aperçu au même format que les démos d'applications mobiles ;
 * en desktop,
 * mockup navigateur ~48px + zone scrollable 560px + lien « Visiter » ~36px.
 */
const WEB_DEMO_HEIGHT = "min-h-[660px] md:min-h-[640px]";
const MOBILE_DEMO_HEIGHT = "min-h-[600px] md:min-h-[680px]";

function lazyDemo(
  loader: () => Promise<{ default: ComponentType }>,
  minH: string,
) {
  return {
    minH,
    Component: dynamic(loader, {
      ssr: false,
      loading: () => <Skeleton minH={minH} />,
    }),
  };
}

const DEMOS = {
  vitrine: lazyDemo(
    () => import("@/components/demos/sites/table-doree/Preview"),
    WEB_DEMO_HEIGHT,
  ),
  volt: lazyDemo(
    () => import("@/components/demos/sites/volt/Preview"),
    WEB_DEMO_HEIGHT,
  ),
  parfum: lazyDemo(
    () => import("@/components/demos/sites/elixir/Preview"),
    WEB_DEMO_HEIGHT,
  ),
  salon: lazyDemo(
    () => import("@/components/demos/sites/ecrin/Preview"),
    WEB_DEMO_HEIGHT,
  ),
  dashboard: lazyDemo(
    () => import("@/components/demos/apps/lumen/Preview"),
    WEB_DEMO_HEIGHT,
  ),
  pressing: lazyDemo(
    () => import("@/components/demos/apps/sandaga/Preview"),
    WEB_DEMO_HEIGHT,
  ),
  mobile: lazyDemo(
    () => import("@/components/demos/mobile/MobileDemo"),
    MOBILE_DEMO_HEIGHT,
  ),
  banque: lazyDemo(
    () => import("@/components/demos/banque/BanqueDemo"),
    MOBILE_DEMO_HEIGHT,
  ),
};

export type DemoName = keyof typeof DEMOS;

export default function LazyDemo({ demo }: { demo: DemoName }) {
  const { minH, Component } = DEMOS[demo];
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // L'observer se déclenche aussi immédiatement pour un lien profond
  // (ex. /portfolio#demo-mobile) puisque la section est alors dans le viewport.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {mounted ? <Component /> : <Skeleton minH={minH} />}
    </div>
  );
}
