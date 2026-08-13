import Link from "next/link";
import Container from "@/components/ui/Container";
import type { Resource } from "@/lib/resources-data";

const RESOURCE_TYPE_LABELS: Record<Resource["type"], string> = {
  guide: "Guide pratique",
  outil: "Outil gratuit, local et sans compte",
};

function formatResourceDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function ResourceHeader({ resource }: { resource: Resource }) {
  return (
    <div className="relative border-b border-line py-12 sm:py-20">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className="relative">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-accent">
                Accueil
              </Link>
            </li>
            <li aria-hidden>→</li>
            <li>
              <Link
                href="/ressources"
                className="transition hover:text-accent"
              >
                Ressources
              </Link>
            </li>
            <li aria-hidden>→</li>
            <li aria-current="page" className="text-foreground">
              {resource.title}
            </li>
          </ol>
        </nav>

        <div className="mt-8 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {RESOURCE_TYPE_LABELS[resource.type]}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {resource.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
            {resource.description}
          </p>
          <p className="mt-6 text-sm text-muted">
            Publié le{" "}
            <time dateTime={resource.publishedAt}>
              {formatResourceDate(resource.publishedAt)}
            </time>
            {resource.updatedAt !== resource.publishedAt && (
              <>
                {" "}· Mis à jour le{" "}
                <time dateTime={resource.updatedAt}>
                  {formatResourceDate(resource.updatedAt)}
                </time>
              </>
            )}
          </p>
        </div>
      </Container>
    </div>
  );
}
