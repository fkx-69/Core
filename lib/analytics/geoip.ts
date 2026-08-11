
import net from "node:net";

import { Reader } from "@maxmind/geoip2-node";

import {
  geoIpDatabasePath,
  trustProxyHeaders,
} from "@/lib/analytics/config";

type CountryReader = Awaited<ReturnType<typeof Reader.open>>;
let readerPromise: Promise<CountryReader | null> | null = null;

function trustedClientIp(request: Request): string | null {
  if (!trustProxyHeaders()) return null;
  const header = request.headers.get("x-forwarded-for");
  if (!header) return null;
  // Caddy is the sole trusted proxy. The left-most address is the original
  // client address in its forwarded chain.
  const candidate = header.split(",")[0]?.trim() ?? "";
  return net.isIP(candidate) ? candidate : null;
}

async function getReader(): Promise<CountryReader | null> {
  if (!readerPromise) {
    const dbPath = geoIpDatabasePath();
    readerPromise = dbPath
      ? Reader.open(dbPath).catch(() => null)
      : Promise.resolve(null);
  }
  return readerPromise;
}

export async function lookupCountry(request: Request): Promise<string | null> {
  const ip = trustedClientIp(request);
  if (!ip) return null;
  const reader = await getReader();
  if (!reader) return null;
  try {
    const result = reader.country(ip);
    const code = result.country?.isoCode;
    return typeof code === "string" && /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}

export function resetGeoIpReaderForTests(): void {
  readerPromise = null;
}
