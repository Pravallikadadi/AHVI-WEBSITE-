import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isAdminAuthed } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blogs");

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Only JPG, PNG or WebP images are allowed" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const name = crypto.randomUUID() + "." + ext;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

  return NextResponse.json({ url: "/uploads/blogs/" + name });
}
