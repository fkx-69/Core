"use client";

import { useEffect, useState } from "react";
import PhoneFrame from "@/components/demos/mockups/PhoneFrame";
import TabBar, { type Tab } from "@/components/demos/mobile/TabBar";
import {
  HomeScreen,
  RestaurantScreen,
  CartScreen,
  TrackingScreen,
  type CartLine,
} from "@/components/demos/mobile/screens";
import {
  ETAPES_LIVRAISON,
  RESTAURANTS,
  type Plat,
} from "@/components/demos/mobile/data";

/** Démo « Application mobile » : app de livraison avec onglets, panier et suivi. */
export default function MobileDemo() {
  const [tab, setTab] = useState<Tab>("accueil");
  const [categorie, setCategorie] = useState("Tous");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [panier, setPanier] = useState<CartLine[]>([]);
  const [commandePassee, setCommandePassee] = useState(false);
  const [etape, setEtape] = useState(0);

  // La livraison progresse automatiquement une fois la commande passée.
  useEffect(() => {
    if (!commandePassee || etape >= ETAPES_LIVRAISON.length - 1) return;
    const timer = window.setInterval(
      () => setEtape((e) => Math.min(e + 1, ETAPES_LIVRAISON.length - 1)),
      2500,
    );
    return () => window.clearInterval(timer);
  }, [commandePassee, etape]);

  const cartCount = panier.reduce((sum, l) => sum + l.qte, 0);
  const restaurant = RESTAURANTS.find((r) => r.id === selectedRestaurantId);

  function addToCart(plat: Plat) {
    setPanier((lines) => {
      const existing = lines.find((l) => l.plat.id === plat.id);
      if (existing) {
        return lines.map((l) =>
          l.plat.id === plat.id ? { ...l, qte: l.qte + 1 } : l,
        );
      }
      return [...lines, { plat, qte: 1 }];
    });
  }

  function decrement(platId: number) {
    setPanier((lines) =>
      lines
        .map((l) => (l.plat.id === platId ? { ...l, qte: l.qte - 1 } : l))
        .filter((l) => l.qte > 0),
    );
  }

  function order() {
    setCommandePassee(true);
    setEtape(0);
    setPanier([]);
    setTab("suivi");
  }

  function newOrder() {
    setCommandePassee(false);
    setEtape(0);
    setSelectedRestaurantId(null);
    setTab("accueil");
  }

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div
          key={`${tab}-${selectedRestaurantId ?? "liste"}`}
          className="screen-in min-h-0 flex-1"
        >
          {tab === "accueil" &&
            (restaurant ? (
              <RestaurantScreen
                restaurant={restaurant}
                onBack={() => setSelectedRestaurantId(null)}
                onAdd={addToCart}
              />
            ) : (
              <HomeScreen
                categorie={categorie}
                onCategorieChange={setCategorie}
                onSelectRestaurant={setSelectedRestaurantId}
              />
            ))}
          {tab === "panier" && (
            <CartScreen
              panier={panier}
              onInc={(id) => {
                const line = panier.find((l) => l.plat.id === id);
                if (line) addToCart(line.plat);
              }}
              onDec={decrement}
              onRemove={(id) =>
                setPanier((lines) => lines.filter((l) => l.plat.id !== id))
              }
              onOrder={order}
            />
          )}
          {tab === "suivi" && (
            <TrackingScreen
              commandePassee={commandePassee}
              etape={etape}
              onNewOrder={newOrder}
            />
          )}
        </div>
        <TabBar tab={tab} cartCount={cartCount} onChange={setTab} />
      </div>
    </PhoneFrame>
  );
}
