export type Stage = "recue" | "nettoyage" | "repassage" | "prete";
export type Payment = "Espèces" | "Wave" | "Orange Money";

export type Order = {
  id: number;
  client: string;
  phone: string;
  items: string;
  amount: number;
  express: boolean;
  promised: string;
  stage: Stage;
  payment: Payment;
};

export type Receipt = {
  id: number;
  client: string;
  amount: number;
  payment: Payment;
  time: string;
};

export const TODAY = "2026-07-06";

export const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: "recue", label: "Reçues", color: "#e5ebed" },
  { id: "nettoyage", label: "Nettoyage", color: "#e5ece8" },
  { id: "repassage", label: "Repassage", color: "#f0ebe1" },
  { id: "prete", label: "Prêtes", color: "#e5ece6" },
];

/** Teintes des modes de paiement : le récit mobile money doit se voir. */
export const PAYMENT_META: Record<Payment, { chip: string; dot: string; color: string }> = {
  Wave: { chip: "bg-[#e0f3f6] text-[#0b6a7d]", dot: "#12a5bd", color: "#0e98a6" },
  "Orange Money": { chip: "bg-[#ffeadb] text-[#a2450f]", dot: "#e8631c", color: "#e8631c" },
  Espèces: { chip: "bg-[#f2ead9] text-[#71582f]", dot: "#c08434", color: "#c08434" },
};

export const INITIAL_ORDERS: Order[] = [
  { id: 1042, client: "Aminata Ba", phone: "77 542 18 90", items: "2 chemises · 1 blazer", amount: 7500, express: true, promised: "2026-07-06", stage: "recue", payment: "Wave" },
  { id: 1041, client: "Cheikh Ndiaye", phone: "76 118 44 02", items: "1 couette 220×240", amount: 9000, express: false, promised: "2026-07-08", stage: "recue", payment: "Orange Money" },
  { id: 1040, client: "Ndeye Fatou Sarr", phone: "78 905 31 66", items: "3 robes · 1 jupe", amount: 10500, express: false, promised: "2026-07-09", stage: "recue", payment: "Espèces" },
  { id: 1039, client: "Mamadou Diallo", phone: "77 332 70 14", items: "1 costume 2 pièces", amount: 6500, express: true, promised: "2026-07-06", stage: "nettoyage", payment: "Wave" },
  { id: 1037, client: "Sokhna Fall", phone: "76 882 09 21", items: "5 chemises", amount: 6000, express: false, promised: "2026-07-04", stage: "nettoyage", payment: "Espèces" },
  { id: 1036, client: "Oumar Kane", phone: "77 451 82 77", items: "1 grand boubou · 2 pantalons", amount: 8000, express: false, promised: "2026-07-07", stage: "repassage", payment: "Orange Money" },
  { id: 1034, client: "Mame Diarra Mbaye", phone: "78 210 56 42", items: "2 ensembles · 1 veste", amount: 8500, express: false, promised: "2026-07-06", stage: "repassage", payment: "Wave" },
  { id: 1032, client: "Ibrahima Seck", phone: "77 614 93 08", items: "1 tenue de cérémonie", amount: 7000, express: true, promised: "2026-07-05", stage: "prete", payment: "Wave" },
  { id: 1031, client: "Khady Diop", phone: "76 390 12 54", items: "4 chemises · 1 foulard", amount: 5500, express: false, promised: "2026-07-06", stage: "prete", payment: "Espèces" },
];

export const INITIAL_RECEIPTS: Receipt[] = [
  { id: 1029, client: "Pape Sarr", amount: 6500, payment: "Wave", time: "08:34" },
  { id: 1028, client: "Astou Dieng", amount: 4500, payment: "Espèces", time: "09:12" },
  { id: 1027, client: "Moussa Sow", amount: 9000, payment: "Orange Money", time: "10:06" },
  { id: 1026, client: "Awa Gueye", amount: 7500, payment: "Wave", time: "11:18" },
  { id: 1025, client: "Alioune Faye", amount: 5000, payment: "Espèces", time: "12:42" },
  { id: 1024, client: "Rama Sy", amount: 8500, payment: "Wave", time: "14:05" },
];

// Groupement en espace insécable pleine chasse : le U+202F du locale fr-FR
// devient invisible dans les corps display.
const group = (value: number) =>
  Math.round(value).toLocaleString("fr-FR").replace(/ /g, " ");

export const formatFcfa = (value: number) => `${group(value)}\u00a0FCFA`;
const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
export const formatPromised = (iso: string) => iso === TODAY ? "Aujourd’hui" : date.format(new Date(`${iso}T12:00:00`));
export const isLate = (order: Order) => order.promised < TODAY;
