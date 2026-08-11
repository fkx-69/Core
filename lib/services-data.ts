import { DEMO_ANCHORS, SERVICE_ANCHORS } from "@/lib/site";

export type Service = {
  id: string;
  slug: string;
  title: string;
  /** Nom d'icône lucide résolu côté composant (les données restent sérialisables). */
  icon: "globe" | "layout-dashboard" | "smartphone" | "puzzle";
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  problems: string[];
  deliverables: string[];
  approach: string[];
  faq: { question: string; answer: string }[];
  nextStep: string;
  benefits: string[];
  technologies: string[];
  /** Ancre de la démo correspondante sur /portfolio (null → haut de page). */
  demoAnchor: string | null;
  demoLabel: string;
};

export const SERVICES: Service[] = [
  {
    id: SERVICE_ANCHORS.sitesWeb,
    slug: "creation-site-web-bamako",
    title: "Sites web",
    icon: "globe",
    tagline: "Vitrines, e-commerce, sites institutionnels",
    description:
      "Nous concevons des sites rapides, élégants et faciles à administrer : vitrines pour présenter votre activité, boutiques en ligne pour vendre, sites institutionnels pour asseoir votre crédibilité. Chaque site est structuré autour de votre activité et des parcours utiles à vos visiteurs.",
    seoTitle: "Création de site web à Bamako",
    seoDescription:
      "Création de sites web à Bamako : une présence claire, responsive et maintenable, cadrée selon votre activité et vos objectifs.",
    h1: "Création de site web à Bamako",
    intro:
      "Un site web utile rend votre activité compréhensible dès les premiers écrans. Nous pouvons travailler une vitrine, un site institutionnel ou un parcours de vente selon le contenu et les besoins à cadrer.",
    problems: [
      "Votre activité mérite une présentation plus claire que quelques pages dispersées.",
      "Vos visiteurs consultent surtout depuis un téléphone et trouvent difficilement la bonne information.",
      "Votre site actuel est compliqué à faire évoluer ou ne reflète plus votre offre.",
    ],
    deliverables: [
      "Arborescence et parcours de navigation adaptés au contenu disponible.",
      "Maquettes d'interface et direction visuelle à valider avant l'intégration.",
      "Pages responsive, composants réutilisables et fondamentaux SEO intégrés.",
      "Mise en ligne et documentation selon le périmètre retenu.",
    ],
    approach: [
      "Cadrer le public, l'offre, les contenus et les contraintes techniques.",
      "Prototyper les pages clés pour vérifier la hiérarchie de l'information.",
      "Développer par itérations et vérifier les parcours sur mobile et desktop.",
      "Préparer la mise en ligne et les prochaines évolutions sans promesse artificielle.",
    ],
    faq: [
      {
        question: "Quel type de site pouvez-vous concevoir ?",
        answer:
          "Une vitrine, un site institutionnel ou un parcours de vente peuvent être étudiés. Le bon périmètre dépend de vos contenus, de vos utilisateurs et des contraintes du projet.",
      },
      {
        question: "Le référencement naturel est-il prévu ?",
        answer:
          "Les fondamentaux techniques et éditoriaux peuvent être intégrés dès la conception : structure claire, métadonnées, performance et contenus compréhensibles. Ils ne remplacent pas une stratégie éditoriale dans la durée.",
      },
      {
        question: "Pouvez-vous partir d'un site existant ?",
        answer:
          "Oui, une reprise ou une refonte peut être examinée après un état des lieux du site, de ses contenus et de ses contraintes d'hébergement.",
      },
    ],
    nextStep:
      "Commencez par décrire votre activité, vos utilisateurs et la place que le site doit prendre. Cela permet de clarifier le périmètre avant de parler de solution.",
    benefits: [
      "Design sur mesure fidèle à votre image de marque",
      "Référencement naturel (SEO) intégré dès la conception",
      "Temps de chargement optimisés sur mobile comme sur desktop",
      "Autonomie totale grâce à une administration simple",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    demoAnchor: DEMO_ANCHORS.vitrine,
    demoLabel: "Voir la démo « Site vitrine »",
  },
  {
    id: SERVICE_ANCHORS.applicationsWeb,
    slug: "developpement-application-web-mali",
    title: "Applications web",
    icon: "layout-dashboard",
    tagline: "Dashboards, SaaS, plateformes métier",
    description:
      "Des outils métier pour réunir vos données et vos processus : tableaux de bord, plateformes SaaS et back-offices. Nous construisons des interfaces riches et réactives, structurées autour de vos flux de travail réels.",
    seoTitle: "Développement d'application web au Mali",
    seoDescription:
      "Développement d'applications web au Mali : dashboards, plateformes métier et outils internes conçus autour de vos flux réels.",
    h1: "Développement d'application web au Mali",
    intro:
      "Une application web peut réunir des opérations aujourd'hui dispersées entre feuilles de calcul, messages et outils difficiles à relier. Le travail commence par les décisions et les flux que l'équipe doit réellement suivre.",
    problems: [
      "Les informations utiles sont réparties entre plusieurs fichiers ou outils.",
      "Les mêmes données sont ressaisies et les responsabilités sont difficiles à suivre.",
      "Les équipes ont besoin d'un outil métier qui s'adapte à leurs règles plutôt que d'un écran générique.",
    ],
    deliverables: [
      "Cartographie des rôles, données et opérations prioritaires.",
      "Prototype des écrans clés : tableau de bord, recherche, saisie et suivi.",
      "Application responsive avec validations, états d'erreur et droits à préciser.",
      "Base technique documentée pour les intégrations et les évolutions futures.",
    ],
    approach: [
      "Observer le fonctionnement actuel et réduire le périmètre au premier flux utile.",
      "Modéliser les données et les règles avant de multiplier les écrans.",
      "Construire un premier parcours testable, puis intégrer les retours du terrain.",
      "Prévoir la maintenance, la sécurité et la reprise des données dans le périmètre.",
    ],
    faq: [
      {
        question: "Une application web remplace-t-elle forcément un logiciel existant ?",
        answer:
          "Pas forcément. Elle peut d'abord relier un flux précis ou compléter un outil déjà en place. Le périmètre dépend de ce qui doit être conservé, synchronisé ou simplifié.",
      },
      {
        question: "Comment cadrer les droits d'accès ?",
        answer:
          "Les rôles et les actions autorisées sont décrits dès le cadrage. On peut alors distinguer ce que chaque profil peut consulter, créer, modifier ou valider.",
      },
      {
        question: "Travaillez-vous avec des données existantes ?",
        answer:
          "La reprise et la qualité des données sont évaluées avec les formats, volumes et contraintes disponibles. Aucune migration n'est supposée avant cet état des lieux.",
      },
    ],
    nextStep:
      "Décrivez le flux qui vous prend le plus de temps ou génère le plus de ressaisie. Nous pouvons partir de ce cas concret pour discuter d'une première version.",
    benefits: [
      "Centralisation de vos données et de vos équipes",
      "Interfaces réactives : filtres, tris et mises à jour instantanés",
      "Architecture évolutive qui grandit avec votre activité",
      "Sécurité et gestion fine des droits d'accès",
    ],
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL"],
    demoAnchor: DEMO_ANCHORS.dashboard,
    demoLabel: "Voir la démo « Application web »",
  },
  {
    id: SERVICE_ANCHORS.applicationsMobiles,
    slug: "developpement-application-mobile-mali",
    title: "Applications mobiles",
    icon: "smartphone",
    tagline: "iOS et Android, natif ou multiplateforme",
    description:
      "Votre service dans la poche de vos utilisateurs. Nous développons des applications iOS et Android fluides et intuitives, du prototype à la préparation de publication, avec une base de code partagée lorsque ce choix correspond au projet.",
    seoTitle: "Développement d'application mobile au Mali",
    seoDescription:
      "Développement d'applications mobiles au Mali : parcours iOS et Android pensés pour les usages réels, du prototype à la mise en ligne.",
    h1: "Développement d'application mobile au Mali",
    intro:
      "Une application mobile doit répondre à un usage régulier, dans des contextes de connexion et d'appareil variés. Nous commençons par le parcours essentiel avant de détailler les fonctions à publier.",
    problems: [
      "Le service est utile en mobilité mais son parcours actuel n'est pas pensé pour un petit écran.",
      "Les utilisateurs doivent pouvoir retrouver une action importante avec peu d'étapes.",
      "Le produit doit tenir compte des notifications, de la connexion et des différences entre appareils.",
    ],
    deliverables: [
      "Parcours mobile priorisé et prototype des écrans principaux.",
      "Interface iOS et Android cohérente avec les conventions de chaque plateforme.",
      "Connexion à une API, notifications ou mode hors ligne si le besoin est confirmé.",
      "Préparation technique à la publication et à la maintenance des versions.",
    ],
    approach: [
      "Définir l'action principale, les utilisateurs et les situations de mobilité.",
      "Tester rapidement les écrans et les états réseau avant de développer l'ensemble.",
      "Construire la base partagée et vérifier les comportements sur les plateformes visées.",
      "Documenter la publication, le suivi et les évolutions à prévoir après le lancement.",
    ],
    faq: [
      {
        question: "Faut-il développer deux applications séparées ?",
        answer:
          "Une base multiplateforme peut convenir à de nombreux projets, tandis qu'un besoin très spécifique peut justifier du natif. Le choix se fait selon les fonctions, les appareils et les contraintes d'exploitation.",
      },
      {
        question: "Pouvez-vous concevoir le prototype avant l'application ?",
        answer:
          "Oui. Un prototype permet de vérifier le parcours et les priorités avant d'engager le développement des fonctionnalités complètes.",
      },
      {
        question: "Une application mobile fonctionne-t-elle hors connexion ?",
        answer:
          "Le hors ligne est une décision de produit et d'architecture. Nous identifions les données à conserver localement et les règles de synchronisation avant de le promettre.",
      },
    ],
    nextStep:
      "Expliquez le moment où vos utilisateurs ont besoin du service, l'action principale et les appareils concernés. Ce contexte guide le premier parcours à prototyper.",
    benefits: [
      "Une seule base de code pour iOS et Android",
      "Expérience fluide : navigation native, animations soignées",
      "Notifications push et fonctionnement hors ligne",
      "Accompagnement jusqu'à la publication sur les stores",
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Firebase"],
    demoAnchor: DEMO_ANCHORS.mobile,
    demoLabel: "Voir la démo « Application mobile »",
  },
  {
    id: SERVICE_ANCHORS.softwareSurMesure,
    slug: "logiciel-sur-mesure-mali",
    title: "Software sur mesure",
    icon: "puzzle",
    tagline: "API, intégrations, maintenance, conseil",
    description:
      "Au-delà du web et du mobile, nous développons le logiciel dont votre métier a précisément besoin : API, connecteurs entre vos outils, automatisations, reprise et maintenance d'applications existantes, audits et conseil technique.",
    seoTitle: "Logiciel sur mesure au Mali",
    seoDescription:
      "Logiciel sur mesure au Mali : API, intégrations et outils adaptés à vos processus, avec un périmètre technique clarifié avant le développement.",
    h1: "Logiciel sur mesure au Mali",
    intro:
      "Quand un outil standard ne couvre pas une règle métier ou ne dialogue pas avec le reste du système, un composant sur mesure peut être étudié. Nous clarifions d'abord les interfaces, les données et les responsabilités du logiciel.",
    problems: [
      "Des outils importants ne partagent pas les mêmes données ou formats.",
      "Une opération répétitive pourrait être fiabilisée par une API, un connecteur ou une automatisation.",
      "Une application existante doit être reprise, documentée ou rendue plus facile à maintenir.",
    ],
    deliverables: [
      "Diagnostic technique et cartographie des systèmes concernés.",
      "API, connecteur, automatisation ou composant métier selon le périmètre retenu.",
      "Tests, documentation d'intégration et traitement explicite des erreurs.",
      "Plan de reprise ou de maintenance lorsque le logiciel existe déjà.",
    ],
    approach: [
      "Délimiter la responsabilité du composant et les systèmes qui l'entourent.",
      "Établir les contrats de données, les accès et les cas d'erreur.",
      "Développer un flux vérifiable avant d'étendre les intégrations.",
      "Transmettre une base maintenable avec les décisions techniques documentées.",
    ],
    faq: [
      {
        question: "Quand un logiciel sur mesure est-il pertinent ?",
        answer:
          "Lorsqu'un flux métier important ne peut pas être couvert correctement par les outils existants ou lorsqu'une intégration ciblée apporte une valeur claire. Un audit peut aussi conclure qu'un outil standard suffit.",
      },
      {
        question: "Pouvez-vous connecter des outils déjà utilisés ?",
        answer:
          "La possibilité dépend des API, exports et droits disponibles. Nous les vérifions avant de définir une intégration et ses limites.",
      },
      {
        question: "Prenez-vous en charge une application existante ?",
        answer:
          "Une reprise, un audit ou une maintenance peuvent être envisagés après examen du code, de l'hébergement, des données et de la documentation disponibles.",
      },
    ],
    nextStep:
      "Décrivez les outils concernés, les données à faire circuler et le point de friction actuel. Cela donne une base concrète pour distinguer intégration, automatisation et refonte.",
    benefits: [
      "Solutions ajustées à vos processus, pas l'inverse",
      "Intégration avec vos outils existants (CRM, ERP, facturation…)",
      "Maintenance et supervision dans la durée",
      "Conseil technique indépendant des éditeurs",
    ],
    technologies: ["Node.js", "Python", "Docker", "AWS"],
    demoAnchor: null,
    demoLabel: "Explorer toutes nos démos",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}
