import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/site";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/** Bannière indigo pleine largeur réutilisable (réf 5), enrichie : trame de
 *  points inversée, filigrane « Core. », CTA WhatsApp secondaire. */
export default function CtaBanner({
  eyebrow = "Contact",
  title,
  text,
  note = "Réponse sous 24 h — sans engagement.",
}: {
  eyebrow?: string;
  title: string;
  text: string;
  note?: string;
}) {
  const whatsappHref = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`;
  return (
    <section className="relative overflow-hidden bg-accent py-24 text-accent-contrast sm:py-28">
      <div
        className="dot-grid-inverse absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black_100%)]"
        aria-hidden
      />
      <Image
        src="/assets/illustrations/home-cta.png"
        alt=""
        width={600}
        height={600}
        className="absolute -bottom-8 -right-12 hidden h-auto w-96 opacity-25 sm:block"
        aria-hidden
      />
      <span
        className="text-outline-inverse pointer-events-none absolute -bottom-10 -left-4 hidden select-none font-display text-[10rem] font-bold leading-none lg:block"
        aria-hidden
      >
        Core.
      </span>
      <Container className="relative text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
            {eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-80">
            {text}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="inverted" size="lg">
              Discutons-en
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Écrivez-nous sur WhatsApp
            </a>
          </div>
          {/* Pastille qui répond à celle du héro — la page se referme comme
              elle s'est ouverte, sur la disponibilité. */}
          <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm">
            <span
              className="animate-pulse-dot h-2 w-2 rounded-full bg-[#4cd6a1]"
              aria-hidden
            />
            {note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
