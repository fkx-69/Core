import type { Metadata } from "next";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceSection from "@/components/services/ServiceSection";
import ProcessTimeline from "@/components/services/ProcessTimeline";
import CtaBanner from "@/components/shared/CtaBanner";
import IntroIllustration from "@/components/ui/IntroIllustration";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Sites web, applications web, applications mobiles et software sur mesure : les services de l'agence Core, de Dakar à Abidjan.",
};

const INTRO_CHIPS = [
  "4 expertises",
  "Devis sous 48 h — en FCFA",
  "Dakar · Abidjan · à distance",
];

export default function ServicesPage() {
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
                eyebrow="Services"
                title="Ce que nous construisons pour vous"
                intro="Quatre expertises complémentaires, un même objectif : livrer un logiciel utile, fiable et agréable à utiliser. Chaque service renvoie vers une démo interactive de notre portfolio."
              />
              <ul className="mt-6 flex flex-wrap gap-2">
                {INTRO_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-line bg-surface-raised px-4 py-1.5 text-sm text-muted"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
            <IntroIllustration src="/assets/illustrations/services-intro.png" alt="" width={1536} height={1024} />
          </div>
        </Container>
      </div>
      {SERVICES.map((service, i) => (
        <ServiceSection
          key={service.id}
          service={service}
          index={i}
          alternate={i % 2 === 1}
        />
      ))}
      <ProcessTimeline />
      <CtaBanner
        title="Un besoin précis ?"
        text="Décrivez-nous votre projet : nous répondons avec un premier avis technique, un planning réaliste et un budget en FCFA, sans jargon."
      />
    </>
  );
}
