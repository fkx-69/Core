import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import Module from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { NextRequest } from "next/server";

import {
  clearLoginFailures,
  closeAnalyticsDatabase,
  deleteVisitorData,
  getDashboardStats,
  getLoginAttempt,
  noteLoginFailure,
  openAnalyticsDatabase,
  purgeAnalytics,
  recordPageview,
} from "@/lib/analytics/db";
import { createSessionToken, createVisitorToken, verifySessionToken, verifyVisitorToken } from "@/lib/analytics/cookies";
import { createAdminSession, safeAdminReturnPath, verifyAdminSession } from "@/lib/admin-auth";
import { classifyDevice, isPublicAnalyticsPath, normalizePath, requestIsSameOrigin } from "@/lib/analytics/request";
import { DELETE as deleteVisitorRoute } from "@/app/api/analytics/visitor/route";

process.env.ANALYTICS_COOKIE_SECRET = "test-secret-123456789012345678901234";
process.env.ADMIN_PASSWORD_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
process.env.ADMIN_SESSION_SECRET = "admin-test-secret-123456789012345678";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 7, 9, 12, 0, 0);

async function loadProxyForTest(): Promise<(request: NextRequest) => Response> {
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

function tempDatabase(): { directory: string; databasePath: string } {
  const directory = mkdtempSync(path.join(os.tmpdir(), "core-analytics-"));
  return { directory, databasePath: path.join(directory, "analytics.sqlite") };
}

function addPageview(
  db: ReturnType<typeof openAnalyticsDatabase> & object,
  value: {
    eventId: string;
    visitorId: string;
    sessionId: string;
    path: string;
    occurredAt: number;
    referrerHost?: string | null;
    deviceType?: "mobile" | "tablet" | "desktop" | "unknown";
    countryCode?: string | null;
  },
): void {
  assert.equal(
    recordPageview(db, {
      ...value,
      landingPath: value.path,
      referrerHost: value.referrerHost ?? null,
      deviceType: value.deviceType ?? "desktop",
      countryCode: value.countryCode ?? null,
    }),
    "accepted",
  );
}

test("signed visitor/session/admin tokens reject tampering and expiry", () => {
  const visitor = createVisitorToken(NOW);
  assert.equal(verifyVisitorToken(visitor.token, NOW + 1)?.id, visitor.id);
  assert.equal(verifyVisitorToken(`${visitor.token}x`, NOW + 1), null);
  assert.equal(verifyVisitorToken(visitor.token, (visitor.expiresAt + 1) * 1000), null);

  const session = createSessionToken(visitor.id, NOW);
  assert.equal(verifySessionToken(session.token, NOW + 1)?.visitorId, visitor.id);
  assert.equal(verifySessionToken(session.token.replace("v1", "v2"), NOW + 1), null);
  assert.equal(verifySessionToken(session.token, (session.expiresAt + 1) * 1000), null);

  const admin = createAdminSession(NOW);
  assert.equal(verifyAdminSession(admin, NOW + 1), true);
  assert.equal(verifyAdminSession(admin.replace("v1", "v2"), NOW + 1), false);
  assert.equal(verifyAdminSession(admin, NOW + 8 * 60 * 60 * 1000 + 1), false);
  assert.equal(safeAdminReturnPath("/admin?periode=7"), "/admin?periode=7");
  assert.equal(safeAdminReturnPath("https://evil.test/"), "/admin");
  assert.equal(safeAdminReturnPath("/admin/connexion"), "/admin");
});

test("dashboard uses exact UTC 7/30/90-day boundaries and counts dimensions as visits", () => {
  const { directory, databasePath } = tempDatabase();
  const db = openAnalyticsDatabase(databasePath);
  assert.ok(db);
  const visitorOne = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const visitorTwo = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  const visitorThree = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const sessionOne = "11111111-1111-4111-8111-111111111111";
  const sessionTwo = "22222222-2222-4222-8222-222222222222";
  const sessionThree = "33333333-3333-4333-8333-333333333333";
  const sessionFour = "44444444-4444-4444-8444-444444444444";
  const from7 = Date.UTC(2026, 7, 3);
  const from30 = Date.UTC(2026, 6, 11);
  const from90 = Date.UTC(2026, 4, 12);

  try {
    // Two pageviews in one session must count once in source/device/country.
    addPageview(db, { eventId: "10000000-0000-4000-8000-000000000001", visitorId: visitorOne, sessionId: sessionOne, path: "/", occurredAt: from7, referrerHost: "news.example", countryCode: "ML" });
    addPageview(db, { eventId: "10000000-0000-4000-8000-000000000002", visitorId: visitorOne, sessionId: sessionOne, path: "/services", occurredAt: from7 + 60_000, referrerHost: "news.example", countryCode: "ML" });
    addPageview(db, { eventId: "10000000-0000-4000-8000-000000000003", visitorId: visitorTwo, sessionId: sessionTwo, path: "/", occurredAt: from7 + DAY, referrerHost: null, deviceType: "mobile", countryCode: "JP" });
    addPageview(db, { eventId: "10000000-0000-4000-8000-000000000004", visitorId: visitorThree, sessionId: sessionThree, path: "/old-30", occurredAt: from30, referrerHost: "old.example" });
    addPageview(db, { eventId: "10000000-0000-4000-8000-000000000005", visitorId: visitorThree, sessionId: sessionFour, path: "/old-90", occurredAt: from90, referrerHost: null });

    const stats7 = getDashboardStats(db, 7, NOW);
    assert.equal(stats7.from, from7);
    assert.equal(stats7.trend.length, 7);
    assert.equal(stats7.trend[0]?.date, "2026-08-03");
    assert.equal(stats7.trend.at(-1)?.date, "2026-08-09");
    assert.equal(stats7.visitors, 2);
    assert.equal(stats7.visits, 2);
    assert.equal(stats7.pageviews, 3);
    assert.equal(stats7.previousVisitors, 0);
    assert.equal(stats7.previousVisits, 0);
    assert.equal(stats7.previousPageviews, 0);
    assert.equal(stats7.trend.reduce((sum, row) => sum + row.pageviews, 0), stats7.pageviews);
    assert.equal(stats7.trend.reduce((sum, row) => sum + row.visitors, 0), stats7.visitors);
    assert.equal(stats7.sources.find((row) => row.label === "news.example")?.value, 1);
    assert.equal(stats7.devices.find((row) => row.label === "desktop")?.value, 1);
    assert.equal(stats7.countries.find((row) => row.label === "ML")?.value, 1);

    const stats30 = getDashboardStats(db, 30, NOW);
    assert.equal(stats30.from, from30);
    assert.equal(stats30.trend.length, 30);
    assert.equal(stats30.trend[0]?.date, "2026-07-11");
    assert.equal(stats30.pageviews, 4);
    assert.equal(stats30.trend.reduce((sum, row) => sum + row.pageviews, 0), stats30.pageviews);
    assert.equal(stats30.trend.reduce((sum, row) => sum + row.visitors, 0), stats30.visitors);

    const stats90 = getDashboardStats(db, 90, NOW);
    assert.equal(stats90.from, from90);
    assert.equal(stats90.trend.length, 90);
    assert.equal(stats90.trend[0]?.date, "2026-05-12");
    assert.equal(stats90.pageviews, 5);
    assert.equal(stats90.trend.reduce((sum, row) => sum + row.pageviews, 0), stats90.pageviews);
  } finally {
    closeAnalyticsDatabase();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("dashboard comparison window is equal-duration, adjacent, and boundary-precise", () => {
  const { directory, databasePath } = tempDatabase();
  const db = openAnalyticsDatabase(databasePath);
  assert.ok(db);
  const from = Date.UTC(2026, 7, 3);
  const currentDuration = NOW - from + 1;
  const previousFrom = from - currentDuration;
  const previousTo = from - 1;
  const previousVisitor = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
  const excludedVisitor = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
  const currentVisitor = "ffffffff-ffff-4fff-8fff-ffffffffffff";
  try {
    addPageview(db, {
      eventId: "11000000-0000-4000-8000-000000000001",
      visitorId: previousVisitor,
      sessionId: "66666666-6666-4666-8666-666666666666",
      path: "/previous-start",
      occurredAt: previousFrom,
    });
    addPageview(db, {
      eventId: "11000000-0000-4000-8000-000000000002",
      visitorId: previousVisitor,
      sessionId: "66666666-6666-4666-8666-666666666666",
      path: "/previous-end",
      occurredAt: previousTo,
    });
    addPageview(db, {
      eventId: "11000000-0000-4000-8000-000000000003",
      visitorId: excludedVisitor,
      sessionId: "77777777-7777-4777-8777-777777777777",
      path: "/outside",
      occurredAt: previousFrom - 1,
    });
    addPageview(db, {
      eventId: "11000000-0000-4000-8000-000000000004",
      visitorId: currentVisitor,
      sessionId: "88888888-8888-4888-8888-888888888888",
      path: "/current",
      occurredAt: from,
    });

    const stats = getDashboardStats(db, 7, NOW);
    assert.equal(stats.previousFrom, previousFrom);
    assert.equal(stats.previousTo, previousTo);
    assert.equal(stats.previousVisitors, 1);
    assert.equal(stats.previousVisits, 1);
    assert.equal(stats.previousPageviews, 2);
    assert.equal(stats.visitors, 1);
    assert.equal(stats.visits, 1);
    assert.equal(stats.pageviews, 1);
  } finally {
    closeAnalyticsDatabase();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("empty dashboard keeps a zero-filled UTC trend and empty dimensions", () => {
  const { directory, databasePath } = tempDatabase();
  const db = openAnalyticsDatabase(databasePath);
  assert.ok(db);
  try {
    const stats = getDashboardStats(db, 7, NOW);
    assert.equal(stats.visitors, 0);
    assert.equal(stats.visits, 0);
    assert.equal(stats.pageviews, 0);
    assert.equal(stats.previousVisitors, 0);
    assert.equal(stats.previousVisits, 0);
    assert.equal(stats.previousPageviews, 0);
    assert.equal(stats.activeVisitors, 0);
    assert.deepEqual(stats.trend.map((row) => row.date), [
      "2026-08-03",
      "2026-08-04",
      "2026-08-05",
      "2026-08-06",
      "2026-08-07",
      "2026-08-08",
      "2026-08-09",
    ]);
    assert.ok(stats.trend.every((row) => row.visitors === 0 && row.pageviews === 0));
    assert.deepEqual(stats.topPages, []);
    assert.deepEqual(stats.sources, []);
    assert.deepEqual(stats.devices, []);
    assert.deepEqual(stats.countries, []);
  } finally {
    closeAnalyticsDatabase();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("SQLite purge removes data older than 90 days and visitor deletion cascades", () => {
  const { directory, databasePath } = tempDatabase();
  const db = openAnalyticsDatabase(databasePath);
  assert.ok(db);
  const old = NOW - 91 * DAY;
  const visitor = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
  const session = "55555555-5555-4555-8555-555555555555";
  try {
    addPageview(db, { eventId: "20000000-0000-4000-8000-000000000001", visitorId: visitor, sessionId: session, path: "/old", occurredAt: old });
    purgeAnalytics(db, NOW);
    assert.equal(getDashboardStats(db, 90, NOW).pageviews, 0);
    addPageview(db, { eventId: "20000000-0000-4000-8000-000000000002", visitorId: visitor, sessionId: session, path: "/new", occurredAt: NOW });
    deleteVisitorData(db, visitor);
    assert.equal(getDashboardStats(db, 90, NOW).pageviews, 0);
    const remaining = db.prepare("SELECT COUNT(*) AS count FROM analytics_sessions WHERE visitor_id = ?").get(visitor) as { count: number };
    assert.equal(remaining.count, 0);
  } finally {
    closeAnalyticsDatabase();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("visitor deletion clears identifiers only after successful SQLite cleanup", async () => {
  const { directory, databasePath } = tempDatabase();
  const previousPath = process.env.ANALYTICS_DATABASE_PATH;
  process.env.ANALYTICS_DATABASE_PATH = databasePath;
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
  const visitor = createVisitorToken(NOW);
  const session = createSessionToken(visitor.id, NOW);
  try {
    const db = openAnalyticsDatabase(databasePath);
    assert.ok(db);
    addPageview(db, {
      eventId: "30000000-0000-4000-8000-000000000001",
      visitorId: visitor.id,
      sessionId: session.id,
      path: "/",
      occurredAt: NOW,
    });
    const request = new Request("https://core.test/api/analytics/visitor", {
      method: "DELETE",
      headers: {
        origin: "https://core.test",
        cookie: `core_analytics_visitor=${visitor.token}; core_analytics_session=${session.token}`,
      },
    });
    const success = await deleteVisitorRoute(request);
    assert.equal(success.status, 204);
    assert.match(success.headers.get("set-cookie") ?? "", /core_analytics_visitor=;/);
    assert.equal(getDashboardStats(db, 7, NOW).pageviews, 0);

    closeAnalyticsDatabase();
    process.env.ANALYTICS_DATABASE_PATH = directory;
    const failure = await deleteVisitorRoute(request);
    assert.equal(failure.status, 503);
    assert.equal(failure.headers.get("set-cookie"), null);
    const noVisitor = await deleteVisitorRoute(new Request("https://core.test/api/analytics/visitor", {
      method: "DELETE",
      headers: { origin: "https://core.test" },
    }));
    assert.equal(noVisitor.status, 204);
    assert.match(noVisitor.headers.get("set-cookie") ?? "", /core_analytics_visitor=;/);
  } finally {
    closeAnalyticsDatabase();
    if (previousPath === undefined) delete process.env.ANALYTICS_DATABASE_PATH;
    else process.env.ANALYTICS_DATABASE_PATH = previousPath;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("visitor deletion still removes prior data when collection is disabled", async () => {
  const { directory, databasePath } = tempDatabase();
  const previousPath = process.env.ANALYTICS_DATABASE_PATH;
  const previousEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
  process.env.ANALYTICS_DATABASE_PATH = databasePath;
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "false";
  const visitor = createVisitorToken(NOW);
  const session = createSessionToken(visitor.id, NOW);
  try {
    const db = openAnalyticsDatabase(databasePath);
    assert.ok(db);
    addPageview(db, {
      eventId: "40000000-0000-4000-8000-000000000001",
      visitorId: visitor.id,
      sessionId: session.id,
      path: "/",
      occurredAt: NOW,
    });
    const response = await deleteVisitorRoute(new Request("https://core.test/api/analytics/visitor", {
      method: "DELETE",
      headers: {
        origin: "https://core.test",
        cookie: `core_analytics_visitor=${visitor.token}; core_analytics_session=${session.token}`,
      },
    }));
    assert.equal(response.status, 204);
    assert.equal(getDashboardStats(db, 7, NOW).pageviews, 0);
  } finally {
    closeAnalyticsDatabase();
    if (previousPath === undefined) delete process.env.ANALYTICS_DATABASE_PATH;
    else process.env.ANALYTICS_DATABASE_PATH = previousPath;
    if (previousEnabled === undefined) delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    else process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = previousEnabled;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("admin login rate limiting locks after five failures and resets after expiry", () => {
  const { directory, databasePath } = tempDatabase();
  const db = openAnalyticsDatabase(databasePath);
  assert.ok(db);
  const ipHash = "hmac-of-trusted-ip";
  try {
    for (let i = 0; i < 5; i += 1) noteLoginFailure(db, ipHash, NOW + i * 1_000);
    const locked = getLoginAttempt(db, ipHash);
    assert.ok(locked);
    assert.equal(locked.failures, 5);
    assert.ok(locked.locked_until > NOW);
    const afterExpiry = locked.locked_until + 1;
    const reset = noteLoginFailure(db, ipHash, afterExpiry);
    assert.equal(reset.failures, 1);
    assert.equal(reset.locked_until, 0);
    clearLoginFailures(db, ipHash);
    assert.equal(getLoginAttempt(db, ipHash), undefined);
  } finally {
    closeAnalyticsDatabase();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("same-origin validation requires Origin or Referer and path rejects encoded controls", () => {
  process.env.ANALYTICS_TRUST_PROXY_HEADERS = "false";
  const url = "https://core.test/api/analytics/pageview";
  assert.equal(requestIsSameOrigin(new Request(url, { headers: { origin: "https://core.test" } })), true);
  assert.equal(requestIsSameOrigin(new Request(url, { headers: { origin: "https://evil.test" } })), false);
  assert.equal(requestIsSameOrigin(new Request(url, { headers: { referer: "https://core.test/page" } })), true);
  assert.equal(requestIsSameOrigin(new Request(url)), false);
  assert.equal(requestIsSameOrigin(new Request(url, { headers: { referer: "https://evil.test/page" } })), false);

  assert.equal(normalizePath("/services"), "/services");
  assert.equal(normalizePath("/services?utm=1"), null);
  assert.equal(normalizePath("/services%3Futm=1"), null);
  assert.equal(normalizePath("/services%23hash"), null);
  assert.equal(normalizePath("/services%20with-space"), null);
  assert.equal(normalizePath("/services%00"), null);
  assert.equal(normalizePath("/services%0A"), null);
  assert.equal(normalizePath("/caf%C3%A9"), "/caf%C3%A9");
  assert.equal(isPublicAnalyticsPath("/admin"), false);
  assert.equal(isPublicAnalyticsPath("/demos/ecrin"), true);
  assert.equal(classifyDevice("Mozilla/5.0 (Linux; Android 13; Tablet)"), "tablet");
});

test("proxy keeps admin auth separate from the optional preview barrier", async () => {
  const environmentNames = [
    "PREVIEW_AUTH_ENABLED",
    "PREVIEW_AUTH_PASSWORD_HASH",
    "PREVIEW_AUTH_SECRET",
    "ADMIN_PASSWORD_HASH",
    "ADMIN_SESSION_SECRET",
  ];
  const previousEnvironment = new Map(
    environmentNames.map((name) => [name, process.env[name]]),
  );

  try {
    process.env.ADMIN_PASSWORD_HASH =
      "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
    process.env.ADMIN_SESSION_SECRET = "admin-test-secret-123456789012345678";
    process.env.PREVIEW_AUTH_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    process.env.PREVIEW_AUTH_SECRET = "preview-test-secret-123456789012345678";
    process.env.PREVIEW_AUTH_ENABLED = "false";

    const proxy = await loadProxyForTest();
    const unauthenticated = proxy(
      new NextRequest("https://core.test/admin?periode=7"),
    );
    assert.equal(unauthenticated.status, 307);
    assert.equal(
      unauthenticated.headers.get("cache-control"),
      "private, no-store, max-age=0",
    );
    const loginLocation = new URL(
      unauthenticated.headers.get("location") ?? "https://core.test/invalid",
    );
    assert.equal(loginLocation.pathname, "/admin/connexion");
    assert.equal(loginLocation.searchParams.get("next"), "/admin?periode=7");
    assert.equal(loginLocation.searchParams.get("erreur"), null);

    process.env.PREVIEW_AUTH_ENABLED = "true";
    const previewStillDoesNotDoubleGate = proxy(
      new NextRequest("https://core.test/admin?periode=7"),
    );
    assert.equal(previewStillDoesNotDoubleGate.status, 307);
    const adminLocation = new URL(
      previewStillDoesNotDoubleGate.headers.get("location") ?? "https://core.test/invalid",
    );
    assert.equal(adminLocation.pathname, "/admin/connexion");
    assert.equal(adminLocation.searchParams.get("next"), "/admin?periode=7");

    const adminCookie = createAdminSession();
    const authenticatedAdmin = proxy(
      new NextRequest("https://core.test/admin?periode=7", {
        headers: { cookie: `core_admin_session=${adminCookie}` },
      }),
    );
    assert.equal(authenticatedAdmin.status, 200);
    assert.equal(
      authenticatedAdmin.headers.get("cache-control"),
      "private, no-store, max-age=0",
    );

    const publicRoute = proxy(new NextRequest("https://core.test/services"));
    assert.equal(publicRoute.status, 307);
    const publicLocation = new URL(
      publicRoute.headers.get("location") ?? "https://core.test/invalid",
    );
    assert.equal(publicLocation.pathname, "/connexion");
    assert.equal(publicLocation.searchParams.get("next"), "/services");

    const authenticatedLogin = proxy(
      new NextRequest("https://core.test/admin/connexion?next=%2Fadmin%3Fperiode%3D7", {
        headers: { cookie: `core_admin_session=${adminCookie}` },
      }),
    );
    assert.equal(authenticatedLogin.status, 307);
    assert.equal(
      authenticatedLogin.headers.get("cache-control"),
      "private, no-store, max-age=0",
    );
    const authenticatedLoginLocation = new URL(
      authenticatedLogin.headers.get("location") ?? "https://core.test/invalid",
    );
    assert.equal(authenticatedLoginLocation.pathname, "/admin");
    assert.equal(authenticatedLoginLocation.search, "?periode=7");

    const unsafeReturn = proxy(
      new NextRequest("https://core.test/admin/connexion?next=https%3A%2F%2Fevil.test", {
        headers: { cookie: `core_admin_session=${adminCookie}` },
      }),
    );
    assert.equal(unsafeReturn.status, 307);
    assert.equal(
      new URL(unsafeReturn.headers.get("location") ?? "https://core.test/invalid").pathname,
      "/admin",
    );
  } finally {
    for (const [name, value] of previousEnvironment) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});
