import Link from "next/link";
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

const RESOURCE = getResourceBySlug("digitaliser-excel-whatsapp")!;

export const metadata = buildPageMetadata({
  title: RESOURCE.title,
  description: RESOURCE.description,
  pathname: RESOURCE.path,
});

export default function DigitalizeGuidePage() {
  return (
    <>
      <JsonLd data={getArticleStructuredData(RESOURCE)} />
      <ResourceArticle resource={RESOURCE}>
        <ResourceSection
          id="diagnostic-flux"
          eyebrow="Diagnostic"
          title="Raconter le flux avant de choisir l'outil"
        >
          <p>
            Commencez par un cas récent et suivez-le du déclencheur à la
            clôture : qui reçoit la demande, où elle est notée, qui agit, qui
            valide et comment les autres personnes savent qu&apos;elle a changé.
            Notez les fichiers Excel, messages WhatsApp, cahiers, appels ou
            exports réellement utilisés, sans supposer qu&apos;un seul outil les
            remplacera.
          </p>
          <p>
            Cherchez les moments où l&apos;équipe ressaisit une donnée, attend une
            confirmation, perd une version ou ne sait plus qui doit agir. Ce
            diagnostic décrit le travail réel et donne une base plus sûre
            qu&apos;une liste de fonctionnalités souhaitées.
          </p>
        </ResourceSection>

        <ResourceSection
          id="prioriser-flux"
          eyebrow="Priorisation"
          title="Choisir un premier flux délimité"
        >
          <p>
            Un bon premier flux est assez fréquent pour être observé, assez
            limité pour être testé et assez important pour que l&apos;équipe accepte
            de le documenter. Il peut s&apos;agir d&apos;une demande entrante, d&apos;un suivi
            de commande, d&apos;une validation ou d&apos;une transmission d&apos;information.
          </p>
          <ul className="list-disc space-y-2 pl-5 marker:text-accent">
            <li>Définissez le début et la fin du flux, même s&apos;ils sont imparfaits.</li>
            <li>Listez les personnes qui saisissent, consultent, modifient et valident.</li>
            <li>Retenez les données nécessaires à l&apos;action, pas tous les champs imaginables.</li>
            <li>Écrivez deux ou trois exceptions qui doivent être gérées dès le départ.</li>
            <li>Décidez comment vérifier que le parcours est compréhensible sur le terrain.</li>
          </ul>
        </ResourceSection>

        <ResourceSection
          id="roles-donnees"
          eyebrow="Modèle métier"
          title="Rôles, données et états à clarifier"
        >
          <p>
            Pour chaque étape, précisez la donnée entrée, son responsable et
            l&apos;état qui permet de savoir quoi faire ensuite. Une fiche peut par
            exemple contenir une référence, un demandeur, une date, une
            priorité, un responsable et une décision, mais ces champs doivent
            venir du travail observé.
          </p>
          <p>
            Distinguez ce qui doit être visible par tous, réservé à un rôle ou
            modifiable seulement avant validation. Les droits d&apos;accès, la
            conservation et la correction des erreurs ne devraient pas être
            ajoutés après coup.
          </p>
        </ResourceSection>

        <ResourceCallout title="Exemple prudent, pas une promesse de résultat">
          <p>
            Imaginons une équipe qui reçoit des demandes dans WhatsApp, recopie
            certaines informations dans Excel puis confirme l&apos;avancement par
            message. Un premier périmètre pourrait consister à saisir une
            demande structurée, attribuer un responsable et afficher un état
            partagé. Il faudrait encore vérifier les appareils, la connexion,
            les règles de confidentialité et la capacité de l&apos;équipe à adopter
            ce parcours avant de choisir une application.
          </p>
        </ResourceCallout>

        <ResourceSection
          id="integrations-connexion"
          eyebrow="Contexte technique"
          title="Intégrations et connexion : vérifier avant de promettre"
        >
          <p>
            Relevez les formats d&apos;import et d&apos;export, les API disponibles, les
            comptes à connecter et la fréquence de synchronisation attendue.
            Un outil peut commencer sans intégration automatique si une saisie
            contrôlée est plus réaliste pour le premier flux.
          </p>
          <p>
            La connexion disponible dans les lieux de travail, les appareils
            utilisés et les moments hors ligne influencent les écrans, les
            validations et la stratégie de synchronisation. Ces questions sont
            à observer, pas à déduire d&apos;un environnement idéal.
          </p>
        </ResourceSection>

        <ResourceSection
          id="securite-adoption"
          eyebrow="Durabilité"
          title="Sécurité et adoption font partie du périmètre"
        >
          <ul className="space-y-4">
            <li>
              <strong className="font-semibold text-foreground">Sécurité :</strong>{" "}
              identifiez les données sensibles, les profils, les appareils
              autorisés, les sauvegardes et les traces nécessaires. La solution
              retenue dépendra des contraintes réellement confirmées.
            </li>
            <li>
              <strong className="font-semibold text-foreground">Adoption :</strong>{" "}
              prévoyez un vocabulaire partagé, un parcours court, des exemples
              réels, une phase de test et un retour vers l&apos;ancien flux si une
              étape bloque. Former les personnes concernées ne se résume pas à
              remettre un lien.
            </li>
            <li>
              <strong className="font-semibold text-foreground">Données :</strong>{" "}
              décidez ce qui est repris, nettoyé, archivé ou laissé de côté.
              Une migration automatique ne devrait être promise qu&apos;après examen
              des fichiers et des règles de qualité.
            </li>
          </ul>
        </ResourceSection>

        <ResourceSection
          id="liens-digitalisation"
          eyebrow="Pour continuer"
          title="Relier le diagnostic au bon service"
        >
          <p>
            Pour cadrer ce type de flux, consultez la page de{" "}
            <Link
              href="/services/digitalisation-processus-entreprise-mali"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              digitalisation des processus d&apos;entreprise au Mali
            </Link>
            . Si le premier périmètre devient une interface de suivi, la page
            d&apos;{" "}
            <Link
              href="/services/developpement-application-web-mali"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              application web
            </Link>{" "}
            aide à préciser les écrans et les rôles. Pour une connexion entre
            systèmes, voyez aussi le{" "}
            <Link
              href="/services/logiciel-sur-mesure-mali"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              logiciel sur mesure
            </Link>
            .
          </p>
          <p>
            Le{" "}
            <Link
              href="/ressources/generateur-cahier-des-charges"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              générateur local
            </Link>{" "}
            peut enfin organiser les rôles, le premier flux et les contraintes
            dans un texte à relire avec l&apos;équipe.
          </p>
        </ResourceSection>
      </ResourceArticle>
    </>
  );
}
