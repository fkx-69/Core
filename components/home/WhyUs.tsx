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

export default function WhyUs() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Pourquoi nous choisir"
            title="Un partenaire, pas un simple prestataire"
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-line bg-surface-raised p-6 shadow-sm transition duration-200 hover:shadow-md">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent"
                  aria-hidden
                >
                  <reason.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
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
