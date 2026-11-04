import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/auth";
import {
  getWaitlistEntries,
  getContactSubmissions,
  getSurveyResponses,
  getSubscribers,
} from "@/lib/admin-data";
import { readLocalAnalytics } from "@/lib/analytics-server";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, Query } from "@/lib/appwrite";

export const runtime = "nodejs";

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = Array.isArray(val) ? val.join("; ") : String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

function toCsv(rows: Record<string, any>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    const line = headers.map((h) => escapeCsvValue(row[h])).join(",");
    lines.push(line);
  }

  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "waitlist";
  const nowStr = new Date().toISOString().slice(0, 10);

  let csv = "";
  let filename = `ahvi-${type}-${nowStr}.csv`;

  if (type === "waitlist") {
    const data = await getWaitlistEntries({ limit: 5000 });
    const rows = data.items.map((i) => ({
      ID: i.id,
      Name: i.name,
      Email: i.email,
      Phone: i.phone || "",
      Interests: i.interests,
      Status: i.status,
      "Referral Code": i.referralCode || "",
      "Created At": i.createdAt,
    }));
    csv = toCsv(rows);
  } else if (type === "contacts") {
    const data = await getContactSubmissions({ limit: 5000 });
    const rows = data.items.map((i) => ({
      ID: i.id,
      Name: i.name,
      Email: i.email,
      Subject: i.subject,
      Message: i.message,
      Status: i.status,
      "Created At": i.createdAt,
    }));
    csv = toCsv(rows);
  } else if (type === "surveys") {
    const data = await getSurveyResponses({ limit: 5000 });
    const rows = data.items.map((i) => ({
      ID: i.id,
      Wants: i.want,
      Challenge: i.challenge,
      "Created At": i.createdAt,
    }));
    csv = toCsv(rows);
  } else if (type === "subscribers") {
    const data = await getSubscribers({ limit: 5000 });
    const rows = data.items.map((i) => ({
      ID: i.id,
      Email: i.email,
      Status: i.status,
      "Subscribed At": i.createdAt,
    }));
    csv = toCsv(rows);
  } else if (type === "analytics") {
    let events: any[] = [];
    if (isAppwriteConfigured()) {
      try {
        const { databases } = createAdminClient();
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.analytics,
          [Query.limit(5000), Query.orderDesc("timestamp")]
        );
        events = res.documents;
      } catch (err: any) {
        console.warn("Appwrite export fallback:", err?.message);
      }
    }
    if (events.length === 0) {
      events = readLocalAnalytics();
    }
    const rows = events.map((e) => ({
      "Event Type": e.eventType,
      Path: e.path,
      Source: e.source,
      Referrer: e.referrer,
      "UTM Source": e.utmSource || "",
      "UTM Medium": e.utmMedium || "",
      "UTM Campaign": e.utmCampaign || "",
      "Device Type": e.deviceType,
      Browser: e.browser,
      Target: e.target || "",
      Timestamp: e.timestamp || e.$createdAt,
    }));
    csv = toCsv(rows);
  } else {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
