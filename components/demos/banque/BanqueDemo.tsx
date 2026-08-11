"use client";

import { useState } from "react";
import { ArrowLeftRight, CreditCard, Home } from "lucide-react";
import PhoneFrame from "@/components/demos/mockups/PhoneFrame";
import {
  AccueilScreen,
  CarteScreen,
  VirementScreen,
} from "@/components/demos/banque/screens";
import {
  SOLDE_INITIAL,
  TRANSACTIONS_INITIALES,
  type Transaction,
} from "@/components/demos/banque/data";

export type TabBanque = "accueil" | "virement" | "carte";

const TABS: { id: TabBanque; label: string; icon: typeof Home }[] = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "virement", label: "Virement", icon: ArrowLeftRight },
  { id: "carte", label: "Carte", icon: CreditCard },
];

/**
 * Démo « Application mobile » : néo-banque. Solde et historique vivants
 * (le virement débite réellement le compte), carte paramétrable.
 */
export default function BanqueDemo() {
  const [tab, setTab] = useState<TabBanque>("accueil");
  const [solde, setSolde] = useState(SOLDE_INITIAL);
  const [transactions, setTransactions] = useState<Transaction[]>(
    TRANSACTIONS_INITIALES,
  );
  const [verrouillee, setVerrouillee] = useState(false);

  function envoyerVirement(nom: string, montant: number) {
    setSolde((s) => s - montant);
    setTransactions((ts) => [
      {
        id: (ts[0]?.id ?? 0) + 1,
        libelle: `Virement à ${nom}`,
        categorie: "Virement",
        icon: ArrowLeftRight,
        montant: -montant,
        date: "Aujourd'hui",
      },
      ...ts,
    ]);
  }

  return (
    <PhoneFrame>
      <div className="demo-touch flex h-full flex-col">
        <div key={tab} className="screen-in min-h-0 flex-1">
          {tab === "accueil" && (
            <AccueilScreen
              solde={solde}
              transactions={transactions}
              verrouillee={verrouillee}
            />
          )}
          {tab === "virement" && (
            <VirementScreen
              solde={solde}
              onEnvoyer={envoyerVirement}
              onRetourAccueil={() => setTab("accueil")}
            />
          )}
          {tab === "carte" && (
            <CarteScreen
              verrouillee={verrouillee}
              onVerrouiller={setVerrouillee}
            />
          )}
        </div>
        <nav
          aria-label="Navigation de l'application Nova"
          className="border-t border-line bg-surface-raised"
        >
          <ul className="flex">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <li key={id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setTab(id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                      active ? "text-accent" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </PhoneFrame>
  );
}
