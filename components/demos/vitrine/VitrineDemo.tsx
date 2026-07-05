"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  UtensilsCrossed,
  X,
} from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import {
  CATEGORY_LABELS,
  GALLERY,
  MENU,
  type MenuCategory,
} from "@/components/demos/vitrine/data";

type Section = "accueil" | "menu" | "galerie";

/** Démo « Site vitrine » : mini site de restaurant entièrement navigable. */
export default function VitrineDemo() {
  const [activeSection, setActiveSection] = useState<Section>("accueil");
  const [menuCategory, setMenuCategory] = useState<MenuCategory>("entrees");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Échap ferme le déroulant puis la lightbox.
  useEffect(() => {
    if (!dropdownOpen && lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDropdownOpen(false);
      setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dropdownOpen, lightboxIndex]);

  function goToMenu(category: MenuCategory) {
    setMenuCategory(category);
    setActiveSection("menu");
    setDropdownOpen(false);
  }

  const navButton = (section: Section, label: string) => (
    <button
      type="button"
      onClick={() => {
        setActiveSection(section);
        setDropdownOpen(false);
      }}
      aria-current={activeSection === section ? "page" : undefined}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        activeSection === section
          ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
          : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <BrowserFrame url="https://latabledoree.fr">
      <div className="flex min-h-[480px] flex-col bg-background">
        {/* En-tête du site fictif */}
        <header className="relative z-10 flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
          <p className="font-display text-lg font-bold tracking-tight">
            La Table <span className="text-amber-600 dark:text-amber-400">Dorée</span>
          </p>
          <nav aria-label="Navigation du site La Table Dorée" className="flex items-center gap-1">
            {navButton("accueil", "Accueil")}
            <div className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((open) => !open)}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  activeSection === "menu"
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Menu
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-field border border-line bg-surface-raised py-1 shadow-overlay"
                >
                  {(Object.keys(CATEGORY_LABELS) as MenuCategory[]).map(
                    (category) => (
                      <button
                        key={category}
                        type="button"
                        role="menuitem"
                        onClick={() => goToMenu(category)}
                        className="block w-full px-4 py-2 text-left text-sm text-muted transition hover:bg-surface hover:text-foreground"
                      >
                        {CATEGORY_LABELS[category]}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
            {navButton("galerie", "Galerie")}
          </nav>
        </header>

        {/* Ferme le déroulant au clic ailleurs */}
        {dropdownOpen && (
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 z-0 cursor-default"
            onClick={() => setDropdownOpen(false)}
          />
        )}

        {/* Contenu de la section active */}
        <div key={activeSection} className="screen-in flex-1 p-4 sm:p-6">
          {activeSection === "accueil" && (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center justify-center rounded-field bg-linear-to-br from-amber-200 via-orange-200 to-rose-200 p-8 text-center dark:from-amber-500/30 dark:via-orange-500/30 dark:to-rose-500/30">
                <UtensilsCrossed
                  className="h-10 w-10 text-amber-700 dark:text-amber-300"
                  aria-hidden
                />
                <h4 className="mt-4 font-display text-2xl font-bold text-amber-950 dark:text-amber-100 sm:text-3xl">
                  Une cuisine de saison, au cœur de Lyon
                </h4>
                <p className="mt-2 max-w-md text-sm text-amber-900/80 dark:text-amber-200/80">
                  Produits locaux, carte courte et vins choisis. Bienvenue à
                  La Table Dorée.
                </p>
                <button
                  type="button"
                  onClick={() => goToMenu("entrees")}
                  className="mt-6 rounded-field bg-amber-800 px-5 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300"
                >
                  Voir le menu
                </button>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                <p className="flex items-center gap-2 rounded-field border border-line px-4 py-3">
                  <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                  Du mardi au samedi · 12h–14h et 19h–22h30
                </p>
                <p className="flex items-center gap-2 rounded-field border border-line px-4 py-3">
                  <MapPin className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                  8 quai Saint-Antoine, 69002 Lyon
                </p>
              </div>
            </div>
          )}

          {activeSection === "menu" && (
            <div>
              <div
                role="tablist"
                aria-label="Catégories du menu"
                className="flex gap-2"
              >
                {(Object.keys(CATEGORY_LABELS) as MenuCategory[]).map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={menuCategory === category}
                      onClick={() => setMenuCategory(category)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        menuCategory === category
                          ? "bg-amber-800 text-amber-50 dark:bg-amber-400 dark:text-amber-950"
                          : "border border-line text-muted hover:text-foreground"
                      }`}
                    >
                      {CATEGORY_LABELS[category]}
                    </button>
                  ),
                )}
              </div>
              <ul key={menuCategory} className="screen-in mt-5 space-y-3">
                {MENU[menuCategory].map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-4 rounded-field border border-line px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {item.description}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {item.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSection === "galerie" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GALLERY.map((item, i) => (
                <button
                  key={item.caption}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Agrandir : ${item.caption}`}
                  className={`h-28 rounded-field bg-linear-to-br transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${item.gradient}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lightbox interne au mockup */}
        {lightboxIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[lightboxIndex].caption}
            className="absolute inset-0 z-30 flex flex-col bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Fermer l'aperçu"
                className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/30"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div
              className={`mt-2 flex-1 rounded-field bg-linear-to-br ${GALLERY[lightboxIndex].gradient}`}
            />
            <div className="mt-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex + GALLERY.length - 1) % GALLERY.length,
                  )
                }
                aria-label="Photo précédente"
                className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/30"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <p className="text-center text-sm text-white">
                {GALLERY[lightboxIndex].caption}
              </p>
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % GALLERY.length)}
                aria-label="Photo suivante"
                className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/30"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
