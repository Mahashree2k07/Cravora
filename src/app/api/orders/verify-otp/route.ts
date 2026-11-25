import { NextRequest, NextResponse } from "next/server";
import {
  OTP_COOKIE,
  SESSION_COOKIE,
  cookieOptions,
  createSession,
  createSignedValue,
  readSignedValue,
  verifyOtpHash,
} from "@/lib/activity-auth";

export const dynamic = "force-dynamic";

type OtpChallenge = {
  email: string;
  otpHash: string;
  expiresAt: number;
  sentAt: number;
  attempts: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const otp = String(body.otp ?? "").trim();

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "Please enter the six-digit verification code." },
        { status: 400 }
      );
    }

    const token = request.cookies.get(OTP_COOKIE)?.value;
    const challenge = readSignedValue<OtpChallenge>(token);

    if (!challenge || challenge.expiresAt < Date.now() / 1000) {
      const response = NextResponse.json(
        { message: "Your verification code has expired. Please request a new one." },
        { status: 401 }
      );
      response.cookies.set(OTP_COOKIE, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }

    if (challenge.attempts >= 5) {
      const response = NextResponse.json(
        { message: "Too many incorrect attempts. Please request a new code." },
        { status: 429 }
      );
      response.cookies.set(OTP_COOKIE, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }

    if (!verifyOtpHash(challenge.email, otp, challenge.otpHash)) {
      const updatedChallenge = {
        ...challenge,
        attempts: challenge.attempts + 1,
      };

      const response = NextResponse.json(
        {
          message: `Incorrect code. ${4 - challenge.attempts} attempts remaining.`,
        },
        { status: 401 }
      );

      response.cookies.set(
        OTP_COOKIE,
        createSignedValue(updatedChallenge),
        { ...cookieOptions, maxAge: Math.max(0, challenge.expiresAt - Math.floor(Date.now() / 1000)) }
      );

      return response;
    }

    const response = NextResponse.json({
      message: "Email verified successfully.",
    });

    response.cookies.set(SESSION_COOKIE, createSession(challenge.email), {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set(OTP_COOKIE, "", {
      ...cookieOptions,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      { message: "Unable to verify the code. Please try again." },
      { status: 500 }
    );
  }
}
