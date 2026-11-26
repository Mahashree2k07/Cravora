
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getRestaurantSettings } from "@/lib/settings";
import {
  EMAIL_DOT_COM_REGEX,
  PHONE_10_REGEX,
  formatTime12h,
  isTimeWithinHours,
} from "@/lib/public-settings";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const settings = await getRestaurantSettings();
    if (!settings.acceptOnlineOrders) {
      return NextResponse.json(
        { message: "Online ordering is currently paused. Please check back later." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupDate,
      pickupTime,
      currency,
      items,
    } = body;

    // Validate customer details
    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof customerPhone !== "string" ||
      !PHONE_10_REGEX.test(customerPhone.trim())
    ) {
      return NextResponse.json(
        { message: "Please provide your name and a 10-digit phone number." },
        { status: 400 }
      );
    }

    const email =
      typeof customerEmail === "string"
        ? customerEmail.trim().toLowerCase()
        : "";

    if (email && !EMAIL_DOT_COM_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address ending in .com." },
        { status: 400 }
      );
    }

    // Validate pickup date and time
    if (
      typeof pickupDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)
    ) {
      return NextResponse.json(
        { message: "Please select a valid pickup date." },
        { status: 400 }
      );
    }

    if (
      typeof pickupTime !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(pickupTime) ||
      !isTimeWithinHours(pickupTime, settings)
    ) {
      return NextResponse.json(
        {
          message: `Please select a pickup time within service hours (${formatTime12h(
            settings.lunchStart
          )}–${formatTime12h(settings.lunchEnd)} or ${formatTime12h(
            settings.dinnerStart
          )}–${formatTime12h(settings.dinnerEnd)}).`,
        },
        { status: 400 }
      );
    }

    const date = new Date(`${pickupDate}T00:00:00.000Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== pickupDate
    ) {
      return NextResponse.json(
        { message: "Invalid pickup date." },
        { status: 400 }
      );
    }

    if (!["INR", "USD"].includes(currency)) {
      return NextResponse.json(
        { message: "Invalid currency selected." },
        { status: 400 }
      );
    }

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your cart is empty." },
        { status: 400 }
      );
    }

    const quantities = new Map<string, number>();

    for (const item of items) {
      if (
        typeof item.id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          { message: "One or more cart items are invalid." },
          { status: 400 }
        );
      }

      quantities.set(
        item.id,
        (quantities.get(item.id) || 0) + item.quantity
      );
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: Array.from(quantities.keys()) },
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        retailPriceInr: true,
        retailPriceUsd: true,
      },
    });

    if (menuItems.length !== quantities.size) {
      return NextResponse.json(
        { message: "Some menu items are no longer available. Please refresh your cart." },
        { status: 400 }
      );
    }

    // Calculate prices using database values, not browser values
    let subtotalCents = 0;

    const orderItems = menuItems.map((menuItem) => {
      const price =
        currency === "INR"
          ? menuItem.retailPriceInr
          : menuItem.retailPriceUsd;

      if (price === null) {
        throw new Error(
          `A price is not configured for ${menuItem.name} in ${currency}.`
        );
      }

      const unitPriceCents = Math.round(Number(price) * 100);
      const quantity = quantities.get(menuItem.id)!;
      const lineTotalCents = unitPriceCents * quantity;

      subtotalCents += lineTotalCents;

      return {
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        unitPrice: unitPriceCents / 100,
        quantity,
        lineTotal: lineTotalCents / 100,
      };
    });

    const subtotal = subtotalCents / 100;

    // Tax is kept at zero for now
    const tax = 0;
    const total = subtotal;

    const orderNumber =
      `CRV-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;

    const pickupTimeDate = new Date(
      `1970-01-01T${pickupTime}:00.000Z`
    );

    // Save the order and its items together
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: email || null,
        pickupDate: date,
        pickupTime: pickupTimeDate,
        subtotal,
        tax,
        total,
        currency,
        status: "pending",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      {
        message: "Your order has been placed successfully.",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          subtotal: Number(order.subtotal),
          tax: Number(order.tax),
          total: Number(order.total),
          currency: order.currency,
          items: order.items.map((item) => ({
  ...item,
  id: item.id.toString(),
})),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to place your order. Please try again.",
      },
      { status: 500 }
    );
  }
}
