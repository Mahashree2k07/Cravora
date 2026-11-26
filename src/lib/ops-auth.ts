import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const OPS_SESSION_COOKIE = "cravora_ops_session";
const OPS_SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export type OpsSessionPayload = {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: string;
  expiresAt: number;
};

function getOpsSecret(): string {
  const secret =
    process.env.OPS_AUTH_SECRET || process.env.ACTIVITY_AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "OPS_AUTH_SECRET (or ACTIVITY_AUTH_SECRET) must contain at least 32 characters."
    );
  }

  return secret;
}

/** Hash a staff password with a random 16-byte salt using scrypt. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

/** Verify a staff password against a stored `salt:hash` string. */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const expected = scryptSync(password, salt, 64);
  const actual = Buffer.from(hash, "hex");

  return (
    expected.length === actual.length && timingSafeEqual(expected, actual)
  );
}

function sign(value: string): string {
  return createHmac("sha256", getOpsSecret())
    .update(value)
    .digest("base64url");
}

export function createOpsSessionToken(
  user: Omit<OpsSessionPayload, "expiresAt">
): string {
  const payload: OpsSessionPayload = {
    ...user,
    expiresAt: Math.floor(Date.now() / 1000) + OPS_SESSION_TTL,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function readOpsSession(token?: string): OpsSessionPayload | null {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const actualBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);

  if (
    actualBuf.length !== expectedBuf.length ||
    !timingSafeEqual(actualBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as OpsSessionPayload;

    if (!parsed.expiresAt || parsed.expiresAt < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getOpsSessionFromRequest(
  request: NextRequest
): OpsSessionPayload | null {
  try {
    return readOpsSession(request.cookies.get(OPS_SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

export function opsUnauthorizedResponse() {
  return NextResponse.json(
    { message: "Authentication required. Please sign in to Operations." },
    { status: 401 }
  );
}

export const opsCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
