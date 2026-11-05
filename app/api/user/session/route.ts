import { NextResponse } from "next/server";
import {
  clearUserSessionCookie,
  getUserSessionSecret,
  isUserAuthAvailable,
  lookupSession,
} from "@/lib/user-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * Authentication status for the current visitor. The signup/login popup asks this BEFORE deciding to show.
 *  - 200 { authenticated: true, user }        valid session
 *  - 200 { authenticated: false }             definitely logged out (no cookie, or Appwrite rejected it)
 *  - 200 { authenticated: false, available: false }  accounts aren't configured on this deployment
 *  - 503 { authenticated: null }              couldn't verify — callers must not treat this as logged out
 */
export async function GET() {
  if (!isUserAuthAvailable()) {
    return NextResponse.json({ authenticated: false, available: false }, { headers: NO_STORE });
  }

  const secret = await getUserSessionSecret();
  const result = await lookupSession(secret);

  if (result.state === "authenticated") {
    return NextResponse.json({ authenticated: true, user: result.user }, { headers: NO_STORE });
  }
  if (result.state === "anonymous") {
    if (secret) await clearUserSessionCookie(); // stale/expired cookie
    return NextResponse.json({ authenticated: false }, { headers: NO_STORE });
  }
  return NextResponse.json({ authenticated: null }, { status: 503, headers: NO_STORE });
}
