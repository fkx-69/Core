"use client";

import { useEffect, useRef, useState } from "react";

/** Fait apparaître son contenu (fade + slide) à l'entrée dans le viewport. */
export default function Reveal({
  delay = 0,
  variant = "up",
  className = "",
  children,
}: {
  /** Décalage en ms, pour échelonner des éléments voisins (desktop seulement). */
  delay?: number;
  /** Direction d'entrée — mappe sur les classes .reveal-* de globals.css. */
  variant?: "up" | "left" | "right" | "scale";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${variant !== "up" ? `reveal-${variant}` : ""} ${visible ? "is-visible" : ""} ${className}`}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
