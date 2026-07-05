import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialIcon from "@/components/ui/SocialIcon";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'agence Core pour votre projet de site web, d'application web ou mobile, ou de logiciel sur mesure.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Parlons de votre projet"
          intro="Décrivez-nous votre besoin : nous revenons vers vous sous 24 heures ouvrées avec un premier avis technique."
          align="center"
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <ContactForm />

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-line bg-surface-raised p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold">
                Nos coordonnées
              </h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-muted transition hover:text-accent"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="text-muted transition hover:text-accent"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span className="text-muted">{CONTACT_INFO.address}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-surface-raised p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold">
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
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <SocialIcon name={social.name} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-accent-soft p-6">
              <h2 className="font-display text-lg font-semibold">
                Horaires
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Du lundi au vendredi, de 9 h à 18 h. En dehors de ces horaires,
                laissez-nous un message : nous vous rappelons.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
