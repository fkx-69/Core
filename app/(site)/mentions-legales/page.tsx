import type { Metadata } from "next";
import { CONTACT_INFO } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site de l'agence Core.",
};

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
              Core SARL (société fictive) — présentée à titre de
              démonstration.
              <br />
              RCCM SN-DKR-2026-B-000 (fictif) · NINEA 004587923 (fictif)
              <br />
              {CONTACT_INFO.address}
              <br />
              {CONTACT_INFO.email} · {CONTACT_INFO.phone}
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Hébergement
            </h2>
            <p>
              Zone Cloud, Dakar (hébergeur fictif). Ce site est un exemple :
              aucune donnée n&apos;est réellement collectée ni hébergée.
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
              traitements réalisés, conformément au RGPD et à la loi
              sénégalaise n° 2008-12 sur la protection des données
              personnelles.
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
