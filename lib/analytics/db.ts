
import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { analyticsDatabasePath } from "@/lib/analytics/config";

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export type PageviewInput = {
  eventId: string;
  visitorId: string;
  sessionId: string;
  path: string;
  occurredAt: number;
  landingPath: string;
  referrerHost: string | null;
  deviceType: DeviceType;
  countryCode: string | null;
};

export type DashboardRow = { label: string; value: number };

export type DashboardStats = {
  periodDays: 7 | 30 | 90;
  from: number;
  to: number;
  previousFrom: number;
  previousTo: number;
  visitors: number;
  visits: number;
  pageviews: number;
  previousVisitors: number;
  previousVisits: number;
  previousPageviews: number;
  activeVisitors: number;
  trend: Array<{ date: string; visitors: number; pageviews: number }>;
  topPages: DashboardRow[];
  sources: DashboardRow[];
  devices: DashboardRow[];
  countries: DashboardRow[];
};

type DatabaseHandle = Database.Database;

const SCHEMA_VERSION = 1;
const GLOBAL_KEY = "__core_analytics_db__";

function globalStore(): { path?: string; db?: DatabaseHandle } {
  const root = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: { path?: string; db?: DatabaseHandle };
  };
  root[GLOBAL_KEY] ??= {};
  return root[GLOBAL_KEY];
}

function migrate(db: DatabaseHandle): void {
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");

  db.transaction(() => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS analytics_meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        visitor_id TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        last_seen_at INTEGER NOT NULL,
        landing_path TEXT NOT NULL,
        referrer_host TEXT,
        device_type TEXT NOT NULL,
        country_code TEXT
      );
      CREATE TABLE IF NOT EXISTS analytics_pageviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL UNIQUE,
        session_id TEXT NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
        path TEXT NOT NULL,
        occurred_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admin_login_attempts (
        ip_hash TEXT PRIMARY KEY NOT NULL,
        window_start INTEGER NOT NULL,
        failures INTEGER NOT NULL DEFAULT 0,
        locked_until INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS analytics_sessions_visitor_idx ON analytics_sessions(visitor_id);
      CREATE INDEX IF NOT EXISTS analytics_sessions_last_seen_idx ON analytics_sessions(last_seen_at);
      CREATE INDEX IF NOT EXISTS analytics_pageviews_occurred_idx ON analytics_pageviews(occurred_at);
      CREATE INDEX IF NOT EXISTS analytics_pageviews_session_idx ON analytics_pageviews(session_id);
    `);
    db.prepare(
      "INSERT INTO analytics_meta(key, value) VALUES('schema_version', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).run(String(SCHEMA_VERSION));
  })();
}

export function openAnalyticsDatabase(databasePath = analyticsDatabasePath()): DatabaseHandle | null {
  if (!databasePath) return null;
  const store = globalStore();
  if (store.db && store.path === databasePath) return store.db;
  if (store.db && store.path !== databasePath) {
    store.db.close();
    store.db = undefined;
    store.path = undefined;
  }

  // Explicitly create the parent only once a request asks for the DAL. This
  // keeps next build/prerender free of filesystem side effects.
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);
  migrate(db);
  purgeIfDue(db);
  store.path = databasePath;
  store.db = db;
  return db;
}

export function closeAnalyticsDatabase(): void {
  const store = globalStore();
  store.db?.close();
  store.db = undefined;
  store.path = undefined;
}

function purgeIfDue(db: DatabaseHandle, now = Date.now()): void {
  const today = new Date(now).toISOString().slice(0, 10);
  const row = db.prepare("SELECT value FROM analytics_meta WHERE key = 'last_purge'").get() as
    | { value: string }
    | undefined;
  if (row?.value === today) return;

  const cutoff = now - 90 * 24 * 60 * 60 * 1000;
  db.transaction(() => {
    db.prepare("DELETE FROM analytics_pageviews WHERE occurred_at < ?").run(cutoff);
    db.prepare("DELETE FROM analytics_sessions WHERE last_seen_at < ?").run(cutoff);
    db.prepare("DELETE FROM admin_login_attempts WHERE window_start < ?").run(now - 24 * 60 * 60 * 1000);
    db.prepare(
      "INSERT INTO analytics_meta(key, value) VALUES('last_purge', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).run(today);
  })();
}

export function purgeAnalytics(db: DatabaseHandle, now = Date.now()): void {
  const cutoff = now - 90 * 24 * 60 * 60 * 1000;
  db.transaction(() => {
    db.prepare("DELETE FROM analytics_pageviews WHERE occurred_at < ?").run(cutoff);
    db.prepare("DELETE FROM analytics_sessions WHERE last_seen_at < ?").run(cutoff);
  })();
}

export function recordPageview(db: DatabaseHandle, input: PageviewInput): "accepted" | "duplicate" {
  const tx = db.transaction((value: PageviewInput) => {
    const existing = db
      .prepare("SELECT 1 FROM analytics_pageviews WHERE event_id = ?")
      .get(value.eventId);
    if (existing) return "duplicate" as const;

    const session = db
      .prepare("SELECT visitor_id FROM analytics_sessions WHERE id = ?")
      .get(value.sessionId) as { visitor_id: string } | undefined;
    if (!session) {
      db.prepare(
        `INSERT INTO analytics_sessions
          (id, visitor_id, started_at, last_seen_at, landing_path, referrer_host, device_type, country_code)
         VALUES (@sessionId, @visitorId, @occurredAt, @occurredAt, @landingPath, @referrerHost, @deviceType, @countryCode)`,
      ).run(value);
    } else if (session.visitor_id !== value.visitorId) {
      return "duplicate" as const;
    }

    db.prepare(
      "INSERT INTO analytics_pageviews(event_id, session_id, path, occurred_at) VALUES (?, ?, ?, ?)",
    ).run(value.eventId, value.sessionId, value.path, value.occurredAt);
    db.prepare("UPDATE analytics_sessions SET last_seen_at = ? WHERE id = ?").run(
      value.occurredAt,
      value.sessionId,
    );
    return "accepted" as const;
  });
  return tx(input);
}

export function deleteVisitorData(db: DatabaseHandle, visitorId: string): void {
  db.transaction(() => {
    db.prepare("DELETE FROM analytics_sessions WHERE visitor_id = ?").run(visitorId);
  })();
}

function dayString(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

const DAY_MS = 24 * 60 * 60 * 1000;

function utcStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function rows(statement: Database.Statement): DashboardRow[] {
  return (statement.all() as Array<{ label: string | null; value: number }>).map((row) => ({
    label: row.label || "Inconnu",
    value: Number(row.value),
  }));
}

export function getDashboardStats(
  db: DatabaseHandle,
  periodDays: 7 | 30 | 90,
  now = Date.now(),
): DashboardStats {
  const from = utcStartOfDay(now) - (periodDays - 1) * DAY_MS;
  // Keep the comparison window exactly as long as the current one while
  // making the two windows adjacent and non-overlapping at millisecond
  // precision. The current period remains [from, now], as it has historically
  // included the current partial UTC day.
  const currentDuration = now - from + 1;
  const previousFrom = from - currentDuration;
  const previousTo = from - 1;
  const base = db
    .prepare(
      `SELECT
        COUNT(DISTINCT CASE WHEN p.occurred_at >= ? AND p.occurred_at <= ? THEN s.visitor_id END) AS visitors,
        COUNT(DISTINCT CASE WHEN p.occurred_at >= ? AND p.occurred_at <= ? THEN s.id END) AS visits,
        COALESCE(SUM(CASE WHEN p.occurred_at >= ? AND p.occurred_at <= ? THEN 1 ELSE 0 END), 0) AS pageviews,
        COUNT(DISTINCT CASE WHEN p.occurred_at >= ? AND p.occurred_at <= ? THEN s.visitor_id END) AS previous_visitors,
        COUNT(DISTINCT CASE WHEN p.occurred_at >= ? AND p.occurred_at <= ? THEN s.id END) AS previous_visits,
        COALESCE(SUM(CASE WHEN p.occurred_at >= ? AND p.occurred_at <= ? THEN 1 ELSE 0 END), 0) AS previous_pageviews
       FROM analytics_pageviews p
       JOIN analytics_sessions s ON s.id = p.session_id
       WHERE p.occurred_at >= ? AND p.occurred_at <= ?`,
    )
    .get(
      from,
      now,
      from,
      now,
      from,
      now,
      previousFrom,
      previousTo,
      previousFrom,
      previousTo,
      previousFrom,
      previousTo,
      previousFrom,
      now,
    ) as {
      visitors: number;
      visits: number;
      pageviews: number;
      previous_visitors: number;
      previous_visits: number;
      previous_pageviews: number;
    };
  const active = db
    .prepare(
      `SELECT COUNT(DISTINCT s.visitor_id) AS active
       FROM analytics_pageviews p JOIN analytics_sessions s ON s.id = p.session_id
       WHERE p.occurred_at >= ? AND p.occurred_at <= ?`,
    )
    .get(now - 5 * 60 * 1000, now) as { active: number };

  const daily = db
    .prepare(
      `SELECT substr(datetime(p.occurred_at / 1000, 'unixepoch'), 1, 10) AS date,
          COUNT(DISTINCT s.visitor_id) AS visitors,
          COUNT(p.id) AS pageviews
       FROM analytics_pageviews p JOIN analytics_sessions s ON s.id = p.session_id
       WHERE p.occurred_at >= ? AND p.occurred_at <= ?
       GROUP BY date ORDER BY date ASC`,
    )
    .all(from, now) as Array<{ date: string; visitors: number; pageviews: number }>;
  const trendMap = new Map(daily.map((row) => [row.date, row]));
  const trend: DashboardStats["trend"] = [];
  for (let i = 0; i < periodDays; i += 1) {
    const timestamp = from + i * DAY_MS;
    const date = dayString(timestamp);
    const row = trendMap.get(date);
    trend.push({ date, visitors: Number(row?.visitors ?? 0), pageviews: Number(row?.pageviews ?? 0) });
  }

  const topPages = rows(
    db.prepare(
      `SELECT p.path AS label, COUNT(*) AS value
       FROM analytics_pageviews p WHERE p.occurred_at >= ? AND p.occurred_at <= ?
       GROUP BY p.path ORDER BY value DESC, label ASC LIMIT ?`,
    ).bind(from, now, 10),
  );
  const sources = rows(
    db.prepare(
      `SELECT COALESCE(NULLIF(s.referrer_host, ''), 'Direct') AS label, COUNT(DISTINCT s.id) AS value
       FROM analytics_pageviews p JOIN analytics_sessions s ON s.id = p.session_id
       WHERE p.occurred_at >= ? AND p.occurred_at <= ?
       GROUP BY label ORDER BY value DESC, label ASC LIMIT ?`,
    ).bind(from, now, 10),
  );
  const devices = rows(
    db.prepare(
      `SELECT s.device_type AS label, COUNT(DISTINCT s.id) AS value
       FROM analytics_pageviews p JOIN analytics_sessions s ON s.id = p.session_id
       WHERE p.occurred_at >= ? AND p.occurred_at <= ?
       GROUP BY label ORDER BY value DESC, label ASC LIMIT ?`,
    ).bind(from, now, 10),
  );
  const countries = rows(
    db.prepare(
      `SELECT COALESCE(NULLIF(s.country_code, ''), 'unknown') AS label, COUNT(DISTINCT s.id) AS value
       FROM analytics_pageviews p JOIN analytics_sessions s ON s.id = p.session_id
       WHERE p.occurred_at >= ? AND p.occurred_at <= ?
       GROUP BY label ORDER BY value DESC, label ASC LIMIT ?`,
    ).bind(from, now, 10),
  );

  return {
    periodDays,
    from,
    to: now,
    previousFrom,
    previousTo,
    visitors: Number(base.visitors),
    visits: Number(base.visits),
    pageviews: Number(base.pageviews),
    previousVisitors: Number(base.previous_visitors),
    previousVisits: Number(base.previous_visits),
    previousPageviews: Number(base.previous_pageviews),
    activeVisitors: Number(active.active),
    trend,
    topPages,
    sources,
    devices,
    countries,
  };
}

export type AdminLoginAttempt = {
  window_start: number;
  failures: number;
  locked_until: number;
};

export function getLoginAttempt(db: DatabaseHandle, ipHash: string): AdminLoginAttempt | undefined {
  return db.prepare("SELECT window_start, failures, locked_until FROM admin_login_attempts WHERE ip_hash = ?").get(ipHash) as
    | AdminLoginAttempt
    | undefined;
}

export function noteLoginFailure(db: DatabaseHandle, ipHash: string, now = Date.now()): AdminLoginAttempt {
  const existing = getLoginAttempt(db, ipHash);
  const withinWindow = existing && now - existing.window_start < 15 * 60 * 1000;
  const failures = withinWindow ? existing.failures + 1 : 1;
  const windowStart = withinWindow ? existing.window_start : now;
  const lockedUntil = failures >= 5 ? now + 15 * 60 * 1000 : 0;
  db.prepare(
    `INSERT INTO admin_login_attempts(ip_hash, window_start, failures, locked_until)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ip_hash) DO UPDATE SET window_start=excluded.window_start,
       failures=excluded.failures, locked_until=excluded.locked_until`,
  ).run(ipHash, windowStart, failures, lockedUntil);
  return { window_start: windowStart, failures, locked_until: lockedUntil };
}

export function clearLoginFailures(db: DatabaseHandle, ipHash: string): void {
  db.prepare("DELETE FROM admin_login_attempts WHERE ip_hash = ?").run(ipHash);
}

export type { DatabaseHandle as AnalyticsDatabase };
