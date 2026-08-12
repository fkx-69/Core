/**
 * Données éditoriales publiques partagées par le hub, les pages de ressources,
 * le sitemap et les tests SEO. Le contenu détaillé reste dans chaque page afin
 * de garder ce catalogue court et lisible.
 */
export type ResourceKind = "guide" | "outil";

export type Resource = {
  slug: string;
  path: string;
  type: ResourceKind;
  title: string;
  description: string;
  publishedAt: "2026-08-12";
  updatedAt: "2026-08-12";
};

export const RESOURCES: Resource[] = [
  {
    slug: "prix-creation-site-web-mali",
    path: "/ressources/prix-creation-site-web-mali",
    type: "guide",
    title: "Prix d'un site web au Mali : préparer et comparer un devis",
    description:
      "Un guide pour comprendre les facteurs de coût d'un site web au Mali, préparer son besoin et comparer des devis sans se limiter à un prix affiché.",
    publishedAt: "2026-08-12",
    updatedAt: "2026-08-12",
  },
  {
    slug: "digitaliser-excel-whatsapp",
    path: "/ressources/digitaliser-excel-whatsapp",
    type: "guide",
    title: "Digitaliser un flux Excel, WhatsApp ou papier",
    description:
      "Une méthode concrète pour diagnostiquer un flux dispersé, choisir un premier périmètre et préparer un outil métier adoptable.",
    publishedAt: "2026-08-12",
    updatedAt: "2026-08-12",
  },
  {
    slug: "generateur-cahier-des-charges",
    path: "/ressources/generateur-cahier-des-charges",
    type: "outil",
    title: "Générateur de cahier des charges",
    description:
      "Un questionnaire local pour structurer un premier cahier des charges de site, application ou logiciel métier, sans transmettre ni enregistrer vos réponses.",
    publishedAt: "2026-08-12",
    updatedAt: "2026-08-12",
  },
];

export const RESOURCE_PATHS = RESOURCES.map((resource) => resource.path);

export function getResourceBySlug(slug: string): Resource | undefined {
  return RESOURCES.find((resource) => resource.slug === slug);
}

export function getResourceByPath(path: string): Resource | undefined {
  return RESOURCES.find((resource) => resource.path === path);
}
