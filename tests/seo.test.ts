import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import { NextRequest } from "next/server";

import {
  generateMetadata,
  generateStaticParams,
} from "@/app/(site)/services/[slug]/page";
import robots from "@/app/robots";
import sitemap, { PUBLIC_SITEMAP_PATHS } from "@/app/sitemap";
import { SERVICES } from "@/lib/services-data";
import {
  buildPageMetadata,
  canonicalUrl,
  getHomeStructuredData,
  getServiceStructuredData,
  resolveSiteUrl,
  siteConfig,
  serializeJsonLd,
} from "@/lib/seo";

async function loadProxyForTest(): Promise<
  (request: NextRequest) => Response
> {
  const loader = Module as typeof Module & {
    _load: (...args: unknown[]) => unknown;
  };
  const originalLoad = loader._load;
  loader._load = (...args: unknown[]) => {
    if (args[0] === "server-only") return {};
    return originalLoad(...args);
  };

  try {
    const imported = (await import("../proxy")) as unknown as {
      default?: { proxy: (request: NextRequest) => Response };
      proxy: (request: NextRequest) => Response;
    };
    return (imported.default ?? imported).proxy;
  } finally {
    loader._load = originalLoad;
  }
}

test("sitemap exposes exactly the canonical public pages", () => {
  const entries = sitemap();
  const expected = PUBLIC_SITEMAP_PATHS.map((pathname) => canonicalUrl(pathname));

  assert.deepEqual(entries.map((entry) => entry.url), expected);
  assert.equal(entries.length, 9);
  assert.ok(entries.every((entry) => !("lastModified" in entry)));
  assert.ok(
    entries.every(
      (entry) =>
        !/(\/admin|\/api|\/connexion|\/demos)(\/|$)/.test(entry.url),
    ),
  );
});

test("robots allows public crawling and points to the canonical sitemap", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
  const wildcard = rules.find((rule) => rule.userAgent === "*");

  assert.ok(wildcard);
  assert.equal(wildcard.allow, "/");
  assert.deepEqual(wildcard.disallow, ["/admin", "/api"]);
  assert.equal(result.sitemap, canonicalUrl("/sitemap.xml"));
});

test("service records have unique stable slugs and static params", () => {
  const slugs = SERVICES.map((service) => service.slug);
  assert.equal(new Set(slugs).size, SERVICES.length);
  assert.deepEqual(
    generateStaticParams(),
    slugs.map((slug) => ({ slug })),
  );
  assert.ok(slugs.includes("creation-site-web-bamako"));
  assert.ok(slugs.includes("developpement-application-web-mali"));
  assert.ok(slugs.includes("developpement-application-mobile-mali"));
  assert.ok(slugs.includes("logiciel-sur-mesure-mali"));
  assert.ok(
    SERVICES.every(
      (service) =>
        service.h1.length > 0 &&
        service.seoTitle.length > 0 &&
        service.seoDescription.length > 0 &&
        service.problems.length > 0 &&
        service.deliverables.length > 0 &&
        service.approach.length > 0 &&
        service.faq.length > 0,
    ),
  );
});

test("public page metadata has page-specific canonical, OpenGraph, and Twitter values", () => {
  const pages = [
    {
      pathname: "/",
      title: siteConfig.title,
      description: siteConfig.description,
      titleAbsolute: true,
    },
    {
      pathname: "/services",
      title: "Services",
      description:
        "Sites web, applications web, applications mobiles et software sur mesure : les services de l'agence Core à Bamako, au Mali.",
    },
    {
      pathname: "/portfolio",
      title: "Portfolio",
      description:
        "Découvrez huit démos interactives et conceptuelles de sites vitrines, applications web et applications mobiles, à tester directement dans votre navigateur.",
    },
    {
      pathname: "/contact",
      title: "Contact",
      description:
        "Contactez l'agence Core pour votre projet de site web, d'application web ou mobile, ou de logiciel sur mesure.",
    },
    {
      pathname: "/mentions-legales",
      title: "Mentions légales",
      description: "Mentions légales du site de l'agence Core.",
    },
    ...SERVICES.map((service) => ({
      pathname: `/services/${service.slug}`,
      title: service.seoTitle,
      description: service.seoDescription,
    })),
  ] as const;

  const metadata = pages.map((page) => buildPageMetadata(page));
  const openGraph = metadata.map((entry) =>
    entry.openGraph as {
      url?: string;
      title?: string;
      description?: string;
      images?: Array<{ url?: string }>;
    },
  );
  const twitter = metadata.map((entry) =>
    entry.twitter as {
      title?: string;
      description?: string;
      images?: string[];
    },
  );

  assert.deepEqual(
    metadata.map((entry) => entry.alternates?.canonical),
    pages.map((page) => canonicalUrl(page.pathname)),
  );
  assert.deepEqual(
    openGraph.map((entry) => entry.url),
    pages.map((page) => canonicalUrl(page.pathname)),
  );
  assert.deepEqual(
    openGraph.map((entry) => entry.title),
    pages.map((page) => page.title),
  );
  assert.deepEqual(
    openGraph.map((entry) => entry.description),
    pages.map((page) => page.description),
  );
  assert.deepEqual(
    twitter.map((entry) => entry.title),
    pages.map((page) => page.title),
  );
  assert.deepEqual(
    twitter.map((entry) => entry.description),
    pages.map((page) => page.description),
  );
  assert.ok(
    openGraph.every(
      (entry) => entry.images?.[0]?.url === canonicalUrl("/opengraph-image"),
    ),
  );
  assert.ok(
    twitter.every(
      (entry) => entry.images?.[0] === canonicalUrl("/opengraph-image"),
    ),
  );
  assert.equal(
    (metadata[0]?.title as { absolute?: string }).absolute,
    siteConfig.title,
  );
  assert.equal(
    new Set(metadata.map((entry) => entry.alternates?.canonical)).size,
    pages.length,
  );
  assert.equal(new Set(openGraph.map((entry) => entry.title)).size, pages.length);
  assert.equal(
    new Set(twitter.map((entry) => entry.description)).size,
    pages.length,
  );
});

test("service metadata is generated from each record and unknown slugs stay noindex", async () => {
  const metadata = await Promise.all(
    SERVICES.map((service) =>
      generateMetadata({ params: Promise.resolve({ slug: service.slug }) }),
    ),
  );

  assert.deepEqual(
    metadata.map((entry) => entry.alternates?.canonical),
    SERVICES.map((service) => canonicalUrl(`/services/${service.slug}`)),
  );
  assert.deepEqual(
    metadata.map((entry) => (entry.openGraph as { title?: string }).title),
    SERVICES.map((service) => service.seoTitle),
  );
  assert.deepEqual(
    metadata.map((entry) => (entry.twitter as { description?: string }).description),
    SERVICES.map((service) => service.seoDescription),
  );

  const missing = await generateMetadata({
    params: Promise.resolve({ slug: "unknown-service" }),
  });
  assert.deepEqual(missing.robots, { index: false, follow: false });
});

test("structured data contains only the declared website and service facts", () => {
  const home = getHomeStructuredData() as {
    "@graph": Array<{ "@type": string }>;
  };
  assert.deepEqual(
    home["@graph"].map((entry) => entry["@type"]),
    ["WebSite", "Organization"],
  );

  const service = getServiceStructuredData(SERVICES[0]) as {
    "@graph": Array<{ "@type": string; areaServed?: { name: string } }>;
  };
  assert.deepEqual(
    service["@graph"].map((entry) => entry["@type"]),
    ["Service", "BreadcrumbList"],
  );
  assert.equal(service["@graph"][0]?.areaServed?.name, "Mali");
  assert.match(
    serializeJsonLd({ unsafe: "</script><script>" }),
    /\\u003c\/script>/,
  );
});

test("site URL override accepts only an origin and otherwise uses production", () => {
  assert.equal(resolveSiteUrl("https://preview.example").toString(), "https://preview.example/");
  assert.equal(resolveSiteUrl("https://preview.example/path").toString(), "https://mycore.work/");
  assert.equal(resolveSiteUrl("not-a-url").toString(), "https://mycore.work/");
});

test("proxy marks noncanonical public hosts without affecting canonical or localhost", async () => {
  const previous = {
    previewEnabled: process.env.PREVIEW_AUTH_ENABLED,
    previewHash: process.env.PREVIEW_AUTH_PASSWORD_HASH,
    previewSecret: process.env.PREVIEW_AUTH_SECRET,
  };
  process.env.PREVIEW_AUTH_ENABLED = "false";
  delete process.env.PREVIEW_AUTH_PASSWORD_HASH;
  delete process.env.PREVIEW_AUTH_SECRET;

  try {
    const proxy = await loadProxyForTest();
    const preview = proxy(new NextRequest("https://test.mycore.work/services"));
    assert.equal(preview.status, 200);
    assert.equal(preview.headers.get("x-robots-tag"), "noindex, nofollow");
    const forwardedPreview = proxy(
      new NextRequest("http://127.0.0.1/services", {
        headers: { "x-forwarded-host": "test.mycore.work" },
      }),
    );
    assert.equal(forwardedPreview.headers.get("x-robots-tag"), "noindex, nofollow");

    const canonical = proxy(new NextRequest("https://mycore.work/services"));
    assert.equal(canonical.status, 200);
    assert.equal(canonical.headers.get("x-robots-tag"), null);

    const localhost = proxy(new NextRequest("http://localhost:3000/services"));
    assert.equal(localhost.status, 200);
    assert.equal(localhost.headers.get("x-robots-tag"), null);
  } finally {
    if (previous.previewEnabled === undefined) delete process.env.PREVIEW_AUTH_ENABLED;
    else process.env.PREVIEW_AUTH_ENABLED = previous.previewEnabled;
    if (previous.previewHash === undefined) delete process.env.PREVIEW_AUTH_PASSWORD_HASH;
    else process.env.PREVIEW_AUTH_PASSWORD_HASH = previous.previewHash;
    if (previous.previewSecret === undefined) delete process.env.PREVIEW_AUTH_SECRET;
    else process.env.PREVIEW_AUTH_SECRET = previous.previewSecret;
  }
});
