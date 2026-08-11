import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  hasPreviewAuthConfiguration,
  PREVIEW_AUTH_COOKIE,
  previewAuthEnabled,
  safeReturnPath,
  verifyPreviewSession,
} from "@/lib/preview-auth";
import {
  ADMIN_SESSION_COOKIE,
  hasAdminAuthConfiguration,
  safeAdminReturnPath,
  verifyAdminSession,
} from "@/lib/admin-auth";
import { shouldNoIndexHostname } from "@/lib/seo";

const LOGIN_PATH = "/connexion";
const LOGIN_HANDLER_PATH = "/api/preview/login";
const ADMIN_CACHE_CONTROL = "private, no-store, max-age=0";

function requestHostname(request: NextRequest): string {
  const hostHeader =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!hostHeader) return request.nextUrl.hostname;

  const host = hostHeader.split(",", 1)[0]?.trim() ?? "";
  if (host.startsWith("[")) {
    return host.slice(1, host.indexOf("]"));
  }
  return host.split(":", 1)[0] ?? request.nextUrl.hostname;
}

function responseForHost(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  if (shouldNoIndexHostname(requestHostname(request))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

function adminResponse(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  response.headers.set("Cache-Control", ADMIN_CACHE_CONTROL);
  return responseForHost(request, response);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Dedicated admin auth is evaluated first so the optional preview barrier
  // can never make administrators log in twice.
  if (pathname === "/admin/connexion" || pathname.startsWith("/admin/") || pathname === "/admin") {
    const configured = hasAdminAuthConfiguration();
    const authenticated = configured && verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
    if (pathname === "/admin/connexion") {
      if (!authenticated) return adminResponse(request, NextResponse.next());
      const next = safeAdminReturnPath(request.nextUrl.searchParams.get("next"));
      return adminResponse(request, NextResponse.redirect(new URL(next, request.url)));
    }
    if (authenticated) return adminResponse(request, NextResponse.next());
    const loginUrl = new URL("/admin/connexion", request.url);
    const returnPath = pathname + request.nextUrl.search;
    loginUrl.searchParams.set("next", safeAdminReturnPath(returnPath));
    if (!configured) loginUrl.searchParams.set("erreur", "indisponible");
    return adminResponse(request, NextResponse.redirect(loginUrl));
  }

  if (!previewAuthEnabled()) {
    return responseForHost(request, NextResponse.next());
  }

  if (pathname === LOGIN_HANDLER_PATH) {
    return responseForHost(request, NextResponse.next());
  }

  const configured = hasPreviewAuthConfiguration();
  const authenticated =
    configured &&
    verifyPreviewSession(
      request.cookies.get(PREVIEW_AUTH_COOKIE)?.value,
    );

  if (pathname === LOGIN_PATH) {
    if (!authenticated) {
      return responseForHost(request, NextResponse.next());
    }

    const returnPath = safeReturnPath(request.nextUrl.searchParams.get("next"));
    return responseForHost(request, NextResponse.redirect(new URL(returnPath, request.url)));
  }

  if (authenticated) {
    return responseForHost(request, NextResponse.next());
  }

  if (pathname.startsWith("/api/")) {
    return responseForHost(
      request,
      NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      ),
    );
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  const returnPath = pathname + request.nextUrl.search;
  if (returnPath !== "/") {
    loginUrl.searchParams.set("next", returnPath);
  }
  if (!configured) {
    loginUrl.searchParams.set("erreur", "configuration");
  }

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(PREVIEW_AUTH_COOKIE);
  response.headers.set("Cache-Control", "no-store");
  return responseForHost(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpe?g|webp|gif|ico|woff2?)$).*)",
  ],
};
