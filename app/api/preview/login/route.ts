import { NextRequest, NextResponse } from "next/server";

import {
  createPreviewSession,
  hasPreviewAuthConfiguration,
  PREVIEW_AUTH_COOKIE,
  PREVIEW_AUTH_MAX_AGE_SECONDS,
  previewAuthEnabled,
  safeReturnPath,
  verifyPreviewPassword,
} from "@/lib/preview-auth";

const MAX_FORM_BYTES = 4_096;

function usesHttps(request: NextRequest): boolean {
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  return forwardedProtocol === "https" || request.nextUrl.protocol === "https:";
}

function redirectToLogin(
  error: "configuration" | "mot-de-passe",
  returnPath: string,
) {
  const searchParams = new URLSearchParams({ erreur: error });

  if (returnPath !== "/") {
    searchParams.set("next", returnPath);
  }

  const response = new NextResponse(null, { status: 303 });
  response.headers.set("Location", "/connexion?" + searchParams.toString());
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function redirectToReturnPath(returnPath: string) {
  const response = new NextResponse(null, { status: 303 });
  response.headers.set("Location", returnPath);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_FORM_BYTES) {
    return redirectToLogin("mot-de-passe", "/");
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return redirectToLogin("mot-de-passe", "/");
  }

  const returnPath = safeReturnPath(
    typeof formData.get("next") === "string"
      ? String(formData.get("next"))
      : undefined,
  );

  if (!previewAuthEnabled()) {
    return redirectToReturnPath(returnPath);
  }

  if (!hasPreviewAuthConfiguration()) {
    return redirectToLogin("configuration", returnPath);
  }

  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!(await verifyPreviewPassword(password))) {
    return redirectToLogin("mot-de-passe", returnPath);
  }

  const response = redirectToReturnPath(returnPath);
  response.cookies.set({
    name: PREVIEW_AUTH_COOKIE,
    value: createPreviewSession(),
    httpOnly: true,
    secure: usesHttps(request),
    sameSite: "lax",
    maxAge: PREVIEW_AUTH_MAX_AGE_SECONDS,
    path: "/",
    priority: "high",
  });
  return response;
}
