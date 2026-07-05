import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <p className="font-display text-8xl font-bold sm:text-9xl">
          <span className="text-outline">404</span>
          <span className="text-accent">.</span>
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
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
