import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialIcon from "@/components/ui/SocialIcon";
import ContactForm from "@/components/contact/ContactForm";
import IntroIllustration from "@/components/ui/IntroIllustration";
import Faq, { type FaqItem } from "@/components/ui/Faq";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'agence Core pour votre projet de site web, d'application web ou mobile, ou de logiciel sur mesure.",
};

const WHATSAPP_HREF = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, "")}`;

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quels sont vos tarifs ?",
    answer:
      "Un site vitrine démarre à 1 500 000 FCFA, une application web à 4 000 000 FCFA. Chaque projet reçoit un devis détaillé, poste par poste, sous 48 h — sans engagement.",
  },
  {
    question: "Peut-on payer par Wave ou Orange Money ?",
    answer:
      "Oui. Nous acceptons Wave, Orange Money, MTN MoMo et le virement bancaire, avec un échéancier par jalons : vous ne payez que ce qui est livré.",
  },
  {
    question: "Travaillez-vous à distance ?",
    answer:
      "Notre équipe est répartie entre Dakar et Abidjan. Nous travaillons en visio avec des points réguliers (fuseau GMT) et nous nous déplaçons pour les ateliers de cadrage.",
  },
  {
    question: "Quels sont les délais typiques ?",
    answer:
      "Un site vitrine : 3 à 4 semaines. Une application web ou mobile : 6 à 12 semaines selon le périmètre. Vous testez un premier livrable dès les premières semaines.",
  },
  {
    question: "Assurez-vous la maintenance après livraison ?",
    answer:
      "Oui : hébergement, supervision, correctifs et évolutions via un contrat de maintenance simple. Et vous restez propriétaire de 100 % du code.",
  },
];

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center mb-14">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Parlez-nous de votre projet"
            intro="Décrivez-nous votre besoin : nous revenons vers vous sous 24 heures ouvrées avec un premier avis technique."
          />
          <IntroIllustration src="/assets/illustrations/contact-intro.png" alt="" width={1000} height={500} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
          <ContactForm />

          {/* Rail indigo doux continu (réf 8) */}
          <aside className="h-fit rounded-card bg-accent-soft/60 p-8 lg:sticky lg:top-24">
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/illustrations/contact-sidebar.png"
                alt=""
                width={200}
                height={200}
                className="h-auto w-full max-w-sm"
                aria-hidden
              />
            </div>
            <h2 className="font-display text-lg font-semibold">
              Nos coordonnées
            </h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-muted transition hover:text-accent"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="text-muted transition hover:text-accent"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-accent"
                >
                  WhatsApp — {CONTACT_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <span className="text-muted">{CONTACT_INFO.address}</span>
              </li>
            </ul>

            <h2 className="mt-10 font-display text-lg font-semibold">
              Horaires
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Lundi – vendredi, 8 h – 18 h (GMT). En dehors de ces horaires,
              laissez-nous un message : nous vous rappelons.
            </p>

            <h2 className="mt-10 font-display text-lg font-semibold">
              Suivez-nous
            </h2>
            <ul className="mt-4 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 text-accent transition hover:border-accent hover:bg-accent hover:text-accent-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <SocialIcon name={social.name} />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-20 sm:mt-24">
          <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
          <div className="mt-10 max-w-3xl">
            <Faq items={FAQ_ITEMS} />
          </div>
        </div>
      </Container>
    </div>
  );
}
