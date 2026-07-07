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
    text: "Un interlocuteur unique, des points d'avancement réguliers et un suivi qui continue après la mise en ligne.",
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
            className="max-w-2xl h-auto"
            aria-hidden
          />
        </Reveal>
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 100} className="lg:px-8">
              <div className="text-center">
                <reason.icon
                  className="mx-auto h-7 w-7 text-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
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
      </Container>
    </section>
  );
}
