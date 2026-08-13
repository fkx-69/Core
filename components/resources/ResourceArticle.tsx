import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import ResourceHeader from "@/components/resources/ResourceHeader";
import type { Resource } from "@/lib/resources-data";

export default function ResourceArticle({
  resource,
  children,
}: {
  resource: Resource;
  children: ReactNode;
}) {
  return (
    <article>
      <ResourceHeader resource={resource} />
      <Container className="py-12 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-muted sm:space-y-16">
          {children}
        </div>
      </Container>
    </article>
  );
}

export function ResourceSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <section aria-labelledby={headingId}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2
        id={headingId}
        className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function ResourceCallout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-card border border-accent/30 bg-accent-soft/60 p-5 text-foreground sm:p-7">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </aside>
  );
}
