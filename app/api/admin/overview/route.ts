import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/auth";
import { getAnalyticsSummary } from "@/lib/admin-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") || "week") as "today" | "week" | "month" | "all";
  const summary = await getAnalyticsSummary(range);

  return NextResponse.json(summary);
}
