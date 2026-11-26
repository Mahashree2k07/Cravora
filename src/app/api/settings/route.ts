import { NextResponse } from "next/server";
import {
  getResolvedDiningDropdowns,
  getRestaurantSettings,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getRestaurantSettings();
    const diningDropdowns = getResolvedDiningDropdowns(
      settings.customerFilterConfig
    );

    return NextResponse.json({
      restaurantEmail: settings.restaurantEmail,
      restaurantPhone: settings.restaurantPhone,
      restaurantAddress: settings.restaurantAddress,
      lunchStart: settings.lunchStart,
      lunchEnd: settings.lunchEnd,
      dinnerStart: settings.dinnerStart,
      dinnerEnd: settings.dinnerEnd,
      acceptOnlineOrders: settings.acceptOnlineOrders,
      acceptDiningReservations: settings.acceptDiningReservations,
      diningDurations: diningDropdowns.diningDurations,
      seatingPreferences: diningDropdowns.seatingPreferences,
    });
  } catch (error) {
    console.error("Public settings get error:", error);
    return NextResponse.json(
      { message: "Unable to load restaurant settings." },
      { status: 500 }
    );
  }
}
