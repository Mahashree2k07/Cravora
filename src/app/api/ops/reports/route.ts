import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (from || to) {
      const range: Record<string, Date> = {};
      if (from) range.gte = new Date(`${from}T00:00:00.000Z`);
      if (to) range.lte = new Date(`${to}T23:59:59.999Z`);
      where.createdAt = range;
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "asc" },
    });

    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const revenueInr = activeOrders
      .filter((o) => o.currency === "INR")
      .reduce((sum, o) => sum + Number(o.total), 0);
    const revenueUsd = activeOrders
      .filter((o) => o.currency === "USD")
      .reduce((sum, o) => sum + Number(o.total), 0);

    const uniqueCustomers = new Set(
      orders.map((o) => (o.customerEmail || o.customerPhone).toLowerCase())
    ).size;

    const statusCounts = {
      completed: orders.filter((o) => o.status === "completed").length,
      preparing: orders.filter((o) =>
        ["confirmed", "preparing", "ready_for_pickup"].includes(o.status)
      ).length,
      pending: orders.filter((o) => o.status === "pending").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    // Group revenue into 4 buckets (or by day) for chart
    const bucketTotals = [0, 0, 0, 0];
    if (activeOrders.length > 0) {
      const startTs = activeOrders[0].createdAt.getTime();
      const endTs = activeOrders[activeOrders.length - 1].createdAt.getTime();
      const span = Math.max(1, endTs - startTs);

      for (const order of activeOrders) {
        const ratio = (order.createdAt.getTime() - startTs) / span;
        const idx = Math.min(3, Math.floor(ratio * 4));
        bucketTotals[idx] += Number(order.total);
      }
    }

    const topMap = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    for (const order of activeOrders) {
      for (const item of order.items) {
        const current = topMap.get(item.itemName) ?? {
          name: item.itemName,
          quantity: 0,
          revenue: 0,
        };
        current.quantity += item.quantity;
        current.revenue += Number(item.lineTotal);
        topMap.set(item.itemName, current);
      }
    }

    const topItems = Array.from(topMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);

    const avgOrderInr =
      activeOrders.filter((o) => o.currency === "INR").length > 0
        ? revenueInr / activeOrders.filter((o) => o.currency === "INR").length
        : 0;

    return NextResponse.json({
      summary: {
        revenueInr,
        revenueUsd,
        totalOrders: orders.length,
        averageOrderInr: Math.round(avgOrderInr),
        totalCustomers: uniqueCustomers,
      },
      statusCounts,
      chartSeries: bucketTotals.map((amount, index) => ({
        label: `Period ${index + 1}`,
        amount: Math.round(amount),
      })),
      topItems,
    });
  } catch (error) {
    console.error("Ops reports error:", error);
    return NextResponse.json(
      { message: "Unable to generate reports." },
      { status: 500 }
    );
  }
}
