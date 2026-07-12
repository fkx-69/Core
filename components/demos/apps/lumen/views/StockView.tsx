"use client";

import { AlertTriangle, Boxes, Minus, PackageCheck, Plus } from "lucide-react";
import { formatFcfa, type StockItem } from "../data";

/** Panneau de base : surface blanche et bordure fine, cohérent avec la vue Ventes. */
const panel =
  "rounded-xl border border-[var(--lumen-line)] bg-[var(--lumen-panel)]";

const display = "font-[family-name:var(--font-lumen-display)]";

export default function StockView({
  stock,
  embedded,
  query,
  onAdjust,
}: {
  stock: StockItem[];
  embedded: boolean;
  query: string;
  onAdjust: (id: number, delta: number) => void;
}) {
  const Heading = embedded ? "h2" : "h1";
  const low = stock.filter((item) => item.quantity <= item.threshold);
  const units = stock.reduce((sum, item) => sum + item.quantity, 0);
  const value = stock.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const needle = query.trim().toLocaleLowerCase("fr");
  const visible = stock.filter((item) => !needle || `${item.product} ${item.reference}`.toLocaleLowerCase("fr").includes(needle));

  const metrics = [
    { label: "Unités disponibles", value: units.toLocaleString("fr-FR"), icon: Boxes },
    { label: "Produits à réassortir", value: String(low.length), icon: AlertTriangle },
    { label: "Valeur du stock", value: formatFcfa(value), icon: PackageCheck },
  ];

  return (
    <div className="screen-in space-y-4 @2xl:space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--lumen-copper)]">Inventaire</p>
        <Heading className={`mt-1.5 ${display} text-[28px] font-semibold leading-none tracking-tight @2xl:text-[34px]`}>État du stock</Heading>
        <p className="mt-2 text-sm text-[var(--lumen-muted)]">Boutique Dakar · mise à jour instantanée</p>
      </div>

      {/* Bande KPI éditoriale : un seul panneau, cellules séparées par des filets. */}
      <div className={`overflow-hidden ${panel}`} aria-live="polite">
        <div className="grid gap-px bg-[var(--lumen-line)] @sm:grid-cols-3">
          {metrics.map(({ label, value: metric, icon: Icon }) => (
            <div key={label} className="bg-[var(--lumen-panel)] p-4 @2xl:p-5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--lumen-muted)]"><Icon className="size-3.5 text-[var(--lumen-copper)]" aria-hidden />{label}</p>
              <p className={`mt-2 ${display} text-[26px] font-semibold leading-none tracking-tight tabular-nums @xl:text-[30px]`}>{metric}</p>
            </div>
          ))}
        </div>
      </div>

      {low.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-[#e7dfcc] bg-[#fbf7ec] p-4 text-[#746139]">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div>
            <p className={`${display} text-[15px] font-semibold italic`}>Réassort conseillé</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {low.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e7dfcc] bg-white/70 px-2.5 py-1 text-[11px] font-semibold"
                >
                  {item.product}
                  <span className="font-normal text-[#a3792f]">
                    · {item.quantity} restant{item.quantity > 1 ? "s" : ""}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className={`overflow-hidden ${panel}`} aria-labelledby="lumen-stock-title">
        <div className="flex flex-wrap items-baseline gap-2 px-4 py-3.5 @2xl:px-5"><h2 id="lumen-stock-title" className="text-[13px] font-bold">Catalogue produits</h2><p className={`${display} text-xs italic text-[var(--lumen-muted)]`}>+ et − simulent une entrée ou une sortie</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[660px] text-left text-[13px]">
            <thead className="text-[10px] uppercase tracking-[0.12em] text-[var(--lumen-muted)]"><tr className="border-b border-[var(--lumen-line)]"><th className="px-4 pb-2.5 font-bold @2xl:px-5">Produit</th><th className="px-3 pb-2.5 font-bold">Référence</th><th className="px-3 pb-2.5 font-bold">Catégorie</th><th className="px-3 pb-2.5 text-right font-bold">Prix</th><th className="px-3 pb-2.5 font-bold">Disponibilité</th><th className="px-3 pb-2.5 font-bold">Ajuster</th></tr></thead>
            <tbody>
              {visible.map((item) => {
                const isLow = item.quantity <= item.threshold;
                return (
                  <tr key={item.id} className="border-t border-[var(--lumen-grid)] transition first:border-t-0 hover:bg-[var(--lumen-canvas)]/45">
                    <td className="px-4 py-3 font-bold @2xl:px-5">{item.product}</td><td className="px-3 py-3 font-mono text-[10px] text-[var(--lumen-muted)]">{item.reference}</td><td className="px-3 py-3 text-[var(--lumen-muted)]">{item.category}</td><td className="px-3 py-3 text-right font-bold tabular-nums">{formatFcfa(item.price)}</td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isLow ? "text-[#8a5a00]" : "text-[#2f7048]"}`}><span className="size-1.5 rounded-full bg-current" aria-hidden />{item.quantity} en stock{isLow ? " · bas" : ""}</span></td>
                    <td className="px-3 py-3"><div className="inline-flex items-center rounded-lg border border-[var(--lumen-line)] bg-[var(--lumen-panel)]"><button type="button" onClick={() => onAdjust(item.id, -1)} disabled={item.quantity === 0} className="p-2 text-[var(--lumen-muted)] hover:text-[var(--lumen-copper)] disabled:opacity-30" aria-label={`Retirer une unité de ${item.product}`}><Minus className="size-3" aria-hidden /></button><span className="min-w-7 text-center font-bold tabular-nums">{item.quantity}</span><button type="button" onClick={() => onAdjust(item.id, 1)} className="p-2 text-[var(--lumen-muted)] hover:text-[var(--lumen-copper)]" aria-label={`Ajouter une unité de ${item.product}`}><Plus className="size-3" aria-hidden /></button></div></td>
                  </tr>
                );
              })}
              {visible.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--lumen-muted)]">Aucun produit trouvé.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
