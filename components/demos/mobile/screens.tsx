"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Bike,
  Clock,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";
import {
  ETAPES_LIVRAISON,
  FRAIS_LIVRAISON,
  RESTAURANTS,
  formatPrix,
  type Plat,
  type Restaurant,
} from "@/components/demos/mobile/data";

export type CartLine = { plat: Plat; qte: number };

/* ---------- Écran Accueil : liste des restaurants ---------- */

export function HomeScreen({
  categorie,
  onCategorieChange,
  onSelectRestaurant,
}: {
  categorie: string;
  onCategorieChange: (c: string) => void;
  onSelectRestaurant: (id: number) => void;
}) {
  const categories = ["Tous", ...RESTAURANTS.map((r) => r.categorie)];
  const visibles =
    categorie === "Tous"
      ? RESTAURANTS
      : RESTAURANTS.filter((r) => r.categorie === categorie);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-2 pt-3">
        <p className="font-display text-lg font-bold">
          Rapido<span className="text-accent">.</span>
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-field bg-surface px-3 py-2 text-xs text-muted">
          <Search className="h-3.5 w-3.5" aria-hidden />
          Un restaurant, un plat…
        </div>
        <div className="scrollbar-none mt-2.5 flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategorieChange(cat)}
              aria-pressed={categorie === cat}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition ${
                categorie === cat
                  ? "bg-accent text-accent-contrast"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <ul className="scrollbar-none min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-3">
        {visibles.map((resto) => (
          <li key={resto.id}>
            <button
              type="button"
              onClick={() => onSelectRestaurant(resto.id)}
              className="flex w-full items-center gap-3 rounded-field border border-line bg-surface-raised p-2.5 text-left transition hover:border-accent/50"
            >
              <span
                aria-hidden
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={resto.image}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {resto.nom}
                </span>
                <span className="block text-[11px] text-muted">
                  {resto.categorie}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                  <span className="flex items-center gap-0.5">
                    <Star
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                    {resto.note.toLocaleString("fr-FR")}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" aria-hidden />
                    {resto.tempsLivraison}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Écran détail d'un restaurant ---------- */

export function RestaurantScreen({
  restaurant,
  onBack,
  onAdd,
}: {
  restaurant: Restaurant;
  onBack: () => void;
  onAdd: (plat: Plat) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0 overflow-hidden px-4 pb-4 pt-3 text-white">
        <Image
          src={restaurant.image}
          alt=""
          fill
          sizes="320px"
          className="object-cover"
          aria-hidden
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-stone-950/85 via-stone-950/40 to-stone-950/30"
        />
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour à la liste des restaurants"
          className="relative inline-flex items-center justify-center rounded-full bg-black/35 p-1.5 transition hover:bg-black/55"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </button>
        <p className="relative mt-6 font-display text-lg font-bold">
          {restaurant.nom}
        </p>
        <p className="relative flex items-center gap-2 text-[11px] opacity-90">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            {restaurant.note.toLocaleString("fr-FR")}
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="h-3 w-3" aria-hidden />
            {restaurant.tempsLivraison}
          </span>
        </p>
      </div>
      <ul className="scrollbar-none min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {restaurant.plats.map((plat) => (
          <li
            key={plat.id}
            className="flex items-center gap-3 rounded-field border border-line bg-surface-raised p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{plat.nom}</p>
              <p className="truncate text-[11px] text-muted">
                {plat.description}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-accent">
                {formatPrix(plat.prix)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAdd(plat)}
              aria-label={`Ajouter ${plat.nom} au panier`}
              className="inline-flex items-center justify-center rounded-full bg-accent p-1.5 text-accent-contrast transition hover:bg-accent-hover active:scale-90"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Écran Panier ---------- */

export function CartScreen({
  panier,
  onInc,
  onDec,
  onRemove,
  onOrder,
}: {
  panier: CartLine[];
  onInc: (platId: number) => void;
  onDec: (platId: number) => void;
  onRemove: (platId: number) => void;
  onOrder: () => void;
}) {
  const sousTotal = panier.reduce((sum, l) => sum + l.plat.prix * l.qte, 0);

  if (panier.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <ShoppingBag className="h-8 w-8 text-muted" aria-hidden />
        <p className="text-sm font-semibold">Votre panier est vide</p>
        <p className="text-xs text-muted">
          Parcourez les restaurants depuis l&apos;onglet Accueil.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <p className="px-4 pb-2 pt-3 font-display text-lg font-bold">
        Mon panier
      </p>
      <ul className="scrollbar-none min-h-0 flex-1 space-y-2 overflow-y-auto px-4">
        {panier.map(({ plat, qte }) => (
          <li
            key={plat.id}
            className="relative rounded-field border border-line bg-surface-raised p-2.5 md:flex md:items-center md:gap-2"
          >
            <div className="min-w-0 pr-12 md:flex-1 md:pr-0">
              <p className="truncate text-sm font-medium">{plat.nom}</p>
              <p className="text-xs text-muted">{formatPrix(plat.prix)}</p>
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 md:mt-0">
              <button
                type="button"
                onClick={() => onDec(plat.id)}
                aria-label={`Retirer un ${plat.nom}`}
                className="inline-flex items-center justify-center rounded-full border border-line p-1 text-muted transition hover:border-accent hover:text-accent"
              >
                <Minus className="h-3 w-3" aria-hidden />
              </button>
              <span className="w-4 text-center text-sm font-semibold tabular-nums">
                {qte}
              </span>
              <button
                type="button"
                onClick={() => onInc(plat.id)}
                aria-label={`Ajouter un ${plat.nom}`}
                className="inline-flex items-center justify-center rounded-full border border-line p-1 text-muted transition hover:border-accent hover:text-accent"
              >
                <Plus className="h-3 w-3" aria-hidden />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemove(plat.id)}
              aria-label={`Supprimer ${plat.nom} du panier`}
              className="absolute right-2.5 top-2.5 inline-flex items-center justify-center rounded-full p-1 text-muted transition hover:text-red-500 md:static md:ml-1"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <div className="shrink-0 border-t border-line px-4 py-3">
        <dl className="space-y-1 text-xs">
          <div className="flex justify-between text-muted">
            <dt>Sous-total</dt>
            <dd className="tabular-nums">{formatPrix(sousTotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Livraison</dt>
            <dd className="tabular-nums">{formatPrix(FRAIS_LIVRAISON)}</dd>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">
              {formatPrix(sousTotal + FRAIS_LIVRAISON)}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onOrder}
          className="mt-3 w-full rounded-field bg-accent py-2.5 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover"
        >
          Commander
        </button>
      </div>
    </div>
  );
}

/* ---------- Écran Suivi de commande ---------- */

export function TrackingScreen({
  commandePassee,
  etape,
  onNewOrder,
}: {
  commandePassee: boolean;
  etape: number;
  onNewOrder: () => void;
}) {
  if (!commandePassee) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <Bike className="h-8 w-8 text-muted" aria-hidden />
        <p className="text-sm font-semibold">Aucune commande en cours</p>
        <p className="text-xs text-muted">
          Validez votre panier pour suivre votre livraison en direct.
        </p>
      </div>
    );
  }

  const livree = etape >= ETAPES_LIVRAISON.length - 1;

  return (
    <div className="flex h-full flex-col px-4 py-3">
      <p className="font-display text-lg font-bold">Suivi de commande</p>
      <p className="text-xs text-muted">
        {livree ? "Bon appétit !" : "Arrivée estimée : 12 à 18 min"}
      </p>

      <ol className="mt-5 flex-1 space-y-0">
        {ETAPES_LIVRAISON.map((label, i) => {
          const done = i < etape;
          const current = i === etape;
          return (
            <li key={label} className="relative flex gap-3 pb-6 last:pb-0">
              {i < ETAPES_LIVRAISON.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-[7px] top-4 h-full w-0.5 ${
                    done ? "bg-accent" : "bg-line"
                  }`}
                />
              )}
              <span
                aria-hidden
                className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                  done || current
                    ? "border-accent bg-accent"
                    : "border-line bg-surface-raised"
                } ${current && !livree ? "animate-pulse" : ""}`}
              />
              <span
                className={`text-sm ${
                  current
                    ? "font-semibold text-foreground"
                    : done
                      ? "text-foreground"
                      : "text-muted"
                }`}
              >
                {label}
                {current && !livree && (
                  <span className="block text-[11px] font-normal text-muted">
                    En cours…
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex items-center gap-3 rounded-field border border-line bg-surface-raised p-3">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent"
        >
          <Bike className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Karim</p>
          <p className="text-[11px] text-muted">
            Votre livreur · à 1,2 km
          </p>
        </div>
        <span
          aria-hidden
          className="rounded-full border border-line p-2 text-muted"
        >
          <Phone className="h-4 w-4" />
        </span>
      </div>

      {livree && (
        <button
          type="button"
          onClick={onNewOrder}
          className="mt-3 w-full rounded-field bg-accent py-2.5 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover"
        >
          Nouvelle commande
        </button>
      )}
    </div>
  );
}
