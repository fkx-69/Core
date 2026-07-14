import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  hasPreviewAuthConfiguration,
  PREVIEW_AUTH_COOKIE,
  previewAuthEnabled,
  safeReturnPath,
  verifyPreviewSession,
} from "@/lib/preview-auth";

const LOGIN_PATH = "/connexion";
const LOGIN_HANDLER_PATH = "/api/preview/login";

export function proxy(request: NextRequest) {
  if (!previewAuthEnabled()) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (pathname === LOGIN_HANDLER_PATH) {
    return NextResponse.next();
  }

  const configured = hasPreviewAuthConfiguration();
  const authenticated =
    configured &&
    verifyPreviewSession(
      request.cookies.get(PREVIEW_AUTH_COOKIE)?.value,
    );

  if (pathname === LOGIN_PATH) {
    if (!authenticated) {
      return NextResponse.next();
    }

    const returnPath = safeReturnPath(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(returnPath, request.url));
  }

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 },
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
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpe?g|webp|gif|ico|woff2?)$).*)",
  ],
};
