"use client";

import { useState } from "react";
import { Banknote, CheckCircle2, Landmark, Smartphone, WalletCards } from "lucide-react";
import { formatFcfa, PAYMENT_META, type Payment, type Receipt } from "../data";

// Icônes locales ; les couleurs proviennent de PAYMENT_META (source unique).
const paymentMeta: Record<Payment, { color: string; icon: typeof Banknote }> = {
  Espèces: { color: PAYMENT_META["Espèces"].color, icon: Banknote },
  Wave: { color: PAYMENT_META.Wave.color, icon: Smartphone },
  "Orange Money": { color: PAYMENT_META["Orange Money"].color, icon: WalletCards },
};

const mono = "[font-family:var(--font-sandaga-mono)]";
const display = "font-[family-name:var(--font-sandaga-display)]";
const panel = "rounded-xl border border-[var(--sandaga-line)] bg-[var(--sandaga-panel)]";

// Dents de scie du reçu : tuile SVG (triangles pointe en bas) répétée sous le grand total.
const teeth = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10'%3E%3Cpath d='M0 0H20L10 10Z' fill='%230d2f2b'/%3E%3C/svg%3E")`;

export default function CaisseView({
  receipts,
  embedded,
}: {
  receipts: Receipt[];
  embedded: boolean;
}) {
  const [closed, setClosed] = useState(false);
  const Heading = embedded ? "h2" : "h1";
  const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const byPayment = (Object.keys(paymentMeta) as Payment[]).map((payment) => ({
    payment,
    total: receipts.filter((receipt) => receipt.payment === payment).reduce((sum, receipt) => sum + receipt.amount, 0),
    count: receipts.filter((receipt) => receipt.payment === payment).length,
  }));
  // Part encaissée via mobile money (Wave + Orange Money) sur le total.
  const mobileMoney = receipts.filter((receipt) => receipt.payment === "Wave" || receipt.payment === "Orange Money").reduce((sum, receipt) => sum + receipt.amount, 0);
  const mobilePct = total ? Math.round((mobileMoney / total) * 100) : 0;

  return (
    <div className="screen-in space-y-4 @2xl:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sandaga-accent)] ${mono}`}>Encaissements</p>
          <Heading className={`mt-1.5 text-2xl font-extrabold tracking-tight @2xl:text-3xl ${display}`}>Caisse du jour</Heading>
          <p className={`mt-1 text-xs text-[var(--sandaga-muted)] ${mono}`}>Lun. 6 juil. 2026 · Sandaga, Dakar</p>
        </div>
        <button type="button" onClick={() => setClosed((value) => !value)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sandaga-accent)] ${closed ? "bg-[#e6f5ec] text-[var(--sandaga-ready)]" : "bg-[var(--sandaga-deep)] text-white hover:bg-[var(--sandaga-accent)]"}`}>{closed ? <CheckCircle2 className="size-4" aria-hidden /> : <Landmark className="size-4" aria-hidden />}{closed ? "Caisse clôturée" : "Clôturer la caisse"}</button>
      </div>

      {closed && <div role="status" className="screen-in flex items-start gap-3 rounded-xl border border-[#a9d9bd] bg-[#eaf8ef] p-4 text-[#226a3e]"><CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden /><div><p className={`text-sm font-extrabold ${display}`}>Caisse équilibrée</p><p className="mt-0.5 text-xs">Le rapport de {formatFcfa(total)} est prêt à être transmis.</p></div></div>}

      {/* Grand reçu sombre : total géant + bord inférieur en dents de scie. */}
      <section aria-label="Total encaissé">
        <div className="rounded-t-xl bg-[var(--sandaga-deep)] p-5 text-white @2xl:p-6">
          <p className={`text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--sandaga-signal)] ${mono}`}>Total encaissé aujourd’hui</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <p className={`text-4xl font-black tracking-tight tabular-nums leading-none @2xl:text-6xl ${display}`}>{formatFcfa(total)}</p>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold ${mono}`}>{receipts.length} retraits</p>
              {total > 0 && <p className={`rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold ${mono}`}>{mobilePct} % mobile money</p>}
            </div>
          </div>
        </div>
        <div aria-hidden className="h-2.5 w-full" style={{ backgroundImage: teeth, backgroundRepeat: "repeat-x", backgroundSize: "20px 10px" }} />
      </section>

      <div className="grid gap-3 @sm:grid-cols-3">
        {byPayment.map(({ payment, total: subtotal, count }) => {
          const meta = paymentMeta[payment]; const Icon = meta.icon; const pct = total ? Math.round((subtotal / total) * 100) : 0;
          return (
            <div key={payment} className={`${panel} p-4`}>
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-lg" style={{ backgroundColor: `${meta.color}18`, color: meta.color }}><Icon className="size-4" aria-hidden /></span>
                <span className={`text-xs font-semibold tabular-nums ${mono}`} style={{ color: meta.color }}>{pct}%</span>
              </div>
              <p className={`mt-4 text-sm font-bold ${display}`}>{payment}</p>
              <p className={`mt-1 text-lg font-semibold tabular-nums ${mono}`}>{formatFcfa(subtotal)}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sandaga-accent-soft)]"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} /></div>
              <p className="mt-2 text-[10px] text-[var(--sandaga-muted)]">{count} paiement{count > 1 ? "s" : ""}</p>
            </div>
          );
        })}
      </div>

      <section className={`${panel} overflow-hidden`} aria-labelledby="sandaga-receipts-title">
        <div className="border-b border-[var(--sandaga-line)] px-4 py-3"><h2 id="sandaga-receipts-title" className={`text-sm font-extrabold ${display}`}>Journal des retraits</h2><p className="text-[11px] text-[var(--sandaga-muted)]">Les commandes encaissées apparaissent ici automatiquement.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead className={`text-[10px] uppercase tracking-[0.1em] text-[var(--sandaga-muted)] ${mono}`}><tr><th className="px-4 py-2.5 font-medium">Heure</th><th className="px-3 py-2.5 font-medium">Commande</th><th className="px-3 py-2.5 font-medium">Client</th><th className="px-3 py-2.5 font-medium">Mode</th><th className="px-3 py-2.5 text-right font-medium">Montant</th></tr></thead>
            <tbody>{receipts.map((receipt) => (
              <tr key={`${receipt.id}-${receipt.time}`} className="border-t border-dashed border-[var(--sandaga-line)] transition hover:bg-[var(--sandaga-canvas)]">
                <td className={`px-4 py-3 text-[var(--sandaga-muted)] ${mono}`}>{receipt.time}</td>
                <td className={`px-3 py-3 ${mono}`}>Nº {receipt.id}</td>
                <td className="px-3 py-3 font-bold">{receipt.client}</td>
                <td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold ${PAYMENT_META[receipt.payment].chip}`}><span className="size-1.5 rounded-full" style={{ backgroundColor: PAYMENT_META[receipt.payment].dot }} aria-hidden />{receipt.payment}</span></td>
                <td className={`px-3 py-3 text-right font-semibold tabular-nums ${mono}`}>{formatFcfa(receipt.amount)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
