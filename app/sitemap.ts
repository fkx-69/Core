import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services-data";
import { RESOURCES } from "@/lib/resources-data";
import { canonicalUrl } from "@/lib/seo";

export const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/services",
  ...SERVICES.map((service) => `/services/${service.slug}`),
  "/portfolio",
  "/contact",
  "/a-propos",
  "/mentions-legales",
  "/ressources",
  ...RESOURCES.map((resource) => resource.path),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITEMAP_PATHS.map((pathname) => ({
    url: canonicalUrl(pathname),
  }));
}
