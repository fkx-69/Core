"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/* L'état du thème vit sur <html> (classe .dark, posée par le script
 * anti-flash du layout). On s'y abonne via un MutationObserver. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getIsDark = () => document.documentElement.classList.contains("dark");
// Côté serveur, le thème est inconnu : on suppose clair (thème par défaut).
const getServerIsDark = () => false;

/** Bascule clair/sombre, persistée dans localStorage. */
export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getIsDark, getServerIsDark);
  const transitionTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
      document.documentElement.classList.remove("theme-transition");
    },
    [],
  );

  function toggle() {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage indisponible (navigation privée) : le toggle reste fonctionnel.
    }
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimer.current = null;
    }, 350);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark ? "Activer le thème clair" : "Activer le thème sombre"
      }
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-raised text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
