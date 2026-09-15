import { NextResponse } from "next/server";
import { getBySlug, getRelated } from "@/lib/blog-store";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBySlug(slug);
  if (!blog || blog.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ blog, related: getRelated(blog) });
}
