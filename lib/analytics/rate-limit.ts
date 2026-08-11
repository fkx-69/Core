
type Bucket = { startedAt: number; count: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_EVENTS = 60;

export function allowPageview(sourceHash: string, now = Date.now()): boolean {
  const current = buckets.get(sourceHash);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(sourceHash, { startedAt: now, count: 1 });
    if (buckets.size > 5000) {
      for (const [key, bucket] of buckets) {
        if (now - bucket.startedAt >= WINDOW_MS) buckets.delete(key);
      }
    }
    return true;
  }
  if (current.count >= MAX_EVENTS) return false;
  current.count += 1;
  return true;
}

export function resetPageviewRateLimitForTests(): void {
  buckets.clear();
}

