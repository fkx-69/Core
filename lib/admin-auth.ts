
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "core_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

const TOKEN_VERSION = "v1";

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function sessionSecret(): string {
  return env("ADMIN_SESSION_SECRET");
}

export function hasAdminAuthConfiguration(): boolean {
  return env("ADMIN_PASSWORD_HASH").startsWith("$2") && sessionSecret().length >= 32;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createAdminSession(now = Date.now()): string {
  if (!hasAdminAuthConfiguration()) throw new Error("Admin auth is not configured.");
  const expiresAt = Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(value: string | undefined, now = Date.now()): boolean {
  if (!hasAdminAuthConfiguration() || !value) return false;
  const [version, rawExpiresAt, signature, extra] = value.split(".");
  if (extra || version !== TOKEN_VERSION || !/^\d+$/.test(rawExpiresAt ?? "")) return false;
  const expiresAt = Number(rawExpiresAt);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;
  const expected = sign(`${version}.${rawExpiresAt}`);
  const actual = Buffer.from(signature ?? "");
  const wanted = Buffer.from(expected);
  return actual.length === wanted.length && timingSafeEqual(actual, wanted);
}

export function safeAdminReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  try {
    const base = new URL("https://admin.invalid");
    const candidate = new URL(value, base);
    if (
      candidate.origin !== base.origin ||
      !(candidate.pathname === "/admin" || candidate.pathname.startsWith("/admin/")) ||
      candidate.pathname === "/admin/connexion" ||
      candidate.pathname.startsWith("/admin/connexion/")
    ) {
      return "/admin";
    }
    return candidate.pathname + candidate.search;
  } catch {
    return "/admin";
  }
}
