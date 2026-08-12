import type { Metadata } from "next";
import { COMPANY_LOCATION } from "@/lib/site";

export const DEFAULT_SITE_URL = "https://mycore.work";

const LOCAL_DEVELOPMENT_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
]);

/**
 * Resolve the canonical public origin once, without allowing credentials,
 * query strings, fragments, or a path to silently change canonical URLs.
 *
 * NEXT_PUBLIC_SITE_URL is intentionally an origin-only override: the default
 * remains the production site when the variable is missing or malformed.
 */
export function resolveSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL): URL {
  const candidate = value?.trim();
  if (!candidate) return new URL(DEFAULT_SITE_URL);

  try {
    const url = new URL(candidate);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.pathname !== "" && url.pathname !== "/")
    ) {
      return new URL(DEFAULT_SITE_URL);
    }

    return new URL(url.origin);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export const SITE_URL = resolveSiteUrl();

export const siteConfig = {
  name: "Core",
  title: "Agence de développement logiciel à Bamako | Core",
  description:
    "Core conçoit des sites web, applications web, applications mobiles et logiciels métier sur mesure au Mali depuis Bamako.",
  location: COMPANY_LOCATION,
  url: SITE_URL,
} as const;

export type PageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  /** Keep the home title from inheriting the root title template. */
  titleAbsolute?: boolean;
};

/**
 * Build complete metadata for one public page so child segments do not inherit
 * the home page's social title, description, or URL by accident.
 */
export function buildPageMetadata({
  title,
  description,
  pathname,
  titleAbsolute = false,
}: PageMetadataInput): Metadata {
  const url = canonicalUrl(pathname);
  const imageUrl = canonicalUrl("/opengraph-image");
  const imageAlt = `${title} — ${siteConfig.name}`;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/** Return an absolute URL on the configured canonical origin. */
export function canonicalUrl(pathname = "/"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, siteConfig.url).toString();
}

export function isLocalDevelopmentHostname(hostname: string): boolean {
  return LOCAL_DEVELOPMENT_HOSTNAMES.has(hostname.toLowerCase());
}

/**
 * Preview and other public aliases must not compete with the canonical site.
 * Local development is deliberately exempt so localhost remains convenient.
 */
export function shouldNoIndexHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return (
    normalized.length > 0 &&
    !isLocalDevelopmentHostname(normalized) &&
    normalized !== siteConfig.url.hostname.toLowerCase()
  );
}

/** Escape markup-significant characters before embedding JSON-LD in HTML. */
export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? "").replace(/</g, "\\u003c");
}

export function getHomeStructuredData() {
  const homeUrl = canonicalUrl("/");
  const organizationId = `${homeUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        url: homeUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: homeUrl,
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bamako",
          addressCountry: "Mali",
        },
      },
    ],
  };
}

type StructuredService = {
  slug: string;
  title: string;
  h1: string;
  seoDescription: string;
};

export type StructuredDataGraph = {
  "@context": "https://schema.org";
  "@graph": Array<Record<string, unknown>>;
};

export type StructuredResource = {
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
};

export function getServiceStructuredData(service: StructuredService) {
  const serviceUrl = canonicalUrl(`/services/${service.slug}`);
  const homeUrl = canonicalUrl("/");
  const servicesUrl = canonicalUrl("/services");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${serviceUrl}#service`,
        name: service.h1,
        serviceType: service.title,
        description: service.seoDescription,
        url: serviceUrl,
        provider: { "@id": `${homeUrl}#organization` },
        areaServed: {
          "@type": "Country",
          name: "Mali",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${serviceUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: servicesUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.h1,
            item: serviceUrl,
          },
        ],
      },
    ],
  };
}

function getResourceBreadcrumbs(resource: StructuredResource) {
  const resourceUrl = canonicalUrl(resource.path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${resourceUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: canonicalUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ressources",
        item: canonicalUrl("/ressources"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: resource.title,
        item: resourceUrl,
      },
    ],
  };
}

/** Structured data for a durable editorial guide, without invented authors. */
export function getArticleStructuredData(
  resource: StructuredResource,
): StructuredDataGraph {
  const resourceUrl = canonicalUrl(resource.path);
  const homeUrl = canonicalUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${resourceUrl}#article`,
        headline: resource.title,
        description: resource.description,
        url: resourceUrl,
        mainEntityOfPage: resourceUrl,
        datePublished: resource.publishedAt,
        dateModified: resource.updatedAt,
        inLanguage: "fr-FR",
        author: { "@id": `${homeUrl}#organization` },
        publisher: { "@id": `${homeUrl}#organization` },
        image: canonicalUrl("/opengraph-image"),
      },
      getResourceBreadcrumbs(resource),
    ],
  };
}

/** Structured data for the local, browser-only project brief generator. */
export function getWebApplicationStructuredData(
  resource: StructuredResource,
): StructuredDataGraph {
  const resourceUrl = canonicalUrl(resource.path);
  const homeUrl = canonicalUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${resourceUrl}#application`,
        name: resource.title,
        description: resource.description,
        url: resourceUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        inLanguage: "fr-FR",
        isAccessibleForFree: true,
        provider: { "@id": `${homeUrl}#organization` },
      },
      getResourceBreadcrumbs(resource),
    ],
  };
}
