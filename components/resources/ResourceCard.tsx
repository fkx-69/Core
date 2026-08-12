import Link from "next/link";
import { ArrowRight, FileText, WandSparkles } from "lucide-react";
import type { Resource } from "@/lib/resources-data";

const RESOURCE_TYPE_LABELS: Record<Resource["type"], string> = {
  guide: "Guide",
  outil: "Outil",
};

/** Carte commune au hub et aux encarts de maillage éditorial. */
export default function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = resource.type === "outil" ? WandSparkles : FileText;

  return (
    <li>
      <Link
        href={resource.path}
        className="group flex h-full flex-col rounded-card border border-line bg-surface-raised p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-7"
      >
        <span className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4" aria-hidden />
            {RESOURCE_TYPE_LABELS[resource.type]}
          </span>
          <time dateTime={resource.updatedAt} className="text-muted">
            {new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(`${resource.updatedAt}T00:00:00Z`))}
          </time>
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">
          {resource.title}
        </h2>
        <p className="mt-3 flex-1 leading-relaxed text-muted">
          {resource.description}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-8 transition group-hover:decoration-accent">
          Lire la ressource
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>
    </li>
  );
}
