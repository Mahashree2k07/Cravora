import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  OPS_SESSION_COOKIE,
  createOpsSessionToken,
  opsCookieOptions,
  verifyPassword,
} from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid credentials." },
        { status: 400 }
      );
    }

    const identifier = parsed.data.identifier.toLowerCase();

    const user = await prisma.staffUser.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: "insensitive" } },
          { email: { equals: identifier, mode: "insensitive" } },
        ],
      },
    });

    if (!user || !user.isActive || !verifyPassword(parsed.data.password, user.passwordHash)) {
      return NextResponse.json(
        { message: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const token = createOpsSessionToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Signed in successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(OPS_SESSION_COOKIE, token, {
      ...opsCookieOptions,
      ...(parsed.data.rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
    });

    return response;
  } catch (error) {
    console.error("Ops login error:", error);
    return NextResponse.json(
      { message: "Unable to sign in right now. Please try again." },
      { status: 500 }
    );
  }
}
