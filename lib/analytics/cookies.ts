
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import {
  ANALYTICS_SESSION_MAX_AGE,
  ANALYTICS_VISITOR_MAX_AGE,
  analyticsSecret,
  hasAnalyticsConfiguration,
} from "@/lib/analytics/config";

const TOKEN_VERSION = "v1";

type ParsedVisitor = { id: string; expiresAt: number };
type ParsedSession = { id: string; visitorId: string; expiresAt: number };

function sign(payload: string): string {
  return createHmac("sha256", analyticsSecret()).update(payload).digest("base64url");
}

function validId(id: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(id);
}

function secureCompare(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function parseParts(value: string | undefined, expectedLength: number): string[] | null {
  if (!hasAnalyticsConfiguration() || !value) return null;
  const parts = value.split(".");
  return parts.length === expectedLength ? parts : null;
}

export function createVisitorToken(now = Date.now()): { token: string; id: string; expiresAt: number } {
  const id = randomUUID();
  const expiresAt = Math.floor(now / 1000) + ANALYTICS_VISITOR_MAX_AGE;
  const payload = `${TOKEN_VERSION}.${id}.${expiresAt}`;
  return { token: `${payload}.${sign(payload)}`, id, expiresAt };
}

export function createSessionToken(
  visitorId: string,
  now = Date.now(),
  existingId?: string,
): { token: string; id: string; visitorId: string; expiresAt: number } {
  const id = existingId ?? randomUUID();
  const expiresAt = Math.floor(now / 1000) + ANALYTICS_SESSION_MAX_AGE;
  const payload = `${TOKEN_VERSION}.${id}.${visitorId}.${expiresAt}`;
  return { token: `${payload}.${sign(payload)}`, id, visitorId, expiresAt };
}

export function verifyVisitorToken(value: string | undefined, now = Date.now()): ParsedVisitor | null {
  const parts = parseParts(value, 4);
  if (!parts) return null;
  const [version, id, rawExpiresAt, signature] = parts;
  if (version !== TOKEN_VERSION || !validId(id) || !/^\d+$/.test(rawExpiresAt)) return null;
  const expiresAt = Number(rawExpiresAt);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return null;
  if (!secureCompare(sign(`${version}.${id}.${rawExpiresAt}`), signature)) return null;
  return { id, expiresAt };
}

export function verifySessionToken(value: string | undefined, now = Date.now()): ParsedSession | null {
  const parts = parseParts(value, 5);
  if (!parts) return null;
  const [version, id, visitorId, rawExpiresAt, signature] = value?.split(".") ?? [];
  if (
    version !== TOKEN_VERSION ||
    !validId(id) ||
    !validId(visitorId) ||
    !/^\d+$/.test(rawExpiresAt ?? "")
  ) {
    return null;
  }
  const expiresAt = Number(rawExpiresAt);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return null;
  if (!secureCompare(sign(`${version}.${id}.${visitorId}.${rawExpiresAt}`), signature ?? "")) return null;
  return { id, visitorId, expiresAt };
}
