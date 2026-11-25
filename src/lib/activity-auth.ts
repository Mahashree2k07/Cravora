import { createHmac, timingSafeEqual } from "node:crypto";

export const OTP_COOKIE = "cravora_activity_otp";
export const SESSION_COOKIE = "cravora_activity_session";

const OTP_TTL = 10 * 60;
const SESSION_TTL = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.ACTIVITY_AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ACTIVITY_AUTH_SECRET must contain at least 32 characters.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

export function createSignedValue(payload: object) {
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${value}.${sign(value)}`;
}

export function readSignedValue<T>(token?: string): T | null {
  if (!token) return null;

  const [value, signature] = token.split(".");
  if (!value || !signature) return null;

  const expected = sign(value);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function createOtp(email: string, otp: string) {
  const now = Math.floor(Date.now() / 1000);

  return createSignedValue({
    email,
    otpHash: createHmac("sha256", getSecret())
      .update(`${email}:${otp}`)
      .digest("hex"),
    expiresAt: now + OTP_TTL,
    sentAt: now,
    attempts: 0,
  });
}

export function verifyOtpHash(email: string, otp: string, hash: string) {
  const expected = createHmac("sha256", getSecret())
    .update(`${email}:${otp}`)
    .digest("hex");

  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(expected, "hex");

  return a.length === b.length && timingSafeEqual(a, b);
}

export function createSession(email: string) {
  const now = Math.floor(Date.now() / 1000);

  return createSignedValue({
    email,
    expiresAt: now + SESSION_TTL,
  });
}

export function readSession(token?: string) {
  const session = readSignedValue<{
    email: string;
    expiresAt: number;
  }>(token);

  if (!session || session.expiresAt < Date.now() / 1000) return null;

  return session;
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
