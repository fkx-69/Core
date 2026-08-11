import { MousePointerClick } from "lucide-react";
import { DEMO_ANCHORS, SERVICE_ANCHORS } from "@/lib/site";
import { getServiceById } from "@/lib/services-data";
import { buildPageMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import DemoGroup, { type DemoEntry } from "@/components/demos/DemoGroup";
import CtaBanner from "@/components/shared/CtaBanner";
import IntroIllustration from "@/components/ui/IntroIllustration";

export const metadata = buildPageMetadata({
  title: "Portfolio",
  description:
    "Découvrez huit démos interactives et conceptuelles de sites vitrines, applications web et applications mobiles, à tester directement dans votre navigateur.",
  pathname: "/portfolio",
});

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
          "Interface conceptuelle d'un restaurant gastronomique : menu par catégories, galerie photo avec lightbox et réservation. Explorez la démonstration dans le mockup ou ouvrez son interface dédiée.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      },
      {
        demo: "volt",
        title: "VOLT Energy",
        description:
          "Interface conceptuelle d'une marque de boisson énergisante : identité sombre et néon, sélecteur de saveurs et page thématique. Faites défiler la démonstration ou ouvrez son interface dédiée.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
      },
      {
        demo: "parfum",
        title: "Maison Élixir",
        description:
          "Interface conceptuelle d'une maison de parfum : direction artistique éditoriale, collection cliquable et pyramide olfactive. Explorez la démonstration directement dans le mockup ou ouvrez son interface dédiée.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity"],
      },
      {
        demo: "salon",
        title: "L'Écrin",
        description:
          "Interface conceptuelle d'un salon de beauté avec prise de rendez-vous en trois étapes : prestation, jour et créneau. Testez le parcours dans la démonstration ou ouvrez son interface dédiée.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
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
          "Démonstration conceptuelle d'une application de gestion de boutique : ventes, paiements, indicateurs et vue stock avec alertes de réassort. Naviguez dans l'interface ou ouvrez sa version dédiée.",
        stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
      },
      {
        demo: "pressing",
        title: "Pressing Sandaga",
        description:
          "Démonstration conceptuelle d'un outil de comptoir pour pressing : pipeline de production, retards, notifications simulées, encaissement et caisse du jour. Testez le parcours ici ou ouvrez sa version dédiée.",
        stack: ["React", "Next.js", "NestJS", "PostgreSQL"],
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
          "Démonstration conceptuelle d'une app de commande et de livraison de repas. Parcourez les restaurants, composez un panier, commandez, puis suivez la livraison dans l'onglet Suivi.",
        stack: ["React Native", "Expo", "TypeScript", "Firebase"],
      },
      {
        demo: "banque",
        title: "Nova",
        description:
          "App d'une néo-banque fictive pensée pour les habitudes mobile money : solde et historique vivants, virement avec pavé numérique qui débite réellement le compte, carte paramétrable (verrouillage instantané, plafonds, paiements à l'étranger).",
        stack: ["React Native", "Expo", "TypeScript", "Plaid"],
      },
    ],
  },
];

function serviceHref(anchor: string): string {
  const service = getServiceById(anchor);
  if (!service) {
    throw new Error(`Unknown service anchor: ${anchor}`);
  }
  return `/services/${service.slug}`;
}

export default function PortfolioPage() {
  return (
    <>
      <div className="relative border-b border-line py-12 sm:py-20">
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Portfolio"
                title="Des démos à essayer, pas des captures d'écran"
                intro="Huit interfaces conceptuelles et interactives. Cliquez, filtrez, réservez et commandez pour explorer des parcours de produit, sans les présenter comme des réalisations livrées par Core."
              />
              {/* Sommaire ancré : trois écrans-fleuves plus bas, ces pilules y mènent. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {DEMO_SECTIONS.map((section) => (
                  <li key={section.anchor}>
                    <a
                      href={`#${section.anchor}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:min-h-0 sm:py-1.5"
                    >
                      {section.kind}
                      <span className="text-xs font-semibold text-accent">
                        {section.entries.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <IntroIllustration src="/assets/illustrations/portfolio-intro.png" alt="" width={1536} height={1024} />
          </div>
          <p className="mt-6 flex w-full items-start gap-2 rounded-2xl border border-line bg-surface-raised px-4 py-3 text-sm font-medium leading-relaxed text-muted sm:w-fit sm:items-center sm:rounded-full sm:py-2">
            <MousePointerClick className="h-4 w-4 text-accent" aria-hidden />
            Interagissez librement — un bouton « Réinitialiser » remet chaque démo à zéro.
          </p>
        </Container>
      </div>

      {DEMO_SECTIONS.map((section, i) => (
        <section
          key={section.anchor}
          id={section.anchor}
          className={`relative scroll-mt-24 overflow-hidden py-12 sm:py-24 ${i % 2 === 1 ? "bg-surface" : ""}`}
        >
          {i % 2 === 0 && (
            <div
              aria-hidden
              className="dot-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_55%)]"
            />
          )}
          <span
            aria-hidden
            className="text-outline-number pointer-events-none absolute -top-8 right-2 hidden select-none font-display text-[12rem] font-bold leading-none lg:block"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <Container className="relative">
            <Reveal>
              <DemoGroup
                index={i}
                kind={section.kind}
                entries={section.entries}
                serviceHref={serviceHref(section.serviceAnchor)}
                serviceLabel={section.serviceLabel}
                flip={i % 2 === 1}
                illustration={section.illustration}
              />
            </Reveal>
          </Container>
        </section>
      ))}
      <CtaBanner
        title="Votre projet mérite une démo aussi convaincante."
        text="Racontez-nous votre idée : nous pouvons explorer avec vous une interface adaptée à votre besoin."
      />
    </>
  );
}
