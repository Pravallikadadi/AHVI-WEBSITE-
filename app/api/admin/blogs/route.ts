import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/auth";
import { create, listAll } from "@/lib/blog-store";
import type { BlogInput } from "@/lib/blog-types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "All";
  const status = searchParams.get("status") || "All";
  let blogs = listAll();
  if (category !== "All") blogs = blogs.filter((b) => b.category === category);
  if (status !== "All") blogs = blogs.filter((b) => b.status === status.toLowerCase());
  if (search) blogs = blogs.filter((b) => (b.title + " " + b.excerpt + " " + b.author + " " + (b.tags || []).join(" ")).toLowerCase().includes(search));
  return NextResponse.json({ blogs });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as BlogInput;
  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }
  if (body.status === "published" && (!body.category || !body.coverImage)) {
    return NextResponse.json({ error: "Category and cover image are required to publish" }, { status: 400 });
  }
  const blog = create(body);
  return NextResponse.json({ blog }, { status: 201 });
}
