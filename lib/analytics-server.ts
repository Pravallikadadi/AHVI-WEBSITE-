import { headers } from "next/headers";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID } from "@/lib/appwrite";
import fs from "fs";
import path from "path";

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "data", "analytics.json");

export interface StoredAnalyticsEvent {
  id?: string;
  eventType: "pageview" | "click" | "form_start" | "form_submit" | "session_start";
  path: string;
  referrer: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  sessionId: string;
  visitorId: string;
  deviceType: "desktop" | "mobile" | "tablet" | "other";
  browser: string;
  target?: string;
  metadata?: string; // serialized JSON
  timestamp: string;
}

/**
 * Parse device category and browser safely from User-Agent string
 */
export function parseUserAgent(ua: string): {
  deviceType: "desktop" | "mobile" | "tablet" | "other";
  browser: string;
} {
  const lower = ua.toLowerCase();

  // Device detection
  let deviceType: "desktop" | "mobile" | "tablet" | "other" = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(lower)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(lower)) {
    deviceType = "mobile";
  }

  // Browser detection
  let browser = "Other";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome/") || lower.includes("crios/")) browser = "Chrome";
  else if (lower.includes("firefox/") || lower.includes("fxios/")) browser = "Firefox";
  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";
  else if (lower.includes("opr/") || lower.includes("opera/")) browser = "Opera";

  return { deviceType, browser };
}

/**
 * Strip sensitive query parameters and credentials from URLs and paths
 */
export function sanitizeUrlPath(rawUrlOrPath: string): string {
  if (!rawUrlOrPath) return "";
  try {
    const isFullUrl = rawUrlOrPath.startsWith("http://") || rawUrlOrPath.startsWith("https://");
    const parsed = new URL(
      isFullUrl ? rawUrlOrPath : `https://ahvi.in${rawUrlOrPath.startsWith("/") ? "" : "/"}${rawUrlOrPath}`
    );
    const sensitiveKeys = new Set([
      "token",
      "auth",
      "key",
      "secret",
      "password",
      "pwd",
      "email",
      "code",
      "session",
      "access_token",
      "api_key",
      "jwt",
    ]);

    for (const key of Array.from(parsed.searchParams.keys())) {
      const lower = key.toLowerCase();
      if (
        sensitiveKeys.has(lower) ||
        lower.includes("token") ||
        lower.includes("secret") ||
        lower.includes("password")
      ) {
        parsed.searchParams.delete(key);
      }
    }
    return isFullUrl ? parsed.toString() : `${parsed.pathname}${parsed.search ? parsed.search : ""}`;
  } catch {
    return rawUrlOrPath.split("?")[0] || "";
  }
}

/**
 * Filter out sensitive keys from analytics metadata to ensure zero PII leakage
 */
export function sanitizeMetadata(metadata: any): Record<string, any> {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
  const sensitiveRegex = /password|pwd|token|secret|key|credit|card|cvv|ssn|auth|jwt|email|phone|bearer/i;
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(metadata)) {
    if (sensitiveRegex.test(k)) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      clean[k] = v;
    }
  }
  return clean;
}

/**
 * Classify traffic source based on referrer
 */
export function classifyTrafficSource(referrer: string, utmSource?: string): string {
  if (utmSource) return utmSource.toLowerCase();
  if (!referrer) return "direct";

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    if (host.includes("google")) return "google";
    if (host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) return "search";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("facebook") || host.includes("fb.com")) return "facebook";
    if (host.includes("twitter") || host.includes("x.com")) return "x/twitter";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("reddit")) return "reddit";
    if (host.includes("youtube")) return "youtube";
    if (host.includes("ahvi") || host.includes("vercel.app") || host.includes("localhost")) return "internal";

    return host;
  } catch {
    return "referral";
  }
}

export function saveLocalAnalytics(event: StoredAnalyticsEvent) {
  try {
    const dir = path.dirname(LOCAL_FALLBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const existing = fs.existsSync(LOCAL_FALLBACK_FILE)
      ? JSON.parse(fs.readFileSync(LOCAL_FALLBACK_FILE, "utf8"))
      : [];
    // Keep max 5000 recent events locally
    existing.unshift(event);
    if (existing.length > 5000) existing.length = 5000;
    fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(existing, null, 2), "utf8");
  } catch (err) {
    console.error("Local analytics save error:", err);
  }
}

export function readLocalAnalytics(): StoredAnalyticsEvent[] {
  try {
    if (!fs.existsSync(LOCAL_FALLBACK_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_FALLBACK_FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function storeAnalyticsEvent(event: Omit<StoredAnalyticsEvent, "id">): Promise<void> {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.analytics,
        ID.unique(),
        {
          eventType: event.eventType,
          path: event.path,
          referrer: event.referrer || "",
          source: event.source || "direct",
          utmSource: event.utmSource || "",
          utmMedium: event.utmMedium || "",
          utmCampaign: event.utmCampaign || "",
          utmTerm: event.utmTerm || "",
          utmContent: event.utmContent || "",
          sessionId: event.sessionId,
          visitorId: event.visitorId,
          deviceType: event.deviceType,
          browser: event.browser,
          target: event.target || "",
          metadata: typeof event.metadata === "string" ? event.metadata : JSON.stringify(event.metadata || {}),
          timestamp: event.timestamp,
        }
      );
      return;
    } catch (err: any) {
      console.error("Appwrite analytics write error:", err?.message);
    }
  }

  saveLocalAnalytics({ id: "ev_" + Date.now() + Math.random().toString(36).slice(2, 6), ...event });
}
