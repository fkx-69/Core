import Link from "next/link";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/seo/JsonLd";
import ResourceArticle from "@/components/resources/ResourceArticle";
import {
  ResourceCallout,
  ResourceSection,
} from "@/components/resources/ResourceArticle";
import { getResourceBySlug } from "@/lib/resources-data";
import {
  buildPageMetadata,
  getArticleStructuredData,
} from "@/lib/seo";

const RESOURCE = getResourceBySlug("prix-creation-site-web-mali")!;

export const metadata = buildPageMetadata({
  title: RESOURCE.title,
  description: RESOURCE.description,
  pathname: RESOURCE.path,
});

export default function SitePriceGuidePage() {
  return (
    <>
      <JsonLd data={getArticleStructuredData(RESOURCE)} />
      <ResourceArticle resource={RESOURCE}>
        <ResourceSection
          id="prix-perimetre"
          eyebrow="Le point de départ"
          title="Le prix dépend d'abord du périmètre"
        >
          <p>
            Demander « combien coûte un site web ? » sans décrire son rôle
            produit une comparaison fragile. Une vitrine éditoriale, un site
            institutionnel, un catalogue avec demande de devis et une boutique
            avec commande ne mobilisent pas les mêmes contenus, parcours ou
            opérations.
          </p>
          <p>
            Un devis utile explique donc ce qui est inclus, ce qui reste à
            fournir, les hypothèses prises et les éléments qui devront être
            confirmés. Il ne suffit pas de comparer un nombre de pages ou une
            liste de technologies.
          </p>
        </ResourceSection>

        <ResourceSection
          id="prix-facteurs"
          eyebrow="À examiner"
          title="Les facteurs qui font varier un devis"
        >
          <ul className="space-y-4">
            <li>
              <strong className="font-semibold text-foreground">
                Objectif et parcours :
              </strong>{" "}
              une présentation simple, une prise de contact, une demande de
              devis, une réservation ou un achat nécessitent des niveaux de
              conception et de vérification différents.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Contenus et direction visuelle :
              </strong>{" "}
              textes, photos, identité, traductions et validation éditoriale
              peuvent être disponibles, à produire ou à organiser.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Fonctions et données :
              </strong>{" "}
              recherche, filtres, formulaires, espace privé, catalogue,
              comptes ou reprise d&apos;un existant ajoutent des règles à définir.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Intégrations :
              </strong>{" "}
              paiement, livraison, stock, agenda, CRM ou API ne devraient pas
              être supposés. Leurs accès, formats, responsabilités et cas
              d&apos;erreur doivent être vérifiés avant de les inclure.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Qualité et exploitation :
              </strong>{" "}
              responsive, accessibilité, performance, sécurité, mise en ligne,
              documentation, maintenance et évolution font partie des
              questions à poser, même lorsqu&apos;elles sont traitées séparément.
            </li>
          </ul>
        </ResourceSection>

        <ResourceCallout title="Ce que ce guide ne fait pas">
          <p>
            Il ne donne pas de tarif Core ni de moyenne de marché : aucune
            donnée vérifiée ne permettrait de les présenter ici honnêtement.
            Son rôle est de rendre la demande comparable et la discussion plus
            concrète.
          </p>
        </ResourceCallout>

        <ResourceSection
          id="prix-preparer"
          eyebrow="Avant de demander un devis"
          title="Préparer un brief court mais exploitable"
        >
          <p>Réunissez, même sous forme de brouillon :</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-accent">
            <li>l&apos;activité et l&apos;objectif prioritaire du site ;</li>
            <li>les publics et les actions qu&apos;ils doivent accomplir ;</li>
            <li>les pages, contenus et éléments de marque déjà disponibles ;</li>
            <li>les outils, données ou systèmes à conserver ou à connecter ;</li>
            <li>les contraintes de validation, de sécurité et de maintenance ;</li>
            <li>ce qui est indispensable au premier lancement et ce qui peut attendre.</li>
          </ul>
          <p>
            Le{" "}
            <Link
              href="/ressources/generateur-cahier-des-charges"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              générateur de cahier des charges
            </Link>{" "}
            transforme ces réponses en base de discussion. Il ne remplace ni
            la validation du besoin ni le devis détaillé.
          </p>
        </ResourceSection>

        <ResourceSection
          id="prix-comparer"
          eyebrow="Comparer sans se perdre"
          title="Poser les mêmes questions à chaque proposition"
        >
          <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-accent">
            <li>
              Le périmètre décrit-il les pages, rôles, parcours et intégrations
              ou seulement une promesse générale ?
            </li>
            <li>
              Les contenus, comptes, hébergement, nom de domaine, mise en ligne
              et maintenance sont-ils inclus, exclus ou à fournir ?
            </li>
            <li>
              Les critères de validation, les tests et les limites connues sont-ils
              écrits ?
            </li>
            <li>
              Qui reste propriétaire des contenus, du code, des comptes et des
              données après la livraison ?
            </li>
            <li>
              Quelles évolutions sont envisagées, et à quelles conditions
              seraient-elles estimées plus tard ?
            </li>
          </ol>
          <p>
            Une proposition plus courte peut être cohérente si ses hypothèses
            sont explicites. À l&apos;inverse, une offre très détaillée ne garantit
            pas à elle seule un bon ajustement : comparez les décisions et les
            responsabilités, pas uniquement la longueur du document.
          </p>
        </ResourceSection>

        <ResourceSection id="prix-liens" eyebrow="Pour continuer" title="Choisir le bon point d'entrée">
          <p>
            Pour une présence en ligne, consultez la page de{" "}
            <Link
              href="/services/creation-site-web-bamako"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              création de site web à Bamako
            </Link>
            . Si le parcours inclut un catalogue et une commande, voyez aussi
            la page de{" "}
            <Link
              href="/services/creation-site-ecommerce-mali"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              création e-commerce au Mali
            </Link>
            . Pour cadrer un échange, vous pouvez enfin passer par le{" "}
            <Link
              href="/contact"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              formulaire de contact de démonstration
            </Link>
            , en gardant à l&apos;esprit qu&apos;il ne transmet aucune saisie.
          </p>
        </ResourceSection>
      </ResourceArticle>
      <Container className="pb-14 sm:pb-24">
        <p className="mx-auto max-w-3xl border-t border-line pt-6 text-sm text-muted">
          Besoin d&apos;un support pour structurer vos réponses ? Le cahier des
          charges local peut être téléchargé en texte brut puis complété avec
          votre équipe.
        </p>
      </Container>
    </>
  );
}
