import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function CtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="rounded-2xl bg-accent px-6 py-14 text-center text-accent-contrast sm:px-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Un projet en tête ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed opacity-90">
              Parlons-en. Nous vous répondons sous 24 h avec un premier avis
              technique et une estimation honnête.
            </p>
            <div className="mt-8">
              <Button
                href="/contact"
                size="lg"
                className="!bg-accent-contrast !text-accent hover:opacity-90"
              >
                Nous contacter
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
