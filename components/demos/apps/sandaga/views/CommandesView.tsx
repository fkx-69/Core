"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, MessageSquareText, Plus, SearchX, X, Zap } from "lucide-react";
import { PAYMENT_META, STAGES, formatFcfa, formatPromised, isLate, type Order, type Payment } from "../data";

const payments: Payment[] = ["Espèces", "Wave", "Orange Money"];
const mono = "[font-family:var(--font-sandaga-mono)]";
const display = "font-[family-name:var(--font-sandaga-display)]";
const field = "w-full rounded-lg border border-[var(--sandaga-line)] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[var(--sandaga-muted)] focus:border-[var(--sandaga-accent)] focus:ring-2 focus:ring-[var(--sandaga-accent-soft)]";

/** Chevron du select stylé (appearance-none oblige à redessiner la flèche). */
const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 1l3 3 3-3' fill='none' stroke='%235f7570' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`;

export default function CommandesView({
  orders,
  embedded,
  query,
  onDeposit,
  onAdvance,
  onPayment,
  onNotify,
}: {
  orders: Order[];
  embedded: boolean;
  query: string;
  onDeposit: (order: Omit<Order, "id" | "stage" | "promised">) => void;
  onAdvance: (id: number) => void;
  onPayment: (id: number, payment: Payment) => void;
  onNotify: (order: Order) => void;
}) {
  const Heading = embedded ? "h2" : "h1";
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState<Payment>("Wave");
  const [express, setExpress] = useState(false);
  const [error, setError] = useState("");

  const needle = query.trim().toLocaleLowerCase("fr");
  const visible = useMemo(() => orders.filter((order) => !needle || `${order.client} ${order.phone} ${order.items}`.toLocaleLowerCase("fr").includes(needle)), [needle, orders]);
  const workshop = orders.filter((order) => order.stage !== "prete").length;
  const ready = orders.filter((order) => order.stage === "prete").length;
  const late = orders.filter(isLate).length;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = Number(amount);
    if (!client.trim() || !phone.trim() || !items.trim() || !Number.isFinite(parsed) || parsed < 1000) {
      setError("Complétez le client, le téléphone, les articles et le montant.");
      return;
    }
    onDeposit({ client: client.trim(), phone: phone.trim(), items: items.trim(), amount: parsed, express, payment });
    setClient(""); setPhone(""); setItems(""); setAmount(""); setExpress(false); setPayment("Wave"); setError(""); setOpen(false);
  }

  return (
    <div className="screen-in space-y-4 @2xl:space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sandaga-accent)] ${mono}`}>Atelier en direct</p>
          <Heading className={`mt-1.5 text-2xl font-extrabold tracking-tight @2xl:text-3xl ${display}`}>Commandes du jour</Heading>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--sandaga-deep)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--sandaga-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)] focus-visible:ring-offset-2">{open ? <X className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}{open ? "Fermer" : "Nouveau dépôt"}</button>
      </div>

      {open && (
        <form onSubmit={submit} className="screen-in rounded-xl border border-[var(--sandaga-line)] bg-[var(--sandaga-panel)] p-4" aria-label="Enregistrer un dépôt">
          <div className="grid gap-3 @sm:grid-cols-2 @3xl:grid-cols-6">
            <label className="text-xs font-bold text-[var(--sandaga-muted)]">Client<input className={`${field} mt-1`} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nom complet" /></label>
            <label className="text-xs font-bold text-[var(--sandaga-muted)]">Téléphone<input className={`${field} mt-1`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00" /></label>
            <label className="text-xs font-bold text-[var(--sandaga-muted)] @3xl:col-span-2">Articles<input className={`${field} mt-1`} value={items} onChange={(e) => setItems(e.target.value)} placeholder="3 chemises · 1 pantalon" /></label>
            <label className="text-xs font-bold text-[var(--sandaga-muted)]">Montant FCFA<input className={`${field} mt-1`} type="number" min="1000" step="500" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="6 500" /></label>
            <label className="text-xs font-bold text-[var(--sandaga-muted)]">Paiement<select className={`${field} mt-1`} value={payment} onChange={(e) => setPayment(e.target.value as Payment)}>{payments.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} className="size-4 accent-[var(--sandaga-signal)]" />Service express</label><p role="alert" className="text-xs text-[var(--sandaga-late)]">{error}</p><button type="submit" className="ml-auto rounded-lg bg-[var(--sandaga-deep)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--sandaga-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)]">Enregistrer</button></div>
        </form>
      )}

      {/* Bande de stats : un seul panneau, trois compteurs façon comptoir. */}
      <div className="grid grid-cols-3 divide-x divide-[var(--sandaga-line)] rounded-xl border border-[var(--sandaga-line)] bg-[var(--sandaga-panel)]" aria-live="polite">
        {[
          { label: "En atelier", value: workshop, color: "text-[var(--sandaga-ink)]" },
          { label: "Prêtes", value: ready, color: "text-[var(--sandaga-ready)]" },
          { label: "En retard", value: late, color: late > 0 ? "text-[var(--sandaga-late)]" : "text-[var(--sandaga-muted)]" },
        ].map((metric) => (
          <div key={metric.label} className="px-3 py-3.5 @xl:px-5">
            <p className={`text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--sandaga-muted)] ${mono}`}>{metric.label}</p>
            <p className={`mt-1 text-3xl font-black tabular-nums leading-none @xl:text-[40px] ${display} ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-4">
        {STAGES.map((stage, stageIndex) => {
          const column = visible.filter((order) => order.stage === stage.id);
          return (
            <section key={stage.id} aria-labelledby={`sandaga-${stage.id}`} className="min-w-0 rounded-xl border border-[var(--sandaga-line)] bg-[var(--sandaga-canvas)] p-2">
              {/* En-tête = repère pastel discret, compteur bordé. */}
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ backgroundColor: stage.color }}>
                <h2 id={`sandaga-${stage.id}`} className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--sandaga-ink)]">{stage.label}</h2>
                <span className={`ml-auto grid min-w-5 place-items-center rounded-md border border-black/5 bg-white/70 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--sandaga-ink)] ${mono}`}>{column.length}</span>
              </div>
              <ul className="mt-2 space-y-2">
                {column.map((order) => {
                  const lateOrder = isLate(order);
                  return (
                    <li key={order.id} className={`rounded-lg border border-[var(--sandaga-line)] bg-white p-3 ${lateOrder ? "border-l-2 border-l-[var(--sandaga-late)]" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`truncate text-sm font-bold ${display}`}>{order.client}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--sandaga-muted)]">{order.items}</p>
                        </div>
                        <span className={`shrink-0 text-[11px] text-[var(--sandaga-muted)] ${mono}`}>Nº {order.id}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {order.express && <span className="inline-flex items-center gap-1 rounded-md bg-[var(--sandaga-signal)] px-2 py-0.5 text-[10px] font-bold text-[var(--sandaga-deep)]"><Zap className="size-3" aria-hidden />Express</span>}
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${lateOrder ? "bg-[#fbe9df] text-[var(--sandaga-late)]" : "bg-[var(--sandaga-accent-soft)] text-[var(--sandaga-accent)]"} ${mono}`}><Clock3 className="size-3" aria-hidden />{formatPromised(order.promised)}</span>
                      </div>
                      {/* Ligne de déchirure du reçu, puis la rangée montant + paiement. */}
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-[var(--sandaga-line)] pt-2.5">
                        <span className={`text-sm font-semibold tabular-nums ${mono}`}>{formatFcfa(order.amount)}</span>
                        <label className="relative inline-flex items-center">
                          <span className="sr-only">Paiement pour {order.client}</span>
                          <span aria-hidden className="pointer-events-none absolute left-2 size-1.5 rounded-full" style={{ backgroundColor: PAYMENT_META[order.payment].dot }} />
                          <select
                            value={order.payment}
                            onChange={(e) => onPayment(order.id, e.target.value as Payment)}
                            className="max-w-33 appearance-none rounded-full border border-[var(--sandaga-line)] bg-white bg-[right_0.5rem_center] bg-no-repeat py-1 pl-5 pr-6 text-[10px] font-bold text-[var(--sandaga-ink)] outline-none transition focus:border-[var(--sandaga-accent)] focus:ring-2 focus:ring-[var(--sandaga-accent-soft)]"
                            style={{ backgroundImage: chevron }}
                          >
                            {payments.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </label>
                      </div>
                      {stage.id === "prete" && <button type="button" onClick={() => onNotify(order)} className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--sandaga-accent-soft)] py-1.5 text-[11px] font-bold text-[var(--sandaga-accent)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)]"><MessageSquareText className="size-3.5" aria-hidden />Prévenir par SMS</button>}
                      <button type="button" onClick={() => onAdvance(order.id)} className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)] ${stage.id === "prete" ? "bg-[var(--sandaga-ready)] text-white hover:brightness-95" : "border border-[var(--sandaga-line)] bg-white text-[var(--sandaga-ink)] hover:border-[var(--sandaga-deep)] hover:bg-[var(--sandaga-deep)] hover:text-white"}`}>
                        {stage.id === "prete" ? <><CheckCircle2 className="size-3.5" aria-hidden />Retirée & encaissée</> : <>Vers {STAGES[stageIndex + 1].label.toLowerCase()}<ArrowRight className="size-3.5" aria-hidden /></>}
                      </button>
                    </li>
                  );
                })}
                {column.length === 0 && <li className={`rounded-lg border border-dashed border-[var(--sandaga-line)] px-3 py-8 text-center text-xs text-[var(--sandaga-muted)] ${mono}`}>{query ? <><SearchX className="mx-auto mb-2 size-4" aria-hidden />Aucun résultat</> : "Aucune commande"}</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
