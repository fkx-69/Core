
import net from "node:net";
import { createHmac } from "node:crypto";

import { trustProxyHeaders, analyticsSecret } from "@/lib/analytics/config";

const BOT_RE = /bot|crawler|spider|slurp|headless|uptimerobot|facebookexternalhit|preview/i;
const PATH_RE = /^\/(?:[^?#\s]*)$/;
const PATH_CONTROL_OR_SPACE_RE = /[\u0000-\u001f\u007f\s]/u;
const HOST_RE = /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?(?::\d{1,5})?$/i;

export function isBot(userAgent: string | null): boolean {
  return Boolean(userAgent && BOT_RE.test(userAgent));
}

export function normalizePath(value: unknown): string | null {
  if (typeof value !== "string" || value.length < 1 || value.length > 512) return null;
  if (value.startsWith("//") || !PATH_RE.test(value) || value.includes("?") || value.includes("#")) return null;
  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded.length > 512 ||
      decoded.startsWith("//") ||
      !decoded.startsWith("/") ||
      decoded.includes("?") ||
      decoded.includes("#") ||
      PATH_CONTROL_OR_SPACE_RE.test(decoded)
    ) return null;
    return value;
  } catch {
    return null;
  }
}

export function isPublicAnalyticsPath(value: string): boolean {
  return (
    !value.startsWith("/admin") &&
    !value.startsWith("/connexion") &&
    !value.startsWith("/api/") &&
    !value.startsWith("/_next/") &&
    !value.startsWith("/favicon") &&
    !/\.[a-z0-9]{2,8}$/i.test(value)
  );
}

export function normalizeReferrerHost(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 253) return null;
  const host = value.trim().toLowerCase().replace(/\.$/, "");
  if (!HOST_RE.test(host)) return null;
  return host;
}

export function classifyDevice(userAgent: string | null): "mobile" | "tablet" | "desktop" | "unknown" {
  if (!userAgent) return "unknown";
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/android/i.test(userAgent) && !/mobile/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android|webos|blackberry|opera mini/i.test(userAgent)) return "mobile";
  if (/windows|macintosh|linux|cros|x11/i.test(userAgent)) return "desktop";
  return "unknown";
}

export function requestIsSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")?.trim();
  const referer = request.headers.get("referer")?.trim();
  const candidate = origin && origin !== "null" ? origin : referer;
  if (!candidate) return false;
  try {
    const requestUrl = new URL(request.url);
    const protocol = (trustProxyHeaders() ? request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() : null) || requestUrl.protocol.replace(":", "");
    const host = (trustProxyHeaders() ? request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() : null) || requestUrl.host;
    const expected = new URL(`${protocol}://${host}`).origin;
    return new URL(candidate).origin === expected;
  } catch {
    return false;
  }
}

export function trustedSourceIp(request: Request): string {
  if (trustProxyHeaders()) {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded && net.isIP(forwarded)) return forwarded;
  }
  // No raw address is persisted. A stable placeholder still allows a modest
  // per-process limit when the platform hides the socket address.
  return "unknown";
}

export function sourceIpHash(request: Request): string {
  return createHmac("sha256", analyticsSecret() || "analytics-rate-limit").update(trustedSourceIp(request)).digest("hex");
}
