import { NextRequest, NextResponse } from "next/server";
import { listPublished } from "@/lib/blog-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  return NextResponse.json({ blogs: listPublished({ search, category }) });
}
