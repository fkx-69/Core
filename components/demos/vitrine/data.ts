export type MenuCategory = "entrees" | "plats" | "desserts";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
};

export const MENU: Record<MenuCategory, MenuItem[]> = {
  entrees: [
    {
      name: "Velouté de potimarron",
      description: "Crème de châtaigne, huile de noisette",
      price: "9 €",
    },
    {
      name: "Tartare de dorade",
      description: "Agrumes, coriandre fraîche, tuile de sarrasin",
      price: "13 €",
    },
    {
      name: "Burrata crémeuse",
      description: "Tomates anciennes, pesto de roquette",
      price: "11 €",
    },
  ],
  plats: [
    {
      name: "Magret de canard",
      description: "Sauce miel-romarin, écrasé de pommes de terre",
      price: "24 €",
    },
    {
      name: "Filet de bar rôti",
      description: "Risotto crémeux aux asperges vertes",
      price: "26 €",
    },
    {
      name: "Ravioles aux cèpes",
      description: "Émulsion parmesan, noisettes torréfiées",
      price: "21 €",
    },
  ],
  desserts: [
    {
      name: "Tarte Tatin",
      description: "Crème fraîche d'Isigny, caramel beurre salé",
      price: "8,50 €",
    },
    {
      name: "Moelleux au chocolat",
      description: "Cœur coulant, glace vanille de Madagascar",
      price: "9 €",
    },
    {
      name: "Pavlova aux fruits rouges",
      description: "Meringue croquante, chantilly légère",
      price: "8 €",
    },
  ],
};

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  entrees: "Entrées",
  plats: "Plats",
  desserts: "Desserts",
};

/** Photo de la salle en terre cuite, aussi utilisée en fond du héros. */
export const HERO_IMAGE = "/assets/demos/resto/hero.webp";

export type GalleryItem = {
  caption: string;
  image: string;
};

export const GALLERY: GalleryItem[] = [
  {
    caption: "La salle principale, terre cuite et bogolan",
    image: HERO_IMAGE,
  },
  {
    caption: "Magret de canard, sauce miel-romarin",
    image: "/assets/demos/resto/plat.webp",
  },
  {
    caption: "Notre chef en cuisine",
    image: "/assets/demos/resto/chef.webp",
  },
  {
    caption: "La terrasse d'été, à l'ombre des tilleuls",
    image: "/assets/demos/resto/terrasse.webp",
  },
  {
    caption: "Tarte Tatin caramélisée minute",
    image: "/assets/demos/resto/dessert.webp",
  },
  {
    caption: "Notre cave, 300 références de vins",
    image: "/assets/demos/resto/cave.webp",
  },
];
