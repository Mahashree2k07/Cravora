import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const [orders, reservations] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerPhone: true,
          customerEmail: true,
          total: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.diningReservation.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          bookingNumber: true,
          guestName: true,
          phone: true,
          email: true,
          guests: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    type CustomerRecord = {
      key: string;
      name: string;
      email: string | null;
      phone: string;
      totalOrders: number;
      totalSpentInr: number;
      totalSpentUsd: number;
      reservationCount: number;
      firstSeen: string;
      lastSeen: string;
      recentOrderNumbers: string[];
    };

    const map = new Map<string, CustomerRecord>();

    const getKey = (email: string | null, phone: string) =>
      email ? `email:${email.toLowerCase()}` : `phone:${phone}`;

    for (const order of orders) {
      const key = getKey(order.customerEmail, order.customerPhone);
      const iso = order.createdAt.toISOString();
      const existing = map.get(key) ?? {
        key,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        totalOrders: 0,
        totalSpentInr: 0,
        totalSpentUsd: 0,
        reservationCount: 0,
        firstSeen: iso,
        lastSeen: iso,
        recentOrderNumbers: [],
      };

      existing.totalOrders += 1;
      if (order.status !== "cancelled") {
        if (order.currency === "USD") {
          existing.totalSpentUsd += Number(order.total);
        } else {
          existing.totalSpentInr += Number(order.total);
        }
      }
      if (iso < existing.firstSeen) existing.firstSeen = iso;
      if (iso > existing.lastSeen) existing.lastSeen = iso;
      if (existing.recentOrderNumbers.length < 5) {
        existing.recentOrderNumbers.push(order.orderNumber);
      }

      map.set(key, existing);
    }

    for (const res of reservations) {
      const key = getKey(res.email, res.phone);
      const iso = res.createdAt.toISOString();
      const existing = map.get(key) ?? {
        key,
        name: res.guestName,
        email: res.email,
        phone: res.phone,
        totalOrders: 0,
        totalSpentInr: 0,
        totalSpentUsd: 0,
        reservationCount: 0,
        firstSeen: iso,
        lastSeen: iso,
        recentOrderNumbers: [],
      };

      existing.reservationCount += 1;
      if (iso < existing.firstSeen) existing.firstSeen = iso;
      if (iso > existing.lastSeen) existing.lastSeen = iso;

      map.set(key, existing);
    }

    const customers = Array.from(map.values()).sort((a, b) =>
      b.lastSeen.localeCompare(a.lastSeen)
    );

    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    ).toISOString();

    const newThisMonth = customers.filter(
      (c) => c.firstSeen >= startOfMonth
    ).length;
    const returning = customers.filter(
      (c) => c.totalOrders + c.reservationCount > 1
    ).length;

    return NextResponse.json({
      stats: {
        total: customers.length,
        newThisMonth,
        returning,
      },
      customers,
    });
  } catch (error) {
    console.error("Ops customers error:", error);
    return NextResponse.json(
      { message: "Unable to load customers." },
      { status: 500 }
    );
  }
}
