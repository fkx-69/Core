import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DEMO_ANCHORS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import Reveal from "@/components/ui/Reveal";

const TEASERS = [
  {
    anchor: DEMO_ANCHORS.dashboard,
    title: "Applications web",
    count: "2 démos",
    text: "Ventes, stocks et pressing en kanban — deux aperçus navigables, aussi disponibles en pleine page.",
  },
  {
    anchor: DEMO_ANCHORS.mobile,
    title: "Applications mobiles",
    count: "2 démos",
    text: "Livraison de repas et néo-banque — panier, virements, suivi en temps réel.",
  },
  {
    anchor: DEMO_ANCHORS.vitrine,
    title: "Sites vitrines",
    count: "4 démos",
    text: "Restaurant, boisson énergisante, maison de parfum, salon de beauté — les quatre identités entrevues plus haut, en pleine page.",
  },
];

/** Aplat indigo doux, texte à gauche, illustration trait fin indigo à droite (réf 4). */
export default function PortfolioTeaser() {
  return (
    <section className="relative border-t border-line bg-accent-soft py-16 sm:py-28">
      <Image
        src="/assets/illustrations/home-portfolio-teaser.png"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-20 pointer-events-none"
        aria-hidden
      />
      <Container>
        <div className="grid items-center gap-9 sm:gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Portfolio"
                title="Des démos, pas des promesses"
                intro="Le héro vous a montré les vitrines ; voici le reste. Chaque démo est une vraie mini-application interactive : cliquez, filtrez, commandez — tout réagit."
              />
            </Reveal>
            <Reveal delay={100}>
              <ul className="mt-8 sm:mt-10">
                {TEASERS.map((teaser) => (
                  <li
                    key={teaser.anchor}
                    className="border-t border-line/80 last:border-b"
                  >
                    <Link
                      href={`/portfolio#${teaser.anchor}`}
                      className="group flex items-center justify-between gap-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-display text-lg font-semibold transition-colors duration-200 group-hover:text-accent">
                            {teaser.title}
                          </span>
                          <span className="rounded-full border border-line bg-surface-raised px-2.5 py-0.5 text-xs font-medium text-muted">
                            {teaser.count}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {teaser.text}
                        </span>
                      </span>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-raised text-accent transition duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-contrast"
                        aria-hidden
                      >
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
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
            <Image
              src="/assets/illustrations/home-portfolio-stack.png"
              alt=""
              width={1536}
              height={1024}
              quality={95}
              sizes="(min-width: 640px) 32rem, 100vw"
              className="mx-auto h-auto w-full max-w-xs sm:max-w-lg"
              aria-hidden
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
