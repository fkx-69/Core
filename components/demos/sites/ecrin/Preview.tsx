import SitePreview from "@/components/demos/sites/SitePreview";
import Site from "./Site";

/** Aperçu embarqué pour le portfolio. */
export default function EcrinPreview() {
  return (
    <SitePreview url="Démo conceptuelle" title="L'Écrin" href="/demos/ecrin">
      <Site embedded />
    </SitePreview>
  );
}
