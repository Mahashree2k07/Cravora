
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      guestName,
      phone,
      email,
      date,
      guests,
      duration,
      seatingPreference,
      time,
      specialRequest,
    } = body;

    // Validate required fields
    if (
      !guestName?.trim() ||
      !phone ||
      !date ||
      !guests ||
      !duration ||
      !seatingPreference ||
      !time
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z ]{2,50}$/.test(guestName.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid name." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Please select a valid reservation date." },
        { status: 400 }
      );
    }

    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json(
        { error: "Please select a valid reservation time." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
      return NextResponse.json(
        { error: "Please select a valid number of guests." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    const reservationDate = new Date(
      Date.UTC(year, month - 1, day)
    );

    // PostgreSQL TIME field: use a fixed date anchor.
    const reservationTime = new Date(
      Date.UTC(1970, 0, 1, hours, minutes)
    );

    // Generate a unique booking reference.
    const bookingNumber = `CRV-${date.replace(/-/g, "")}-${randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const reservation = await prisma.diningReservation.create({
      data: {
        bookingNumber,
        guestName: guestName.trim(),
        phone,
        email: email?.trim() || null,
        reservationDate,
        reservationTime,
        guests: Number(guests),
        duration,
        seatingPreference,
        specialRequest: specialRequest?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        message: "Reservation submitted successfully.",
        booking: {
          bookingNumber: reservation.bookingNumber,
          guestName: reservation.guestName,
          phone: reservation.phone,
          email: reservation.email ?? "",
          date,
          guests: String(reservation.guests),
          duration: reservation.duration,
          seatingPreference: reservation.seatingPreference,
          time,
          specialRequest: reservation.specialRequest ?? "",
          status: reservation.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create dining reservation:", error);

    return NextResponse.json(
      { error: "Unable to complete your reservation. Please try again." },
      { status: 500 }
    );
  }
}
