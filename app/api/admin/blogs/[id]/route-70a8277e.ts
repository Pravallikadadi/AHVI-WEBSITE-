import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/auth";
import { getById, remove, setStatus, update } from "@/lib/blog-store";
import type { BlogInput } from "@/lib/blog-types";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const blog = getById(id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blog });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as BlogInput & { onlyStatus?: boolean };
  if (body.onlyStatus) {
    const blog = setStatus(id, body.status);
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ blog });
  }
  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }
  if (body.status === "published" && (!body.category || !body.coverImage)) {
    return NextResponse.json({ error: "Category and cover image are required to publish" }, { status: 400 });
  }
  const blog = update(id, body);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blog });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const ok = remove(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
