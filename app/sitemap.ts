import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services-data";
import { canonicalUrl } from "@/lib/seo";

export const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/services",
  ...SERVICES.map((service) => `/services/${service.slug}`),
  "/portfolio",
  "/contact",
  "/mentions-legales",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITEMAP_PATHS.map((pathname) => ({
    url: canonicalUrl(pathname),
  }));
}
