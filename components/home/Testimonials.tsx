import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";

const TESTIMONIALS = [
  {
    initials: "AN",
    name: "Awa Ndiaye",
    role: "Directrice — Téranga Bistro, Dakar",
    quote:
      "Le site a doublé nos réservations en trois mois. Les clients commandent depuis Dakar comme depuis la diaspora, et l'intégration Wave a tout changé pour les acomptes.",
  },
  {
    initials: "YK",
    name: "Yao Koffi",
    role: "Gérant — Sandaga Market, Abidjan",
    quote:
      "Le dashboard remplace trois cahiers et un tableur. Je vois le chiffre du jour en FCFA, les retards et les stocks — depuis mon téléphone.",
  },
  {
    initials: "MD",
    name: "Mariama Diallo",
    role: "Fondatrice — Baobab Pay, Dakar",
    quote:
      "Livrée en six semaines, jalons tenus, zéro jargon. L'équipe comprend les réalités du mobile money mieux que certaines banques.",
  },
];

/** Trois témoignages clients, guillemet géant en filigrane sur chaque carte. */
export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ils ont lancé leur produit avec Core"
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 100} className="h-full">
              <Card className="flex h-full flex-col p-8">
                <span
                  className="text-outline font-display text-6xl leading-none font-bold select-none"
                  aria-hidden
                >
                  “
                </span>
                <p className="mt-4 leading-relaxed text-foreground">
                  {testimonial.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
