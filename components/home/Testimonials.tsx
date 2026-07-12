import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

// Le résultat concret de chaque citation est graissé : en lecture rapide,
// la section devient une rangée de preuves.
const TESTIMONIALS: {
  initials: string;
  name: string;
  role: string;
  quote: React.ReactNode;
}[] = [
  {
    initials: "AN",
    name: "Awa Ndiaye",
    role: "Directrice — Téranga Bistro, Dakar",
    quote: (
      <>
        Le site a <strong className="font-semibold">doublé nos réservations
        en trois mois</strong>. Les clients commandent depuis Dakar comme
        depuis la diaspora, et l&apos;intégration Wave a tout changé pour les
        acomptes.
      </>
    ),
  },
  {
    initials: "CS",
    name: "Coumba Sène",
    role: "Gérante — Boutique Lumen, Dakar",
    quote: (
      <>
        Le dashboard <strong className="font-semibold">remplace trois cahiers
        et un tableur</strong>. Je vois le chiffre du mois en FCFA, les
        paiements à encaisser et les stocks — depuis mon téléphone.
      </>
    ),
  },
  {
    initials: "MD",
    name: "Mariama Diallo",
    role: "Fondatrice — Baobab Pay, Dakar",
    quote: (
      <>
        <strong className="font-semibold">Livrée en six semaines, jalons
        tenus, zéro jargon.</strong> L&apos;équipe comprend les réalités du
        mobile money mieux que certaines banques.
      </>
    ),
  },
];

/** Trois témoignages en colonnes éditoriales séparées par des filets —
 *  guillemet géant filaire, citation, signature sous un filet (pas de cartes,
 *  même langage calme que « Pourquoi Core »). */
export default function Testimonials() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ils ont lancé leur produit avec Core"
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 100} className="md:px-8">
              <figure className="flex h-full flex-col">
                <span
                  className="text-outline font-display text-7xl leading-none font-bold select-none"
                  aria-hidden
                >
                  “
                </span>
                <blockquote className="mt-3 mb-6 leading-relaxed text-foreground">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-line/80 pt-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
                    {testimonial.initials}
                  </span>
                  <span>
                    <span className="block font-semibold">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-muted">
                      {testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
