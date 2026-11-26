import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "completed",
  "cancelled",
] as const;

const updateOrderSchema = z.object({
  status: z.enum(ALLOWED_STATUSES),
  cancellationReason: z.string().trim().max(500).optional().nullable(),
});

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const idParam = decodeURIComponent(context.params.id);
    const order = await prisma.order.findFirst({
      where: UUID_REGEX.test(idParam)
        ? { id: idParam }
        : { orderNumber: idParam },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        pickupDate: order.pickupDate.toISOString(),
        pickupTime: order.pickupTime.toISOString(),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        total: Number(order.total),
        currency: order.currency,
        status: order.status,
        cancellationReason: order.cancellationReason,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id.toString(),
          menuItemId: item.menuItemId,
          itemName: item.itemName,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
          lineTotal: Number(item.lineTotal),
        })),
      },
    });
  } catch (error) {
    console.error("Ops order detail error:", error);
    return NextResponse.json(
      { message: "Unable to load order details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = updateOrderSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid order status." },
        { status: 400 }
      );
    }

    const idParam = decodeURIComponent(context.params.id);
    const existing = await prisma.order.findFirst({
      where: UUID_REGEX.test(idParam)
        ? { id: idParam }
        : { orderNumber: idParam },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    if (parsed.data.status === "cancelled") {
      const reason = (parsed.data.cancellationReason ?? "").trim();
      if (!reason) {
        return NextResponse.json(
          { message: "Please provide a reason for cancelling this order." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        status: parsed.data.status,
        cancellationReason:
          parsed.data.status === "cancelled"
            ? (parsed.data.cancellationReason ?? "").trim()
            : null,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        cancellationReason: true,
      },
    });

    return NextResponse.json({
      message: "Order status updated.",
      order: updated,
    });
  } catch (error) {
    console.error("Ops order update error:", error);
    return NextResponse.json(
      { message: "Unable to update order status." },
      { status: 500 }
    );
  }
}
