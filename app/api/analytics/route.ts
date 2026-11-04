import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { parseUserAgent, classifyTrafficSource, storeAnalyticsEvent } from "@/lib/analytics-server";
import { analyticsEventSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const reqHeaders = await headers();
    // Respect Do Not Track / Global Privacy Control headers
    const dnt = reqHeaders.get("dnt") || reqHeaders.get("sec-gpc");
    if (dnt === "1") {
      return NextResponse.json({ ok: true, ignored: "dnt" });
    }

    const ip = await getClientIp();
    // Rate limit: 120 analytics events per minute per IP
    const limit = checkRateLimit("analytics", ip, 120, 60 * 1000);
    if (!limit.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const userAgent = reqHeaders.get("user-agent") || "";
    const { deviceType, browser } = parseUserAgent(userAgent);

    const body = await req.json();
    const events = Array.isArray(body) ? body : [body];

    const timestamp = new Date().toISOString();

    for (const raw of events.slice(0, 20)) {
      const parsed = analyticsEventSchema.safeParse(raw);
      if (!parsed.success) continue;

      const data = parsed.data;
      const source = classifyTrafficSource(data.referrer, data.utmSource);

      await storeAnalyticsEvent({
        eventType: data.eventType,
        path: data.path.slice(0, 300),
        referrer: (data.referrer || "").slice(0, 500),
        source,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmTerm: data.utmTerm,
        utmContent: data.utmContent,
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        deviceType: data.deviceType || deviceType,
        browser: data.browser && data.browser !== "Other" ? data.browser : browser,
        target: (data.target || "").slice(0, 150),
        metadata: JSON.stringify(data.metadata || {}),
        timestamp,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics ingestion error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
