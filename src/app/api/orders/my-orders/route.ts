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
        { message: "Please verify your email to view your orders." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        customerEmail: {
          equals: session.email,
          mode: "insensitive",
        },
      },
      include: {
        items: {
          select: {
            id: true,
            itemName: true,
            unitPrice: true,
            quantity: true,
            lineTotal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      pickupDate: order.pickupDate.toISOString(),
      pickupTime: order.pickupTime.toISOString(),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      currency: order.currency,
      status: order.status,
      items: order.items.map((item) => ({
        id: String(item.id),
        itemName: item.itemName,
        unitPrice: Number(item.unitPrice),
        quantity: item.quantity,
        lineTotal: Number(item.lineTotal),
      })),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("My orders API error:", error);

    return NextResponse.json(
      { message: "Unable to load your orders." },
      { status: 500 }
    );
  }
}
