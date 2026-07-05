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

export type GalleryItem = {
  caption: string;
  /** Classes de dégradé CSS simulant une photo. */
  gradient: string;
};

export const GALLERY: GalleryItem[] = [
  {
    caption: "La salle principale et ses voûtes en pierre",
    gradient: "from-amber-300 via-orange-300 to-rose-300 dark:from-amber-500/60 dark:via-orange-500/60 dark:to-rose-500/60",
  },
  {
    caption: "Magret de canard, sauce miel-romarin",
    gradient: "from-rose-300 via-red-300 to-orange-200 dark:from-rose-500/60 dark:via-red-500/60 dark:to-orange-400/60",
  },
  {
    caption: "Notre chef en cuisine",
    gradient: "from-slate-300 via-zinc-300 to-stone-300 dark:from-slate-500/60 dark:via-zinc-500/60 dark:to-stone-500/60",
  },
  {
    caption: "La terrasse d'été, à l'ombre des tilleuls",
    gradient: "from-emerald-300 via-teal-300 to-cyan-200 dark:from-emerald-500/60 dark:via-teal-500/60 dark:to-cyan-400/60",
  },
  {
    caption: "Tarte Tatin caramélisée minute",
    gradient: "from-yellow-300 via-amber-300 to-orange-300 dark:from-yellow-500/60 dark:via-amber-500/60 dark:to-orange-500/60",
  },
  {
    caption: "Notre cave, 300 références de vins",
    gradient: "from-purple-300 via-violet-300 to-indigo-300 dark:from-purple-500/60 dark:via-violet-500/60 dark:to-indigo-500/60",
  },
];
