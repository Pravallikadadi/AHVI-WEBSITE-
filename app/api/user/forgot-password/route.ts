import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validations";
import { UserAuthError, requestPasswordRecovery, siteOrigin } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();
    const ipLimit = checkRateLimit("user-forgot", ip, 5, 60 * 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many reset requests. Please try again later.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please enter a valid email address", code: "invalid" },
        { status: 400 }
      );
    }

    // Also cap per target email so the form can't be used to flood someone's inbox.
    const emailLimit = checkRateLimit("user-forgot-email", parsed.data.email, 3, 60 * 60 * 1000);
    if (!emailLimit.success) {
      return NextResponse.json(
        { error: "Too many reset requests. Please try again later.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const redirectUrl = `${siteOrigin(req.nextUrl.origin)}/reset-password`;
    await requestPasswordRecovery(parsed.data.email, redirectUrl);

    // Identical response whether or not the email belongs to an account.
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UserAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ error: "Couldn't send the reset email. Please try again.", code: "unknown" }, { status: 500 });
  }
}
