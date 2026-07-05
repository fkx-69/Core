import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";

export default function ServiceSection({
  service,
  alternate = false,
}: {
  service: Service;
  alternate?: boolean;
}) {
  const demoHref = service.demoAnchor
    ? `/portfolio#${service.demoAnchor}`
    : "/portfolio";

  return (
    <section
      id={service.id}
      className={`scroll-mt-24 py-16 sm:py-20 ${alternate ? "bg-surface" : ""}`}
    >
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <ServiceIcon icon={service.icon} />
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight">
                {service.title}
              </h2>
              <p className="mt-1 font-medium text-accent">{service.tagline}</p>
              <p className="mt-4 leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
              <div className="mt-8">
                <Button href={demoHref} variant="outline">
                  {service.demoLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <h3 className="font-display text-lg font-semibold">
                  Ce que vous y gagnez
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                        aria-hidden
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="border-accent/30 bg-accent-soft/40">
                <h3 className="font-display text-lg font-semibold">
                  {service.useCase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.useCase.text}
                </p>
              </Card>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
