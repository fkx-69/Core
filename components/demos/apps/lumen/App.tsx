"use client";

import { useState } from "react";
import { Boxes, LayoutDashboard, RotateCcw, Search } from "lucide-react";
import { lumenBody, lumenDisplay } from "./fonts";
import { INITIAL_SALES, INITIAL_STOCK, MONTH_TARGET, formatFcfaCompact, type Sale, type StockItem } from "./data";
import VentesView from "./views/VentesView";
import StockView from "./views/StockView";

type View = "sales" | "stock";

export default function LumenApp({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<View>("sales");
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [query, setQuery] = useState("");
  const [nextId, setNextId] = useState(INITIAL_SALES.length + 1);
  const Main = embedded ? "div" : "main";

  const lowStockCount = stock.filter((item) => item.quantity <= item.threshold).length;
  // CA vivant du mois : alimente la jauge d'objectif de la sidebar.
  const revenue = sales
    .filter((sale) => sale.status !== "Annulée")
    .reduce((sum, sale) => sum + sale.amount, 0);
  const targetPct = Math.min(100, Math.round((revenue / MONTH_TARGET) * 100));
  // Vitrine de la sidebar : la plus belle pièce vendue du mois.
  const bestSale = sales
    .filter((sale) => sale.status !== "Annulée")
    .reduce<Sale | null>((best, sale) => (!best || sale.amount > best.amount ? sale : best), null);

  function reset() {
    setSales(INITIAL_SALES);
    setStock(INITIAL_STOCK);
    setQuery("");
    setNextId(INITIAL_SALES.length + 1);
    setView("sales");
  }

  function changeView(next: View) {
    setView(next);
    setQuery("");
  }

  const nav = [
    { id: "sales" as const, label: "Ventes", icon: LayoutDashboard },
    { id: "stock" as const, label: "Stock", icon: Boxes, count: lowStockCount },
  ];

  return (
    <div
      className={`${lumenBody.variable} ${lumenDisplay.variable} @container min-h-[720px] bg-[var(--lumen-canvas)] text-[var(--lumen-ink)] [--lumen-canvas:#f6efe3] [--lumen-copper-deep:#96501f] [--lumen-copper-soft:#f0dcc4] [--lumen-copper:#b4672d] [--lumen-gold:#d9a04e] [--lumen-grid:#efe6d2] [--lumen-ink:#262119] [--lumen-line:#e5d9c4] [--lumen-muted:#7b7160] [--lumen-olive:#6f7d4f] [--lumen-panel:#fffcf5] [--lumen-sand:#e7c9a0] [font-family:var(--font-lumen-body)] selection:bg-[var(--lumen-copper-soft)]`}
    >
      <div className="grid min-h-[720px] @2xl:grid-cols-[196px_1fr] @5xl:grid-cols-[230px_1fr]">
        <aside className="hidden flex-col bg-[#211b12] p-4 text-[#f3ead9] @2xl:flex @5xl:p-5">
          <div className="px-1 pt-1.5">
            <p className="font-[family-name:var(--font-lumen-display)] text-[30px] font-medium italic leading-none tracking-tight">
              lumen<span className="not-italic text-[var(--lumen-gold)]">.</span>
            </p>
            <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#f3ead9]/40">Boutique · Dakar</p>
          </div>
          <nav className="mt-9 space-y-1" aria-label="Navigation Lumen">
            {nav.map(({ id, label, icon: Icon, count }) => (
              <button key={id} type="button" onClick={() => changeView(id)} aria-current={view === id ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-gold)] ${view === id ? "bg-[var(--lumen-canvas)] text-[#211b12]" : "text-[#f3ead9]/55 hover:bg-white/5 hover:text-[#f3ead9]"}`}>
                <Icon className={`size-4 ${view === id ? "text-[var(--lumen-copper)]" : ""}`} aria-hidden /><span>{label}</span>{count ? <span className="ml-auto rounded-full bg-[var(--lumen-copper-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--lumen-copper-deep)]">{count}</span> : null}
              </button>
            ))}
          </nav>
          {bestSale && (
            <div className="mt-auto rounded-2xl border border-white/10 p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--lumen-gold)]/85">Meilleure vente</p>
              <p className="mt-2 font-[family-name:var(--font-lumen-display)] text-[15px] italic leading-snug">{bestSale.product}</p>
              <p className="mt-1.5 text-[11px] tabular-nums text-[#f3ead9]/50">{formatFcfaCompact(bestSale.amount)} FCFA · {bestSale.client}</p>
            </div>
          )}
          {/* Jauge vivante : elle avance quand on enregistre une vente dans la démo. */}
          <div className="mt-5 border-t border-white/10 pt-4" aria-live="polite">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#f3ead9]/40">Objectif juin</p>
              <p className="font-[family-name:var(--font-lumen-display)] text-lg font-semibold tabular-nums text-[var(--lumen-gold)]">{targetPct} %</p>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[var(--lumen-copper)] to-[var(--lumen-gold)] transition-[width] duration-500" style={{ width: `${targetPct}%` }} />
            </div>
            <p className="mt-2 text-[10px] tabular-nums text-[#f3ead9]/45">{formatFcfaCompact(revenue)} / {formatFcfaCompact(MONTH_TARGET)} FCFA</p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-[var(--lumen-line)] px-4 py-3 @2xl:px-6 @4xl:px-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#211b12] pb-0.5 font-[family-name:var(--font-lumen-display)] text-[15px] italic leading-none text-[var(--lumen-gold)] @2xl:hidden" aria-hidden>l.</span>
              <div className="relative min-w-0 flex-1 @3xl:max-w-sm">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--lumen-muted)]" aria-hidden />
                <label htmlFor="lumen-search" className="sr-only">Rechercher {view === "sales" ? "une vente" : "un produit"}</label>
                <input id="lumen-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={view === "sales" ? "Rechercher un client, un produit…" : "Rechercher un produit, une référence…"} className="w-full rounded-full border border-[var(--lumen-line)] bg-[var(--lumen-panel)] py-2 pl-10 pr-4 text-xs outline-none placeholder:text-[var(--lumen-muted)] focus:border-[var(--lumen-copper)] focus:ring-2 focus:ring-[var(--lumen-copper-soft)]" />
              </div>
              <div className="ml-auto hidden items-baseline gap-2 @sm:flex">
                <p className="font-[family-name:var(--font-lumen-display)] text-[15px] font-medium italic">Juin 2026</p>
                <span className="size-1 rounded-full bg-[var(--lumen-copper)]" aria-hidden />
                <p className="hidden text-[10px] text-[var(--lumen-muted)] @xl:block">synchronisé à l’instant</p>
              </div>
              <button type="button" onClick={reset} className="grid size-9 place-items-center rounded-full border border-[var(--lumen-line)] text-[var(--lumen-muted)] transition hover:border-[var(--lumen-copper)] hover:text-[var(--lumen-copper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-copper)]" aria-label="Réinitialiser Lumen" title="Réinitialiser"><RotateCcw className="size-4" aria-hidden /></button>
              <div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-full bg-[var(--lumen-copper-soft)] font-[family-name:var(--font-lumen-display)] text-[13px] font-semibold italic text-[var(--lumen-copper-deep)]">AD</span><span className="hidden text-xs font-bold @4xl:inline">Awa D.</span></div>
            </div>
            <nav className="mt-3 flex gap-2 @2xl:hidden" aria-label="Vues Lumen">
              {nav.map(({ id, label, icon: Icon, count }) => <button key={id} type="button" onClick={() => changeView(id)} aria-current={view === id ? "page" : undefined} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-copper)] ${view === id ? "bg-[#211b12] text-[var(--lumen-canvas)]" : "border border-[var(--lumen-line)] bg-[var(--lumen-panel)] text-[var(--lumen-muted)]"}`}><Icon className="size-3.5" aria-hidden />{label}{count ? <span className={`rounded-full px-1.5 text-[10px] ${view === id ? "bg-white/15 text-[var(--lumen-gold)]" : "bg-[var(--lumen-copper-soft)] text-[var(--lumen-copper-deep)]"}`}>{count}</span> : null}</button>)}
            </nav>
          </header>

          <Main className="p-4 @2xl:p-6 @4xl:p-8">
            {view === "sales" ? (
              <VentesView
                sales={sales}
                embedded={embedded}
                query={query}
                lowStockCount={lowStockCount}
                onAdd={(sale) => {
                  setSales((current) => [{ ...sale, id: nextId, date: "2026-06-30", status: "En attente" }, ...current]);
                  setNextId((id) => id + 1);
                }}
                onMarkPaid={(id) => setSales((current) => current.map((sale) => sale.id === id ? { ...sale, status: "Payée" } : sale))}
                onDelete={(id) => setSales((current) => current.filter((sale) => sale.id !== id))}
              />
            ) : (
              <StockView embedded={embedded} stock={stock} query={query} onAdjust={(id, delta) => setStock((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))} />
            )}
          </Main>
        </div>
      </div>
    </div>
  );
}
