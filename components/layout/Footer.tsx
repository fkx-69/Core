import Link from "next/link";
import { CONTACT_INFO, NAV_LINKS, SOCIAL_LINKS } from "@/lib/site";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import SocialIcon from "@/components/ui/SocialIcon";

const WHATSAPP_HREF = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, "")}`;

// Découpe "Immeuble Kébé, Avenue Cheikh Anta Diop, Dakar, Sénégal" en deux lignes lisibles.
const ADDRESS_PARTS = CONTACT_INFO.address.split(", ");
const ADDRESS_LINE_1 = ADDRESS_PARTS.slice(0, 2).join(", ");
const ADDRESS_LINE_2 = ADDRESS_PARTS.slice(2).join(", ");

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 hidden select-none font-display text-[8rem] font-bold leading-none text-outline opacity-60 lg:block"
      >
        Core.
      </span>
      <Container className="relative py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-bold tracking-tight">
              Core<span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Core conçoit des sites, applications web et mobiles pour les
              entreprises d&apos;Afrique de l&apos;Ouest — de Dakar à
              Abidjan.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
              Disponibles — Dakar · Abidjan · à distance
            </p>
          </div>

          <nav aria-label="Nos services">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Services
            </p>
            <ul className="mt-4 space-y-2">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="text-sm text-muted transition hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navigation du pied de page">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Navigation
            </p>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-muted transition hover:text-accent"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-muted transition hover:text-accent"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="text-muted transition hover:text-accent"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-accent"
                >
                  WhatsApp — {CONTACT_INFO.whatsapp}
                </a>
              </li>
              <li className="text-muted">
                {ADDRESS_LINE_1}
                <br />
                {ADDRESS_LINE_2}
              </li>
            </ul>
            <ul className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 text-accent transition hover:border-accent hover:bg-accent hover:text-accent-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <SocialIcon name={social.name} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Core. Tous droits réservés.
        </p>
      </Container>
    </footer>
  );
}
