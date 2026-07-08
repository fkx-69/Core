import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { SERVICE_ILLUSTRATIONS } from "@/components/services/serviceIllustrations";

/** Bloc service : numéral filaire, récit à gauche, rail bénéfices à droite (réf 6). */
export default function ServiceSection({
  service,
  index,
  alternate = false,
}: {
  service: Service;
  index: number;
  alternate?: boolean;
}) {
  const demoHref = service.demoAnchor
    ? `/portfolio#${service.demoAnchor}`
    : "/portfolio";
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <section
      id={service.id}
      className={`group scroll-mt-24 py-16 sm:py-24 ${alternate ? "bg-surface" : ""}`}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-0">
          <Reveal variant="left" className="lg:pr-14">
            <div>
              <p
                aria-hidden
                className="text-outline font-display text-7xl font-bold transition-colors duration-500 group-hover:text-accent-soft lg:text-8xl"
              >
                {numeral}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Service {numeral}
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {service.title}
              </h2>
              <p className="mt-4 text-lg font-medium">{service.tagline}</p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
              <div className="mt-10">
                <Button href={demoHref} variant="outline">
                  {service.demoLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal
            variant="right"
            delay={100}
            className="flex flex-col gap-6 lg:border-l lg:border-line lg:pl-14"
          >
              {SERVICE_ILLUSTRATIONS[service.id] && (
                <div className="relative aspect-square w-full max-w-xs">
                  <Image
                    src={SERVICE_ILLUSTRATIONS[service.id]}
                    alt=""
                    fill
                    className="object-contain"
                    aria-hidden
                  />
                </div>
              )}
              <Card>
                <h3 className="font-display text-lg font-semibold">
                  Ce que vous y gagnez
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
                        aria-hidden
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-dashed border-teal/50 pt-4 text-sm font-semibold text-accent first-letter:uppercase">
                  {service.priceFrom}
                </p>
              </Card>
              <Card className="border-accent/30 bg-accent-soft/40">
                <h3 className="font-display text-lg font-semibold">
                  {service.useCase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.useCase.text}
                </p>
              </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
