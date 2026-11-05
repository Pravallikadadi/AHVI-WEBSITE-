import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validations";
import { UserAuthError, completePasswordRecovery } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();
    const limit = checkRateLimit("user-reset", ip, 10, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please check your details", code: "invalid" },
        { status: 400 }
      );
    }

    await completePasswordRecovery(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UserAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    return NextResponse.json({ error: "Couldn't reset your password. Please try again.", code: "unknown" }, { status: 500 });
  }
}
