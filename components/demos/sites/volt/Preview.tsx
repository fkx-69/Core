import SitePreview from "@/components/demos/sites/SitePreview";
import Site from "./Site";

/** Aperçu embarqué pour le portfolio. */
export default function VoltPreview() {
  return (
    <SitePreview url="Démo conceptuelle" title="VOLT Energy" href="/demos/volt">
      <Site embedded />
    </SitePreview>
  );
}
