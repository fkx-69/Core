import type { Metadata } from "next";
import { MousePointerClick } from "lucide-react";
import { DEMO_ANCHORS, SERVICE_ANCHORS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import DemoGroup, { type DemoEntry } from "@/components/demos/DemoGroup";
import IntroIllustration from "@/components/ui/IntroIllustration";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez huit démos interactives de réalisations Core : sites vitrines, applications web et applications mobiles, à tester directement dans votre navigateur.",
};

const DEMO_SECTIONS: {
  anchor: string;
  kind: string;
  entries: DemoEntry[];
  serviceAnchor: string;
  serviceLabel: string;
  illustration: string;
}[] = [
  {
    anchor: DEMO_ANCHORS.vitrine,
    kind: "Sites vitrines",
    serviceAnchor: SERVICE_ANCHORS.sitesWeb,
    serviceLabel: "Sites web",
    illustration: "/assets/illustrations/portfolio-vitrine.png",
    entries: [
      {
        demo: "vitrine",
        title: "La Table Dorée",
        description:
          "Site vitrine d'un restaurant lyonnais fictif : navigation interne, menu par catégories et galerie photo avec lightbox. Ouvrez le menu déroulant, changez de catégorie, cliquez sur les photos — tout fonctionne.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        fullscreen: true,
      },
      {
        demo: "volt",
        title: "VOLT Energy",
        description:
          "Vitrine d'une marque de boisson énergisante : identité sombre et néon, sélecteur de saveurs qui rethème toute la page, panneau composition et bandeau défilant. Changez de saveur et regardez le site changer de peau.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
        fullscreen: true,
      },
      {
        demo: "parfum",
        title: "Maison Élixir",
        description:
          "Vitrine d'une maison de parfum grassoise : direction artistique éditoriale, collection cliquable, fiche produit avec pyramide olfactive et sélecteur de contenance qui recalcule le prix. Ajoutez un flacon au coffret.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity"],
        fullscreen: true,
      },
      {
        demo: "salon",
        title: "L'Écrin",
        description:
          "Vitrine d'un salon de beauté bordelais avec vraie prise de rendez-vous en trois étapes : choisissez une prestation, un jour, un créneau — les indisponibilités sont gérées — puis confirmez.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
        fullscreen: true,
      },
    ],
  },
  {
    anchor: DEMO_ANCHORS.dashboard,
    kind: "Applications web",
    serviceAnchor: SERVICE_ANCHORS.applicationsWeb,
    serviceLabel: "Applications web",
    illustration: "/assets/illustrations/portfolio-dashboard.png",
    entries: [
      {
        demo: "dashboard",
        title: "Boutique Lumen",
        description:
          "Dashboard de gestion des ventes d'une boutique de décoration fictive. Ajoutez une vente, marquez-la payée, supprimez-la : indicateurs, histogramme et donut se recalculent en direct. Le tableau se filtre, se trie et se recherche.",
        stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
        fullscreen: true,
      },
      {
        demo: "pressing",
        title: "Pressing des Halles",
        description:
          "Outil métier de gestion d'un pressing : les commandes avancent dans un pipeline kanban (reçue → nettoyage → repassage → prête), les retards sont signalés, la caisse s'incrémente à chaque retrait. Enregistrez un dépôt et faites-le avancer.",
        stack: ["React", "Next.js", "NestJS", "PostgreSQL"],
        fullscreen: true,
      },
    ],
  },
  {
    anchor: DEMO_ANCHORS.mobile,
    kind: "Applications mobiles",
    serviceAnchor: SERVICE_ANCHORS.applicationsMobiles,
    serviceLabel: "Applications mobiles",
    illustration: "/assets/illustrations/portfolio-mobile.png",
    entries: [
      {
        demo: "mobile",
        title: "Rapido",
        description:
          "App de commande d'un service de livraison fictif. Parcourez les restaurants, composez un panier, commandez, puis suivez la livraison qui progresse en temps réel dans l'onglet Suivi.",
        stack: ["React Native", "Expo", "TypeScript", "Firebase"],
      },
      {
        demo: "banque",
        title: "Nova",
        description:
          "App d'une néo-banque fictive : solde et historique vivants, virement avec pavé numérique qui débite réellement le compte, carte paramétrable (verrouillage instantané, plafonds, paiements à l'étranger).",
        stack: ["React Native", "Expo", "TypeScript", "Plaid"],
      },
    ],
  },
];

export default function PortfolioPage() {
  return (
    <>
      <div className="border-b border-line py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <SectionHeading
              as="h1"
              eyebrow="Portfolio"
              title="Des démos à essayer, pas des captures d'écran"
              intro="Huit projets fictifs, huit vraies mini-applications fonctionnelles. Cliquez, filtrez, réservez, commandez : chaque interface réagit comme un produit réellement livré par Core."
            />
            <IntroIllustration src="/assets/illustrations/portfolio-intro.png" alt="" width={1000} height={500} />
          </div>
          <p className="mt-6 flex w-fit items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-muted">
            <MousePointerClick className="h-4 w-4 text-accent" aria-hidden />
            Interagissez librement — un bouton « Réinitialiser » remet chaque démo à zéro.
          </p>
        </Container>
      </div>

      {DEMO_SECTIONS.map((section, i) => (
        <section
          key={section.anchor}
          id={section.anchor}
          className={`scroll-mt-24 py-16 sm:py-24 ${i % 2 === 1 ? "bg-surface" : ""}`}
        >
          <Container>
            <Reveal>
              <DemoGroup
                index={i}
                kind={section.kind}
                entries={section.entries}
                serviceHref={`/services#${section.serviceAnchor}`}
                serviceLabel={section.serviceLabel}
                flip={i % 2 === 1}
                illustration={section.illustration}
              />
            </Reveal>
          </Container>
        </section>
      ))}
    </>
  );
}
