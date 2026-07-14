"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Container from "@/components/ui/Container";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Le dialogue natif rend l'arrière-plan inerte et piège le focus. React ne
  // pilote que son état ouvert/fermé afin de garder aria-expanded synchronisé.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  // Empêche la page de défiler derrière le menu plein écran.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Un passage en vue desktop ne doit jamais laisser un dialogue modal
  // invisible ouvert. Les liens ferment eux-mêmes le menu avant navigation.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* En haut de la home, le header rejoint la scène du héro : il redéfinit
   * localement les tokens sémantiques (--background, --accent…) vers les
   * vars --hero-* posées sur <html> par HeroShowcase — logo, nav, toggle et
   * CTA se rethèment sans changer leurs classes. Les fallbacks sont la
   * palette Table Dorée, thème initial rendu au SSR. Au scroll (ou hors
   * home), retour au chrome standard. */
  const themed = pathname === "/" && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 border-b text-foreground transition-colors duration-500 ${
        themed
          ? "border-transparent bg-background [--accent-contrast:var(--hero-accent-ink,#ffffff)] [--accent-hover:var(--hero-accent,#b45309)] [--accent-soft:var(--hero-halo)] [--accent:var(--hero-accent,#b45309)] [--background:var(--hero-bg,#faf6ef)] [--foreground:var(--hero-ink,#241d16)] [--line:var(--hero-line,#e3d8c2)] [--muted:var(--hero-muted,#6b5c4a)] [--surface-raised:var(--hero-surface,#fffdf8)] [--surface:var(--hero-surface,#fffdf8)]"
          : "border-line bg-background/80 backdrop-blur"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="inline-flex min-h-11 items-center rounded-lg font-display text-2xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:min-h-0"
        >
          Core<span className="text-accent">.</span>
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
          >
            Démarrer un projet
          </Link>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-raised text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </Container>

      {/* Navigation mobile modale : son propre en-tête garde le thème et la
          fermeture accessibles une fois l'arrière-plan rendu inerte. */}
      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-labelledby="menu-mobile-title"
        onCancel={() => setMenuOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const dialog = event.currentTarget;
          const focusable = Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = focusable[0];
          const last = focusable.at(-1);
          if (!first || !last) return;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-background p-0 text-foreground backdrop:bg-black/35 md:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-line">
            <Container className="flex h-16 items-center justify-between">
              <p id="menu-mobile-title" className="font-display text-2xl font-bold tracking-tight">
                Core<span className="text-accent">.</span>
              </p>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  type="button"
                  autoFocus
                  aria-label="Fermer le menu"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-raised text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </Container>
          </div>

          <Container className="flex min-h-0 flex-1 flex-col overflow-y-auto py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <nav aria-label="Navigation mobile">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`flex min-h-14 items-center justify-between rounded-card px-5 py-3 font-display text-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          active
                            ? "bg-accent-soft text-accent"
                            : "border border-transparent text-foreground hover:border-line hover:bg-surface"
                        }`}
                      >
                        {link.label}
                        <span
                          className="text-sm font-normal text-muted"
                          aria-hidden
                        >
                          {active ? "Page actuelle" : "↗"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto pt-8">
              <p className="mb-4 flex items-center gap-2 text-sm text-muted">
                <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
                Disponibles — Dakar · Abidjan · à distance
              </p>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-center text-base font-semibold text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Démarrer un projet
            </Link>
            </div>
          </Container>
        </div>
      </dialog>
    </header>
  );
}
