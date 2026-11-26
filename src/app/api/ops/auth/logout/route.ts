import { NextResponse } from "next/server";
import { OPS_SESSION_COOKIE, opsCookieOptions } from "@/lib/ops-auth";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out successfully." });
  response.cookies.set(OPS_SESSION_COOKIE, "", {
    ...opsCookieOptions,
    maxAge: 0,
  });
  return response;
}
