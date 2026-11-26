import { NextRequest, NextResponse } from "next/server";

const OPS_SESSION_COOKIE = "cravora_ops_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ops") && pathname !== "/ops/login") {
    const token = request.cookies.get(OPS_SESSION_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL("/ops/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops/:path*"],
};
