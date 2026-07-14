import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { compare } from "bcryptjs";

export const PREVIEW_AUTH_COOKIE = "core_preview_session";
export const PREVIEW_AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const SESSION_VERSION = "v1";

function environmentValue(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function previewAuthEnabled(): boolean {
  return environmentValue("PREVIEW_AUTH_ENABLED").toLowerCase() === "true";
}

export function hasPreviewAuthConfiguration(): boolean {
  const passwordHash = environmentValue("PREVIEW_AUTH_PASSWORD_HASH");
  const sessionSecret = environmentValue("PREVIEW_AUTH_SECRET");

  return passwordHash.startsWith("$2") && sessionSecret.length >= 32;
}

function sessionSecret(): string {
  if (!hasPreviewAuthConfiguration()) {
    throw new Error(
      "Preview auth requires PREVIEW_AUTH_PASSWORD_HASH and a PREVIEW_AUTH_SECRET of at least 32 characters.",
    );
  }

  return environmentValue("PREVIEW_AUTH_SECRET");
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createPreviewSession(now = Date.now()): string {
  const expiresAt =
    Math.floor(now / 1000) + PREVIEW_AUTH_MAX_AGE_SECONDS;
  const payload = SESSION_VERSION + "." + expiresAt;

  return payload + "." + sign(payload);
}

export function verifyPreviewSession(
  session: string | undefined,
  now = Date.now(),
): boolean {
  if (!previewAuthEnabled() || !session || !hasPreviewAuthConfiguration()) {
    return false;
  }

  const parts = session.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [version, rawExpiresAt, signature] = parts;
  if (version !== SESSION_VERSION || !/^\d+$/.test(rawExpiresAt)) {
    return false;
  }

  const expiresAt = Number(rawExpiresAt);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) {
    return false;
  }

  const expected = sign(version + "." + rawExpiresAt);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function verifyPreviewPassword(password: string): Promise<boolean> {
  if (
    !previewAuthEnabled() ||
    !hasPreviewAuthConfiguration() ||
    password.length === 0 ||
    password.length > 512
  ) {
    return false;
  }

  try {
    return await compare(
      password,
      environmentValue("PREVIEW_AUTH_PASSWORD_HASH"),
    );
  } catch {
    return false;
  }
}

export function safeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  try {
    const base = new URL("https://preview.invalid");
    const candidate = new URL(value, base);

    if (
      candidate.origin !== base.origin ||
      candidate.pathname === "/connexion" ||
      candidate.pathname === "/api/preview/login"
    ) {
      return "/";
    }

    return candidate.pathname + candidate.search + candidate.hash;
  } catch {
    return "/";
  }
}
