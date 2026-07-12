export type SaleStatus = "Payée" | "En attente" | "Annulée";
export type Category = "Luminaires" | "Mobilier" | "Décoration";
export type Payment = "Wave" | "Orange Money" | "Espèces" | "Carte";

export type Sale = {
  id: number;
  client: string;
  product: string;
  category: Category;
  amount: number;
  date: string;
  status: SaleStatus;
  payment: Payment;
};

export type StockItem = {
  id: number;
  product: string;
  category: Category;
  reference: string;
  quantity: number;
  threshold: number;
  price: number;
};

export const CATEGORIES: Category[] = ["Luminaires", "Mobilier", "Décoration"];
export const PAYMENTS: Payment[] = ["Wave", "Orange Money", "Espèces", "Carte"];

export const INITIAL_SALES: Sale[] = [
  { id: 12, client: "Awa Ndiaye", product: "Suspension rônier Nao", category: "Luminaires", amount: 85000, date: "2026-06-28", status: "Payée", payment: "Wave" },
  { id: 11, client: "Hôtel Terrou-Bi", product: "Applique Halo × 6", category: "Luminaires", amount: 270000, date: "2026-06-26", status: "En attente", payment: "Orange Money" },
  { id: 10, client: "Fatou Sarr", product: "Coussins bogolan × 3", category: "Décoration", amount: 72000, date: "2026-06-23", status: "Payée", payment: "Wave" },
  { id: 9, client: "Studio Baobab", product: "Lampadaire cuivre Arc", category: "Luminaires", amount: 165000, date: "2026-06-19", status: "Payée", payment: "Carte" },
  { id: 8, client: "Moussa Diop", product: "Étagère teck Fjord", category: "Mobilier", amount: 145000, date: "2026-06-17", status: "Annulée", payment: "Espèces" },
  { id: 7, client: "Marième Fall", product: "Miroir laiton Ondine", category: "Décoration", amount: 98000, date: "2026-06-14", status: "Payée", payment: "Orange Money" },
  { id: 6, client: "Maison Gëm", product: "Fauteuil teck Saly", category: "Mobilier", amount: 315000, date: "2026-06-12", status: "En attente", payment: "Carte" },
  { id: 5, client: "Khady Sow", product: "Vase terre cuite Terra", category: "Décoration", amount: 38000, date: "2026-06-10", status: "Payée", payment: "Espèces" },
  { id: 4, client: "Café Touba Plateau", product: "Chaises rônier × 4", category: "Mobilier", amount: 240000, date: "2026-06-08", status: "Payée", payment: "Wave" },
  { id: 3, client: "Ousmane Kane", product: "Lampe à poser Halo", category: "Luminaires", amount: 55000, date: "2026-06-05", status: "En attente", payment: "Orange Money" },
  { id: 2, client: "Atelier Ndar", product: "Table basse teck", category: "Mobilier", amount: 185000, date: "2026-06-03", status: "Payée", payment: "Carte" },
  { id: 1, client: "Ndeye Mbaye", product: "Panier mural tressé", category: "Décoration", amount: 45000, date: "2026-06-02", status: "Payée", payment: "Espèces" },
];

export const INITIAL_STOCK: StockItem[] = [
  { id: 1, product: "Suspension rônier Nao", category: "Luminaires", reference: "LUM-NAO-01", quantity: 3, threshold: 4, price: 85000 },
  { id: 2, product: "Table basse teck", category: "Mobilier", reference: "MOB-TEK-02", quantity: 8, threshold: 3, price: 185000 },
  { id: 3, product: "Coussins bogolan", category: "Décoration", reference: "DEC-BOG-03", quantity: 14, threshold: 6, price: 24000 },
  { id: 4, product: "Lampadaire cuivre Arc", category: "Luminaires", reference: "LUM-ARC-04", quantity: 2, threshold: 3, price: 165000 },
  { id: 5, product: "Fauteuil teck Saly", category: "Mobilier", reference: "MOB-SAL-05", quantity: 5, threshold: 2, price: 315000 },
  { id: 6, product: "Vase terre cuite Terra", category: "Décoration", reference: "DEC-TER-06", quantity: 1, threshold: 5, price: 38000 },
  { id: 7, product: "Miroir laiton Ondine", category: "Décoration", reference: "DEC-OND-07", quantity: 9, threshold: 3, price: 98000 },
];

export const PREVIOUS_REVENUE = [
  { label: "Janv.", value: 1180000 },
  { label: "Févr.", value: 1320000 },
  { label: "Mars", value: 1250000 },
  { label: "Avr.", value: 1490000 },
  { label: "Mai", value: 1370000 },
];

/** Objectif de CA du mois, pour la jauge de la sidebar. */
export const MONTH_TARGET = 1800000;

// Groupement en espace insécable pleine chasse : le U+202F du locale fr-FR
// devient invisible dans les corps display.
const group = (value: number) =>
  Math.round(value).toLocaleString("fr-FR").replace(/ /g, " ");

export const formatFcfa = (value: number) => `${group(value)} FCFA`;

/** Forme courte pour les espaces contraints (centre du donut, jauge, ticks). */
export const formatFcfaCompact = (value: number) =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} M`
    : `${Math.round(value / 1000)} k`;

/** Teintes des modes de paiement : le récit mobile money doit se voir. */
export const PAYMENT_META: Record<Payment, { chip: string; dot: string }> = {
  Wave: { chip: "bg-[#e0f3f6] text-[#0b6a7d]", dot: "#12a5bd" },
  "Orange Money": { chip: "bg-[#ffeadb] text-[#a2450f]", dot: "#e8631c" },
  Espèces: { chip: "bg-[#efe8da] text-[#6b5c3e]", dot: "#a8905e" },
  Carte: { chip: "bg-[#e8edf3] text-[#33465c]", dot: "#52708f" },
};

const dayMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
export const formatDate = (iso: string) => dayMonth.format(new Date(`${iso}T12:00:00`));
