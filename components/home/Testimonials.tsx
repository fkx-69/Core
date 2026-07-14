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
    <section className="bg-background py-16 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ils ont lancé leur produit avec Core"
            align="center"
          />
        </Reveal>
        <div
          role="region"
          aria-label="Témoignages clients — faites glisser pour parcourir"
          className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-0 md:divide-x md:divide-line md:overflow-visible md:px-0 md:pb-0"
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 100} className="w-[82vw] max-w-sm shrink-0 snap-center md:w-auto md:max-w-none md:px-8">
              <figure className="flex h-full min-h-96 flex-col rounded-card border border-line bg-surface-raised p-6 shadow-card md:min-h-0 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
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
