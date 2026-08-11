import SitePreview from "@/components/demos/sites/SitePreview";
import Site from "./Site";

/** Aperçu embarqué pour le portfolio. */
export default function ElixirPreview() {
  return (
    <SitePreview url="Démo conceptuelle" title="Maison Élixir" href="/demos/elixir">
      <Site embedded />
    </SitePreview>
  );
}
