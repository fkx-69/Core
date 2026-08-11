"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, RotateCcw, Search, Shirt, UserRound } from "lucide-react";
import { sandagaBody, sandagaDisplay, sandagaMono } from "./fonts";
import { INITIAL_ORDERS, INITIAL_RECEIPTS, STAGES, formatFcfa, isLate, type Order, type Payment, type Receipt } from "./data";
import CommandesView from "./views/CommandesView";
import CaisseView from "./views/CaisseView";

type View = "orders" | "register";

const mono = "[font-family:var(--font-sandaga-mono)]";

const tab = "relative inline-flex min-h-11 items-center px-1 pb-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sandaga-panel)]";

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
    <div className={`${sandagaBody.variable} ${sandagaDisplay.variable} ${sandagaMono.variable} demo-touch @container min-h-[720px] overflow-x-clip bg-[var(--sandaga-canvas)] text-[var(--sandaga-ink)] [--sandaga-accent-soft:#edf1ed] [--sandaga-accent:#667168] [--sandaga-canvas:#f7f6f3] [--sandaga-deep:#292c29] [--sandaga-ink:#292b29] [--sandaga-late:#a45f4c] [--sandaga-line:#e4e2dd] [--sandaga-muted:#747772] [--sandaga-panel:#ffffff] [--sandaga-ready:#55725d] [--sandaga-signal:#eee9dd] [font-family:var(--font-sandaga-body)] selection:bg-[var(--sandaga-signal)] selection:text-[var(--sandaga-deep)]`}>
      <header className="border-b border-[var(--sandaga-line)] bg-[var(--sandaga-panel)] text-[var(--sandaga-ink)]">
        <div className="flex items-center gap-3 px-4 py-3 @2xl:px-6 @4xl:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[var(--sandaga-line)] bg-[var(--sandaga-canvas)] text-[var(--sandaga-deep)]"><Shirt className="size-5" aria-hidden /></span>
            <div className="min-w-0">
              {/* Enseigne : autorisée à passer sur deux lignes en étroit, jamais tronquée. */}
              <p className="font-[family-name:var(--font-sandaga-display)] text-sm font-extrabold uppercase tracking-tight leading-[1.05] @sm:text-base @2xl:truncate @2xl:text-lg @2xl:leading-none">Pressing Sandaga</p>
              <p className={`mt-1 hidden truncate text-[10px] tracking-[0.1em] text-[var(--sandaga-muted)] @xl:block ${mono}`}>propre · prêt · à l’heure</p>
            </div>
          </div>
          <p className={`ml-auto hidden text-xs text-[var(--sandaga-muted)] @xl:block ${mono}`}>Lun. 6 juil. 2026</p>
          <button type="button" onClick={() => changeView("register")} aria-label="Ouvrir la caisse du jour" className="hidden items-center gap-2 rounded-lg border border-[var(--sandaga-line)] bg-[var(--sandaga-canvas)] px-3 py-2 text-[var(--sandaga-deep)] transition hover:bg-[var(--sandaga-signal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)] @sm:inline-flex">
            <span className={`hidden text-[9px] font-semibold uppercase tracking-[0.14em] @xl:inline ${mono}`}>Caisse</span>
            <span className={`text-xs font-semibold tabular-nums ${mono}`}>{formatFcfa(total)}</span>
          </button>
          <button type="button" onClick={reset} className="grid size-11 shrink-0 place-items-center rounded-lg text-[var(--sandaga-muted)] transition hover:bg-[var(--sandaga-canvas)] hover:text-[var(--sandaga-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)] md:size-9" aria-label="Réinitialiser Pressing Sandaga" title="Réinitialiser"><RotateCcw className="size-4" aria-hidden /></button>
          <span className="hidden size-9 place-items-center rounded-full bg-[var(--sandaga-canvas)] text-[var(--sandaga-muted)] @xl:grid"><UserRound className="size-4" aria-hidden /></span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[var(--sandaga-line)] px-4 pt-2.5 @2xl:px-6 @4xl:px-8">
          <nav className="flex gap-6 self-end" aria-label="Navigation Pressing Sandaga">
            <button type="button" onClick={() => changeView("orders")} aria-current={view === "orders" ? "page" : undefined} className={`${tab} ${view === "orders" ? "border-b-2 border-[var(--sandaga-ink)] text-[var(--sandaga-ink)]" : "border-b-2 border-transparent text-[var(--sandaga-muted)] hover:text-[var(--sandaga-ink)]"}`}>Commandes</button>
            <button type="button" onClick={() => changeView("register")} aria-current={view === "register" ? "page" : undefined} className={`${tab} ${view === "register" ? "border-b-2 border-[var(--sandaga-ink)] text-[var(--sandaga-ink)]" : "border-b-2 border-transparent text-[var(--sandaga-muted)] hover:text-[var(--sandaga-ink)]"}`}>Caisse du jour</button>
          </nav>
          {view === "orders" && (
            <div className="relative order-last mb-2.5 w-full @sm:order-none @sm:mb-2 @sm:ml-auto @sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--sandaga-muted)]" aria-hidden />
              <label className="sr-only" htmlFor="sandaga-search">Rechercher une commande</label>
              <input id="sandaga-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Client, téléphone, article…" className="min-h-12 w-full rounded-lg border border-[var(--sandaga-line)] bg-[var(--sandaga-canvas)] py-2 pl-9 pr-3 text-base text-[var(--sandaga-ink)] outline-none placeholder:text-[var(--sandaga-muted)] focus:border-[var(--sandaga-accent)] focus:ring-2 focus:ring-[var(--sandaga-accent-soft)] md:min-h-0 md:text-xs" />
            </div>
          )}
          <button type="button" className={`relative mb-2 hidden size-8 shrink-0 place-items-center rounded-lg text-[var(--sandaga-muted)] transition hover:bg-[var(--sandaga-canvas)] hover:text-[var(--sandaga-ink)] @sm:grid ${view === "orders" ? "" : "@sm:ml-auto"}`} aria-label="Notifications" title={lateCount > 0 ? `${lateCount} commandes en retard` : "Aucune commande en retard"}>
            <Bell className="size-4" aria-hidden />
            {lateCount > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-[var(--sandaga-late)] ring-2 ring-[var(--sandaga-panel)]" aria-hidden />}
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

      <div className={`pointer-events-none sticky bottom-4 z-20 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-lg bg-[var(--sandaga-deep)] px-4 py-2.5 text-center text-xs font-bold text-white transition ${toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
