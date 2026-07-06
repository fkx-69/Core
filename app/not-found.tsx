import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <Image
          src="/assets/illustrations/notfound.webp"
          alt=""
          width={1200}
          height={800}
          className="mx-auto h-auto w-full max-w-md dark:brightness-200"
          aria-hidden
        />
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight">
          Page introuvable
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8">
          <Button href="/">Retour à l&apos;accueil</Button>
        </div>
      </Container>
    </div>
  );
}
