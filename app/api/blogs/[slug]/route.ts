import { NextResponse } from "next/server";
import { getBySlug, getRelated } from "@/lib/blog-store";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBySlug(slug);
  if (!blog || blog.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const related = await getRelated(blog);
  return NextResponse.json({ blog, related });
}
