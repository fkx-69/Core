import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { COMPANY_LOCATION, NAV_LINKS } from "@/lib/site";
import { SERVICES } from "@/lib/services-data";
import Container from "@/components/ui/Container";
import AnalyticsPreferencesButton from "@/components/analytics/AnalyticsPreferencesButton";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 hidden select-none font-display text-[8rem] font-bold leading-none text-outline opacity-60 lg:block"
      >
        Core.
      </span>
      <Container className="relative py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-bold tracking-tight">
              Core<span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Core conçoit des sites, applications web et mobiles depuis
              Bamako, au Mali.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
              Basée à Bamako, Mali
            </p>
          </div>

          <nav aria-label="Nos services" className="hidden sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Services
            </p>
            <ul className="mt-4 space-y-2">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted transition hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navigation du pied de page" className="hidden sm:block">
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

          <div className="hidden sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Contact
            </p>
            <p className="mt-4 text-sm text-muted">{COMPANY_LOCATION}</p>
          </div>
        </div>

        {/* Sur smartphone, les trois longues colonnes deviennent des
            accordéons natifs : tous les liens restent présents et accessibles
            sans transformer le footer en second écran-fleuve. */}
        <div className="mt-8 divide-y divide-line border-y border-line sm:hidden">
          <details className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
              Services
              <ChevronDown className="h-4 w-4 text-accent transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <nav aria-label="Nos services sur mobile">
              <ul className="pb-3">
                {SERVICES.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex min-h-11 items-center text-sm text-muted transition hover:text-accent"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          <details className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
              Navigation
              <ChevronDown className="h-4 w-4 text-accent transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <nav aria-label="Navigation du pied de page sur mobile">
              <ul className="pb-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-11 items-center text-sm text-muted transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/mentions-legales"
                    className="flex min-h-11 items-center text-sm text-muted transition hover:text-accent"
                  >
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </nav>
          </details>

          <details className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
              Contact
              <ChevronDown className="h-4 w-4 text-accent transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="pb-5">
              <p className="pt-2 text-sm leading-relaxed text-muted">
                {COMPANY_LOCATION}
              </p>
            </div>
          </details>
        </div>

        <p className="mt-8 border-t border-line pt-6 text-sm text-muted sm:mt-12">
          © {new Date().getFullYear()} Core. Tous droits réservés.
        </p>
        <div className="mt-4">
          <AnalyticsPreferencesButton />
        </div>
      </Container>
    </footer>
  );
}
