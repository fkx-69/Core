/** Constantes partagées du site : navigation, ancres canoniques, coordonnées. */

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

export const CONTACT_INFO = {
  email: "contact@core-agency.fr",
  phone: "+33 1 23 45 67 89",
  address: "12 rue de l'Innovation, 75011 Paris",
} as const;

export const SOCIAL_LINKS = [
  { label: "GitHub de Core", name: "github", href: "https://github.com" },
  {
    label: "LinkedIn de Core",
    name: "linkedin",
    href: "https://www.linkedin.com",
  },
  { label: "X (Twitter) de Core", name: "twitter", href: "https://x.com" },
] as const;
