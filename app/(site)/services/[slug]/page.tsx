import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/seo/JsonLd";
import CtaBanner from "@/components/shared/CtaBanner";
import { getServiceBySlug, SERVICES, type Service } from "@/lib/services-data";
import {
  buildPageMetadata,
  getServiceStructuredData,
} from "@/lib/seo";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service introuvable",
      robots: { index: false, follow: false },
    };
  }

  return buildPageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    pathname: `/services/${service.slug}`,
  });
}

function demoHref(service: Service): string {
  return service.demoAnchor
    ? `/portfolio#${service.demoAnchor}`
    : "/portfolio";
}

function serviceLink(service: Service): string {
  return `/services/${service.slug}`;
}

const RESOURCE_LINKS_BY_SERVICE: Record<
  string,
  Array<{ href: string; label: string }>
> = {
  "creation-site-web-bamako": [
    {
      href: "/ressources/prix-creation-site-web-mali",
      label: "Préparer et comparer un devis web",
    },
    {
      href: "/ressources/generateur-cahier-des-charges",
      label: "Structurer un premier cahier des charges",
    },
  ],
  "creation-site-ecommerce-mali": [
    {
      href: "/ressources/prix-creation-site-web-mali",
      label: "Comprendre les facteurs de coût d'un site",
    },
    {
      href: "/ressources/generateur-cahier-des-charges",
      label: "Décrire le parcours de commande",
    },
  ],
  "developpement-application-web-mali": [
    {
      href: "/ressources/digitaliser-excel-whatsapp",
      label: "Diagnostiquer un flux dispersé",
    },
    {
      href: "/ressources/generateur-cahier-des-charges",
      label: "Décrire les rôles et le premier flux",
    },
  ],
  "logiciel-sur-mesure-mali": [
    {
      href: "/ressources/digitaliser-excel-whatsapp",
      label: "Préparer une intégration à étudier",
    },
    {
      href: "/ressources/generateur-cahier-des-charges",
      label: "Structurer les contraintes métier",
    },
  ],
  "digitalisation-processus-entreprise-mali": [
    {
      href: "/ressources/digitaliser-excel-whatsapp",
      label: "Diagnostiquer Excel, WhatsApp ou papier",
    },
    {
      href: "/ressources/generateur-cahier-des-charges",
      label: "Décrire un premier flux",
    },
  ],
  "developpement-application-mobile-mali": [
    {
      href: "/ressources/generateur-cahier-des-charges",
      label: "Clarifier le parcours et les utilisateurs",
    },
    { href: "/ressources", label: "Voir toutes les ressources" },
  ],
};

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedServices = SERVICES.filter(
    (candidate) => candidate.slug !== service.slug,
  );

  return (
    <>
      <JsonLd data={getServiceStructuredData(service)} />

      <article>
        <div className="relative border-b border-line py-12 sm:py-20">
          <div
            aria-hidden
            className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <Container className="relative">
            <nav
              aria-label="Fil d'Ariane"
              className="text-sm text-muted"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition hover:text-accent"
                  >
                    Accueil
                  </Link>
                </li>
                <li aria-hidden>→</li>
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-accent"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden>→</li>
                <li aria-current="page" className="text-foreground">
                  {service.h1}
                </li>
              </ol>
            </nav>

            <div className="mt-8 max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {service.title}
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {service.h1}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
                {service.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={demoHref(service)} variant="outline">
                  {service.demoLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/contact">
                  Échanger sur votre besoin
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          </Container>
        </div>

        <section className="py-14 sm:py-24" aria-labelledby="service-problems">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Point de départ
                </p>
                <h2
                  id="service-problems"
                  className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Quand ce service est utile
                </h2>
              </div>
              <ul className="grid gap-4 sm:grid-cols-3">
                {service.problems.map((problem) => (
                  <li
                    key={problem}
                    className="rounded-card border border-line bg-surface-raised p-5 text-sm leading-relaxed text-muted shadow-card"
                  >
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section
          className="border-y border-line bg-surface py-14 sm:py-24"
          aria-labelledby="service-deliverables"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Périmètre possible
                </p>
                <h2
                  id="service-deliverables"
                  className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Ce que nous pouvons préparer
                </h2>
                <p className="mt-5 max-w-xl leading-relaxed text-muted">
                  Le contenu exact dépend du contexte, des utilisateurs et des
                  contraintes à clarifier ensemble.
                </p>
              </div>
              <ul className="space-y-4">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
                      aria-hidden
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed text-muted">
                      {deliverable}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section className="py-14 sm:py-24" aria-labelledby="service-approach">
          <Container>
            <div className="mx-auto max-w-4xl">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Approche
              </p>
              <h2
                id="service-approach"
                className="mt-3 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Avancer par étapes vérifiables
              </h2>
              <ol className="mt-10 grid gap-4 sm:grid-cols-2">
                {service.approach.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-card border border-line bg-surface-raised p-5 shadow-card"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent font-display text-sm font-semibold text-accent">
                      {index + 1}
                    </span>
                    <p className="mt-4 leading-relaxed text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        <section
          className="border-y border-line bg-surface py-14 sm:py-24"
          aria-labelledby="service-faq"
        >
          <Container className="max-w-3xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              FAQ
            </p>
            <h2
              id="service-faq"
              className="mt-3 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Questions fréquentes
            </h2>
            <div className="mt-10">
              <Faq items={service.faq} />
            </div>
          </Container>
        </section>

        <section className="py-14 sm:py-24" aria-labelledby="related-services">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  À explorer ensuite
                </p>
                <h2
                  id="related-services"
                  className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Les autres expertises Core
                </h2>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent"
              >
                Voir le hub services
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {relatedServices.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={serviceLink(related)}
                    className="group flex h-full items-center justify-between gap-4 rounded-card border border-line bg-surface-raised p-5 shadow-card transition hover:-translate-y-0.5 hover:border-accent/50"
                  >
                    <span>
                      <span className="block font-display font-semibold">
                        {related.h1}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {related.tagline}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section
          className="border-t border-line bg-surface py-14 sm:py-24"
          aria-labelledby="service-resources"
        >
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Ressources
                </p>
                <h2
                  id="service-resources"
                  className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Préparer la prochaine discussion
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {(RESOURCE_LINKS_BY_SERVICE[service.slug] ?? [
                  { href: "/ressources", label: "Voir les ressources" },
                ]).map((resourceLink) => (
                  <li key={resourceLink.href}>
                    <Link
                      href={resourceLink.href}
                      className="group flex h-full items-center justify-between gap-4 rounded-card border border-line bg-surface-raised p-5 text-sm font-medium shadow-card transition hover:-translate-y-0.5 hover:border-accent/50"
                    >
                      <span>{resourceLink.label}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </article>

      <CtaBanner
        title="Clarifions la prochaine étape"
        text={service.nextStep}
        note="Le formulaire de contact est une démonstration : aucune saisie n'est transmise ni conservée."
      />
    </>
  );
}
