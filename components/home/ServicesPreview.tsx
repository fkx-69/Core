import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";

/** Les trois services principaux, en cartes cliquables vers /services. */
export default function ServicesPreview() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Nos services"
            title="Trois façons de donner vie à vos idées"
            intro="Du site vitrine à l'application mobile, une même exigence : un produit soigné, performant et facile à faire évoluer."
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SERVICES.slice(0, 3).map((service, i) => (
            <Reveal key={service.id} delay={i * 100}>
              <Link
                href={`/services#${service.id}`}
                className="group block h-full rounded-2xl border border-line bg-surface-raised p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ServiceIcon icon={service.icon} />
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-accent">
                  {service.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.description.split(". ")[0]}.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  En savoir plus
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
