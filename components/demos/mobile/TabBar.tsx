"use client";

import { Bike, Home, ShoppingBag } from "lucide-react";

export type Tab = "accueil" | "panier" | "suivi";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "panier", label: "Panier", icon: ShoppingBag },
  { id: "suivi", label: "Suivi", icon: Bike },
];

export default function TabBar({
  tab,
  cartCount,
  onChange,
}: {
  tab: Tab;
  cartCount: number;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav
      aria-label="Navigation de l'application Rapido"
      className="border-t border-line bg-surface-raised"
    >
      <ul className="flex">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                  active ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" aria-hidden />
                  {id === "panier" && cartCount > 0 && (
                    <span
                      aria-label={`${cartCount} article${cartCount > 1 ? "s" : ""} dans le panier`}
                      className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-contrast"
                    >
                      {cartCount}
                    </span>
                  )}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
