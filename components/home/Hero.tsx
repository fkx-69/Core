import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Halo décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />
      <Container className="relative py-24 text-center sm:py-32">
        <p className="mb-6 inline-flex items-center rounded-full border border-line bg-surface-raised px-4 py-1.5 text-sm text-muted">
          Agence de développement logiciel
        </p>
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
          Core<span className="text-accent">.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Le logiciel sur mesure qui fait avancer votre métier.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Sites web, applications web et mobiles, API et intégrations : nous
          concevons, développons et maintenons des produits numériques fiables,
          rapides et élégants — pensés pour vos utilisateurs.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/services" size="lg">
            Découvrir nos services
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Nous contacter
          </Button>
        </div>
      </Container>
    </section>
  );
}
