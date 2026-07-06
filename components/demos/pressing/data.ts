export type EtapeCommande = "recue" | "nettoyage" | "repassage" | "prete";

export type Commande = {
  id: number;
  client: string;
  articles: string;
  montant: number;
  express: boolean;
  /** Date promise au client (ISO) — sert au calcul des retards. */
  promis: string;
  etape: EtapeCommande;
};

/** « Aujourd'hui » figé de la démo, cohérent avec ses données. */
export const AUJOURDHUI = "2026-07-06";

export const ETAPES: { id: EtapeCommande; label: string; dot: string }[] = [
  { id: "recue", label: "Reçues", dot: "bg-chart-1" },
  { id: "nettoyage", label: "Nettoyage", dot: "bg-chart-3" },
  { id: "repassage", label: "Repassage", dot: "bg-chart-2" },
  { id: "prete", label: "Prêtes", dot: "bg-ok" },
];

export const COMMANDES_INITIALES: Commande[] = [
  { id: 1042, client: "Camille Roussel", articles: "2 chemises · 1 blazer", montant: 24.5, express: true, promis: "2026-07-06", etape: "recue" },
  { id: 1041, client: "Hugo Lemaire", articles: "1 couette 220×240", montant: 29, express: false, promis: "2026-07-08", etape: "recue" },
  { id: 1040, client: "Inès Benali", articles: "3 robes · 1 jupe plissée", montant: 42, express: false, promis: "2026-07-09", etape: "recue" },
  { id: 1039, client: "Marc Aubert", articles: "1 costume 2 pièces", montant: 22, express: true, promis: "2026-07-06", etape: "nettoyage" },
  { id: 1037, client: "Léa Fontaine", articles: "5 chemises", montant: 27.5, express: false, promis: "2026-07-04", etape: "nettoyage" },
  { id: 1036, client: "Sofia Costa", articles: "1 manteau laine · 2 pulls", montant: 35, express: false, promis: "2026-07-07", etape: "repassage" },
  { id: 1034, client: "Antoine Chevalier", articles: "2 pantalons · 1 veste", montant: 28, express: false, promis: "2026-07-06", etape: "repassage" },
  { id: 1032, client: "Nadia Haddad", articles: "1 robe de soirée", montant: 26, express: true, promis: "2026-07-05", etape: "prete" },
  { id: 1031, client: "Paul Girard", articles: "4 chemises · 1 cravate", montant: 25.5, express: false, promis: "2026-07-06", etape: "prete" },
];

export const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export function formatPromis(iso: string): string {
  if (iso === AUJOURDHUI) return "Aujourd'hui";
  return dateFmt.format(new Date(iso));
}

export const enRetard = (c: Commande) => c.promis < AUJOURDHUI;
