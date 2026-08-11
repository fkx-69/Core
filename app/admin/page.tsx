import type { Metadata } from "next";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardView from "@/components/admin/DashboardView";
import {
  ADMIN_SESSION_COOKIE,
  hasAdminAuthConfiguration,
  verifyAdminSession,
} from "@/lib/admin-auth";
import { logoutAdminAction, requireAdminSession } from "@/lib/admin-actions";
import { geoIpDatabasePath } from "@/lib/analytics/config";
import { getDashboardStats, openAnalyticsDatabase } from "@/lib/analytics/db";

export const metadata: Metadata = {
  title: "Administration — Audience",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type AdminPageProps = {
  searchParams: Promise<{ periode?: string | string[] }>;
};

function periodValue(value: string | string[] | undefined): 7 | 30 | 90 {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected === "7" ? 7 : selected === "90" ? 90 : 30;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await connection();
  await requireAdminSession();
  // The DAL re-check is intentionally immediately before opening and reading
  // the synchronous SQLite handle, rather than relying on proxy optimism.
  const cookieStore = await cookies();
  if (!hasAdminAuthConfiguration() || !verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/connexion");
  }
  const period = periodValue((await searchParams).periode);
  const geoIpConfigured = Boolean(geoIpDatabasePath());
  let stats = null;
  let unavailable = false;
  try {
    const db = openAnalyticsDatabase();
    if (!db) unavailable = true;
    else stats = getDashboardStats(db, period);
  } catch (error) {
    console.error("[admin] dashboard read failure", error instanceof Error ? error.message : "unknown error");
    unavailable = true;
  }

  return (
    <DashboardView
      stats={stats}
      unavailable={unavailable}
      geoIpConfigured={geoIpConfigured}
      onLogout={logoutAdminAction}
    />
  );
}
