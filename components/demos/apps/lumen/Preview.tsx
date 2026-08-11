import SitePreview from "@/components/demos/sites/SitePreview";
import LumenApp from "./App";

export default function LumenPreview() {
  return (
    <SitePreview url="Démo conceptuelle" title="Boutique Lumen" href="/demos/lumen" linkLabel="Ouvrir l’application en entier">
      <LumenApp embedded />
    </SitePreview>
  );
}
