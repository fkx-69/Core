"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, Trash2 } from "lucide-react";
import type { Statut, Vente } from "@/components/demos/dashboard/data";

export type SortColumn = "client" | "produit" | "categorie" | "montant" | "date" | "statut";
export type Sort = { col: SortColumn; dir: "asc" | "desc" } | null;

const COLUMNS: { key: SortColumn; label: string; numeric?: boolean }[] = [
  { key: "client", label: "Client" },
  { key: "produit", label: "Produit" },
  { key: "categorie", label: "Catégorie" },
  { key: "montant", label: "Montant", numeric: true },
  { key: "date", label: "Date" },
  { key: "statut", label: "Statut" },
];

const STATUS_STYLES: Record<Statut, string> = {
  Payée: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  "En attente": "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  Annulée: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function SalesTable({
  rows,
  sort,
  onSort,
  onMarkPaid,
  onDelete,
  formatMontant,
  formatDate,
}: {
  rows: Vente[];
  sort: Sort;
  onSort: (col: SortColumn) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  formatMontant: (value: number) => string;
  formatDate: (iso: string) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-135 text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-surface text-xs text-muted">
            {COLUMNS.map((col) => {
              const active = sort?.col === col.key;
              const ariaSort = active
                ? sort.dir === "asc"
                  ? ("ascending" as const)
                  : ("descending" as const)
                : undefined;
              const SortIcon = active
                ? sort.dir === "asc"
                  ? ArrowUp
                  : ArrowDown
                : ArrowUpDown;
              return (
                <th key={col.key} scope="col" aria-sort={ariaSort} className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className={`inline-flex items-center gap-1 font-medium transition hover:text-foreground ${
                      active ? "text-accent" : ""
                    }`}
                  >
                    {col.label}
                    <SortIcon className="h-3 w-3" aria-hidden />
                  </button>
                </th>
              );
            })}
            <th scope="col" className="px-3 py-2.5 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-muted">
                Aucune vente ne correspond à ces critères.
              </td>
            </tr>
          )}
          {rows.map((vente) => (
            <tr
              key={vente.id}
              className="border-b border-line last:border-0 hover:bg-surface/60"
            >
              <td className="px-3 py-2.5 font-medium">{vente.client}</td>
              <td className="px-3 py-2.5 text-muted">{vente.produit}</td>
              <td className="px-3 py-2.5 text-muted">{vente.categorie}</td>
              <td className="px-3 py-2.5 tabular-nums">
                {formatMontant(vente.montant)}
              </td>
              <td className="px-3 py-2.5 tabular-nums text-muted">
                {formatDate(vente.date)}
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[vente.statut]}`}
                >
                  {vente.statut}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1">
                  {vente.statut === "En attente" && (
                    <button
                      type="button"
                      onClick={() => onMarkPaid(vente.id)}
                      aria-label={`Marquer la vente de ${vente.client} comme payée`}
                      title="Marquer payée"
                      className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                    >
                      <Check className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(vente.id)}
                    aria-label={`Supprimer la vente de ${vente.client}`}
                    title="Supprimer"
                    className="rounded-lg p-1.5 text-muted transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
