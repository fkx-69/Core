"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
 * Les sites vitrines et applications web pointent vers leurs aperçus dédiés
 * (mockup navigateur ~48px + zone scrollable 560px + lien « Visiter » ~36px).
 */
const DEMOS = {
  vitrine: {
    minH: "min-h-[640px]",
    Component: dynamic(
      () => import("@/components/demos/sites/table-doree/Preview"),
      { ssr: false, loading: () => <Skeleton minH="min-h-[640px]" /> },
    ),
  },
  volt: {
    minH: "min-h-[640px]",
    Component: dynamic(() => import("@/components/demos/sites/volt/Preview"), {
      ssr: false,
      loading: () => <Skeleton minH="min-h-[640px]" />,
    }),
  },
  parfum: {
    minH: "min-h-[640px]",
    Component: dynamic(
      () => import("@/components/demos/sites/elixir/Preview"),
      { ssr: false, loading: () => <Skeleton minH="min-h-[640px]" /> },
    ),
  },
  salon: {
    minH: "min-h-[640px]",
    Component: dynamic(() => import("@/components/demos/sites/ecrin/Preview"), {
      ssr: false,
      loading: () => <Skeleton minH="min-h-[640px]" />,
    }),
  },
  dashboard: {
    minH: "min-h-[640px]",
    Component: dynamic(
      () => import("@/components/demos/apps/lumen/Preview"),
      { ssr: false, loading: () => <Skeleton minH="min-h-[640px]" /> },
    ),
  },
  pressing: {
    minH: "min-h-[640px]",
    Component: dynamic(
      () => import("@/components/demos/apps/sandaga/Preview"),
      { ssr: false, loading: () => <Skeleton minH="min-h-[640px]" /> },
    ),
  },
  mobile: {
    minH: "min-h-[680px]",
    Component: dynamic(() => import("@/components/demos/mobile/MobileDemo"), {
      ssr: false,
      loading: () => <Skeleton minH="min-h-[680px]" />,
    }),
  },
  banque: {
    minH: "min-h-[680px]",
    Component: dynamic(() => import("@/components/demos/banque/BanqueDemo"), {
      ssr: false,
      loading: () => <Skeleton minH="min-h-[680px]" />,
    }),
  },
} as const;

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
