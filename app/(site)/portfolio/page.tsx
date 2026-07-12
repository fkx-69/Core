import type { Metadata } from "next";
import { MousePointerClick } from "lucide-react";
import { DEMO_ANCHORS, SERVICE_ANCHORS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import DemoGroup, { type DemoEntry } from "@/components/demos/DemoGroup";
import CtaBanner from "@/components/shared/CtaBanner";
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
          "Site complet d'un restaurant gastronomique fictif des Almadies, à Dakar : menu par catégories, galerie photo avec lightbox, réservation. L'aperçu se navigue tel quel dans le mockup ; « Visiter le site en entier » ouvre le vrai site pleine page, dans un nouvel onglet.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      },
      {
        demo: "volt",
        title: "VOLT Energy",
        description:
          "Site complet d'une marque de boisson énergisante abidjanaise : identité sombre et néon, sélecteur de saveurs qui rethème toute la page. Faites défiler l'aperçu comme un vrai site, puis cliquez sur « Visiter le site en entier » pour l'ouvrir pleine page dans un nouvel onglet.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
      },
      {
        demo: "parfum",
        title: "Maison Élixir",
        description:
          "Site complet d'une maison de parfum d'Abidjan : direction artistique éditoriale, collection cliquable, pyramide olfactive et prix par contenance. Explorez l'aperçu directement dans le mockup, ou ouvrez le vrai site pleine page via « Visiter le site en entier », dans un nouvel onglet.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity"],
      },
      {
        demo: "salon",
        title: "L'Écrin",
        description:
          "Site complet d'un salon de beauté du Plateau, à Abidjan, avec prise de rendez-vous en trois étapes : prestation, jour, créneau. Réservez directement dans l'aperçu, puis cliquez sur « Visiter le site en entier » pour ouvrir le vrai site pleine page dans un nouvel onglet.",
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
          "Application de gestion d'une boutique de décoration dakaroise fictive : ventes en FCFA, paiements Wave, Orange Money, espèces ou carte, indicateurs vivants et vraie vue stock avec alertes de réassort. Naviguez dans l'aperçu ou ouvrez l'application complète en pleine page.",
        stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
      },
      {
        demo: "pressing",
        title: "Pressing Sandaga",
        description:
          "Outil de comptoir d'un pressing du quartier Sandaga, à Dakar : pipeline de production, retards, SMS simulés, encaissement en espèces, Wave ou Orange Money et caisse du jour détaillée en FCFA. Testez le parcours ici ou ouvrez l'application complète.",
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
          "App de commande d'un service de livraison de repas fictif à Abidjan. Parcourez les restaurants, composez un panier, commandez, puis suivez la livraison qui progresse en temps réel dans l'onglet Suivi.",
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

export default function PortfolioPage() {
  return (
    <>
      <div className="relative border-b border-line py-16 sm:py-20">
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Portfolio"
                title="Des démos à essayer, pas des captures d'écran"
                intro="Huit projets fictifs, huit vraies interfaces fonctionnelles. Cliquez, filtrez, réservez, commandez — et visitez chaque site et chaque application web en pleine page, comme s'ils étaient déjà en ligne : chaque projet réagit comme un produit réellement livré par Core."
              />
              {/* Sommaire ancré : trois écrans-fleuves plus bas, ces pilules y mènent. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {DEMO_SECTIONS.map((section) => (
                  <li key={section.anchor}>
                    <a
                      href={`#${section.anchor}`}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
          className={`relative scroll-mt-24 overflow-hidden py-16 sm:py-24 ${i % 2 === 1 ? "bg-surface" : ""}`}
        >
          {i % 2 === 0 && (
            <div
              aria-hidden
              className="dot-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_55%)]"
            />
          )}
          <span
            aria-hidden
            className="text-outline pointer-events-none absolute -top-8 right-2 hidden select-none font-display text-[12rem] font-bold leading-none lg:block"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <Container className="relative">
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
      <CtaBanner
        title="Votre projet mérite une démo aussi convaincante."
        text="Racontez-nous votre idée : nous vous montrons, planning et budget en FCFA à l'appui, comment la transformer en produit que vos clients utilisent vraiment."
      />
    </>
  );
}
