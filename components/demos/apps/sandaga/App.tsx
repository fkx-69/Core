"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, RotateCcw, Search, Shirt, UserRound } from "lucide-react";
import { sandagaBody, sandagaDisplay, sandagaMono } from "./fonts";
import { INITIAL_ORDERS, INITIAL_RECEIPTS, STAGES, formatFcfa, isLate, type Order, type Payment, type Receipt } from "./data";
import CommandesView from "./views/CommandesView";
import CaisseView from "./views/CaisseView";

type View = "orders" | "register";

const mono = "[font-family:var(--font-sandaga-mono)]";

const tab = "relative px-1 pb-2.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sandaga-deep)]";

export default function SandagaApp({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<View>("orders");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [receipts, setReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
  const [query, setQuery] = useState("");
  const [nextId, setNextId] = useState(1043);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const Main = embedded ? "div" : "main";

  const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  // Commandes dont l'échéance est dépassée : nourrit l'indicateur de la cloche.
  const lateCount = orders.filter(isLate).length;

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  function changeView(next: View) {
    setView(next);
    setQuery("");
  }

  function announce(message: string) {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3200);
  }

  function reset() {
    setOrders(INITIAL_ORDERS);
    setReceipts(INITIAL_RECEIPTS);
    setNextId(1043);
    setQuery("");
    setToast("");
    setView("orders");
  }

  function advance(id: number) {
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    if (order.stage === "prete") {
      setReceipts((current) => [{ id: order.id, client: order.client, amount: order.amount, payment: order.payment, time: "15:26" }, ...current]);
      setOrders((current) => current.filter((item) => item.id !== id));
      announce(`${order.client} · retrait encaissé par ${order.payment}.`);
      return;
    }
    const index = STAGES.findIndex((stage) => stage.id === order.stage);
    setOrders((current) => current.map((item) => item.id === id ? { ...item, stage: STAGES[index + 1].id } : item));
  }

  return (
    <div className={`${sandagaBody.variable} ${sandagaDisplay.variable} ${sandagaMono.variable} @container min-h-[720px] bg-[var(--sandaga-canvas)] text-[var(--sandaga-ink)] [--sandaga-accent-soft:#d9efec] [--sandaga-accent:#0c8f84] [--sandaga-canvas:#edf3f0] [--sandaga-deep:#0d2f2b] [--sandaga-ink:#14312d] [--sandaga-late:#d96b3f] [--sandaga-line:#d8e4df] [--sandaga-muted:#5f7570] [--sandaga-panel:#ffffff] [--sandaga-ready:#2c8a54] [--sandaga-signal:#f4c944] [font-family:var(--font-sandaga-body)] selection:bg-[var(--sandaga-signal)] selection:text-[var(--sandaga-deep)]`}>
      <header className="bg-[var(--sandaga-deep)] text-white">
        <div className="flex items-center gap-3 px-4 py-3 @2xl:px-6 @4xl:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--sandaga-signal)] text-[var(--sandaga-deep)]"><Shirt className="size-5" aria-hidden /></span>
            <div className="min-w-0">
              {/* Enseigne : autorisée à passer sur deux lignes en étroit, jamais tronquée. */}
              <p className="font-[family-name:var(--font-sandaga-display)] text-sm font-extrabold uppercase tracking-tight leading-[1.05] @sm:text-base @2xl:truncate @2xl:text-lg @2xl:leading-none">Pressing Sandaga</p>
              <p className={`mt-1 hidden truncate text-[10px] tracking-[0.1em] text-[var(--sandaga-signal)] @xl:block ${mono}`}>propre · prêt · à l’heure</p>
            </div>
          </div>
          <p className={`ml-auto hidden text-xs text-white/60 @xl:block ${mono}`}>Lun. 6 juil. 2026</p>
          <button type="button" onClick={() => changeView("register")} aria-label="Ouvrir la caisse du jour" className="hidden items-center gap-2 rounded-lg bg-[var(--sandaga-signal)] px-3 py-2 text-[var(--sandaga-deep)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white @sm:inline-flex">
            <span className={`hidden text-[9px] font-semibold uppercase tracking-[0.14em] @xl:inline ${mono}`}>Caisse</span>
            <span className={`text-xs font-semibold tabular-nums ${mono}`}>{formatFcfa(total)}</span>
          </button>
          <button type="button" onClick={reset} className="grid size-9 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-signal)]" aria-label="Réinitialiser Pressing Sandaga" title="Réinitialiser"><RotateCcw className="size-4" aria-hidden /></button>
          <span className="hidden size-9 place-items-center rounded-full bg-white/10 text-white @xl:grid"><UserRound className="size-4" aria-hidden /></span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-white/10 px-4 pt-2.5 @2xl:px-6 @4xl:px-8">
          <nav className="flex gap-6 self-end" aria-label="Navigation Pressing Sandaga">
            <button type="button" onClick={() => changeView("orders")} aria-current={view === "orders" ? "page" : undefined} className={`${tab} ${view === "orders" ? "border-b-[3px] border-[var(--sandaga-signal)] text-white" : "border-b-[3px] border-transparent text-white/50 hover:text-white"}`}>Commandes</button>
            <button type="button" onClick={() => changeView("register")} aria-current={view === "register" ? "page" : undefined} className={`${tab} ${view === "register" ? "border-b-[3px] border-[var(--sandaga-signal)] text-white" : "border-b-[3px] border-transparent text-white/50 hover:text-white"}`}>Caisse du jour</button>
          </nav>
          {view === "orders" && (
            <div className="relative order-last mb-2.5 w-full @sm:order-none @sm:mb-2 @sm:ml-auto @sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-white/50" aria-hidden />
              <label className="sr-only" htmlFor="sandaga-search">Rechercher une commande</label>
              <input id="sandaga-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Client, téléphone, article…" className="w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[var(--sandaga-signal)]" />
            </div>
          )}
          <button type="button" className={`relative mb-2 hidden size-8 shrink-0 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white @sm:grid ${view === "orders" ? "" : "@sm:ml-auto"}`} aria-label="Notifications" title={lateCount > 0 ? `${lateCount} commandes en retard` : "Aucune commande en retard"}>
            <Bell className="size-4" aria-hidden />
            {lateCount > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-[var(--sandaga-signal)] ring-2 ring-[var(--sandaga-deep)]" aria-hidden />}
            <span className="sr-only">{lateCount} commandes en retard</span>
          </button>
        </div>
      </header>

      <Main className="p-4 @2xl:p-6 @4xl:p-8">
        {view === "orders" ? (
          <CommandesView
            orders={orders}
            embedded={embedded}
            query={query}
            onDeposit={(order) => {
              setOrders((current) => [{ ...order, id: nextId, stage: "recue", promised: order.express ? "2026-07-07" : "2026-07-09" }, ...current]);
              setNextId((id) => id + 1);
              announce(`Dépôt #${nextId} enregistré pour ${order.client}.`);
            }}
            onAdvance={advance}
            onPayment={(id, payment: Payment) => setOrders((current) => current.map((order) => order.id === id ? { ...order, payment } : order))}
            onNotify={(order) => announce(`SMS envoyé à ${order.client} au ${order.phone}.`)}
          />
        ) : <CaisseView embedded={embedded} receipts={receipts} />}
      </Main>

      <div className={`pointer-events-none sticky bottom-4 z-20 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-lg bg-[var(--sandaga-deep)] px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg transition ${toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
