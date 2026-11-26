import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

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

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(`${from}T00:00:00.000Z`);
      if (to) dateFilter.lte = new Date(`${to}T23:59:59.999Z`);
      where.createdAt = dateFilter;
    }

    const [orders, total, pending, inProgress, completed] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { select: { quantity: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({
        where: { status: { in: ["confirmed", "preparing", "ready_for_pickup"] } },
      }),
      prisma.order.count({ where: { status: "completed" } }),
    ]);

    return NextResponse.json({
      stats: { total, pending, inProgress, completed },
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        pickupDate: o.pickupDate.toISOString(),
        pickupTime: o.pickupTime.toISOString(),
        subtotal: Number(o.subtotal),
        tax: Number(o.tax),
        total: Number(o.total),
        currency: o.currency,
        status: o.status,
        cancellationReason: o.cancellationReason,
        itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
        createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Ops orders list error:", error);
    return NextResponse.json(
      { message: "Unable to load orders." },
      { status: 500 }
    );
  }
}
