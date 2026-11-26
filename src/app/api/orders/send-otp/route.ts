import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { EMAIL_DOT_COM_REGEX } from "@/lib/public-settings";
import {
  createOtp,
  cookieOptions,
  OTP_COOKIE,
  readSignedValue,
} from "@/lib/activity-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!EMAIL_DOT_COM_REGEX.test(email) || email.length > 255) {
      return NextResponse.json(
        { message: "Please enter a valid email address ending in .com." },
        { status: 400 }
      );
    }

    const previous = readSignedValue<{
      email: string;
      sentAt: number;
    }>(request.cookies.get(OTP_COOKIE)?.value);

    if (
      previous?.email === email &&
      Date.now() / 1000 - previous.sentAt < 60
    ) {
      return NextResponse.json(
        { message: "Please wait one minute before requesting another code." },
        { status: 429 }
      );
    }

    const [order, reservation] = await Promise.all([
      prisma.order.findFirst({
        where: { customerEmail: { equals: email, mode: "insensitive" } },
        select: { id: true },
      }),
      prisma.diningReservation.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true },
      }),
    ]);

    if (!order && !reservation) {
      return NextResponse.json({
        message: "If this email is associated with Cravora activity, a verification code will be sent.",
      });
    }

    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      throw new Error("Resend environment variables are not configured.");
    }

    const otp = String(randomInt(100000, 1000000));
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Cravora verification code",
      html: `
        <div style="font-family:Arial,sans-serif;background:#F5F1E9;padding:32px;color:#25271F">
          <div style="max-width:480px;margin:auto;background:#fff;padding:32px;border-radius:12px">
            <h1 style="color:#A45B3C;margin-top:0">cravora<span style="color:#A45B3C">.</span></h1>
            <h2>Verify your email</h2>
            <p>Use the following code to access your Cravora orders and dining reservations.</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:20px 0;color:#A45B3C">
              ${otp}
            </div>
            <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Unable to send the verification email.");
    }

    const response = NextResponse.json({
      message: "A verification code has been sent to your email address.",
    });

    response.cookies.set(OTP_COOKIE, createOtp(email, otp), {
      ...cookieOptions,
      maxAge: 10 * 60,
    });

    return response;
  } catch (error) {
    console.error("Send OTP error:", error);

    return NextResponse.json(
      { message: "Unable to send the verification code. Please try again." },
      { status: 500 }
    );
  }
}
