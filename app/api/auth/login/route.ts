import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, setAdminSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { adminLoginSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = await getClientIp();
    // Brute force protection: max 5 login attempts per 15 minutes
    const limit = checkRateLimit("login", ip, 5, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (!result.success || !result.token) {
      return NextResponse.json(
        { error: result.error || "Incorrect email or password." },
        { status: 401 }
      );
    }

    await setAdminSession(result.token);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
