import { NextResponse } from "next/server";

import {
  ANALYTICS_SESSION_COOKIE,
  ANALYTICS_VISITOR_COOKIE,
  isHttpsRequest,
} from "@/lib/analytics/config";
import { verifyVisitorToken } from "@/lib/analytics/cookies";
import { deleteVisitorData, openAnalyticsDatabase } from "@/lib/analytics/db";
import { requestIsSameOrigin } from "@/lib/analytics/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function clearCookie(response: NextResponse, name: string, request: Request): void {
  response.cookies.set(name, "", {
    httpOnly: true,
    secure: isHttpsRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function DELETE(request: Request): Promise<NextResponse> {
  if (!requestIsSameOrigin(request)) {
    return NextResponse.json({ error: "Origine invalide." }, { status: 403 });
  }
  const cookieHeader = request.headers.get("cookie") ?? "";
  const value = cookieHeader.match(/(?:^|; )core_analytics_visitor=([^;]+)/)?.[1];
  const visitor = verifyVisitorToken(value);
  if (visitor) {
    try {
      const db = openAnalyticsDatabase();
      if (!db) throw new Error("analytics database is unavailable");
      deleteVisitorData(db, visitor.id);
    } catch (error) {
      console.error("[analytics] visitor deletion failure", error instanceof Error ? error.message : "unknown error");
      return NextResponse.json(
        { error: "Suppression temporairement indisponible." },
        { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } },
      );
    }
  }
  const response = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  clearCookie(response, ANALYTICS_VISITOR_COOKIE, request);
  clearCookie(response, ANALYTICS_SESSION_COOKIE, request);
  return response;
}
