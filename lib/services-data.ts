import { DEMO_ANCHORS, SERVICE_ANCHORS } from "@/lib/site";

export type Service = {
  id: string;
  title: string;
  /** Nom d'icône lucide résolu côté composant (les données restent sérialisables). */
  icon: "globe" | "layout-dashboard" | "smartphone" | "puzzle";
  tagline: string;
  description: string;
  benefits: string[];
  technologies: string[];
  useCase: { title: string; text: string };
  /** Ancre de la démo correspondante sur /portfolio (null → haut de page). */
  demoAnchor: string | null;
  demoLabel: string;
};

export const SERVICES: Service[] = [
  {
    id: SERVICE_ANCHORS.sitesWeb,
    title: "Sites web",
    icon: "globe",
    tagline: "Vitrines, e-commerce, sites institutionnels",
    description:
      "Nous concevons des sites rapides, élégants et faciles à administrer : vitrines pour présenter votre activité, boutiques en ligne pour vendre, sites institutionnels pour asseoir votre crédibilité. Chaque site est pensé pour convertir vos visiteurs en clients.",
    benefits: [
      "Design sur mesure fidèle à votre image de marque",
      "Référencement naturel (SEO) intégré dès la conception",
      "Temps de chargement optimisés sur mobile comme sur desktop",
      "Autonomie totale grâce à une administration simple",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    useCase: {
      title: "Cas d'usage : restaurant gastronomique",
      text: "Un restaurant nous confie sa présence en ligne : site vitrine avec menu interactif, galerie photo et réservation. Résultat : +40 % de demandes de réservation en trois mois.",
    },
    demoAnchor: DEMO_ANCHORS.vitrine,
    demoLabel: "Voir la démo « Site vitrine »",
  },
  {
    id: SERVICE_ANCHORS.applicationsWeb,
    title: "Applications web",
    icon: "layout-dashboard",
    tagline: "Dashboards, SaaS, plateformes métier",
    description:
      "Des outils métier qui remplacent vos tableurs et processus manuels : tableaux de bord temps réel, plateformes SaaS, back-offices. Nous construisons des interfaces riches, réactives et sécurisées, adaptées à vos flux de travail réels.",
    benefits: [
      "Centralisation de vos données et de vos équipes",
      "Interfaces réactives : filtres, tris et mises à jour instantanés",
      "Architecture évolutive qui grandit avec votre activité",
      "Sécurité et gestion fine des droits d'accès",
    ],
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL"],
    useCase: {
      title: "Cas d'usage : suivi des ventes",
      text: "Une boutique de décoration pilote désormais ses ventes depuis un dashboard : indicateurs clés, graphiques et gestion des commandes au même endroit, à jour en permanence.",
    },
    demoAnchor: DEMO_ANCHORS.dashboard,
    demoLabel: "Voir la démo « Application web »",
  },
  {
    id: SERVICE_ANCHORS.applicationsMobiles,
    title: "Applications mobiles",
    icon: "smartphone",
    tagline: "iOS et Android, natif ou multiplateforme",
    description:
      "Votre service dans la poche de vos utilisateurs. Nous développons des applications iOS et Android fluides et intuitives, du prototype à la publication sur les stores, avec une base de code partagée pour maîtriser les coûts.",
    benefits: [
      "Une seule base de code pour iOS et Android",
      "Expérience fluide : navigation native, animations soignées",
      "Notifications push et fonctionnement hors ligne",
      "Accompagnement jusqu'à la publication sur les stores",
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Firebase"],
    useCase: {
      title: "Cas d'usage : livraison de repas",
      text: "Un réseau de restaurants lance son app de livraison : commande en trois écrans, suivi du livreur en temps réel et paiement intégré. 4,8/5 sur les stores dès le premier mois.",
    },
    demoAnchor: DEMO_ANCHORS.mobile,
    demoLabel: "Voir la démo « Application mobile »",
  },
  {
    id: SERVICE_ANCHORS.softwareSurMesure,
    title: "Software sur mesure",
    icon: "puzzle",
    tagline: "API, intégrations, maintenance, conseil",
    description:
      "Au-delà du web et du mobile, nous développons le logiciel dont votre métier a précisément besoin : API, connecteurs entre vos outils, automatisations, reprise et maintenance d'applications existantes, audits et conseil technique.",
    benefits: [
      "Solutions ajustées à vos processus, pas l'inverse",
      "Intégration avec vos outils existants (CRM, ERP, facturation…)",
      "Maintenance et supervision dans la durée",
      "Conseil technique indépendant des éditeurs",
    ],
    technologies: ["Node.js", "Python", "Docker", "AWS"],
    useCase: {
      title: "Cas d'usage : synchronisation e-commerce",
      text: "Un distributeur synchronise automatiquement son stock entre sa boutique en ligne, son ERP et ses places de marché : zéro double saisie, zéro rupture non signalée.",
    },
    demoAnchor: null,
    demoLabel: "Explorer toutes nos démos",
  },
];
