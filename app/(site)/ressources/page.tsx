import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ResourceCard from "@/components/resources/ResourceCard";
import CtaBanner from "@/components/shared/CtaBanner";
import { RESOURCES } from "@/lib/resources-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Ressources pour cadrer un projet logiciel au Mali",
  description:
    "Guides et outil local de Core pour préparer un projet web, e-commerce ou métier au Mali, comparer un devis et structurer un premier besoin.",
  pathname: "/ressources",
});

export default function ResourcesPage() {
  return (
    <>
      <div className="relative border-b border-line py-12 sm:py-20">
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow="Ressources"
            title="Mieux cadrer avant de développer"
            intro="Des contenus courts et concrets pour comprendre un périmètre, poser les bonnes questions et préparer un échange sur un site, une application ou un outil métier au Mali."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ressources/generateur-cahier-des-charges"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Ouvrir le générateur
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface-raised px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Voir les services
            </Link>
          </div>
        </Container>
      </div>

      <section className="py-14 sm:py-24" aria-label="Liste des ressources">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {RESOURCES.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </ul>
        </Container>
      </section>

      <section
        className="border-y border-line bg-surface py-14 sm:py-24"
        aria-label="Passer de la ressource au projet"
      >
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="Pour aller plus loin"
            title="Un document n'est qu'un point de départ"
            intro="Après un premier diagnostic, le périmètre doit être confronté aux utilisateurs, aux données disponibles et aux contraintes d'exploitation. Les pages services détaillent les contextes dans lesquels Core peut étudier une solution."
          />
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <Link
              href="/services/creation-site-web-bamako"
              className="text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent"
            >
              Création de site web
            </Link>
            <Link
              href="/services/creation-site-ecommerce-mali"
              className="text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent"
            >
              Création e-commerce
            </Link>
            <Link
              href="/services/digitalisation-processus-entreprise-mali"
              className="text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent"
            >
              Digitalisation des processus
            </Link>
            <Link
              href="/contact"
              className="text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent"
            >
              Préparer un échange
            </Link>
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Vous avez déjà un premier flux ?"
        text="Le générateur peut vous aider à le décrire avant de discuter du périmètre et des prochaines questions."
        eyebrow="Outil local"
      />
    </>
  );
}
