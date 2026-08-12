import { SERVICES } from "@/lib/services-data";
import { buildPageMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceSection from "@/components/services/ServiceSection";
import ProcessTimeline from "@/components/services/ProcessTimeline";
import CtaBanner from "@/components/shared/CtaBanner";
import IntroIllustration from "@/components/ui/IntroIllustration";

export const metadata = buildPageMetadata({
  title: "Services",
  description:
    "Sites web, applications web, applications mobiles et software sur mesure : les services de l'agence Core à Bamako, au Mali.",
  pathname: "/services",
});

const INTRO_CHIPS = [
  "Conception et développement",
  "Interfaces web et mobiles",
  "Bamako · Mali",
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
                intro="Des expertises complémentaires, un même objectif : concevoir un logiciel utile, fiable et agréable à utiliser. Chaque service dispose d'une page détaillée et d'un périmètre à explorer, avec des démos conceptuelles lorsque cela est pertinent."
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
        text="Décrivez-nous votre projet : nous vous aidons à clarifier le périmètre et les prochaines étapes, sans jargon."
      />
    </>
  );
}
