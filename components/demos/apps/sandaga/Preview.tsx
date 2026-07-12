import SitePreview from "@/components/demos/sites/SitePreview";
import SandagaApp from "./App";

export default function SandagaPreview() {
  return (
    <SitePreview url="https://app.pressingsandaga.sn" href="/demos/sandaga" linkLabel="Ouvrir l’application en entier">
      <SandagaApp embedded />
    </SitePreview>
  );
}
