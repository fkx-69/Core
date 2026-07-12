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

export const SOLDE_INITIAL = 2_843_720;

export const TRANSACTIONS_INITIALES: Transaction[] = [
  { id: 8, libelle: "Auchan Mermoz", categorie: "Courses", icon: ShoppingCart, montant: -54_300, date: "Aujourd'hui" },
  { id: 7, libelle: "Dakar Dem Dikk", categorie: "Transport", icon: TrainFront, montant: -25_000, date: "Aujourd'hui" },
  { id: 6, libelle: "La Table Dorée", categorie: "Restaurant", icon: UtensilsCrossed, montant: -68_500, date: "Hier" },
  { id: 5, libelle: "Salaire — Studio Nova", categorie: "Revenus", icon: Briefcase, montant: 2_450_000, date: "1 juil." },
  { id: 4, libelle: "Canal+", categorie: "Abonnement", icon: Tv, montant: -13_500, date: "30 juin" },
  { id: 3, libelle: "Pharmacie du Plateau", categorie: "Santé", icon: HeartPulse, montant: -18_900, date: "29 juin" },
  { id: 2, libelle: "Marché Kermel", categorie: "Courses", icon: ShoppingCart, montant: -32_750, date: "28 juin" },
  { id: 1, libelle: "Air Sénégal", categorie: "Transport", icon: TrainFront, montant: -79_000, date: "27 juin" },
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
  `${Math.round(n).toLocaleString("fr-FR")}\u00a0FCFA`;

/** Montant signé : « + 2 450 000 FCFA » / « − 54 300 FCFA ». */
export const formatMontant = (n: number) =>
  `${n > 0 ? "+" : "−"} ${formatSolde(Math.abs(n))}`;
