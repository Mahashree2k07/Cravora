import { NextResponse } from "next/server";
import {
  OTP_COOKIE,
  SESSION_COOKIE,
  cookieOptions,
} from "@/lib/activity-auth";

export async function POST() {
  const response = NextResponse.json({
    message: "You have been logged out successfully.",
  });

  response.cookies.set(SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });

  response.cookies.set(OTP_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });

  return response;
}
