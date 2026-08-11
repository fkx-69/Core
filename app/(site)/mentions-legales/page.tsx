import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site de l'agence Core.",
  pathname: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading as="h1" eyebrow="Informations" title="Mentions légales" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Éditeur du site
            </h2>
            <p>
              Les informations officielles concernant l&apos;entreprise Core
              seront complétées ici.
              <br />
              Localisation déclarée : Bamako, Mali.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Données personnelles
            </h2>
            <p>
              Le formulaire de contact de ce site est une démonstration : les
              informations saisies ne sont ni transmises ni conservées. Sur un
              site en production, cette section détaillerait vos droits et les
              traitements réalisés, conformément aux règles applicables.
            </p>
            <p className="mt-3">
              Une mesure d&apos;audience facultative est proposée avec votre
              consentement explicite. Elle conserve pendant 90 jours des
              événements limités et pseudonymisés, puis leurs statistiques,
              pour les visiteurs consentants : chemin de
              page, hôte référent externe, catégorie d&apos;appareil et, si la
              base GeoLite2 est configurée, code pays ISO. Les adresses IP,
              agents utilisateurs, paramètres de requête, fragments et données
              de formulaire ne sont jamais enregistrés. Le choix est conservé
              180 jours et peut être retiré via le lien de préférences du pied
              de page ; le retrait supprime l&apos;historique du visiteur courant.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus de ce site (textes, illustrations,
              code) est fourni à titre d&apos;exemple. Les marques et noms de
              produits cités appartiennent à leurs propriétaires respectifs.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
