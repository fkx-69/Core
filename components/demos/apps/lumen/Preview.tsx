import SitePreview from "@/components/demos/sites/SitePreview";
import LumenApp from "./App";

export default function LumenPreview() {
  return (
    <SitePreview url="https://app.boutiquelumen.sn" href="/demos/lumen" linkLabel="Ouvrir l’application en entier">
      <LumenApp embedded />
    </SitePreview>
  );
}
