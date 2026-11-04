import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/auth";
import { getWaitlistEntries, updateWaitlistStatus, deleteWaitlistEntry } from "@/lib/admin-data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const interest = searchParams.get("interest") || "All";
  const status = searchParams.get("status") || "All";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const data = await getWaitlistEntries({ search, interest, status, page, limit });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) {
    return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
  }

  const ok = await updateWaitlistStatus(id, status);
  if (!ok) return NextResponse.json({ error: "Failed to update status" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await deleteWaitlistEntry(id);
  return NextResponse.json({ ok: true });
}
