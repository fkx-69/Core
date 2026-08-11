import SitePreview from "@/components/demos/sites/SitePreview";
import SandagaApp from "./App";

export default function SandagaPreview() {
  return (
    <SitePreview url="Démo conceptuelle" title="Pressing Sandaga" href="/demos/sandaga" linkLabel="Ouvrir l’application en entier">
      <SandagaApp embedded />
    </SitePreview>
  );
}
