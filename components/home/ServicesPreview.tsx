import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";

/** Illustration filaire d'un navigateur pour la grande tuile (réf 2). */
function WireBrowser() {
  return (
    <div
      aria-hidden
      className="rounded-field border border-line bg-background p-3"
    >
      <div className="flex items-center gap-1.5 border-b border-line pb-2">
        <span className="h-1.5 w-1.5 rounded-full border border-line" />
        <span className="h-1.5 w-1.5 rounded-full border border-line" />
        <span className="h-1.5 w-1.5 rounded-full border border-line" />
      </div>
      <div className="flex gap-3 pt-3">
        <div className="h-14 w-1/2 rounded-field border border-line" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-1.5 rounded-full bg-line" />
          <div className="h-1.5 w-4/5 rounded-full bg-line" />
          <div className="h-1.5 w-3/5 rounded-full border-b border-dashed border-teal/70" />
        </div>
      </div>
      <div className="flex gap-2 pt-3">
        <div className="h-8 flex-1 rounded-field border border-line" />
        <div className="h-8 flex-1 rounded-field border border-line" />
        <div className="h-8 flex-1 rounded-field bg-accent-soft/60" />
      </div>
    </div>
  );
}

/** Numéral d'index filaire, coin supérieur droit des tuiles du bento. */
function TileIndex({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="text-outline pointer-events-none absolute top-5 right-6 select-none font-display text-3xl font-bold"
    >
      {n}
    </span>
  );
}

/** Ticks « + » de coin, révélés à l'accent au survol de la tuile. */
function CornerTicks() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-4 select-none text-sm text-line transition-colors duration-200 group-hover:text-accent/60"
      >
        +
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 bottom-3 select-none text-sm text-line transition-colors duration-200 group-hover:text-accent/60"
      >
        +
      </span>
    </>
  );
}

const arrowLabel = (
  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-8 transition group-hover:decoration-accent">
    En savoir plus
    <ArrowRight
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden
    />
  </span>
);

/** Les quatre services en bento asymétrique : une grande tuile + trois tuiles. */
export default function ServicesPreview() {
  const [main, ...others] = SERVICES;
  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Ce que nous construisons"
            intro="Du site vitrine au software métier, une même exigence : un produit soigné, performant et facile à faire évoluer."
          />
        </Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <Reveal variant="left" className="h-full">
            <Link
              href={`/services#${main.id}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface-raised p-8 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src="/assets/illustrations/home-services-preview.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0 -z-10 object-cover opacity-10"
                aria-hidden
              />
              <TileIndex n="01" />
              <CornerTicks />
              <WireBrowser />
              <h3 className="mt-8 font-display text-2xl font-semibold">
                {main.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-accent">
                {main.tagline}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                {main.description.split(". ")[0]}.
              </p>
              {arrowLabel}
            </Link>
          </Reveal>
          <div className="grid gap-4">
            <Reveal variant="right" delay={100}>
              <Link
                href={`/services#${others[0].id}`}
                className="group relative flex h-full flex-col rounded-card border border-line bg-surface-raised p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <TileIndex n="02" />
                <CornerTicks />
                <div className="flex items-start gap-4">
                  <ServiceIcon icon={others[0].icon} />
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {others[0].title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {others[0].tagline}
                    </p>
                  </div>
                </div>
                {arrowLabel}
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {others.slice(1).map((service, i) => (
                <Reveal
                  key={service.id}
                  variant="right"
                  delay={200 + i * 100}
                  className="h-full"
                >
                  <Link
                    href={`/services#${service.id}`}
                    className={`group relative flex h-full flex-col rounded-card border border-line p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      i === 0 ? "bg-accent-soft/60" : "bg-surface-raised"
                    }`}
                  >
                    <TileIndex n={i === 0 ? "03" : "04"} />
                    <CornerTicks />
                    <ServiceIcon icon={service.icon} />
                    <h3 className="mt-4 font-display text-lg font-semibold">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {service.tagline}
                    </p>
                    {arrowLabel}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
