"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Check, Plus, SearchX, Trash2, TrendingDown, TrendingUp, X } from "lucide-react";
import { CategoryDonut, RevenueBars } from "../Charts";
import {
  CATEGORIES,
  MONTH_TARGET,
  PAYMENTS,
  PAYMENT_META,
  PREVIOUS_REVENUE,
  formatDate,
  formatFcfa,
  type Category,
  type Payment,
  type Sale,
  type SaleStatus,
} from "../data";

type SortKey = "date" | "client" | "amount";

const field =
  "w-full rounded-xl border border-[var(--lumen-line)] bg-[var(--lumen-canvas)]/50 px-3 py-2.5 text-sm text-[var(--lumen-ink)] outline-none transition placeholder:text-[var(--lumen-muted)] focus:border-[var(--lumen-copper)] focus:bg-[var(--lumen-panel)] focus:ring-2 focus:ring-[var(--lumen-copper-soft)]";

/** Panneau de base : bordure chaude + ombre très douce, ton papier. */
const panel =
  "rounded-[20px] border border-[var(--lumen-line)] bg-[var(--lumen-panel)] shadow-[0_1px_0_rgba(122,96,58,0.06),0_18px_44px_-36px_rgba(74,56,31,0.55)]";

const display = "font-[family-name:var(--font-lumen-display)]";

/* Statuts en point coloré + texte : plus éditorial que la pastille pleine. */
const statusMeta: Record<SaleStatus, { dot: string; text: string }> = {
  Payée: { dot: "#4a9163", text: "#2f7048" },
  "En attente": { dot: "#cf9226", text: "#8a5a00" },
  Annulée: { dot: "#c05f4e", text: "#a03e32" },
};

function StatusMark({ status }: { status: SaleStatus }) {
  const meta = statusMeta[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: meta.text }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.dot }} aria-hidden />
      {status}
    </span>
  );
}

function PaymentChip({ payment }: { payment: Payment }) {
  const meta = PAYMENT_META[payment];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-semibold ${meta.chip}`}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.dot }} aria-hidden />
      {payment}
    </span>
  );
}

/** Médaillon d'initiales serif : la touche « maison » des lignes clients. */
function Initials({ name }: { name: string }) {
  const letters = name.split(" ").slice(0, 2).map((word) => word[0]).join("");
  return (
    <span className={`grid size-7 shrink-0 place-items-center rounded-full bg-[var(--lumen-copper-soft)]/60 ${display} text-[11px] font-semibold italic text-[var(--lumen-copper-deep)]`} aria-hidden>
      {letters}
    </span>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-[var(--lumen-panel)] p-4 @2xl:p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--lumen-muted)]">{label}</p>
      <p className={`mt-2 ${display} text-[26px] font-semibold leading-none tracking-tight tabular-nums text-[var(--lumen-ink)] @xl:text-[30px]`}>{value}</p>
      {note && <p className="mt-2 text-[11px] text-[var(--lumen-muted)]">{note}</p>}
    </div>
  );
}

export default function VentesView({
  sales,
  embedded,
  query,
  lowStockCount,
  onAdd,
  onMarkPaid,
  onDelete,
}: {
  sales: Sale[];
  embedded: boolean;
  query: string;
  lowStockCount: number;
  onAdd: (sale: Omit<Sale, "id" | "date" | "status">) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const Heading = embedded ? "h2" : "h1";
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<SaleStatus | "Toutes">("Toutes");
  const [sort, setSort] = useState<SortKey>("date");
  const [client, setClient] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState<Category>("Décoration");
  const [payment, setPayment] = useState<Payment>("Wave");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const activeSales = useMemo(() => sales.filter((sale) => sale.status !== "Annulée"), [sales]);
  const revenue = activeSales.reduce((sum, sale) => sum + sale.amount, 0);
  const awaiting = sales.filter((sale) => sale.status === "En attente").length;
  const revenueByCategory = CATEGORIES.map((item) => ({
    label: item,
    value: activeSales.filter((sale) => sale.category === item).reduce((sum, sale) => sum + sale.amount, 0),
  }));

  // Delta vivant contre mai (dernier mois clos) : il réagit aux ventes ajoutées.
  const mayRevenue = PREVIOUS_REVENUE[PREVIOUS_REVENUE.length - 1].value;
  const deltaPct = ((revenue - mayRevenue) / mayRevenue) * 100;
  const deltaUp = deltaPct >= 0;
  const DeltaIcon = deltaUp ? TrendingUp : TrendingDown;

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    return sales
      .filter((sale) => status === "Toutes" || sale.status === status)
      .filter((sale) => !needle || `${sale.client} ${sale.product}`.toLocaleLowerCase("fr").includes(needle))
      .toSorted((a, b) => {
        if (sort === "amount") return b.amount - a.amount;
        if (sort === "client") return a.client.localeCompare(b.client, "fr");
        return b.date.localeCompare(a.date);
      });
  }, [query, sales, sort, status]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = Number(amount);
    if (!client.trim() || !product.trim() || !Number.isFinite(parsed) || parsed < 1000) {
      setError("Renseignez le client, le produit et un montant d’au moins 1 000 FCFA.");
      return;
    }
    onAdd({ client: client.trim(), product: product.trim(), category, payment, amount: parsed });
    setClient("");
    setProduct("");
    setAmount("");
    setError("");
    setFormOpen(false);
  }

  return (
    <div className="screen-in space-y-4 @2xl:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--lumen-copper)]">Vue d’ensemble</p>
          <Heading className={`mt-1.5 ${display} text-[28px] font-semibold leading-none tracking-tight @2xl:text-[34px]`}>Ventes de juin</Heading>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--lumen-copper)] px-4.5 py-2.5 text-sm font-bold text-[#fff8ec] shadow-[0_10px_24px_-12px_rgba(150,80,31,0.8)] transition hover:bg-[var(--lumen-copper-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-copper)] focus-visible:ring-offset-2"
        >
          {formOpen ? <X className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          {formOpen ? "Fermer" : "Nouvelle vente"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={submit} className={`screen-in ${panel} p-4`} aria-label="Ajouter une vente">
          <div className="grid gap-3 @sm:grid-cols-2 @3xl:grid-cols-5">
            <label className="text-xs font-semibold text-[var(--lumen-muted)]">Client<input className={`${field} mt-1`} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Aminata Ba" /></label>
            <label className="text-xs font-semibold text-[var(--lumen-muted)]">Produit<input className={`${field} mt-1`} value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Produit vendu" /></label>
            <label className="text-xs font-semibold text-[var(--lumen-muted)]">Catégorie<select className={`${field} mt-1`} value={category} onChange={(e) => setCategory(e.target.value as Category)}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-xs font-semibold text-[var(--lumen-muted)]">Paiement<select className={`${field} mt-1`} value={payment} onChange={(e) => setPayment(e.target.value as Payment)}>{PAYMENTS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-xs font-semibold text-[var(--lumen-muted)]">Montant FCFA<input className={`${field} mt-1`} type="number" min="1000" step="500" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="75 000" /></label>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#a03e32]" role="alert">{error}</p>
            <button type="submit" className="ml-auto rounded-full bg-[#211b12] px-4 py-2 text-sm font-bold text-[var(--lumen-canvas)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-copper)]">Enregistrer la vente</button>
          </div>
        </form>
      )}

      {/* Bande KPI éditoriale : un seul panneau, cellules séparées par des filets. */}
      <div className={`overflow-hidden ${panel}`} aria-live="polite">
        <div className="grid grid-cols-2 gap-px bg-[var(--lumen-line)] @3xl:grid-cols-4">
          <div className="col-span-2 bg-[var(--lumen-panel)] p-4 @2xl:p-5 @3xl:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--lumen-muted)]">Chiffre d’affaires</p>
            <p className={`mt-2 ${display} text-[26px] font-semibold leading-none tracking-tight tabular-nums text-[var(--lumen-copper-deep)] @xl:text-[30px]`}>{formatFcfa(revenue)}</p>
            <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--lumen-copper-soft)]/50 px-2 py-0.5 text-[11px] font-bold ${deltaUp ? "text-[var(--lumen-copper-deep)]" : "text-[#a03e32]"}`}>
              <DeltaIcon className="size-3.5" aria-hidden />
              {deltaUp ? "+" : ""}{deltaPct.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % vs mai
            </p>
          </div>
          <Metric label="Commandes" value={String(activeSales.length)} note="hors ventes annulées" />
          <Metric label="À encaisser" value={String(awaiting)} note="paiements en attente" />
          {/* Pleine largeur sous @3xl : évite la cellule orpheline dans la grille 2 colonnes. */}
          <div className="col-span-2 @3xl:col-span-1"><Metric label="Stocks bas" value={String(lowStockCount)} note="réassort à prévoir" /></div>
        </div>
      </div>

      <div className="grid gap-3 @3xl:grid-cols-[1.55fr_1fr] @2xl:gap-4">
        <section className={`${panel} p-4 @2xl:p-5`} aria-labelledby="lumen-revenue-title">
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="lumen-revenue-title" className="text-[13px] font-bold">Chiffre d’affaires mensuel</h2>
            <p className={`${display} text-xs italic text-[var(--lumen-muted)]`}>6 derniers mois</p>
          </div>
          <div className="mt-2">
            <RevenueBars data={[...PREVIOUS_REVENUE, { label: "Juin", value: revenue }]} target={MONTH_TARGET} />
          </div>
        </section>
        <section className={`${panel} p-4 @2xl:p-5`} aria-labelledby="lumen-category-title">
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="lumen-category-title" className="text-[13px] font-bold">Ventes par catégorie</h2>
            <p className={`${display} text-xs italic text-[var(--lumen-muted)]`}>juin</p>
          </div>
          <div className="mt-5">
            <CategoryDonut data={revenueByCategory} />
          </div>
        </section>
      </div>

      <section className={`overflow-hidden ${panel}`} aria-labelledby="lumen-sales-title">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 @2xl:px-5">
          <div className="flex items-baseline gap-2"><h2 id="lumen-sales-title" className="text-[13px] font-bold">Dernières ventes</h2><p className={`${display} text-xs italic text-[var(--lumen-muted)]`}>{visible.length} résultat{visible.length > 1 ? "s" : ""}</p></div>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="lumen-status">Filtrer par statut</label>
            <select id="lumen-status" value={status} onChange={(e) => setStatus(e.target.value as SaleStatus | "Toutes")} className="rounded-full border border-[var(--lumen-line)] bg-[var(--lumen-panel)] px-3 py-1.5 text-xs font-semibold outline-none focus:border-[var(--lumen-copper)]"><option>Toutes</option><option>Payée</option><option>En attente</option><option>Annulée</option></select>
            <label className="sr-only" htmlFor="lumen-sort">Trier les ventes</label>
            <span className="relative"><ArrowDownUp className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-[var(--lumen-muted)]" aria-hidden /><select id="lumen-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-full border border-[var(--lumen-line)] bg-[var(--lumen-panel)] py-1.5 pl-7 pr-3 text-xs font-semibold outline-none focus:border-[var(--lumen-copper)]"><option value="date">Récentes</option><option value="amount">Montant</option><option value="client">Client</option></select></span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="text-[10px] uppercase tracking-[0.12em] text-[var(--lumen-muted)]"><tr className="border-b border-[var(--lumen-line)]"><th className="px-4 pb-2.5 font-bold @2xl:px-5">Client</th><th className="px-3 pb-2.5 font-bold">Produit</th><th className="px-3 pb-2.5 font-bold">Paiement</th><th className="px-3 pb-2.5 text-right font-bold">Montant</th><th className="px-3 pb-2.5 font-bold">Date</th><th className="px-3 pb-2.5 font-bold">Statut</th><th className="px-3 pb-2.5" aria-label="Actions" /></tr></thead>
            <tbody>
              {visible.map((sale) => (
                <tr key={sale.id} className="border-t border-[var(--lumen-grid)] transition first:border-t-0 hover:bg-[var(--lumen-canvas)]/45">
                  <td className="px-4 py-3 @2xl:px-5"><span className="flex items-center gap-2.5"><Initials name={sale.client} /><span className="font-bold">{sale.client}</span></span></td><td className="px-3 py-3 text-[var(--lumen-muted)]">{sale.product}</td><td className="px-3 py-3 text-xs"><PaymentChip payment={sale.payment} /></td><td className="px-3 py-3 text-right font-bold tabular-nums">{formatFcfa(sale.amount)}</td><td className="px-3 py-3 text-[var(--lumen-muted)]">{formatDate(sale.date)}</td><td className="px-3 py-3"><StatusMark status={sale.status} /></td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-1">{sale.status === "En attente" && <button type="button" onClick={() => onMarkPaid(sale.id)} className="rounded-full p-1.5 text-[#2f7048] hover:bg-[#e8f0e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-copper)]" aria-label={`Marquer la vente de ${sale.client} comme payée`}><Check className="size-4" aria-hidden /></button>}<button type="button" onClick={() => onDelete(sale.id)} className="rounded-full p-1.5 text-[var(--lumen-muted)] hover:bg-[#f5e4de] hover:text-[#a03e32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lumen-copper)]" aria-label={`Supprimer la vente de ${sale.client}`}><Trash2 className="size-4" aria-hidden /></button></div></td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-[var(--lumen-muted)]"><SearchX className="mx-auto mb-2 size-5" aria-hidden />Aucune vente ne correspond à ces critères.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
