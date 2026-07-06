"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Plus,
  Search,
  Shirt,
  Timer,
  X,
} from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";
import StatTile from "@/components/demos/dashboard/StatTile";
import {
  COMMANDES_INITIALES,
  ETAPES,
  enRetard,
  eur,
  formatPromis,
  type Commande,
  type EtapeCommande,
} from "@/components/demos/pressing/data";

/**
 * Démo « Application web » : gestion d'un pressing. Pipeline kanban des
 * commandes (reçue → nettoyage → repassage → prête → retirée), indicateurs
 * dérivés en direct, création de commande et recherche client.
 */
export default function PressingDemo() {
  const [commandes, setCommandes] = useState<Commande[]>(COMMANDES_INITIALES);
  const [recherche, setRecherche] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [nextId, setNextId] = useState(1043);
  // Retraits du jour (préchargés pour que la tuile vive dès le départ).
  const [retraits, setRetraits] = useState({ nb: 6, total: 148.5 });

  // Champs du formulaire de dépôt
  const [client, setClient] = useState("");
  const [articles, setArticles] = useState("");
  const [montant, setMontant] = useState("");
  const [express, setExpress] = useState(false);

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return q === ""
      ? commandes
      : commandes.filter((c) => c.client.toLowerCase().includes(q));
  }, [commandes, recherche]);

  const enAtelier = commandes.filter((c) => c.etape !== "prete").length;
  const pretes = commandes.filter((c) => c.etape === "prete").length;
  const retards = commandes.filter(enRetard).length;

  function avancer(id: number) {
    setCommandes((cs) =>
      cs.flatMap((c) => {
        if (c.id !== id) return c;
        if (c.etape === "prete") {
          // Retrait : la commande sort du pipeline, la caisse s'incrémente.
          setRetraits((r) => ({ nb: r.nb + 1, total: r.total + c.montant }));
          return [];
        }
        const ordre: EtapeCommande[] = ["recue", "nettoyage", "repassage", "prete"];
        return { ...c, etape: ordre[ordre.indexOf(c.etape) + 1] };
      }),
    );
  }

  function deposer(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(montant.replace(",", "."));
    if (!client.trim() || !articles.trim() || !Number.isFinite(value) || value <= 0)
      return;
    setCommandes((cs) => [
      {
        id: nextId,
        client: client.trim(),
        articles: articles.trim(),
        montant: value,
        express,
        promis: express ? "2026-07-06" : "2026-07-09",
        etape: "recue",
      },
      ...cs,
    ]);
    setNextId((id) => id + 1);
    setClient("");
    setArticles("");
    setMontant("");
    setExpress(false);
    setFormOpen(false);
  }

  const inputClasses =
    "w-full rounded-field border border-line bg-surface-raised px-3 py-2 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <BrowserFrame url="https://app.pressing-des-halles.fr/commandes">
      <div className="space-y-4 bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h4 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Shirt className="h-5 w-5 text-accent" aria-hidden />
              Pressing des Halles
            </h4>
            <p className="text-xs text-muted">lundi 6 juillet 2026</p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-contrast transition hover:bg-accent-hover"
          >
            {formOpen ? (
              <X className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Plus className="h-3.5 w-3.5" aria-hidden />
            )}
            {formOpen ? "Annuler" : "Nouveau dépôt"}
          </button>
        </div>

        {/* Dépôt d'une commande */}
        {formOpen && (
          <form
            onSubmit={deposer}
            className="screen-in grid gap-3 rounded-field border border-line bg-surface-raised p-4 sm:grid-cols-[1.2fr_1.6fr_0.8fr_auto_auto]"
          >
            <div>
              <label htmlFor="pressing-client" className="mb-1 block text-xs font-medium text-muted">
                Client
              </label>
              <input
                id="pressing-client"
                type="text"
                placeholder="Nom du client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="pressing-articles" className="mb-1 block text-xs font-medium text-muted">
                Articles
              </label>
              <input
                id="pressing-articles"
                type="text"
                placeholder="Ex. 3 chemises · 1 manteau"
                value={articles}
                onChange={(e) => setArticles(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="pressing-montant" className="mb-1 block text-xs font-medium text-muted">
                Montant (€)
              </label>
              <input
                id="pressing-montant"
                type="text"
                inputMode="decimal"
                placeholder="24,50"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className={inputClasses}
              />
            </div>
            <label className="flex items-end gap-2 pb-2 text-xs font-medium text-muted">
              <input
                type="checkbox"
                checked={express}
                onChange={(e) => setExpress(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              Express
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-field bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover sm:w-auto"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}

        {/* Indicateurs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="En atelier" value={String(enAtelier)} hint="commandes en cours" />
          <StatTile label="Prêtes à retirer" value={String(pretes)} />
          <StatTile
            label="En retard"
            value={String(retards)}
            hint={retards > 0 ? "à traiter en priorité" : "tout est à l'heure"}
          />
          <StatTile
            label="Encaissé aujourd'hui"
            value={eur.format(retraits.total)}
            hint={`${retraits.nb} retrait${retraits.nb > 1 ? "s" : ""}`}
          />
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <label htmlFor="pressing-recherche" className="sr-only">
            Rechercher un client
          </label>
          <input
            id="pressing-recherche"
            type="search"
            placeholder="Rechercher un client…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full rounded-field border border-line bg-surface-raised py-2 pl-9 pr-3 text-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Pipeline kanban */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((etape, etapeIndex) => {
            const colonne = visibles.filter((c) => c.etape === etape.id);
            return (
              <section key={etape.id} aria-label={`Colonne ${etape.label}`}>
                <p className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  <span aria-hidden className={`h-2 w-2 rounded-full ${etape.dot}`} />
                  {etape.label}
                  <span className="ml-auto rounded-full bg-surface-raised border border-line px-2 py-0.5 text-[10px] tabular-nums">
                    {colonne.length}
                  </span>
                </p>
                <ul className="mt-2 space-y-2">
                  {colonne.map((c) => {
                    const retard = enRetard(c);
                    return (
                      <li
                        key={c.id}
                        className={`rounded-field border bg-surface-raised p-3 shadow-card ${
                          retard ? "border-danger/40" : "border-line"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-tight">
                            {c.client}
                          </p>
                          <p className="shrink-0 text-[10px] font-medium tabular-nums text-muted">
                            #{c.id}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">{c.articles}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {c.express && (
                            <span className="flex items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-[10px] font-semibold text-warn">
                              <Timer className="h-3 w-3" aria-hidden />
                              Express
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              retard
                                ? "bg-danger-soft text-danger"
                                : "bg-surface text-muted"
                            }`}
                          >
                            {retard
                              ? `Promis le ${formatPromis(c.promis)}`
                              : formatPromis(c.promis)}
                          </span>
                          <span className="ml-auto text-xs font-semibold tabular-nums">
                            {eur.format(c.montant)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => avancer(c.id)}
                          className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-field py-1.5 text-xs font-semibold transition ${
                            etape.id === "prete"
                              ? "bg-ok-soft text-ok hover:brightness-95"
                              : "border border-line text-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {etape.id === "prete" ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                              Retirée & encaissée
                            </>
                          ) : (
                            <>
                              Vers {ETAPES[etapeIndex + 1].label.toLowerCase()}
                              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                            </>
                          )}
                        </button>
                      </li>
                    );
                  })}
                  {colonne.length === 0 && (
                    <li className="rounded-field border border-dashed border-line px-3 py-6 text-center text-xs text-muted">
                      Aucune commande
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </BrowserFrame>
  );
}
