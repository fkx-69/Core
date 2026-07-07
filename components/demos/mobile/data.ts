export type Plat = {
  id: number;
  nom: string;
  description: string;
  prix: number;
};

export type Restaurant = {
  id: number;
  nom: string;
  categorie: string;
  note: number;
  tempsLivraison: string;
  /** Photo vignette et bandeau de l'écran détail. */
  image: string;
  plats: Plat[];
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    nom: "Chez Nonna",
    categorie: "Italien",
    note: 4.8,
    tempsLivraison: "20-30 min",
    image: "/assets/demos/food/pizza.webp",
    plats: [
      { id: 101, nom: "Pizza Margherita", description: "Tomate, mozzarella di bufala, basilic", prix: 12.5 },
      { id: 102, nom: "Lasagnes maison", description: "Bœuf mijoté, béchamel gratinée", prix: 14 },
      { id: 103, nom: "Tiramisu", description: "Mascarpone, café, cacao amer", prix: 6.5 },
    ],
  },
  {
    id: 2,
    nom: "Sakura Sushi",
    categorie: "Japonais",
    note: 4.7,
    tempsLivraison: "25-35 min",
    image: "/assets/demos/food/sushi.webp",
    plats: [
      { id: 201, nom: "Plateau 12 pièces", description: "Saumon, thon, crevette, avocat", prix: 16.9 },
      { id: 202, nom: "Ramen tonkotsu", description: "Bouillon crémeux, porc braisé, œuf mollet", prix: 13.5 },
      { id: 203, nom: "Gyozas ×6", description: "Poulet et légumes, sauce ponzu", prix: 7.2 },
    ],
  },
  {
    id: 3,
    nom: "Green Bowl",
    categorie: "Healthy",
    note: 4.6,
    tempsLivraison: "15-25 min",
    image: "/assets/demos/food/bowl.webp",
    plats: [
      { id: 301, nom: "Buddha bowl", description: "Quinoa, avocat, patate douce, houmous", prix: 11.9 },
      { id: 302, nom: "Salade César", description: "Poulet grillé, parmesan, croûtons", prix: 10.5 },
      { id: 303, nom: "Smoothie mangue", description: "Mangue, banane, lait de coco", prix: 5.5 },
    ],
  },
  {
    id: 4,
    nom: "Smash Bros Burger",
    categorie: "Burger",
    note: 4.5,
    tempsLivraison: "20-30 min",
    image: "/assets/demos/food/burger.webp",
    plats: [
      { id: 401, nom: "Double smash", description: "Deux steaks, cheddar affiné, oignons", prix: 13.9 },
      { id: 402, nom: "Frites maison", description: "Pommes de terre fraîches, sel fumé", prix: 4.5 },
      { id: 403, nom: "Milkshake vanille", description: "Glace artisanale, chantilly", prix: 5.9 },
    ],
  },
  {
    id: 5,
    nom: "Bombay Palace",
    categorie: "Indien",
    note: 4.7,
    tempsLivraison: "30-40 min",
    image: "/assets/demos/food/curry.webp",
    plats: [
      { id: 501, nom: "Butter chicken", description: "Poulet mariné, sauce tomate-crème", prix: 13.5 },
      { id: 502, nom: "Cheese naan ×2", description: "Pain fromager cuit au tandoor", prix: 4.9 },
      { id: 503, nom: "Riz biryani", description: "Riz basmati, épices douces", prix: 6.9 },
    ],
  },
];

export const FRAIS_LIVRAISON = 2.9;

export const ETAPES_LIVRAISON = [
  "Commande confirmée",
  "En préparation",
  "En livraison",
  "Livrée",
] as const;

export const formatPrix = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
