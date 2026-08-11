import Image from "next/image";
import { MapPin } from "lucide-react";
import { COMPANY_LOCATION } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import IntroIllustration from "@/components/ui/IntroIllustration";
import Faq, { type FaqItem } from "@/components/ui/Faq";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contactez l'agence Core pour votre projet de site web, d'application web ou mobile, ou de logiciel sur mesure.",
  pathname: "/contact",
});

// Parcours indicatif après la prise de contact, sans engagement sur un délai.
const NEXT_STEPS = [
  {
    title: "Prise de connaissance",
    text: "Nous prenons connaissance de votre besoin et de son contexte.",
  },
  {
    title: "Échange de cadrage",
    text: "Un échange permet de préciser le périmètre et les priorités.",
  },
  {
    title: "Prochaines étapes",
    text: "Nous identifions ensemble une suite adaptée au projet.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment parler de votre projet ?",
    answer:
      "Le formulaire permet de partager le contexte, les objectifs et le type de produit envisagé.",
  },
  {
    question: "Le formulaire est-il connecté ?",
    answer:
      "Non. Il s'agit d'une démonstration : les informations saisies ne sont ni transmises ni conservées.",
  },
  {
    question: "Travaillez-vous à distance ?",
    answer:
      "Core est basée à Bamako, au Mali, et peut étudier des collaborations à distance selon le contexte.",
  },
  {
    question: "Quels types de projets accompagnez-vous ?",
    answer:
      "Des sites web, applications web, applications mobiles et logiciels sur mesure, selon les besoins exprimés.",
  },
  {
    question: "Assurez-vous la maintenance après livraison ?",
    answer:
      "Les modalités de suivi et de maintenance sont à définir selon le projet.",
  },
];

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="mb-10 grid gap-6 sm:mb-14 sm:gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Parlez-nous de votre projet"
            intro="Décrivez-nous votre besoin. Ce formulaire est une démonstration et ne transmet pas les informations saisies."
          />
          <IntroIllustration src="/assets/illustrations/contact-intro.png" alt="" width={1000} height={500} />
        </div>

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
          <div>
            <ContactForm />
            {/* « Et ensuite ? » : équilibre la colonne face au rail et ancre
                la promesse — nœuds numérotés et pointillés teal, écho de la
                timeline Méthode de la page Services. */}
            <div className="mt-10 sm:mt-14">
              <h2 className="font-display text-lg font-semibold">
                Et ensuite ?
              </h2>
              <ol className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-8">
                {NEXT_STEPS.map((step, i) => (
                  <li
                    key={step.title}
                    className="relative rounded-card border border-line bg-surface-raised p-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
                  >
                    {i < NEXT_STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute top-4 left-10 hidden w-[calc(100%-2.5rem)] border-t border-dashed border-teal/50 sm:block"
                      />
                    )}
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-background font-display text-sm font-semibold text-accent">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-display text-sm font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Rail indigo doux continu (réf 8) */}
          <aside className="h-fit rounded-card bg-accent-soft/60 p-6 sm:p-8 lg:sticky lg:top-24">
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/illustrations/contact-sidebar.png"
                alt=""
                width={200}
                height={200}
                className="h-auto w-full max-w-52 sm:max-w-sm"
                aria-hidden
              />
            </div>
            <h2 className="font-display text-lg font-semibold">Localisation</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <span className="text-muted">{COMPANY_LOCATION}</span>
              </li>
            </ul>

          </aside>
        </div>

        <div className="mt-16 sm:mt-24">
          <SectionHeading eyebrow="FAQ" title="Questions fréquentes" align="center" />
          <div className="mx-auto mt-10 max-w-3xl">
            <Faq items={FAQ_ITEMS} />
          </div>
        </div>
      </Container>
    </div>
  );
}
