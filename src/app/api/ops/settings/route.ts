import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  OPS_SESSION_COOKIE,
  createOpsSessionToken,
  getOpsSessionFromRequest,
  opsCookieOptions,
  opsUnauthorizedResponse,
} from "@/lib/ops-auth";
import {
  getResolvedDiningDropdowns,
  getRestaurantSettings,
} from "@/lib/settings";
import { EMAIL_DOT_COM_REGEX, PHONE_10_REGEX } from "@/lib/public-settings";

export const dynamic = "force-dynamic";

const updateSettingsSchema = z.object({
  restaurantEmail: z
    .string()
    .trim()
    .regex(
      EMAIL_DOT_COM_REGEX,
      "Please enter a valid email address with @ and .com."
    )
    .max(255)
    .optional(),
  restaurantPhone: z
    .string()
    .trim()
    .regex(PHONE_10_REGEX, "Phone number must be exactly 10 digits.")
    .optional(),
  restaurantAddress: z.string().trim().min(3).max(500).optional(),
  lunchStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  lunchEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  dinnerStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  dinnerEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  acceptOnlineOrders: z.boolean().optional(),
  acceptDiningReservations: z.boolean().optional(),
  diningDurations: z
    .array(z.string().trim().min(1).max(80))
    .min(1)
    .optional(),
  seatingPreferences: z
    .array(z.string().trim().min(1).max(80))
    .min(1)
    .optional(),
  adminName: z.string().trim().min(2).max(150).optional(),
  adminEmail: z.string().email().max(255).optional(),
});

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const [settings, staff] = await Promise.all([
      getRestaurantSettings(),
      prisma.staffUser.findUnique({
        where: { id: session.userId },
        select: { id: true, username: true, name: true, email: true, role: true },
      }),
    ]);

    const diningDropdowns = getResolvedDiningDropdowns(
      settings.customerFilterConfig
    );

    return NextResponse.json({
      settings: {
        restaurantEmail: settings.restaurantEmail,
        restaurantPhone: settings.restaurantPhone,
        restaurantAddress: settings.restaurantAddress,
        lunchStart: settings.lunchStart,
        lunchEnd: settings.lunchEnd,
        dinnerStart: settings.dinnerStart,
        dinnerEnd: settings.dinnerEnd,
        acceptOnlineOrders: settings.acceptOnlineOrders,
        acceptDiningReservations: settings.acceptDiningReservations,
        diningDurations: diningDropdowns.diningDurations,
        seatingPreferences: diningDropdowns.seatingPreferences,
      },
      account: staff ?? {
        id: session.userId,
        username: session.username,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    console.error("Ops settings get error:", error);
    return NextResponse.json(
      { message: "Unable to load settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = updateSettingsSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid settings values." },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const currentSettings = await getRestaurantSettings();
    const existingFilterConfig = (currentSettings.customerFilterConfig ??
      {}) as Record<string, unknown>;

    const updatedFilterConfig =
      d.diningDurations !== undefined || d.seatingPreferences !== undefined
        ? {
            ...existingFilterConfig,
            ...(d.diningDurations !== undefined
              ? { diningDurations: d.diningDurations }
              : {}),
            ...(d.seatingPreferences !== undefined
              ? { seatingPreferences: d.seatingPreferences }
              : {}),
          }
        : undefined;

    const updatedSettings = await prisma.restaurantSetting.update({
      where: { id: 1 },
      data: {
        ...(d.restaurantEmail !== undefined
          ? { restaurantEmail: d.restaurantEmail }
          : {}),
        ...(d.restaurantPhone !== undefined
          ? { restaurantPhone: d.restaurantPhone }
          : {}),
        ...(d.restaurantAddress !== undefined
          ? { restaurantAddress: d.restaurantAddress }
          : {}),
        ...(d.lunchStart !== undefined ? { lunchStart: d.lunchStart } : {}),
        ...(d.lunchEnd !== undefined ? { lunchEnd: d.lunchEnd } : {}),
        ...(d.dinnerStart !== undefined ? { dinnerStart: d.dinnerStart } : {}),
        ...(d.dinnerEnd !== undefined ? { dinnerEnd: d.dinnerEnd } : {}),
        ...(d.acceptOnlineOrders !== undefined
          ? { acceptOnlineOrders: d.acceptOnlineOrders }
          : {}),
        ...(d.acceptDiningReservations !== undefined
          ? { acceptDiningReservations: d.acceptDiningReservations }
          : {}),
        ...(updatedFilterConfig !== undefined
          ? { customerFilterConfig: updatedFilterConfig as object }
          : {}),
      },
    });

    let updatedStaff: {
      id: string;
      username: string;
      email: string;
      name: string;
      role: string;
    } | null = null;

    if (d.adminName !== undefined || d.adminEmail !== undefined) {
      updatedStaff = await prisma.staffUser.update({
        where: { id: session.userId },
        data: {
          ...(d.adminName !== undefined ? { name: d.adminName } : {}),
          ...(d.adminEmail !== undefined
            ? { email: d.adminEmail.toLowerCase() }
            : {}),
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
        },
      });
    }

    const response = NextResponse.json({
      message: "Settings saved successfully.",
      settings: updatedSettings,
      ...(updatedStaff ? { account: updatedStaff } : {}),
    });

    if (updatedStaff) {
      const token = createOpsSessionToken({
        userId: updatedStaff.id,
        username: updatedStaff.username,
        email: updatedStaff.email,
        name: updatedStaff.name,
        role: updatedStaff.role,
      });
      response.cookies.set(OPS_SESSION_COOKIE, token, opsCookieOptions);
    }

    return response;
  } catch (error) {
    console.error("Ops settings update error:", error);
    return NextResponse.json(
      { message: "Unable to save settings." },
      { status: 500 }
    );
  }
}
