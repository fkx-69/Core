import SitePreview from "@/components/demos/sites/SitePreview";
import Site from "./Site";

/** Aperçu embarqué pour le portfolio. */
export default function EcrinPreview() {
  return (
    <SitePreview url="https://lecrin.ci" href="/demos/ecrin">
      <Site />
    </SitePreview>
  );
}
