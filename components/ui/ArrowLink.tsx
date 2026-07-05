import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Lien secondaire de la famille de CTA : texte souligné + flèche. */
export default function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent ${className}`}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
