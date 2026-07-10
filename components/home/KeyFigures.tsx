import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";

const FIGURES = [
  { value: 40, suffix: "+", label: "projets livrés" },
  { value: 6, suffix: "", label: "pays d'Afrique de l'Ouest" },
  { value: 24, suffix: " h", label: "de délai de réponse" },
  { value: 98, suffix: " %", label: "de clients satisfaits" },
];

/** Bande poster encre pleine largeur : chiffres géants, suffixes indigo,
 *  trame de points inversée et halo — écho direct de la scène VOLT du héro.
 *  Palette absolue (identique en light et dark : la bande EST le poster). */
export default function KeyFigures() {
  return (
    // border-y : délimite la bande en mode sombre, où le fond du site est
    // aussi #0b0d13 (invisible en clair, la bande contraste déjà).
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0b0d13] py-20 sm:py-24">
      <div
        className="dot-grid-inverse pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden
      />
      {/* Halo indigo — même langage que le halo de marque du héro. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 left-1/2 h-64 w-[42rem] max-w-none -translate-x-1/2 rounded-full bg-[rgb(79_70_229/0.3)] blur-3xl"
      />
      <Container className="relative">
        <p className="flex items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa0b3]">
          <span aria-hidden className="h-px w-6 bg-[#818cf8]/60" />
          Core en chiffres
          <span aria-hidden className="h-px w-6 bg-[#818cf8]/60" />
        </p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          {FIGURES.map((figure, i) => (
            <Reveal key={figure.label} delay={i * 100} className="lg:px-8">
              <div className="text-center">
                <Counter
                  value={figure.value}
                  suffix={figure.suffix}
                  className="font-display text-5xl font-bold tracking-tight text-[#edeef4] sm:text-6xl"
                  suffixClassName="text-[#818cf8]"
                />
                <p className="mt-3 text-sm text-[#9aa0b3]">{figure.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
