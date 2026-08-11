
import path from "node:path";

export const ANALYTICS_VISITOR_COOKIE = "core_analytics_visitor";
export const ANALYTICS_SESSION_COOKIE = "core_analytics_session";
export const ANALYTICS_CONSENT_COOKIE = "core_analytics_consent";
export const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const ANALYTICS_VISITOR_MAX_AGE = 60 * 60 * 24 * 90;
export const ANALYTICS_SESSION_MAX_AGE = 60 * 30;
export const ANALYTICS_EVENT_BODY_LIMIT = 8 * 1024;

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function analyticsEnabled(): boolean {
  return env("NEXT_PUBLIC_ANALYTICS_ENABLED").toLowerCase() === "true";
}

export function analyticsSecret(): string {
  return env("ANALYTICS_COOKIE_SECRET");
}

export function hasAnalyticsConfiguration(): boolean {
  return analyticsSecret().length >= 32;
}

/**
 * Analytics must never silently create a production database in the working
 * directory. Development and tests intentionally use the ignored .data
 * fallback so local collection remains easy to exercise.
 */
export function analyticsDatabasePath(): string | null {
  const configured = env("ANALYTICS_DATABASE_PATH");
  if (configured) {
    if (process.env.NODE_ENV === "production" && !path.isAbsolute(configured)) return null;
    return configured;
  }

  if (process.env.NODE_ENV === "production") return null;
  return path.join(process.cwd(), ".data", "analytics.sqlite");
}

export function geoIpDatabasePath(): string | null {
  const configured = env("ANALYTICS_GEOIP_DATABASE_PATH");
  return configured || null;
}

export function trustProxyHeaders(): boolean {
  return env("ANALYTICS_TRUST_PROXY_HEADERS").toLowerCase() === "true";
}

export function isHttpsRequest(request: Request): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return (forwardedProto || new URL(request.url).protocol.replace(":", "")) === "https";
}

export function clientCookieOptions(request: Request, maxAge: number) {
  return {
    httpOnly: false,
    secure: isHttpsRequest(request),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function serverCookieOptions(request: Request, maxAge: number) {
  return {
    httpOnly: true,
    secure: isHttpsRequest(request),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function consentCookieValue(value: string | undefined): "accepted" | "declined" | null {
  if (value === "accepted" || value === "declined") return value;
  return null;
}
