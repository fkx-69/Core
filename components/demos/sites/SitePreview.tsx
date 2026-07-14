import Link from "next/link";
import { ExternalLink } from "lucide-react";
import BrowserFrame from "@/components/demos/mockups/BrowserFrame";

/**
 * Aperçu embarqué d'un site de démonstration : le vrai site (composant
 * partagé avec la page /demos/*) défile dans un mockup navigateur à hauteur
 * fixe. Le conteneur est un `@container` : le site, écrit en container
 * queries, y adopte de lui-même sa mise en page compacte.
 */
export default function SitePreview({
  url,
  href,
  linkLabel = "Visiter le site en entier",
  children,
}: {
  /** Fausse URL affichée dans la barre du navigateur. */
  url: string;
  /** Route réelle de la page démo (/demos/…), ouverte dans un nouvel onglet. */
  href: string;
  /** Libellé adapté au type de produit présenté. */
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <BrowserFrame url={url}>
        <div className="@container scrollbar-none h-[clamp(420px,65dvh,520px)] overflow-y-auto overscroll-y-auto md:h-[560px] md:overscroll-contain">
          {children}
        </div>
      </BrowserFrame>
      <div className="mt-3 flex justify-end">
        <Link
          href={href}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface-raised px-4 py-2 text-xs font-medium text-muted shadow-card transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:min-h-0 md:px-3 md:py-1.5"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
