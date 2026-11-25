import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  readSession,
} from "@/lib/activity-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = readSession(
      request.cookies.get(SESSION_COOKIE)?.value
    );

    if (!session) {
      return NextResponse.json(
        { message: "Please verify your email to view your reservations." },
        { status: 401 }
      );
    }

    const reservations = await prisma.diningReservation.findMany({
      where: {
        email: {
          equals: session.email,
          mode: "insensitive",
        },
      },
      orderBy: [
        { reservationDate: "desc" },
        { reservationTime: "desc" },
      ],
    });

    const formattedReservations = reservations.map((reservation) => ({
      id: reservation.id,
      bookingNumber: reservation.bookingNumber,
      guestName: reservation.guestName,
      reservationDate: reservation.reservationDate.toISOString(),
      reservationTime: reservation.reservationTime.toISOString(),
      guests: reservation.guests,
      duration: reservation.duration,
      seatingPreference: reservation.seatingPreference,
      specialRequest: reservation.specialRequest,
      status: reservation.status,
    }));

    return NextResponse.json({
      reservations: formattedReservations,
    });
  } catch (error) {
    console.error("My reservations API error:", error);

    return NextResponse.json(
      { message: "Unable to load your reservations." },
      { status: 500 }
    );
  }
}
