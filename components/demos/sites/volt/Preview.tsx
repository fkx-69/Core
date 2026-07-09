import SitePreview from "@/components/demos/sites/SitePreview";
import Site from "./Site";

/** Aperçu embarqué pour le portfolio. */
export default function VoltPreview() {
  return (
    <SitePreview url="https://drinkvolt.ci" href="/demos/volt">
      <Site />
    </SitePreview>
  );
}
