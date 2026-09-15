import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
