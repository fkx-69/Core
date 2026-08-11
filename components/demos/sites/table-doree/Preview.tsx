import SitePreview from "@/components/demos/sites/SitePreview";
import Site from "./Site";

/** Aperçu embarqué pour le portfolio. */
export default function TableDoreePreview() {
  return (
    <SitePreview url="Démo conceptuelle" title="La Table Dorée" href="/demos/table-doree">
      <Site embedded imageSizes="(min-width: 1024px) 55vw, 100vw" />
    </SitePreview>
  );
}
