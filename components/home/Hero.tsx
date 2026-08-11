import HeroShowcase from "@/components/home/hero/HeroShowcase";

/**
 * Héro de la home : la scène immersive des démos EST le héro — fond, encre
 * et accent prennent les couleurs du site vitrine affiché. Tout vit dans
 * HeroShowcase (client, car le thème suit l'onglet actif) ; titre et légende
 * y sont prérendus normalement.
 */
export default function Hero() {
  return <HeroShowcase />;
}
