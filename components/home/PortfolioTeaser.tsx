import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DEMO_ANCHORS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import Reveal from "@/components/ui/Reveal";
import portfolioTeaserIllustration from "@/public/assets/illustrations/home-portfolio-teaser.png";

/** Miniature stylisée d'un navigateur avec un faux site vitrine. */
function MiniBrowser() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface-raised shadow-raised">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-line" />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-16 rounded-field bg-linear-to-br from-amber-200 to-orange-300 dark:from-amber-500/40 dark:to-orange-600/40" />
        <div className="h-2.5 w-2/3 rounded-full bg-line" />
        <div className="h-2.5 w-1/2 rounded-full bg-line" />
      </div>
    </div>
  );
}

/** Miniature stylisée d'un dashboard avec barres. */
function MiniDashboard() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface-raised shadow-raised">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-line" />
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-8 flex-1 rounded-field bg-accent-soft" />
          <div className="h-8 flex-1 rounded-field bg-accent-soft" />
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
    <div className="w-24 overflow-hidden rounded-card border-4 border-foreground/80 bg-surface-raised shadow-raised">
      <div className="space-y-1.5 p-2">
        <div className="mx-auto h-1 w-8 rounded-full bg-line" />
        <div className="h-10 rounded-field bg-linear-to-br from-accent/60 to-accent" />
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
    title: "La Table Dorée",
    text: "Site vitrine — navigation interne, menu et galerie cliquables.",
  },
  {
    anchor: DEMO_ANCHORS.dashboard,
    title: "Boutique Lumen",
    text: "Dashboard de ventes — graphiques, tableau filtrable, données vivantes.",
  },
  {
    anchor: DEMO_ANCHORS.mobile,
    title: "Rapido",
    text: "App de livraison — onglets, panier et suivi de commande animé.",
  },
];

/** Aplat indigo doux, texte en bas à gauche, pile de mockups à droite (réf 4). */
export default function PortfolioTeaser() {
  return (
    <section className="relative bg-accent-soft/50 py-20 sm:py-28">
      <Image
        src={portfolioTeaserIllustration}
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-10 pointer-events-none"
        aria-hidden
      />
      <Container>
        <div className="grid items-end gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Portfolio"
                title="Des démos, pas des promesses"
                intro="Chaque démo est une vraie mini-application interactive : cliquez, filtrez, commandez — tout réagit."
              />
            </Reveal>
            <Reveal delay={100}>
              <ul className="mt-10">
                {TEASERS.map((teaser) => (
                  <li key={teaser.anchor} className="border-t border-line/80">
                    <Link
                      href={`/portfolio#${teaser.anchor}`}
                      className="group flex items-center justify-between gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span>
                        <span className="font-display font-semibold">
                          {teaser.title}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                          {teaser.text}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <ArrowLink href="/portfolio" className="mt-8">
                Tester les démos
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div aria-hidden className="relative mx-auto w-full max-w-lg pb-8">
              <div className="w-3/5 -rotate-2">
                <MiniBrowser />
              </div>
              <div className="absolute top-16 right-0 w-2/3 rotate-1">
                <MiniDashboard />
              </div>
              <div className="absolute -bottom-2 right-1/4 -rotate-3">
                <MiniPhone />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
