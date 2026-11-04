import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID, Query } from "@/lib/appwrite";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "data", "subscribers.json");

function readLocal(): any[] {
  try {
    if (!fs.existsSync(LOCAL_FALLBACK_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_FALLBACK_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveLocal(entry: any) {
  try {
    const list = readLocal();
    if (!list.some((item) => item.email === entry.email)) {
      list.unshift(entry);
      fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(list, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Local subscribers save error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();

    const limit = checkRateLimit("newsletter", ip, 5, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const { email, honeypot } = result.data;
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const normalizedEmail = email.toLowerCase();
    const now = new Date().toISOString();
    const entry = {
      email: normalizedEmail,
      status: "subscribed",
      createdAt: now,
    };

    if (isAppwriteConfigured()) {
      try {
        const { databases } = createAdminClient();

        // Check if already subscribed
        const existing = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.subscribers,
          [Query.equal("email", normalizedEmail), Query.limit(1)]
        );

        if (existing.total > 0) {
          return NextResponse.json({ ok: true, alreadySubscribed: true });
        }

        const doc = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.subscribers,
          ID.unique(),
          entry
        );

        return NextResponse.json({ ok: true, id: doc.$id });
      } catch (err: any) {
        console.error("Appwrite newsletter error:", err?.message);
        saveLocal({ id: "local_" + Date.now(), ...entry });
        return NextResponse.json({ ok: true, id: "fallback" });
      }
    }

    saveLocal({ id: "local_" + Date.now(), ...entry });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
