import type { Metadata } from "next";
import "./globals.css";
import "../styles/wireframe.css";
import { PublicSettingsProvider } from "@/components/PublicSettingsProvider";
import {
  DEFAULT_PUBLIC_SETTINGS,
  type PublicRestaurantSettings,
} from "@/lib/public-settings";
import {
  getResolvedDiningDropdowns,
  getRestaurantSettings,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cravora | Good Food. Great Moments.",
  description:
    "Discover delicious food and enjoy a seamless ordering experience with Cravora.",
};

async function loadInitialPublicSettings(): Promise<PublicRestaurantSettings> {
  try {
    const settings = await getRestaurantSettings();
    const diningDropdowns = getResolvedDiningDropdowns(
      settings.customerFilterConfig
    );

    return {
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
    };
  } catch {
    return DEFAULT_PUBLIC_SETTINGS;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await loadInitialPublicSettings();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PublicSettingsProvider initialSettings={initialSettings}>
          {children}
        </PublicSettingsProvider>
      </body>
    </html>
  );
}
