"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_PUBLIC_SETTINGS,
  type PublicRestaurantSettings,
} from "@/lib/public-settings";

const PublicSettingsContext = createContext<PublicRestaurantSettings>(
  DEFAULT_PUBLIC_SETTINGS
);

export function PublicSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: PublicRestaurantSettings;
  children: ReactNode;
}) {
  return (
    <PublicSettingsContext.Provider value={initialSettings}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings(): PublicRestaurantSettings {
  return useContext(PublicSettingsContext);
}
