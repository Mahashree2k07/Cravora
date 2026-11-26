import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";
import { EMAIL_DOT_COM_REGEX } from "@/lib/public-settings";

export const dynamic = "force-dynamic";

const updateReservationSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  cancellationReason: z.string().trim().max(500).optional().nullable(),
  guestName: z.string().trim().min(2).max(150).optional(),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits.").optional(),
  email: z
    .string()
    .trim()
    .regex(EMAIL_DOT_COM_REGEX, "Email must include @ and end in .com.")
    .max(255)
    .optional()
    .nullable()
    .or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  guests: z.number().int().min(1).max(30).optional(),
  duration: z.string().trim().min(2).max(50).optional(),
  seatingPreference: z.string().trim().min(2).max(50).optional(),
  specialRequest: z.string().trim().max(500).optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = updateReservationSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid reservation details." },
        { status: 400 }
      );
    }

    const d = parsed.data;
    if (d.status === "cancelled" && !(d.cancellationReason ?? "").trim()) {
      return NextResponse.json(
        { message: "Please provide a reason for cancelling this reservation." },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (d.status !== undefined) {
      data.status = d.status;
      data.cancellationReason =
        d.status === "cancelled"
          ? (d.cancellationReason ?? "").trim()
          : null;
    } else if (d.cancellationReason !== undefined) {
      data.cancellationReason = (d.cancellationReason ?? "").trim() || null;
    }
    if (d.guestName !== undefined) data.guestName = d.guestName;
    if (d.phone !== undefined) data.phone = d.phone;
    if (d.email !== undefined) data.email = d.email || null;
    if (d.guests !== undefined) data.guests = d.guests;
    if (d.duration !== undefined) data.duration = d.duration;
    if (d.seatingPreference !== undefined) {
      data.seatingPreference = d.seatingPreference;
    }
    if (d.specialRequest !== undefined) {
      data.specialRequest = d.specialRequest || null;
    }
    if (d.date !== undefined) {
      const [y, m, day] = d.date.split("-").map(Number);
      data.reservationDate = new Date(Date.UTC(y, m - 1, day));
    }
    if (d.time !== undefined) {
      const [h, min] = d.time.split(":").map(Number);
      data.reservationTime = new Date(Date.UTC(1970, 0, 1, h, min));
    }

    const updated = await prisma.diningReservation.update({
      where: { id: context.params.id },
      data,
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        cancellationReason: true,
      },
    });

    return NextResponse.json({
      message: "Reservation updated.",
      reservation: updated,
    });
  } catch (error) {
    console.error("Ops reservation update error:", error);
    return NextResponse.json(
      { message: "Unable to update reservation." },
      { status: 500 }
    );
  }
}
