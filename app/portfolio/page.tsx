import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { MousePointerClick } from "lucide-react";
import { DEMO_ANCHORS, SERVICE_ANCHORS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import DemoShell from "@/components/demos/DemoShell";
import LazyDemo, { type DemoName } from "@/components/demos/LazyDemo";
import IntroIllustration from "@/components/ui/IntroIllustration";
import portfolioIntroIllustration from "@/public/assets/illustrations/portfolio-intro.png";
import vitrineIllustration from "@/public/assets/illustrations/portfolio-vitrine.png";
import dashboardIllustration from "@/public/assets/illustrations/portfolio-dashboard.png";
import mobileIllustration from "@/public/assets/illustrations/portfolio-mobile.png";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez des exemples interactifs de réalisations Core : site vitrine, application web et application mobile, à tester directement dans votre navigateur.",
};

const DEMO_SECTIONS: {
  anchor: string;
  demo: DemoName;
  kind: string;
  title: string;
  description: string;
  stack: string[];
  serviceAnchor: string;
  serviceLabel: string;
  illustration: StaticImageData;
}[] = [
  {
    anchor: DEMO_ANCHORS.vitrine,
    demo: "vitrine",
    kind: "Site vitrine",
    title: "La Table Dorée",
    description:
      "Core a livré un site vitrine complet pour ce restaurant lyonnais fictif : présentation, menu par catégories et galerie photo. Naviguez entre les sections, ouvrez le menu déroulant et cliquez sur les photos de la galerie — tout fonctionne.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    serviceAnchor: SERVICE_ANCHORS.sitesWeb,
    serviceLabel: "Sites web",
    illustration: vitrineIllustration,
  },
  {
    anchor: DEMO_ANCHORS.dashboard,
    demo: "dashboard",
    kind: "Application web",
    title: "Boutique Lumen",
    description:
      "Un dashboard de gestion des ventes livré à une boutique de décoration fictive. Ajoutez une vente, marquez-la payée, supprimez-la : les indicateurs, l'histogramme et le donut se recalculent en direct. Le tableau se filtre, se trie et se recherche.",
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
    serviceAnchor: SERVICE_ANCHORS.applicationsWeb,
    serviceLabel: "Applications web",
    illustration: dashboardIllustration,
  },
  {
    anchor: DEMO_ANCHORS.mobile,
    demo: "mobile",
    kind: "Application mobile",
    title: "Rapido",
    description:
      "L'app de commande d'un service de livraison fictif. Parcourez les restaurants, composez un panier, commandez, puis suivez la livraison qui progresse en temps réel dans l'onglet Suivi — le tout avec une navigation par onglets animée.",
    stack: ["React Native", "Expo", "TypeScript", "Firebase"],
    serviceAnchor: SERVICE_ANCHORS.applicationsMobiles,
    serviceLabel: "Applications mobiles",
    illustration: mobileIllustration,
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
              intro="Chaque projet ci-dessous est une mini-application réellement fonctionnelle, avec des données factices. Cliquez, filtrez, commandez : l'interface réagit comme un vrai produit livré par Core."
            />
            <IntroIllustration src={portfolioIntroIllustration} alt="" />
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
              <DemoShell
                index={i}
                kind={section.kind}
                title={section.title}
                description={section.description}
                stack={section.stack}
                serviceHref={`/services#${section.serviceAnchor}`}
                serviceLabel={section.serviceLabel}
                flip={i % 2 === 1}
                illustration={section.illustration}
              >
                <LazyDemo demo={section.demo} />
              </DemoShell>
            </Reveal>
          </Container>
        </section>
      ))}
    </>
  );
}
