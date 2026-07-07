import {
  Briefcase,
  HeartPulse,
  ShoppingCart,
  TrainFront,
  Tv,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type Transaction = {
  id: number;
  libelle: string;
  categorie: string;
  icon: LucideIcon;
  /** Négatif pour un débit. */
  montant: number;
  date: string;
};

export const SOLDE_INITIAL = 2843.72;

export const TRANSACTIONS_INITIALES: Transaction[] = [
  { id: 8, libelle: "Monoprix", categorie: "Courses", icon: ShoppingCart, montant: -54.3, date: "Aujourd'hui" },
  { id: 7, libelle: "TCL abonnement", categorie: "Transport", icon: TrainFront, montant: -25, date: "Aujourd'hui" },
  { id: 6, libelle: "La Table Dorée", categorie: "Restaurant", icon: UtensilsCrossed, montant: -68.5, date: "Hier" },
  { id: 5, libelle: "Salaire — Studio Nova", categorie: "Revenus", icon: Briefcase, montant: 2450, date: "1 juil." },
  { id: 4, libelle: "Netflix", categorie: "Abonnement", icon: Tv, montant: -13.49, date: "30 juin" },
  { id: 3, libelle: "Pharmacie Bellecour", categorie: "Santé", icon: HeartPulse, montant: -18.9, date: "29 juin" },
  { id: 2, libelle: "Carrefour City", categorie: "Courses", icon: ShoppingCart, montant: -32.75, date: "28 juin" },
  { id: 1, libelle: "SNCF Connect", categorie: "Transport", icon: TrainFront, montant: -79, date: "27 juin" },
];

export type Beneficiaire = {
  id: number;
  nom: string;
  initiales: string;
  /** Classe littérale de couleur d'avatar. */
  couleur: string;
};

export const BENEFICIAIRES: Beneficiaire[] = [
  { id: 1, nom: "Maman", initiales: "MA", couleur: "bg-rose-400" },
  { id: 2, nom: "Thomas", initiales: "TH", couleur: "bg-emerald-400" },
  { id: 3, nom: "Coloc' loyer", initiales: "CL", couleur: "bg-amber-400" },
  { id: 4, nom: "Julie", initiales: "JU", couleur: "bg-sky-400" },
];

export const formatSolde = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

/** Montant signé : « + 2 450,00 € » / « − 54,30 € ». */
export const formatMontant = (n: number) =>
  `${n > 0 ? "+" : "−"} ${Math.abs(n).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  })}`;
