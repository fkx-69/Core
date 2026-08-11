/** Constantes partagées du site : navigation, ancres canoniques et localisation. */

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

/** Ids d'ancres des sections de /services — importés partout pour éviter tout lien mort. */
export const SERVICE_ANCHORS = {
  sitesWeb: "sites-web",
  applicationsWeb: "applications-web",
  applicationsMobiles: "applications-mobiles",
  softwareSurMesure: "software-sur-mesure",
} as const;

/** Ids d'ancres des démos de /portfolio. */
export const DEMO_ANCHORS = {
  vitrine: "demo-vitrine",
  dashboard: "demo-dashboard",
  mobile: "demo-mobile",
} as const;

export const COMPANY_LOCATION = "Bamako, Mali";
