import { NextResponse } from "next/server";

import {
  ANALYTICS_CONSENT_COOKIE,
  ANALYTICS_EVENT_BODY_LIMIT,
  ANALYTICS_SESSION_COOKIE,
  ANALYTICS_SESSION_MAX_AGE,
  ANALYTICS_VISITOR_COOKIE,
  ANALYTICS_VISITOR_MAX_AGE,
  analyticsEnabled,
  consentCookieValue,
  hasAnalyticsConfiguration,
  serverCookieOptions,
  trustProxyHeaders,
} from "@/lib/analytics/config";
import {
  createSessionToken,
  createVisitorToken,
  verifySessionToken,
  verifyVisitorToken,
} from "@/lib/analytics/cookies";
import { openAnalyticsDatabase, recordPageview } from "@/lib/analytics/db";
import { lookupCountry } from "@/lib/analytics/geoip";
import {
  classifyDevice,
  isBot,
  isPublicAnalyticsPath,
  normalizePath,
  normalizeReferrerHost,
  requestIsSameOrigin,
  sourceIpHash,
} from "@/lib/analytics/request";
import { allowPageview as allowRate } from "@/lib/analytics/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function noContent(): NextResponse {
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!analyticsEnabled() || !hasAnalyticsConfiguration()) return noContent();

  const consent = consentCookieValue(request.headers.get("cookie")?.match(new RegExp(`(?:^|; )${ANALYTICS_CONSENT_COOKIE}=([^;]+)`))?.[1]);
  // Consent is a server-side guard as well as a client-side UX choice. A
  // missing or declined cookie can never mint identifiers.
  if (consent !== "accepted") return noContent();
  if (!requestIsSameOrigin(request)) {
    return NextResponse.json({ error: "Origine invalide." }, { status: 403 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > ANALYTICS_EVENT_BODY_LIMIT) {
    return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });
  }
  if (isBot(request.headers.get("user-agent"))) return noContent();
  if (!allowRate(sourceIpHash(request))) {
    return noContent();
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > ANALYTICS_EVENT_BODY_LIMIT) {
      return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }
  const value = body as Record<string, unknown>;
  const eventId = typeof value.eventId === "string" ? value.eventId : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }
  const pathname = normalizePath(value.path);
  if (!pathname || !isPublicAnalyticsPath(pathname)) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }
  let referrerHost = normalizeReferrerHost(value.referrerHost);
  if (value.referrerHost !== undefined && (!referrerHost || typeof value.referrerHost !== "string")) {
    return NextResponse.json({ error: "Référent invalide." }, { status: 400 });
  }
  if (referrerHost) {
    try {
      const forwardedHost = trustProxyHeaders() ? request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() : null;
      const requestHost = (forwardedHost || new URL(request.url).host).split(":")[0]?.toLowerCase();
      if (referrerHost === requestHost) referrerHost = null;
    } catch {
      referrerHost = null;
    }
  }
  const cookieHeader = request.headers.get("cookie") ?? "";
  const getCookie = (name: string): string | undefined =>
    cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`))?.[1];
  let visitor = verifyVisitorToken(getCookie(ANALYTICS_VISITOR_COOKIE));
  let visitorToken: { token: string; id: string; expiresAt: number } | null = null;
  if (!visitor) {
    visitorToken = createVisitorToken();
    visitor = visitorToken;
  }
  let session = verifySessionToken(getCookie(ANALYTICS_SESSION_COOKIE));
  let sessionToken: { token: string; id: string; visitorId: string; expiresAt: number } | null = null;
  if (!session || session.visitorId !== visitor.id) {
    sessionToken = createSessionToken(visitor.id);
    session = sessionToken;
  } else {
    sessionToken = createSessionToken(visitor.id, Date.now(), session.id);
    session = sessionToken;
  }

  let db: ReturnType<typeof openAnalyticsDatabase>;
  try {
    db = openAnalyticsDatabase();
  } catch (error) {
    console.error("[analytics] database unavailable", error instanceof Error ? error.message : "unknown error");
    return noContent();
  }
  if (!db) return noContent();
  const occurredAt = Date.now();
  try {
    const countryCode = await lookupCountry(request);
    recordPageview(db, {
      eventId,
      visitorId: visitor.id,
      sessionId: session.id,
      path: pathname,
      occurredAt,
      landingPath: pathname,
      referrerHost,
      deviceType: classifyDevice(request.headers.get("user-agent")),
      countryCode,
    });
  } catch (error) {
    console.error("[analytics] pageview collector failure", error instanceof Error ? error.message : "unknown error");
    return noContent();
  }

  const response = noContent();
  if (visitorToken) {
    response.cookies.set(ANALYTICS_VISITOR_COOKIE, visitorToken.token, {
      ...serverCookieOptions(request, ANALYTICS_VISITOR_MAX_AGE),
    });
  }
  if (sessionToken || session) {
    const token = sessionToken?.token ?? getCookie(ANALYTICS_SESSION_COOKIE);
    if (token) {
      response.cookies.set(ANALYTICS_SESSION_COOKIE, token, {
        ...serverCookieOptions(request, ANALYTICS_SESSION_MAX_AGE),
      });
    }
  }
  return response;
}
