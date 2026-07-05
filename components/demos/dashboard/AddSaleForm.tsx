"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES, type Categorie } from "@/components/demos/dashboard/data";

const inputClasses =
  "w-full rounded-field border border-line bg-background px-3 py-2 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function AddSaleForm({
  onAdd,
}: {
  onAdd: (sale: { client: string; produit: string; categorie: Categorie; montant: number }) => void;
}) {
  const [client, setClient] = useState("");
  const [produit, setProduit] = useState("");
  const [categorie, setCategorie] = useState<Categorie>("Luminaires");
  const [montant, setMontant] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(montant.replace(",", "."));
    if (!client.trim() || !produit.trim() || !montant || Number.isNaN(amount) || amount <= 0) {
      setError("Renseignez tous les champs (montant supérieur à 0).");
      return;
    }
    onAdd({ client: client.trim(), produit: produit.trim(), categorie, montant: amount });
    setClient("");
    setProduit("");
    setMontant("");
    setError(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-field border border-line bg-surface-raised p-4"
      aria-label="Ajouter une vente"
    >
      <p className="text-sm font-semibold">Nouvelle vente</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <label htmlFor="demo-client" className="sr-only">
            Client
          </label>
          <input
            id="demo-client"
            type="text"
            placeholder="Client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="lg:col-span-1">
          <label htmlFor="demo-produit" className="sr-only">
            Produit
          </label>
          <input
            id="demo-produit"
            type="text"
            placeholder="Produit"
            value={produit}
            onChange={(e) => setProduit(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="lg:col-span-1">
          <label htmlFor="demo-categorie" className="sr-only">
            Catégorie
          </label>
          <select
            id="demo-categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as Categorie)}
            className={inputClasses}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-1">
          <label htmlFor="demo-montant" className="sr-only">
            Montant en euros
          </label>
          <input
            id="demo-montant"
            type="number"
            min="1"
            step="1"
            placeholder="Montant (€)"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-field bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:col-span-1"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Ajouter
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
