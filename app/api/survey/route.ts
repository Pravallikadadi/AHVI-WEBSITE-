import { NextRequest, NextResponse } from "next/server";
import { surveyResponseSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID } from "@/lib/appwrite";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "data", "surveys.json");

function saveLocal(data: any) {
  try {
    const dir = path.dirname(LOCAL_FALLBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const existing = fs.existsSync(LOCAL_FALLBACK_FILE)
      ? JSON.parse(fs.readFileSync(LOCAL_FALLBACK_FILE, "utf8"))
      : [];
    existing.unshift(data);
    fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(existing, null, 2), "utf8");
  } catch (err) {
    console.error("Local survey save error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();

    const limit = checkRateLimit("survey", ip, 10, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many survey responses. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = surveyResponseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid survey response" },
        { status: 400 }
      );
    }

    const { want, challenge, honeypot } = result.data;
    if (honeypot) {
      return NextResponse.json({ ok: true, id: "ack" });
    }

    const now = new Date().toISOString();
    const record = {
      want: want || [],
      challenge: challenge || "",
      createdAt: now,
    };

    if (isAppwriteConfigured()) {
      try {
        const { databases } = createAdminClient();
        const doc = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.surveys,
          ID.unique(),
          record
        );
        return NextResponse.json({ ok: true, id: doc.$id });
      } catch (err: any) {
        console.error("Appwrite survey error:", err?.message);
        saveLocal({ id: "local_" + Date.now(), ...record });
        return NextResponse.json({ ok: true, id: "fallback" });
      }
    }

    saveLocal({ id: "local_" + Date.now(), ...record });
    return NextResponse.json({ ok: true, id: "local" });
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json({ error: "Failed to record survey response." }, { status: 500 });
  }
}
