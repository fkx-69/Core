"use client";

import { useState } from "react";
import { Check, Delete, Eye, EyeOff, Globe, Lock, Plane, Wifi } from "lucide-react";
import {
  BENEFICIAIRES,
  formatMontant,
  formatSolde,
  type Beneficiaire,
  type Transaction,
} from "@/components/demos/banque/data";

/* ---------- Carte bancaire visuelle partagée ---------- */

function CarteVisuelle({ verrouillee }: { verrouillee: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 p-4 text-white shadow-raised transition ${
        verrouillee ? "grayscale" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="font-display text-sm font-bold tracking-wide">
          Nova<span className="opacity-60">.</span>
        </p>
        <Wifi className="h-4 w-4 rotate-90 opacity-80" aria-hidden />
      </div>
      <p className="mt-5 font-mono text-sm tracking-[0.2em]">
        •••• •••• •••• 4821
      </p>
      <div className="mt-3 flex items-end justify-between text-[10px] uppercase tracking-wide opacity-85">
        <span>Léa Moreau</span>
        <span>Exp. 09/29</span>
      </div>
      <span
        aria-hidden
        className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10"
      />
      {verrouillee && (
        <p className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/45 text-xs font-semibold backdrop-blur-[2px]">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Carte verrouillée
        </p>
      )}
    </div>
  );
}

/* ---------- Écran Accueil : solde + historique ---------- */

export function AccueilScreen({
  solde,
  transactions,
  verrouillee,
}: {
  solde: number;
  transactions: Transaction[];
  verrouillee: boolean;
}) {
  const [soldeVisible, setSoldeVisible] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-3 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted">Bonsoir,</p>
            <p className="font-display text-lg font-bold leading-tight">Léa</p>
          </div>
          <button
            type="button"
            onClick={() => setSoldeVisible((v) => !v)}
            aria-label={soldeVisible ? "Masquer le solde" : "Afficher le solde"}
            className="rounded-full border border-line p-1.5 text-muted transition hover:text-foreground"
          >
            {soldeVisible ? (
              <Eye className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <EyeOff className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
          Compte courant
        </p>
        <p className="font-display text-3xl font-bold tabular-nums tracking-tight">
          {soldeVisible ? formatSolde(solde) : "•••••• €"}
        </p>
        <div className="mt-3">
          <CarteVisuelle verrouillee={verrouillee} />
        </div>
      </div>
      <p className="px-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
        Dernières opérations
      </p>
      <ul className="scrollbar-none min-h-0 flex-1 space-y-1 overflow-y-auto px-4 pb-3">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-field border border-line bg-surface-raised px-3 py-2"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
            >
              <t.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">
                {t.libelle}
              </span>
              <span className="block text-[10px] text-muted">
                {t.categorie} · {t.date}
              </span>
            </span>
            <span
              className={`shrink-0 text-xs font-semibold tabular-nums ${
                t.montant > 0 ? "text-ok" : ""
              }`}
            >
              {formatMontant(t.montant)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Écran Virement : bénéficiaire + pavé numérique ---------- */

export function VirementScreen({
  solde,
  onEnvoyer,
  onRetourAccueil,
}: {
  solde: number;
  onEnvoyer: (nom: string, montant: number) => void;
  onRetourAccueil: () => void;
}) {
  const [beneficiaire, setBeneficiaire] = useState<Beneficiaire | null>(null);
  const [saisie, setSaisie] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const montant = Number(saisie.replace(",", "."));
  const valide =
    beneficiaire !== null &&
    Number.isFinite(montant) &&
    montant > 0 &&
    montant <= solde;

  function tape(touche: string) {
    setSaisie((s) => {
      if (touche === "⌫") return s.slice(0, -1);
      if (touche === ",") {
        if (s === "" || s.includes(",")) return s;
        return `${s},`;
      }
      const [, dec] = s.split(",");
      if (dec !== undefined && dec.length >= 2) return s;
      if (s.replace(",", "").length >= 6) return s;
      return s + touche;
    });
  }

  if (envoye && beneficiaire) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ok-soft">
          <Check className="h-7 w-7 text-ok" aria-hidden />
        </span>
        <p className="font-display text-lg font-bold">Virement envoyé</p>
        <p className="text-xs leading-relaxed text-muted">
          {formatSolde(montant)} envoyés à {beneficiaire.nom}. L&apos;opération
          apparaît déjà dans votre historique.
        </p>
        <button
          type="button"
          onClick={onRetourAccueil}
          className="mt-2 rounded-field bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-4 py-3">
      <p className="font-display text-lg font-bold">Envoyer de l&apos;argent</p>
      <p className="text-[11px] text-muted">
        Solde disponible : {formatSolde(solde)}
      </p>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
        Bénéficiaire
      </p>
      <div className="scrollbar-none mt-1.5 flex gap-2 overflow-x-auto pb-1">
        {BENEFICIAIRES.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={beneficiaire?.id === b.id}
            onClick={() => setBeneficiaire(b)}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-field border px-3 py-2 transition ${
              beneficiaire?.id === b.id
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface-raised hover:border-accent/50"
            }`}
          >
            <span
              aria-hidden
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${b.couleur}`}
            >
              {b.initiales}
            </span>
            <span className="text-[10px] font-medium">{b.nom}</span>
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        className="mt-3 text-center font-display text-3xl font-bold tabular-nums tracking-tight"
      >
        {saisie === "" ? (
          <span className="text-muted/50">0,00 €</span>
        ) : (
          `${saisie} €`
        )}
      </p>
      {saisie !== "" && montant > solde && (
        <p className="mt-0.5 text-center text-[10px] font-medium text-danger">
          Montant supérieur au solde disponible
        </p>
      )}

      <div className="mt-auto grid grid-cols-3 gap-1.5 pb-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"].map(
          (touche) => (
            <button
              key={touche}
              type="button"
              onClick={() => tape(touche)}
              aria-label={touche === "⌫" ? "Effacer" : undefined}
              className="rounded-field py-2.5 text-base font-semibold transition hover:bg-surface active:scale-95"
            >
              {touche === "⌫" ? (
                <Delete className="mx-auto h-4.5 w-4.5" aria-hidden />
              ) : (
                touche
              )}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        disabled={!valide}
        onClick={() => {
          if (!beneficiaire) return;
          onEnvoyer(beneficiaire.nom, montant);
          setEnvoye(true);
        }}
        className="mb-1 w-full rounded-field bg-accent py-2.5 text-sm font-semibold text-accent-contrast transition enabled:hover:bg-accent-hover disabled:opacity-40"
      >
        Envoyer
      </button>
    </div>
  );
}

/* ---------- Écran Carte : réglages ---------- */

function Interrupteur({
  actif,
  onChange,
  label,
}: {
  actif: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={label}
      onClick={() => onChange(!actif)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition ${
        actif ? "bg-accent" : "bg-line"
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-all ${
          actif ? "left-[1.125rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function CarteScreen({
  verrouillee,
  onVerrouiller,
}: {
  verrouillee: boolean;
  onVerrouiller: (v: boolean) => void;
}) {
  const [enLigne, setEnLigne] = useState(true);
  const [etranger, setEtranger] = useState(false);
  const [plafond, setPlafond] = useState(1500);

  const reglages: {
    icon: typeof Lock;
    titre: string;
    detail: string;
    actif: boolean;
    onChange: (v: boolean) => void;
  }[] = [
    {
      icon: Lock,
      titre: "Verrouiller la carte",
      detail: "Bloque instantanément tous les paiements",
      actif: verrouillee,
      onChange: onVerrouiller,
    },
    {
      icon: Globe,
      titre: "Paiements en ligne",
      detail: "Achats sur internet et in-app",
      actif: enLigne,
      onChange: setEnLigne,
    },
    {
      icon: Plane,
      titre: "Paiements à l'étranger",
      detail: "Hors zone euro, sans frais Nova",
      actif: etranger,
      onChange: setEtranger,
    },
  ];

  return (
    <div className="scrollbar-none h-full overflow-y-auto px-4 py-3">
      <p className="font-display text-lg font-bold">Ma carte</p>
      <div className="mt-2">
        <CarteVisuelle verrouillee={verrouillee} />
      </div>

      <ul className="mt-4 space-y-2">
        {reglages.map((r) => (
          <li
            key={r.titre}
            className="flex items-center gap-3 rounded-field border border-line bg-surface-raised px-3 py-2.5"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
            >
              <r.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold">{r.titre}</span>
              <span className="block text-[10px] leading-tight text-muted">
                {r.detail}
              </span>
            </span>
            <Interrupteur actif={r.actif} onChange={r.onChange} label={r.titre} />
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-field border border-line bg-surface-raised px-3 py-3">
        <div className="flex items-baseline justify-between">
          <label htmlFor="nova-plafond" className="text-xs font-semibold">
            Plafond de paiement mensuel
          </label>
          <span className="text-xs font-semibold tabular-nums text-accent">
            {plafond.toLocaleString("fr-FR")} €
          </span>
        </div>
        <input
          id="nova-plafond"
          type="range"
          min={500}
          max={3000}
          step={100}
          value={plafond}
          onChange={(e) => setPlafond(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--accent)]"
        />
        <p className="mt-1 flex justify-between text-[10px] text-muted">
          <span>500 €</span>
          <span>3 000 €</span>
        </p>
      </div>
    </div>
  );
}
