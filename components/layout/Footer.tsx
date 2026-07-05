import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight">
              Core<span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Agence de développement logiciel. Sites web, applications web et
              mobiles, software sur mesure — conçus pour durer.
            </p>
          </div>

          <nav aria-label="Nos services">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted">
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
            <p className="text-sm font-semibold uppercase tracking-widest text-muted">
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
        </div>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Core. Tous droits réservés.
        </p>
      </Container>
    </footer>
  );
}
