
import { createHmac } from "node:crypto";
import net from "node:net";
import { compare } from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { trustProxyHeaders } from "@/lib/analytics/config";
import {
  clearLoginFailures,
  getLoginAttempt,
  noteLoginFailure,
  openAnalyticsDatabase,
} from "@/lib/analytics/db";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  hasAdminAuthConfiguration,
  safeAdminReturnPath,
  verifyAdminSession,
} from "@/lib/admin-auth";

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function sourceHash(headersValue: Headers): string {
  let source = "unknown";
  if (trustProxyHeaders()) {
    const forwarded = headersValue.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded && net.isIP(forwarded)) source = forwarded;
  }
  return createHmac("sha256", env("ADMIN_SESSION_SECRET") || "admin-rate-limit")
    .update(source)
    .digest("hex");
}

function secureCookie(headersValue: Headers): boolean {
  return (headersValue.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http") === "https";
}

export async function requireAdminSession(): Promise<void> {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/connexion");
}

export async function loginAdminAction(formData: FormData): Promise<void> {
  "use server";
  const passwordValue = formData.get("password");
  const nextValue = formData.get("next");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const next = safeAdminReturnPath(typeof nextValue === "string" ? nextValue : null);
  const headerStore = await headers();
  const ipHash = sourceHash(headerStore);
  if (!hasAdminAuthConfiguration()) redirect(`/admin/connexion?erreur=indisponible&next=${encodeURIComponent(next)}`);
  let db: ReturnType<typeof openAnalyticsDatabase>;
  try {
    db = openAnalyticsDatabase();
  } catch {
    db = null;
  }
  if (!db) redirect(`/admin/connexion?erreur=indisponible&next=${encodeURIComponent(next)}`);

  const now = Date.now();
  const attempt = getLoginAttempt(db, ipHash);
  if (attempt && attempt.locked_until > now) redirect(`/admin/connexion?erreur=identifiants&next=${encodeURIComponent(next)}`);
  let valid = false;
  if (password.length > 0 && password.length <= 512) {
    try {
      valid = await compare(password, env("ADMIN_PASSWORD_HASH"));
    } catch {
      valid = false;
    }
  }
  if (!valid) {
    noteLoginFailure(db, ipHash, now);
    redirect(`/admin/connexion?erreur=identifiants&next=${encodeURIComponent(next)}`);
  }
  clearLoginFailures(db, ipHash);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(now), {
    httpOnly: true,
    secure: secureCookie(headerStore),
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  redirect(next);
}

export async function logoutAdminAction(): Promise<void> {
  "use server";
  await requireAdminSession();
  const cookieStore = await cookies();
  const headerStore = await headers();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: secureCookie(headerStore),
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });
  redirect("/admin/connexion");
}
