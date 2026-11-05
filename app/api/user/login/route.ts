import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { userLoginSchema } from "@/lib/validations";
import { UserAuthError, loginUser, setUserSessionCookie } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();
    const ipLimit = checkRateLimit("user-login", ip, 20, 15 * 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = userLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid credentials", code: "invalid" },
        { status: 400 }
      );
    }

    // Per-account throttle slows password guessing against a single email from many IPs.
    const emailLimit = checkRateLimit("user-login-email", parsed.data.email, 8, 15 * 60 * 1000);
    if (!emailLimit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const { user, secret } = await loginUser(parsed.data);
    await setUserSessionCookie(secret);
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    if (err instanceof UserAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ error: "Login failed. Please try again.", code: "unknown" }, { status: 500 });
  }
}
