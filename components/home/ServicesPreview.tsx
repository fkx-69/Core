import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services-data";
import { SERVICE_ILLUSTRATIONS } from "@/components/services/serviceIllustrations";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/** Illustration riche d'un service (mêmes assets que la page Services). */
function TileIllustration({
  serviceId,
  className,
  sizes,
}: {
  serviceId: string;
  className: string;
  sizes: string;
}) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <Image
        src={SERVICE_ILLUSTRATIONS[serviceId]}
        alt=""
        fill
        sizes={sizes}
        className="object-contain transition-transform duration-200 group-hover:scale-[1.03]"
      />
    </div>
  );
}

/** Numéral d'index filaire, coin supérieur droit des tuiles du bento. */
function TileIndex({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="text-outline-number pointer-events-none absolute top-5 right-6 select-none font-display text-3xl font-bold"
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

/** Les services en bento asymétrique : une grande tuile + des tuiles secondaires. */
export default function ServicesPreview() {
  const [main, ...others] = SERVICES;
  return (
    <section className="bg-background py-16 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Ce que nous construisons"
            intro="Du site vitrine au software métier, une même exigence : un produit soigné, performant et facile à faire évoluer."
          />
        </Reveal>
        <div className="mt-9 grid gap-3 lg:hidden">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id}>
              <Link
                href={`/services/${service.slug}`}
                className="group relative grid min-h-32 grid-cols-[5.5rem_1fr_auto] items-center gap-3 overflow-hidden rounded-card border border-line bg-surface-raised p-4 shadow-card transition hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <TileIllustration
                  serviceId={service.id}
                  className="aspect-square w-[5.5rem]"
                  sizes="88px"
                />
                <span className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block font-display text-lg font-semibold">
                    {service.title}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted">
                    {service.tagline}
                  </span>
                  {i === 0 && (
                    <span className="mt-2 block text-xs leading-relaxed text-muted">
                      {service.description.split(". ")[0]}.
                    </span>
                  )}
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 hidden gap-4 lg:grid lg:grid-cols-2">
          <Reveal variant="left" className="h-full">
            <Link
              href={`/services/${main.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface-raised p-8 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <TileIndex n="01" />
              <CornerTicks />
              <TileIllustration
                serviceId={main.id}
                className="mx-auto aspect-square w-full max-w-sm"
                sizes="384px"
              />
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
                href={`/services/${others[0].slug}`}
                className="group relative flex h-full flex-col rounded-card border border-line bg-surface-raised p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <TileIndex n="02" />
                <CornerTicks />
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {others[0].title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {others[0].tagline}
                    </p>
                  </div>
                  {/* pr : dégage le numéral filaire « 02 » du coin. Vignette
                      compacte en mobile — les tuiles 03/04 gardent la leur,
                      celle-ci ne doit pas être la seule nue. */}
                  <div className="shrink-0 pr-12 sm:pr-20">
                    <TileIllustration
                      serviceId={others[0].id}
                      className="aspect-square w-24 sm:w-48"
                      sizes="(min-width: 640px) 192px, 96px"
                    />
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
                    href={`/services/${service.slug}`}
                    className={`group relative flex h-full flex-col rounded-card border border-line p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      i === 0 ? "bg-accent-soft/60" : "bg-surface-raised"
                    }`}
                  >
                    <TileIndex n={String(i + 3).padStart(2, "0")} />
                    <CornerTicks />
                    <TileIllustration
                      serviceId={service.id}
                      className="h-32 w-32"
                      sizes="128px"
                    />
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
