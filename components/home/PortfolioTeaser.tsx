import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEMO_ANCHORS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/** Miniature stylisée d'un navigateur avec un faux site vitrine. */
function MiniBrowser() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-raised shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-line" />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-16 rounded-lg bg-linear-to-br from-amber-200 to-orange-300 dark:from-amber-500/40 dark:to-orange-600/40" />
        <div className="h-2.5 w-2/3 rounded-full bg-line" />
        <div className="h-2.5 w-1/2 rounded-full bg-line" />
      </div>
    </div>
  );
}

/** Miniature stylisée d'un dashboard avec barres. */
function MiniDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-raised shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-line" />
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-8 flex-1 rounded-lg bg-accent-soft" />
          <div className="h-8 flex-1 rounded-lg bg-accent-soft" />
        </div>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t bg-chart-1"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Miniature stylisée d'un smartphone. */
function MiniPhone() {
  return (
    <div className="mx-auto w-24 overflow-hidden rounded-2xl border-4 border-foreground/80 bg-surface-raised shadow-sm">
      <div className="space-y-1.5 p-2">
        <div className="mx-auto h-1 w-8 rounded-full bg-line" />
        <div className="h-10 rounded-lg bg-linear-to-br from-accent/60 to-accent" />
        <div className="h-2 rounded-full bg-line" />
        <div className="h-2 w-2/3 rounded-full bg-line" />
        <div className="flex justify-between pt-1">
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="h-3 w-3 rounded-full bg-line" />
          <span className="h-3 w-3 rounded-full bg-line" />
        </div>
      </div>
    </div>
  );
}

const TEASERS = [
  {
    anchor: DEMO_ANCHORS.vitrine,
    title: "Site vitrine — La Table Dorée",
    text: "Un restaurant fictif : navigation interne, menu et galerie cliquables.",
    art: <MiniBrowser />,
  },
  {
    anchor: DEMO_ANCHORS.dashboard,
    title: "Application web — Boutique Lumen",
    text: "Un dashboard de ventes : graphiques, tableau filtrable, données vivantes.",
    art: <MiniDashboard />,
  },
  {
    anchor: DEMO_ANCHORS.mobile,
    title: "Application mobile — Rapido",
    text: "Une app de livraison : onglets, panier et suivi de commande animé.",
    art: <MiniPhone />,
  },
];

export default function PortfolioTeaser() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="Essayez nos réalisations, ne les regardez pas"
            intro="Chaque démo est une vraie mini-application interactive : cliquez, filtrez, commandez — tout réagit."
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TEASERS.map((teaser, i) => (
            <Reveal key={teaser.anchor} delay={i * 100}>
              <Link
                href={`/portfolio#${teaser.anchor}`}
                className="group block h-full rounded-2xl border border-line bg-background p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div aria-hidden>{teaser.art}</div>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {teaser.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {teaser.text}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Tester la démo
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Button href="/portfolio" variant="outline">
            Voir toutes les démos
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
