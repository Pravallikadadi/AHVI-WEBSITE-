import { NextRequest, NextResponse } from "next/server";
import { waitlistEntrySchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID, Query } from "@/lib/appwrite";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "data", "waitlist.json");

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
    const existingIndex = list.findIndex((item) => item.email === entry.email);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...entry };
    } else {
      list.unshift(entry);
    }
    fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Local waitlist save error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();

    // Rate limiting: 5 submissions per 10 minutes per IP
    const limit = checkRateLimit("waitlist", ip, 5, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = waitlistEntrySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid waitlist submission" },
        { status: 400 }
      );
    }

    const { name, email, phone, interests, referralCode, honeypot } = result.data;

    // Honeypot trap
    if (honeypot) {
      return NextResponse.json({ ok: true, alreadyExists: false });
    }

    const normalizedEmail = email.toLowerCase();
    const now = new Date().toISOString();

    const entry = {
      name,
      email: normalizedEmail,
      phone: phone || "",
      interests: interests || [],
      referralCode: referralCode || "",
      status: "pending",
      createdAt: now,
    };

    if (isAppwriteConfigured()) {
      try {
        const { databases } = createAdminClient();

        // Deduplication: Check if email already on waitlist
        const existing = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.waitlist,
          [Query.equal("email", normalizedEmail), Query.limit(1)]
        );

        if (existing.total > 0) {
          // Already on list - update interests if new ones provided
          const existingDoc = existing.documents[0];
          if (existingDoc && interests && interests.length > 0) {
            const mergedInterests = Array.from(new Set([...(existingDoc.interests || []), ...interests]));
            await databases.updateDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.waitlist,
              existingDoc.$id,
              { interests: mergedInterests }
            );
          }
          return NextResponse.json({ ok: true, alreadyExists: true, message: "Already on waitlist" });
        }

        const doc = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.waitlist,
          ID.unique(),
          entry
        );

        return NextResponse.json({ ok: true, id: doc.$id });
      } catch (err: any) {
        console.error("Appwrite waitlist error:", err?.message);
        saveLocal({ id: "local_" + Date.now(), ...entry });
        return NextResponse.json({ ok: true, id: "fallback" });
      }
    }

    // Local fallback
    const localList = readLocal();
    const already = localList.some((x) => x.email === normalizedEmail);
    saveLocal({ id: "local_" + Date.now(), ...entry });

    return NextResponse.json({ ok: true, alreadyExists: already });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Failed to join waitlist." }, { status: 500 });
  }
}
