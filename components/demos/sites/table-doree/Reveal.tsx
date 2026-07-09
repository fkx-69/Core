"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Apparition douce au scroll, locale au site La Table Dorée.
 * Les classes `td-reveal` / `td-reveal-in` sont définies dans le <style>
 * de Site.tsx et respectent prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Décalage d'apparition en millisecondes (stagger). */
  delay?: number;
  as?: "div" | "li" | "figure";
}) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const setNode = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={setNode}
      className={`td-reveal ${visible ? "td-reveal-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
