import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialIcon from "@/components/ui/SocialIcon";
import ContactForm from "@/components/contact/ContactForm";
import IntroIllustration from "@/components/ui/IntroIllustration";
import contactIntroIllustration from "@/public/assets/illustrations/contact-intro.png";
import contactSidebarIllustration from "@/public/assets/illustrations/contact-sidebar.png";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'agence Core pour votre projet de site web, d'application web ou mobile, ou de logiciel sur mesure.",
};

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
          <IntroIllustration src={contactIntroIllustration} alt="" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
          <ContactForm />

          {/* Rail indigo doux continu (réf 8) */}
          <aside className="h-fit rounded-card bg-accent-soft/60 p-8 lg:sticky lg:top-24">
            {contactSidebarIllustration && (
              <div className="mb-6 flex justify-center">
                <Image
                  src={contactSidebarIllustration}
                  alt=""
                  className="h-auto w-full max-w-xs"
                  aria-hidden
                />
              </div>
            )}
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
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <span className="text-muted">{CONTACT_INFO.address}</span>
              </li>
            </ul>

            <h2 className="mt-10 font-display text-lg font-semibold">
              Horaires
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Du lundi au vendredi, de 9 h à 18 h. En dehors de ces horaires,
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
      </Container>
    </div>
  );
}
