import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isAdminAuthed } from "@/lib/auth";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID } from "@/lib/appwrite";
import { Permission, Role } from "node-appwrite";

export const runtime = "nodejs";

const ALLOWED_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as Record<string, string>;

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blogs");

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPG, PNG or WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload to Appwrite Storage if configured
    if (isAppwriteConfigured()) {
      try {
        const { storage } = createAdminClient();
        const { InputFile } = await import("node-appwrite/file");

        const fileName = `${crypto.randomUUID()}.${ext}`;
        const appwriteFile = InputFile.fromBuffer(buffer, fileName);

        const uploaded = await storage.createFile(
          APPWRITE_CONFIG.bucketId,
          ID.unique(),
          appwriteFile,
          [Permission.read(Role.any())]
        );

        const url = `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${uploaded.$id}/view?project=${APPWRITE_CONFIG.projectId}`;
        return NextResponse.json({ url, fileId: uploaded.$id });
      } catch (err: any) {
        console.error("Appwrite Storage upload error, using local fallback:", err?.message);
      }
    }

    // 2. Local fallback storage
    if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
      fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
    }
    const localName = `${crypto.randomUUID()}.${ext}`;
    fs.writeFileSync(path.join(LOCAL_UPLOAD_DIR, localName), buffer);

    return NextResponse.json({ url: `/uploads/blogs/${localName}` });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
