import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";

const FIGURES = [
  { value: 40, suffix: "+", label: "projets livrés" },
  { value: 6, suffix: "", label: "pays d'Afrique de l'Ouest" },
  { value: 24, suffix: " h", label: "de délai de réponse" },
  { value: 98, suffix: " %", label: "de clients satisfaits" },
];

/** Bande de chiffres clés : quatre colonnes séparées par des filets sur
 *  fond accent-soft, trame de points en filigrane. */
export default function KeyFigures() {
  return (
    <section className="relative bg-accent-soft/50 py-16 sm:py-20">
      <div
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden
      />
      <Container className="relative">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {FIGURES.map((figure, i) => (
            <Reveal key={figure.label} delay={i * 100} className="lg:px-8">
              <div className="text-center">
                <Counter
                  value={figure.value}
                  suffix={figure.suffix}
                  className="font-display text-5xl font-bold"
                />
                <p className="mt-2 text-sm text-muted">{figure.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
