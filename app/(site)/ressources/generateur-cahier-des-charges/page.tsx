import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import BriefGenerator from "@/components/resources/BriefGenerator";
import ResourceArticle from "@/components/resources/ResourceArticle";
import {
  ResourceSection,
} from "@/components/resources/ResourceArticle";
import { getResourceBySlug } from "@/lib/resources-data";
import {
  buildPageMetadata,
  getWebApplicationStructuredData,
} from "@/lib/seo";

const RESOURCE = getResourceBySlug("generateur-cahier-des-charges")!;

export const metadata = buildPageMetadata({
  title: RESOURCE.title,
  description: RESOURCE.description,
  pathname: RESOURCE.path,
});

export default function BriefGeneratorPage() {
  return (
    <>
      <JsonLd data={getWebApplicationStructuredData(RESOURCE)} />
      <ResourceArticle resource={RESOURCE}>
        <ResourceSection
          id="outil-mode-emploi"
          eyebrow="Mode d'emploi"
          title="Une base de discussion en quelques réponses"
        >
          <p>
            Répondez aux questions sur l&apos;objectif, les utilisateurs, le premier
            flux, les outils existants et les contraintes à étudier. Le résultat
            est un texte structuré que vous pouvez relire, compléter et
            télécharger avant un échange.
          </p>
          <p>
            Les champs ne demandent pas de coordonnées et l&apos;outil n&apos;a pas de
            compte, d&apos;API ou de stockage. Il fonctionne localement dans le
            navigateur : aucune réponse n&apos;est transmise à Core par cette page.
          </p>
        </ResourceSection>

        <BriefGenerator />

        <ResourceSection
          id="outil-limites"
          eyebrow="À garder en tête"
          title="Ce document ne remplace pas le cadrage"
        >
          <p>
            Le générateur produit une première formulation, pas une estimation
            de charge, une spécification technique ou un engagement de livraison.
            Les rôles, données, intégrations, sécurité et critères de validation
            doivent encore être discutés avec les personnes concernées.
          </p>
          <p>
            Pour préparer un site, le guide sur le{" "}
            <Link
              href="/ressources/prix-creation-site-web-mali"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              prix et la comparaison des devis web
            </Link>{" "}
            aide à préciser le périmètre. Pour un flux dispersé entre fichiers
            et messages, consultez le guide{" "}
            <Link
              href="/ressources/digitaliser-excel-whatsapp"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              digitaliser Excel, WhatsApp ou papier
            </Link>
            .
          </p>
          <p>
            Vous pouvez ensuite consulter les pages de{" "}
            <Link
              href="/services"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              services
            </Link>{" "}
            ou le{" "}
            <Link
              href="/contact"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-8 hover:decoration-accent"
            >
              contact de démonstration
            </Link>
            .
          </p>
        </ResourceSection>
      </ResourceArticle>
    </>
  );
}
