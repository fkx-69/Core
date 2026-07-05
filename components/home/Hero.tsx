import Image from "next/image";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import Container from "@/components/ui/Container";
import homeHeroIllustration from "@/public/assets/illustrations/home-hero.png";

/** Fausse fenêtre de code, détail décoratif du héro (réf 1). */
function CodeCard() {
  const lines = [
    { w: "w-40", accent: false },
    { w: "w-56", accent: false },
    { w: "w-48", accent: true },
    { w: "w-36", accent: false },
    { w: "w-52", accent: false },
    { w: "w-32", accent: false },
  ];
  return (
    <div
      aria-hidden
      className="w-88 rounded-card border border-line bg-surface-raised p-5 shadow-raised"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
        </div>
        <span className="font-mono text-xs text-muted">{"</>"}</span>
      </div>
      <ol className="mt-4 space-y-2.5">
        {lines.map((line, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-4 text-right font-mono text-[10px] text-muted/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`h-2 rounded-full ${line.w} ${
                line.accent ? "bg-accent" : "bg-line"
              }`}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Trame de points, fondue vers le bas */}
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      {/* Illustration constellation de fond */}
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 -z-10 hidden opacity-20 lg:block">
        <Image src={homeHeroIllustration} alt="" className="h-auto w-[34rem] max-w-none" />
      </div>
      <Container className="relative py-24 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            Le logiciel sur mesure
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Sites web, applications web et mobiles, software sur mesure : des
            produits numériques fiables, rapides et élégants — pensés pour
            votre métier.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Button href="/services" size="lg">
              Découvrir nos services
            </Button>
            <ArrowLink href="/contact">Nous contacter</ArrowLink>
          </div>
        </div>
        <div className="pointer-events-none absolute right-8 bottom-16 hidden xl:block">
          <CodeCard />
        </div>
      </Container>
    </section>
  );
}
