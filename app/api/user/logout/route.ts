import { NextResponse } from "next/server";
import { clearUserSessionCookie, getUserSessionSecret, logoutUser } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST() {
  const secret = await getUserSessionSecret();
  await logoutUser(secret);
  await clearUserSessionCookie();
  return NextResponse.json({ ok: true });
}
