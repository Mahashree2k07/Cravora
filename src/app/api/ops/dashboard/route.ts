import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      todaysReservations,
      todaysOrders,
      recentOrders,
      upcomingReservations,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.diningReservation.count({
        where: {
          reservationDate: { gte: startOfToday, lt: endOfToday },
          status: { not: "cancelled" },
        },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfToday, lt: endOfToday },
          status: { not: "cancelled" },
        },
        select: { total: true, currency: true },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { items: { select: { quantity: true } } },
      }),
      prisma.diningReservation.findMany({
        where: { reservationDate: { gte: startOfToday } },
        take: 6,
        orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
      }),
    ]);

    const todaysRevenueInr = todaysOrders
      .filter((o) => o.currency === "INR")
      .reduce((sum, o) => sum + Number(o.total), 0);
    const todaysRevenueUsd = todaysOrders
      .filter((o) => o.currency === "USD")
      .reduce((sum, o) => sum + Number(o.total), 0);

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        todaysReservations,
        todaysRevenueInr,
        todaysRevenueUsd,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        total: Number(o.total),
        currency: o.currency,
        status: o.status,
        itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
        createdAt: o.createdAt.toISOString(),
      })),
      upcomingReservations: upcomingReservations.map((r) => ({
        id: r.id,
        bookingNumber: r.bookingNumber,
        guestName: r.guestName,
        guests: r.guests,
        reservationDate: r.reservationDate.toISOString(),
        reservationTime: r.reservationTime.toISOString(),
        seatingPreference: r.seatingPreference,
        status: r.status,
      })),
    });
  } catch (error) {
    console.error("Ops dashboard error:", error);
    return NextResponse.json(
      { message: "Unable to load dashboard data." },
      { status: 500 }
    );
  }
}
