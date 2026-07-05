export type Statut = "Payée" | "En attente" | "Annulée";
export type Categorie = "Luminaires" | "Mobilier" | "Décoration";

export type Vente = {
  id: number;
  client: string;
  produit: string;
  categorie: Categorie;
  montant: number;
  /** Date ISO — formatée à l'affichage. */
  date: string;
  statut: Statut;
};

export const CATEGORIES: Categorie[] = ["Luminaires", "Mobilier", "Décoration"];
export const STATUTS: Statut[] = ["Payée", "En attente", "Annulée"];

export const VENTES_INITIALES: Vente[] = [
  { id: 1, client: "Marie Lefebvre", produit: "Suspension Osier Nao", categorie: "Luminaires", montant: 129, date: "2026-06-02", statut: "Payée" },
  { id: 2, client: "Atelier Brindille", produit: "Table basse Chêne massif", categorie: "Mobilier", montant: 549, date: "2026-06-03", statut: "Payée" },
  { id: 3, client: "Thomas Garnier", produit: "Lampe à poser Halo", categorie: "Luminaires", montant: 89, date: "2026-06-05", statut: "En attente" },
  { id: 4, client: "Café Marcel", produit: "Lot de 4 chaises Bistrot", categorie: "Mobilier", montant: 396, date: "2026-06-08", statut: "Payée" },
  { id: 5, client: "Sophie Nguyen", produit: "Vase céramique Terra", categorie: "Décoration", montant: 45, date: "2026-06-10", statut: "Payée" },
  { id: 6, client: "Hôtel du Parc", produit: "Applique murale Louna ×6", categorie: "Luminaires", montant: 414, date: "2026-06-12", statut: "En attente" },
  { id: 7, client: "Julie Moreau", produit: "Miroir laiton Ondine", categorie: "Décoration", montant: 119, date: "2026-06-14", statut: "Payée" },
  { id: 8, client: "Karim Benali", produit: "Étagère murale Fjord", categorie: "Mobilier", montant: 179, date: "2026-06-17", statut: "Annulée" },
  { id: 9, client: "Studio Palma", produit: "Lampadaire Arc Cuivré", categorie: "Luminaires", montant: 249, date: "2026-06-19", statut: "Payée" },
  { id: 10, client: "Claire Dubois", produit: "Coussins lin lavé ×3", categorie: "Décoration", montant: 87, date: "2026-06-23", statut: "Payée" },
  { id: 11, client: "Le Pain Doré", produit: "Banc d'entrée Loft", categorie: "Mobilier", montant: 289, date: "2026-06-26", statut: "En attente" },
  { id: 12, client: "Antoine Rossi", produit: "Guirlande lumineuse Perle", categorie: "Luminaires", montant: 39, date: "2026-06-28", statut: "Payée" },
];

/** CA des mois précédents (juin est calculé en direct depuis les ventes). */
export const CA_MOIS_PRECEDENTS: { mois: string; montant: number }[] = [
  { mois: "Janv.", montant: 1840 },
  { mois: "Févr.", montant: 2150 },
  { mois: "Mars", montant: 1920 },
  { mois: "Avr.", montant: 2480 },
  { mois: "Mai", montant: 2210 },
];
