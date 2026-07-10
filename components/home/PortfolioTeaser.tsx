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
    title: "Applications web · 2 démos",
    text: "Dashboard de ventes et gestion de pressing en kanban — trop grandes pour le héro, elles se testent en taille réelle.",
  },
  {
    anchor: DEMO_ANCHORS.mobile,
    title: "Applications mobiles · 2 démos",
    text: "Livraison de repas et néo-banque — panier, virements, suivi en temps réel.",
  },
  {
    anchor: DEMO_ANCHORS.vitrine,
    title: "Sites vitrines · 4 démos",
    text: "Restaurant, boisson énergisante, maison de parfum, salon de beauté — les quatre identités entrevues plus haut, en pleine page.",
  },
];

/** Aplat indigo doux, texte à gauche, illustration trait fin indigo à droite (réf 4). */
export default function PortfolioTeaser() {
  return (
    <section className="relative bg-accent-soft/50 py-20 sm:py-28">
      <Image
        src="/assets/illustrations/home-portfolio-teaser.png"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-20 pointer-events-none"
        aria-hidden
      />
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Portfolio"
                title="Des démos, pas des promesses"
                intro="Le héro vous a montré les vitrines ; voici le reste. Chaque démo est une vraie mini-application interactive : cliquez, filtrez, commandez — tout réagit."
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
            <Image
              src="/assets/illustrations/home-portfolio-stack.png"
              alt=""
              width={1536}
              height={1024}
              className="mx-auto h-auto w-full max-w-lg"
              aria-hidden
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
