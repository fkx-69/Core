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
    <section className="bg-surface py-16 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Pourquoi Core"
            title="Un partenaire, pas un simple prestataire"
            align="center"
          />
        </Reveal>
        <Reveal className="mt-8 flex justify-center sm:mt-12">
          <Image
            src="/assets/illustrations/home-why-us.png"
            alt=""
            width={1400}
            height={369}
            sizes="(min-width: 768px) 42rem, 100vw"
            className="h-auto w-full max-w-sm sm:max-w-2xl"
            aria-hidden
          />
        </Reveal>
        <div className="mt-8 divide-y divide-line border-y border-line sm:hidden">
          {REASONS.map((reason, i) => (
            <details key={reason.title} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-3 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
                <span className="text-outline font-display text-3xl font-bold" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-semibold">{reason.title}</span>
                <span className="ml-auto text-xl text-accent transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="pb-5 pl-[4.25rem] text-sm leading-relaxed text-muted">
                {reason.text}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-16 hidden gap-12 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
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
