import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { userSignupSchema } from "@/lib/validations";
import { UserAuthError, setUserSessionCookie, signUpUser } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();
    const limit = checkRateLimit("user-signup", ip, 10, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many sign-up attempts. Please try again later.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = userSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please check your details", code: "invalid" },
        { status: 400 }
      );
    }
    const { honeypot, ...input } = parsed.data;
    if (honeypot) {
      return NextResponse.json({ error: "Please check your details", code: "invalid" }, { status: 400 });
    }

    const { user, secret } = await signUpUser(input);
    await setUserSessionCookie(secret);
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    if (err instanceof UserAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ error: "Sign up failed. Please try again.", code: "unknown" }, { status: 500 });
  }
}
