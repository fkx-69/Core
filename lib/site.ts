/** Constantes partagées du site : navigation, ancres canoniques et localisation. */

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/ressources", label: "Ressources" },
  { href: "/contact", label: "Contact" },
] as const;

/** Ids d'ancres des sections de /services — importés partout pour éviter tout lien mort. */
export const SERVICE_ANCHORS = {
  sitesWeb: "sites-web",
  applicationsWeb: "applications-web",
  applicationsMobiles: "applications-mobiles",
  softwareSurMesure: "software-sur-mesure",
  creationSiteEcommerce: "creation-site-ecommerce",
  digitalisationProcessusEntreprise: "digitalisation-processus-entreprise",
} as const;

/** Ids d'ancres des démos de /portfolio. */
export const DEMO_ANCHORS = {
  vitrine: "demo-vitrine",
  dashboard: "demo-dashboard",
  mobile: "demo-mobile",
} as const;

export const COMPANY_LOCATION = "Bamako, Mali";

/**
 * Keep navigation active for a section's child routes while avoiding false
 * positives such as `/services` matching a hypothetical `/services-old`.
 */
export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
