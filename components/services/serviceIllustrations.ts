import type { StaticImageData } from "next/image";
import { SERVICE_ANCHORS } from "@/lib/site";
import sitesWeb from "@/public/assets/illustrations/services-sites-web.png";
import applicationsWeb from "@/public/assets/illustrations/services-applications-web.png";
import applicationsMobiles from "@/public/assets/illustrations/services-applications-mobiles.png";
import softwareSurMesure from "@/public/assets/illustrations/services-software-sur-mesure.png";

export const SERVICE_ILLUSTRATIONS: Record<string, StaticImageData> = {
  [SERVICE_ANCHORS.sitesWeb]: sitesWeb,
  [SERVICE_ANCHORS.applicationsWeb]: applicationsWeb,
  [SERVICE_ANCHORS.applicationsMobiles]: applicationsMobiles,
  [SERVICE_ANCHORS.softwareSurMesure]: softwareSurMesure,
};
