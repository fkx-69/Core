import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    title: "Cadrage & devis",
    duration: "1 semaine",
    text: "Atelier de cadrage, périmètre précis, devis détaillé en FCFA sous 48 h.",
  },
  {
    title: "Maquettes & validation",
    duration: "1–2 semaines",
    text: "Maquettes cliquables, allers-retours rapides, validation avant chaque développement.",
  },
  {
    title: "Développement itératif",
    duration: "2–6 semaines",
    text: "Démo chaque semaine, environnement de recette accessible, ajustements en continu.",
  },
  {
    title: "Lancement & suivi",
    duration: "en continu",
    text: "Mise en ligne, hébergement, maintenance et évolutions ; vous restez propriétaire du code.",
  },
];

/** Méthode en quatre étapes : rail pointillé vertical sur mobile, connecteur
 *  horizontal derrière les nœuds numérotés à partir de lg. */
export default function ProcessTimeline() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Méthode"
            title="Une méthode simple, des jalons clairs"
            align="center"
          />
        </Reveal>
        <div className="relative mt-16">
          <div
            className="absolute top-5 right-0 left-0 hidden border-t border-dashed border-teal/50 lg:block"
            aria-hidden
          />
          <ol className="space-y-10 border-l border-dashed border-teal/50 pl-6 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0 lg:border-l-0 lg:pl-0">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <Reveal delay={i * 100}>
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-background font-display font-semibold text-accent">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 font-display font-semibold">
                    {step.title}
                  </h3>
                  <span className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {step.duration}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
