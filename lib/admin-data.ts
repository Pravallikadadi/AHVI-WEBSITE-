import fs from "fs";
import path from "path";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, Query } from "@/lib/appwrite";

const DATA_DIR = path.join(process.cwd(), "data");

function readJsonFile(filename: string): any[] {
  try {
    const file = path.join(DATA_DIR, filename);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

function writeJsonFile(filename: string, data: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

// ==================== WAITLIST ====================
export async function getWaitlistEntries(opts?: {
  search?: string;
  interest?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const offset = (page - 1) * limit;

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const queries = [Query.orderDesc("createdAt"), Query.limit(limit), Query.offset(offset)];

      if (opts?.status && opts.status !== "All") {
        queries.push(Query.equal("status", opts.status.toLowerCase()));
      }

      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.waitlist,
        queries
      );

      let items = res.documents.map((d: any) => ({
        id: d.$id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        interests: d.interests || [],
        referralCode: d.referralCode,
        status: d.status || "pending",
        createdAt: d.createdAt || d.$createdAt,
      }));

      if (opts?.search) {
        const q = opts.search.toLowerCase();
        items = items.filter(
          (i) => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.phone.includes(q)
        );
      }

      if (opts?.interest && opts.interest !== "All") {
        items = items.filter((i) => i.interests.includes(opts.interest));
      }

      return { items, total: res.total, page, limit };
    } catch (err: any) {
      console.warn("Appwrite getWaitlistEntries fallback:", err?.message);
    }
  }

  // Local fallback
  let items = readJsonFile("waitlist.json");
  if (opts?.status && opts.status !== "All") {
    items = items.filter((i) => i.status === opts.status?.toLowerCase());
  }
  if (opts?.interest && opts.interest !== "All") {
    items = items.filter((i) => (i.interests || []).includes(opts.interest));
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    items = items.filter(
      (i) =>
        (i.name || "").toLowerCase().includes(q) ||
        (i.email || "").toLowerCase().includes(q) ||
        (i.phone || "").includes(q)
    );
  }

  const total = items.length;
  const paged = items.slice(offset, offset + limit);
  return { items: paged, total, page, limit };
}

export async function updateWaitlistStatus(id: string, status: string) {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.waitlist,
        id,
        { status }
      );
      return true;
    } catch (err: any) {
      console.warn("Appwrite updateWaitlistStatus fallback:", err?.message);
    }
  }

  const list = readJsonFile("waitlist.json");
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    writeJsonFile("waitlist.json", list);
    return true;
  }
  return false;
}

export async function deleteWaitlistEntry(id: string) {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.waitlist,
        id
      );
    } catch (err: any) {
      console.warn("Appwrite deleteWaitlistEntry fallback:", err?.message);
    }
  }

  const list = readJsonFile("waitlist.json");
  writeJsonFile("waitlist.json", list.filter((i) => i.id !== id));
  return true;
}

// ==================== CONTACTS ====================
export async function getContactSubmissions(opts?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const offset = (page - 1) * limit;

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const queries = [Query.orderDesc("createdAt"), Query.limit(limit), Query.offset(offset)];

      if (opts?.status && opts.status !== "All") {
        queries.push(Query.equal("status", opts.status.toLowerCase()));
      }

      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.contacts,
        queries
      );

      let items = res.documents.map((d: any) => ({
        id: d.$id,
        name: d.name,
        email: d.email,
        subject: d.subject,
        message: d.message,
        status: d.status || "new",
        createdAt: d.createdAt || d.$createdAt,
      }));

      if (opts?.search) {
        const q = opts.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.email.toLowerCase().includes(q) ||
            i.subject.toLowerCase().includes(q) ||
            i.message.toLowerCase().includes(q)
        );
      }

      return { items, total: res.total, page, limit };
    } catch (err: any) {
      console.warn("Appwrite getContactSubmissions fallback:", err?.message);
    }
  }

  // Local fallback
  let items = readJsonFile("contacts.json");
  if (opts?.status && opts.status !== "All") {
    items = items.filter((i) => i.status === opts.status?.toLowerCase());
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    items = items.filter(
      (i) =>
        (i.name || "").toLowerCase().includes(q) ||
        (i.email || "").toLowerCase().includes(q) ||
        (i.subject || "").toLowerCase().includes(q) ||
        (i.message || "").toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const paged = items.slice(offset, offset + limit);
  return { items: paged, total, page, limit };
}

export async function updateContactStatus(id: string, status: string) {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.contacts,
        id,
        { status }
      );
      return true;
    } catch (err: any) {
      console.warn("Appwrite updateContactStatus fallback:", err?.message);
    }
  }

  const list = readJsonFile("contacts.json");
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    writeJsonFile("contacts.json", list);
    return true;
  }
  return false;
}

export async function deleteContactSubmission(id: string) {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.contacts,
        id
      );
    } catch (err: any) {
      console.warn("Appwrite deleteContact fallback:", err?.message);
    }
  }

  const list = readJsonFile("contacts.json");
  writeJsonFile("contacts.json", list.filter((i) => i.id !== id));
  return true;
}

// ==================== SURVEYS ====================
export async function getSurveyResponses(opts?: { search?: string; want?: string; page?: number; limit?: number }) {
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const offset = (page - 1) * limit;

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const queries = [Query.orderDesc("createdAt"), Query.limit(limit), Query.offset(offset)];

      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.surveys,
        queries
      );

      let items = res.documents.map((d: any) => ({
        id: d.$id,
        want: d.want || [],
        challenge: d.challenge || "",
        createdAt: d.createdAt || d.$createdAt,
      }));

      if (opts?.want && opts.want !== "All") {
        items = items.filter((i) => i.want.includes(opts.want));
      }

      if (opts?.search) {
        const q = opts.search.toLowerCase();
        items = items.filter((i) => i.challenge.toLowerCase().includes(q));
      }

      return { items, total: res.total, page, limit };
    } catch (err: any) {
      console.warn("Appwrite getSurveyResponses fallback:", err?.message);
    }
  }

  let items = readJsonFile("surveys.json");
  if (opts?.want && opts.want !== "All") {
    items = items.filter((i) => (i.want || []).includes(opts.want));
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    items = items.filter((i) => (i.challenge || "").toLowerCase().includes(q));
  }

  const total = items.length;
  const paged = items.slice(offset, offset + limit);
  return { items: paged, total, page, limit };
}

export async function deleteSurveyResponse(id: string) {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.surveys,
        id
      );
    } catch (err: any) {
      console.warn("Appwrite deleteSurvey fallback:", err?.message);
    }
  }

  const list = readJsonFile("surveys.json");
  writeJsonFile("surveys.json", list.filter((i) => i.id !== id));
  return true;
}

// ==================== SUBSCRIBERS ====================
export async function getSubscribers(opts?: { search?: string; page?: number; limit?: number }) {
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const offset = (page - 1) * limit;

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const queries = [Query.orderDesc("createdAt"), Query.limit(limit), Query.offset(offset)];

      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.subscribers,
        queries
      );

      let items = res.documents.map((d: any) => ({
        id: d.$id,
        email: d.email,
        status: d.status || "subscribed",
        createdAt: d.createdAt || d.$createdAt,
      }));

      if (opts?.search) {
        const q = opts.search.toLowerCase();
        items = items.filter((i) => i.email.toLowerCase().includes(q));
      }

      return { items, total: res.total, page, limit };
    } catch (err: any) {
      console.warn("Appwrite getSubscribers fallback:", err?.message);
    }
  }

  let items = readJsonFile("subscribers.json");
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    items = items.filter((i) => (i.email || "").toLowerCase().includes(q));
  }

  const total = items.length;
  const paged = items.slice(offset, offset + limit);
  return { items: paged, total, page, limit };
}

export async function deleteSubscriber(id: string) {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.subscribers,
        id
      );
    } catch (err: any) {
      console.warn("Appwrite deleteSubscriber fallback:", err?.message);
    }
  }

  const list = readJsonFile("subscribers.json");
  writeJsonFile("subscribers.json", list.filter((i) => i.id !== id));
  return true;
}

// ==================== ANALYTICS STATS ====================
export async function getAnalyticsSummary(timeRange: "today" | "week" | "month" | "all" = "week") {
  const now = new Date();
  let cutoff = new Date(0); // all time

  if (timeRange === "today") {
    cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (timeRange === "week") {
    cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeRange === "month") {
    cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  let events: any[] = [];

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.analytics,
        [Query.orderDesc("timestamp"), Query.limit(2000)]
      );
      events = res.documents;
    } catch (err: any) {
      console.warn("Appwrite getAnalyticsSummary fallback:", err?.message);
    }
  }

  if (events.length === 0) {
    events = readJsonFile("analytics.json");
  }

  // Filter by time range
  const filtered = events.filter((ev) => {
    const ts = new Date(ev.timestamp || ev.$createdAt || 0).getTime();
    return ts >= cutoff.getTime();
  });

  const pageviews = filtered.filter((e) => e.eventType === "pageview");
  const uniqueVisitors = new Set(filtered.map((e) => e.visitorId)).size;
  const uniqueSessions = new Set(filtered.map((e) => e.sessionId)).size;

  // Top pages
  const pageCounts: Record<string, number> = {};
  for (const pv of pageviews) {
    const p = pv.path || "/";
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Traffic sources
  const sourceCounts: Record<string, number> = {};
  for (const ev of filtered) {
    const s = ev.source || "direct";
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  }
  const topSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Device breakdown
  const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  for (const ev of filtered) {
    const d = (ev.deviceType || "desktop").toLowerCase();
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
  }

  // Browser breakdown
  const browserCounts: Record<string, number> = {};
  for (const ev of filtered) {
    const b = ev.browser || "Other";
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  }
  const topBrowsers = Object.entries(browserCounts)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Daily timeline (last 7 or 14 days)
  const timelineMap: Record<string, { views: number; visitors: Set<string> }> = {};
  const daysToShow = timeRange === "today" ? 1 : timeRange === "month" ? 30 : 7;
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    timelineMap[key] = { views: 0, visitors: new Set() };
  }

  for (const ev of filtered) {
    const day = (ev.timestamp || "").slice(0, 10);
    if (timelineMap[day]) {
      if (ev.eventType === "pageview") timelineMap[day].views++;
      if (ev.visitorId) timelineMap[day].visitors.add(ev.visitorId);
    }
  }

  const timeline = Object.entries(timelineMap).map(([date, data]) => ({
    date,
    label: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    views: data.views,
    visitors: data.visitors.size,
  }));

  // Waitlist, contact, and survey total counts
  const waitlistTotal = (await getWaitlistEntries({ limit: 1 })).total;
  const contactsTotal = (await getContactSubmissions({ limit: 1 })).total;
  const surveysTotal = (await getSurveyResponses({ limit: 1 })).total;
  const subscribersTotal = (await getSubscribers({ limit: 1 })).total;

  return {
    timeRange,
    totalPageviews: pageviews.length,
    uniqueVisitors,
    uniqueSessions,
    waitlistTotal,
    contactsTotal,
    surveysTotal,
    subscribersTotal,
    topPages,
    topSources,
    deviceCounts,
    topBrowsers,
    timeline,
    recentEvents: filtered.slice(0, 15).map((e) => ({
      id: e.$id || e.id || "ev",
      eventType: e.eventType,
      path: e.path,
      target: e.target,
      source: e.source,
      deviceType: e.deviceType,
      timestamp: e.timestamp || e.$createdAt,
    })),
  };
}
