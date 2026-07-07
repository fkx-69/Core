import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/** Bannière pleine largeur indigo, empilée au centre (réf 5). */
export default function CtaSection() {
  return (
    <section className="relative bg-accent py-24 text-accent-contrast sm:py-28 overflow-hidden">
      <Image
        src="/assets/illustrations/home-cta.png"
        alt=""
        width={600}
        height={600}
        className="absolute -bottom-8 -right-12 -z-10 opacity-15 hidden sm:block h-auto w-96"
        aria-hidden
      />
      <Container className="text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
            Contact
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Un projet en tête ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-80">
            Parlons de votre produit, de vos délais et de votre budget. Nous
            vous répondons avec un premier avis technique et une estimation
            honnête.
          </p>
          <div className="mt-10">
            <Button href="/contact" variant="inverted" size="lg">
              Discutons-en
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-70">
            Réponse sous 24 h — sans engagement.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
