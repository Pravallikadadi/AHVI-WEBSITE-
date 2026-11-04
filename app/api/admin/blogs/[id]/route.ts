import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/auth";
import { getById, remove, setStatus, update } from "@/lib/blog-store";
import type { BlogInput } from "@/lib/blog-types";
import { blogInputSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const blog = await getById(id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blog });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.onlyStatus) {
    const blog = await setStatus(id, body.status);
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ blog });
  }

  const parsed = blogInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid blog input" },
      { status: 400 }
    );
  }

  const blog = await update(id, parsed.data as BlogInput);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blog });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await remove(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
