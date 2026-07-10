import Image from "next/image";
import { Award, Cpu, HeartHandshake, Rocket } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const REASONS = [
  {
    icon: Award,
    title: "Expertise reconnue",
    text: "Des développeurs seniors qui maîtrisent leur stack de bout en bout, du design d'API à l'interface finale.",
  },
  {
    icon: HeartHandshake,
    title: "Accompagnement complet",
    text: "Un interlocuteur unique, des points d'avancement réguliers — sur place à Dakar et Abidjan ou en visio (GMT) — et un suivi qui continue après la mise en ligne.",
  },
  {
    icon: Cpu,
    title: "Technologies modernes",
    text: "React, Next.js, TypeScript, React Native : des outils éprouvés, performants et pérennes.",
  },
  {
    icon: Rocket,
    title: "Livraison rapide",
    text: "Des itérations courtes et un premier livrable utilisable en quelques semaines, pas en plusieurs mois.",
  },
];

/** Section calme : quatre colonnes séparées par des filets, sans cartes (réf 3). */
export default function WhyUs() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Pourquoi Core"
            title="Un partenaire, pas un simple prestataire"
            align="center"
          />
        </Reveal>
        <Reveal className="mt-12 flex justify-center">
          <Image
            src="/assets/illustrations/home-why-us.png"
            alt=""
            width={960}
            height={280}
            className="w-full max-w-2xl h-auto"
            aria-hidden
          />
        </Reveal>
        <div className="relative mt-16">
          {/* Connecteur pointillé teal derrière la rangée d'icônes (lg+) */}
          <div
            aria-hidden
            className="absolute top-14 right-12 left-12 hidden border-t border-dashed border-teal/40 lg:block"
          />
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 100} className="lg:px-8">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/70">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="relative mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
                    <reason.icon
                      className="h-6 w-6 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {reason.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
