import { NextRequest, NextResponse } from "next/server";
import { contactSubmissionSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID } from "@/lib/appwrite";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "data", "contacts.json");

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
    console.error("Local contacts save error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();

    // Rate limiting: 5 contact requests per 15 min per IP
    const limit = checkRateLimit("contact", ip, 5, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = contactSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    // Honeypot spam trap
    if (honeypot) {
      // Fake success for bots
      return NextResponse.json({ ok: true, id: "ack" });
    }

    const now = new Date().toISOString();
    const submission = {
      name: name || "Anonymous",
      email: email.toLowerCase(),
      subject: subject || "Website Contact Form",
      message,
      status: "new",
      createdAt: now,
    };

    if (isAppwriteConfigured()) {
      try {
        const { databases } = createAdminClient();
        const doc = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.contacts,
          ID.unique(),
          submission
        );
        return NextResponse.json({ ok: true, id: doc.$id });
      } catch (err: any) {
        console.error("Appwrite contact error:", err?.message);
        // Fallback to local storage if Appwrite collection/db is initializing
        saveLocal({ id: "local_" + Date.now(), ...submission });
        return NextResponse.json({ ok: true, id: "fallback" });
      }
    }

    saveLocal({ id: "local_" + Date.now(), ...submission });
    return NextResponse.json({ ok: true, id: "local" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to process message." }, { status: 500 });
  }
}
