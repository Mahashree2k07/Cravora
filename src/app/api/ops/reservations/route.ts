import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";
import { EMAIL_DOT_COM_REGEX } from "@/lib/public-settings";

export const dynamic = "force-dynamic";

const createReservationSchema = z.object({
  guestName: z.string().trim().min(2).max(150),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits."),
  email: z
    .string()
    .trim()
    .regex(EMAIL_DOT_COM_REGEX, "Email must include @ and end in .com.")
    .max(255)
    .optional()
    .or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.number().int().min(1).max(30),
  duration: z.string().trim().min(1).max(50),
  seatingPreference: z.string().trim().min(1).max(50),
  specialRequest: z.string().trim().max(1000).optional().nullable(),
  status: z.enum(["pending", "confirmed"]).optional(),
});

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: "insensitive" } },
        { guestName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (from || to) {
      const range: Record<string, Date> = {};
      if (from) range.gte = new Date(`${from}T00:00:00.000Z`);
      if (to) range.lte = new Date(`${to}T23:59:59.999Z`);
      where.reservationDate = range;
    }

    const [reservations, total, pending, confirmed, cancelled] =
      await Promise.all([
        prisma.diningReservation.findMany({
          where,
          orderBy: [{ reservationDate: "desc" }, { reservationTime: "desc" }],
        }),
        prisma.diningReservation.count(),
        prisma.diningReservation.count({ where: { status: "pending" } }),
        prisma.diningReservation.count({ where: { status: "confirmed" } }),
        prisma.diningReservation.count({ where: { status: "cancelled" } }),
      ]);

    return NextResponse.json({
      stats: { total, pending, confirmed, cancelled },
      reservations: reservations.map((r) => ({
        id: r.id,
        bookingNumber: r.bookingNumber,
        guestName: r.guestName,
        phone: r.phone,
        email: r.email,
        reservationDate: r.reservationDate.toISOString(),
        reservationTime: r.reservationTime.toISOString(),
        guests: r.guests,
        duration: r.duration,
        seatingPreference: r.seatingPreference,
        specialRequest: r.specialRequest,
        status: r.status,
        cancellationReason: r.cancellationReason,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Ops reservations error:", error);
    return NextResponse.json(
      { message: "Unable to load reservations." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = createReservationSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid reservation data." },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const [year, month, day] = d.date.split("-").map(Number);
    const [hours, minutes] = d.time.split(":").map(Number);

    const bookingNumber = `CRV-${d.date.replace(/-/g, "")}-${randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const created = await prisma.diningReservation.create({
      data: {
        bookingNumber,
        guestName: d.guestName,
        phone: d.phone,
        email: d.email ? d.email.toLowerCase() : null,
        reservationDate: new Date(Date.UTC(year, month - 1, day)),
        reservationTime: new Date(Date.UTC(1970, 0, 1, hours, minutes)),
        guests: d.guests,
        duration: d.duration,
        seatingPreference: d.seatingPreference,
        specialRequest: d.specialRequest || null,
        status: d.status || "confirmed",
      },
    });

    return NextResponse.json(
      { message: "Reservation created.", reservation: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ops reservation create error:", error);
    return NextResponse.json(
      { message: "Unable to create reservation." },
      { status: 500 }
    );
  }
}
