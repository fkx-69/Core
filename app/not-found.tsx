import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Rendu dans le layout racine (sans chrome) : le header/footer Core sont
// remontés ici pour que le 404 reste habillé quelle que soit l'URL manquée.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}

function NotFoundContent() {
  return (
    <div className="relative flex flex-1 items-center overflow-hidden py-24">
      <div
        aria-hidden
        className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <Container className="text-center">
        <div className="relative mx-auto w-full max-w-md">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 hidden select-none items-center justify-center font-display text-[14rem] font-bold leading-none text-outline-number sm:flex"
          >
            404
          </span>
          <Image
            src="/assets/illustrations/notfound.webp"
            alt=""
            width={1200}
            height={800}
            loading="eager"
            className="mx-auto h-auto w-full max-w-md dark:brightness-200"
            aria-hidden
          />
        </div>
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight">
          Page introuvable
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <Button href="/">Retour à l&apos;accueil</Button>
          <ArrowLink href="/portfolio">Voir nos démos</ArrowLink>
        </div>
      </Container>
    </div>
  );
}
