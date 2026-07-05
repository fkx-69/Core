"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import StatTile from "@/components/demos/dashboard/StatTile";
import BarChart from "@/components/demos/dashboard/BarChart";
import DonutChart from "@/components/demos/dashboard/DonutChart";
import SalesTable, {
  type Sort,
  type SortColumn,
} from "@/components/demos/dashboard/SalesTable";
import AddSaleForm from "@/components/demos/dashboard/AddSaleForm";
import {
  CA_MOIS_PRECEDENTS,
  CATEGORIES,
  VENTES_INITIALES,
  type Categorie,
  type Statut,
  type Vente,
} from "@/components/demos/dashboard/data";

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

const formatDate = (iso: string) => dateFmt.format(new Date(iso));

/** Démo « Application web » : dashboard de ventes dont toutes les données réagissent. */
export default function DashboardDemo() {
  const [ventes, setVentes] = useState<Vente[]>(VENTES_INITIALES);
  const [filtreStatut, setFiltreStatut] = useState<Statut | "Tous">("Tous");
  const [recherche, setRecherche] = useState("");
  const [sort, setSort] = useState<Sort>(null);
  const [nextId, setNextId] = useState(VENTES_INITIALES.length + 1);

  // Ventes prises en compte dans les indicateurs (les annulées sont exclues).
  const actives = useMemo(
    () => ventes.filter((v) => v.statut !== "Annulée"),
    [ventes],
  );

  const caJuin = useMemo(
    () => actives.reduce((sum, v) => sum + v.montant, 0),
    [actives],
  );

  const enAttente = useMemo(
    () => ventes.filter((v) => v.statut === "En attente").length,
    [ventes],
  );

  const caParMois = useMemo(
    () => [...CA_MOIS_PRECEDENTS, { mois: "Juin", montant: caJuin }],
    [caJuin],
  );

  const caParCategorie = useMemo(
    () =>
      CATEGORIES.map((categorie) => ({
        label: categorie,
        value: actives
          .filter((v) => v.categorie === categorie)
          .reduce((sum, v) => sum + v.montant, 0),
      })),
    [actives],
  );

  const lignes = useMemo(() => {
    const query = recherche.trim().toLowerCase();
    let result = ventes.filter(
      (v) =>
        (filtreStatut === "Tous" || v.statut === filtreStatut) &&
        (query === "" ||
          v.client.toLowerCase().includes(query) ||
          v.produit.toLowerCase().includes(query)),
    );
    if (sort) {
      const { col, dir } = sort;
      result = [...result].sort((a, b) => {
        const va = a[col];
        const vb = b[col];
        const cmp =
          typeof va === "number" && typeof vb === "number"
            ? va - vb
            : String(va).localeCompare(String(vb), "fr");
        return dir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [ventes, filtreStatut, recherche, sort]);

  function handleSort(col: SortColumn) {
    setSort((current) => {
      if (current?.col !== col) return { col, dir: "asc" };
      if (current.dir === "asc") return { col, dir: "desc" };
      return null;
    });
  }

  function handleAdd(sale: {
    client: string;
    produit: string;
    categorie: Categorie;
    montant: number;
  }) {
    setVentes((v) => [
      { id: nextId, date: "2026-06-30", statut: "En attente", ...sale },
      ...v,
    ]);
    setNextId((id) => id + 1);
  }

  return (
    <BrowserFrame url="https://app.boutiquelumen.fr/ventes">
      <div className="space-y-4 bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="font-display text-lg font-semibold">
            Suivi des ventes
          </h4>
          <p className="text-xs text-muted">Boutique Lumen · Juin 2026</p>
        </div>

        {/* Indicateurs clés */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Chiffre d'affaires (juin)"
            value={eur.format(caJuin)}
            hint="hors ventes annulées"
          />
          <StatTile label="Commandes" value={String(actives.length)} />
          <StatTile
            label="Panier moyen"
            value={actives.length > 0 ? eur.format(caJuin / actives.length) : "—"}
          />
          <StatTile label="En attente de paiement" value={String(enAttente)} />
        </div>

        {/* Graphiques */}
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface-raised p-4 lg:col-span-2">
            <p className="text-sm font-semibold">Chiffre d&apos;affaires mensuel</p>
            <div className="mt-3">
              <BarChart
                data={caParMois.map((m) => ({ label: m.mois, value: m.montant }))}
                formatValue={(v) => eur.format(v)}
                title="Chiffre d'affaires par mois, de janvier à juin"
              />
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface-raised p-4">
            <p className="text-sm font-semibold">CA par catégorie</p>
            <div className="mt-3">
              <DonutChart
                data={caParCategorie}
                centerValue={eur.format(caJuin)}
                centerLabel="en juin"
                title="Répartition du chiffre d'affaires de juin par catégorie"
              />
            </div>
          </div>
        </div>

        {/* Ajout d'une vente */}
        <AddSaleForm onAdd={handleAdd} />

        {/* Filtres */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <label htmlFor="demo-recherche" className="sr-only">
              Rechercher un client ou un produit
            </label>
            <input
              id="demo-recherche"
              type="search"
              placeholder="Rechercher un client, un produit…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-raised py-2 pl-9 pr-3 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label htmlFor="demo-filtre-statut" className="sr-only">
              Filtrer par statut
            </label>
            <select
              id="demo-filtre-statut"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value as Statut | "Tous")}
              className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-44"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Payée">Payée</option>
              <option value="En attente">En attente</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        <SalesTable
          rows={lignes}
          sort={sort}
          onSort={handleSort}
          onMarkPaid={(id) =>
            setVentes((v) =>
              v.map((vente) =>
                vente.id === id ? { ...vente, statut: "Payée" } : vente,
              ),
            )
          }
          onDelete={(id) => setVentes((v) => v.filter((vente) => vente.id !== id))}
          formatMontant={(value) => eur.format(value)}
          formatDate={formatDate}
        />
      </div>
    </BrowserFrame>
  );
}
