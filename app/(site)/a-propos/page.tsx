import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBanner from "@/components/shared/CtaBanner";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "À propos de Core",
  description:
    "Le périmètre de Core, son approche de développement logiciel à Bamako et la distinction entre démos conceptuelles et projets livrés.",
  pathname: "/a-propos",
});

const PRINCIPLES = [
  {
    title: "Partir du besoin réel",
    text: "Un produit commence par ses utilisateurs, ses données et le flux à rendre plus clair. Le périmètre est précisé avant de multiplier les écrans ou les intégrations.",
  },
  {
    title: "Rendre les décisions visibles",
    text: "Les prototypes, états d'erreur, rôles et contraintes servent à vérifier les choix avec les personnes concernées, plutôt qu'à promettre un résultat abstrait.",
  },
  {
    title: "Construire une base maintenable",
    text: "Le code, les contenus et les prochaines évolutions sont pris en compte dans le cadrage. Les options techniques restent liées au contexte du projet.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="relative border-b border-line py-12 sm:py-20">
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow="À propos"
            title="Une approche claire du logiciel sur mesure"
            intro="Core est une agence de développement logiciel basée à Bamako, au Mali. Le site présente un périmètre de travail et des exemples d'interfaces conceptuelles, sans les présenter comme des réalisations livrées."
          />
        </Container>
      </div>

      <section className="py-14 sm:py-24" aria-labelledby="scope-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Périmètre
              </p>
              <h2
                id="scope-title"
                className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Ce que Core peut étudier
              </h2>
            </div>
            <div className="space-y-5 leading-relaxed text-muted">
              <p>
                Les services couvrent les sites web, les applications web, les
                applications mobiles, le logiciel sur mesure, les parcours
                e-commerce et la digitalisation progressive de processus.
              </p>
              <p>
                Chaque projet est à cadrer : utilisateurs, contenus, données,
                outils existants, contraintes de connexion, sécurité,
                intégrations et conditions de maintenance. Une page de service
                décrit des possibilités de travail, pas une promesse de
                périmètre automatique.
              </p>
              <p>
                Le formulaire de contact présent sur le site est une
                démonstration et ne transmet pas les informations saisies. Pour
                préparer un échange, le générateur de cahier des charges traite
                également les réponses localement dans le navigateur.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/services"
                  className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Explorer les services
                </Link>
                <Link
                  href="/ressources/generateur-cahier-des-charges"
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface-raised px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Préparer un besoin
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="border-y border-line bg-surface py-14 sm:py-24"
        aria-label="Approche"
      >
        <Container>
          <SectionHeading
            as="h2"
            eyebrow="Approche"
            title="Trois repères pour avancer"
            intro="Une collaboration utile commence par des questions concrètes et des décisions vérifiables."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <li
                key={principle.title}
                className="rounded-card border border-line bg-surface-raised p-6 shadow-card"
              >
                <span className="text-outline-number font-display text-4xl font-bold" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {principle.text}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 sm:py-24" aria-label="Transparence des démos">
        <Container className="max-w-4xl">
          <SectionHeading
            as="h2"
            eyebrow="Transparence"
            title="Les démos sont des concepts"
            intro="Les interfaces du portfolio sont des démonstrations conceptuelles destinées à montrer des parcours et une direction d'interface. Elles ne constituent pas des études de cas, des références client ou des résultats obtenus par Core."
          />
          <div className="mt-8 rounded-card border border-line bg-surface-raised p-6 text-sm leading-relaxed text-muted shadow-card sm:p-8">
            <p>
              Les noms, marques et scénarios utilisés dans certaines démos sont
              fictifs ou présentés à titre d&apos;exemple. Une proposition réelle
              doit être examinée à partir d&apos;un contexte, de contenus et de
              contraintes qui restent à fournir.
            </p>
            <p className="mt-4">
              Aucun chiffre, témoignage, client, certification ou ancienneté
              n&apos;est revendiqué ici.
            </p>
            <Link
              href="/portfolio"
              className="mt-6 inline-flex items-center font-medium text-accent underline decoration-accent/40 underline-offset-8 transition hover:decoration-accent"
            >
              Voir le portfolio conceptuel
            </Link>
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Un sujet à clarifier ?"
        text="Partagez le flux, le produit ou la question qui vous amène. Le premier échange sert à délimiter le besoin avant de choisir une solution."
      />
    </>
  );
}
