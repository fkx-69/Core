import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const REASONS = [
  {
    title: "Expertise reconnue",
    text: "Des développeurs seniors qui maîtrisent leur stack de bout en bout, du design d'API à l'interface finale.",
  },
  {
    title: "Accompagnement complet",
    text: "Un interlocuteur unique, des points d'avancement réguliers — sur place à Dakar et Abidjan ou en visio (GMT) — et un suivi qui continue après la mise en ligne.",
  },
  {
    title: "Technologies modernes",
    text: "React, Next.js, TypeScript, React Native : des outils éprouvés, performants et pérennes.",
  },
  {
    title: "Livraison rapide",
    text: "Des itérations courtes et un premier livrable utilisable en quelques semaines, pas en plusieurs mois.",
  },
];

/** Section calme : quatre colonnes éditoriales séparées par des filets —
 *  grand numéral filaire, tiret pointillé teal, titre, texte (réf 3). */
export default function WhyUs() {
  return (
    <section className="bg-surface py-24 sm:py-32">
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
            width={1400}
            height={369}
            className="w-full max-w-2xl h-auto"
            aria-hidden
          />
        </Reveal>
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 100} className="lg:px-8">
              <div>
                <p
                  className="text-outline font-display text-5xl font-bold select-none"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <span
                  aria-hidden
                  className="mt-4 block w-8 border-t-2 border-dashed border-teal/60"
                />
                <h3 className="mt-4 font-display text-lg font-semibold">
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
