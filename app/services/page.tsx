import type { Metadata } from "next";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceSection from "@/components/services/ServiceSection";
import IntroIllustration from "@/components/ui/IntroIllustration";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Sites web, applications web, applications mobiles et software sur mesure : découvrez les services de l'agence Core.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="border-b border-line py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <SectionHeading
              as="h1"
              eyebrow="Services"
              title="Ce que nous construisons pour vous"
              intro="Quatre expertises complémentaires, un même objectif : livrer un logiciel utile, fiable et agréable à utiliser. Chaque service renvoie vers une démo interactive de notre portfolio."
            />
            <IntroIllustration src="/assets/illustrations/services-intro.png" alt="" width={1000} height={500} />
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
    </>
  );
}
