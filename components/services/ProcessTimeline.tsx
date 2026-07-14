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
    <section className="py-16 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Méthode"
            title="Une méthode simple, des jalons clairs"
            align="center"
          />
        </Reveal>
        <div className="relative mt-10 md:mt-16">
          <div
            className="absolute top-5 right-0 left-0 hidden border-t border-dashed border-teal/50 lg:block"
            aria-hidden
          />
          <ol className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-card border border-line bg-surface-raised p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
              >
                <Reveal delay={i * 100}>
                  <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-accent bg-background font-display text-sm font-semibold text-accent lg:h-10 lg:w-10 lg:text-base">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-display text-sm font-semibold lg:mt-5 lg:text-base">
                    {step.title}
                  </h3>
                  <span className="mt-2 inline-block rounded-full border border-line px-2.5 py-1 text-[11px] text-muted lg:mt-3 lg:px-3 lg:text-xs">
                    {step.duration}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-muted lg:mt-3 lg:text-sm">
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
