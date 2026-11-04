import { headers } from "next/headers";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding-window store
const store = new Map<string, RateLimitRecord>();

// Cleanup stale buckets periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      const valid = record.timestamps.filter((ts) => now - ts < 1000 * 60 * 60);
      if (valid.length === 0) {
        store.delete(key);
      } else {
        record.timestamps = valid;
      }
    }
  }, 1000 * 60 * 5);
}

/**
 * Get client IP address safely from standard proxy headers
 */
export async function getClientIp(): Promise<string> {
  const reqHeaders = await headers();
  const forwarded = reqHeaders.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",");
    if (ips[0]) return ips[0].trim();
  }
  const realIp = reqHeaders.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = reqHeaders.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}

/**
 * Check and record a rate limit hit for a given namespace and key
 * @param namespace e.g. "contact", "waitlist", "login", "analytics"
 * @param key unique identifier, e.g. IP address or email
 * @param limit maximum allowed hits
 * @param windowMs window duration in milliseconds
 */
export function checkRateLimit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const bucketKey = `${namespace}:${key}`;
  const record = store.get(bucketKey) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
  const currentCount = activeTimestamps.length;

  if (currentCount >= limit) {
    const oldestTimestamp = activeTimestamps[0] || now;
    const reset = oldestTimestamp + windowMs - now;
    return {
      success: false,
      remaining: 0,
      reset: Math.max(0, reset),
    };
  }

  activeTimestamps.push(now);
  store.set(bucketKey, { timestamps: activeTimestamps });

  return {
    success: true,
    remaining: limit - activeTimestamps.length,
    reset: windowMs,
  };
}
