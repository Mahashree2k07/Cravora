import { prisma } from "@/lib/prisma";
import {
  DEFAULT_DINING_DURATIONS,
  DEFAULT_SEATING_PREFERENCES,
} from "@/lib/public-settings";

export type FilterOptionConfig = {
  slug: string;
  label: string;
  enabled: boolean;
  displayOrder: number;
  createdAt?: string;
  itemCount?: number;
};

export type CustomerFilterConfig = {
  cuisine: FilterOptionConfig[];
  courses: FilterOptionConfig[];
  spice: FilterOptionConfig[];
  moods: FilterOptionConfig[];
  dietary: FilterOptionConfig[];
};

const DEFAULT_SPICE_OPTIONS: FilterOptionConfig[] = [
  { slug: "0", label: "No spice", enabled: true, displayOrder: 1 },
  { slug: "1", label: "Level 1 Mild", enabled: true, displayOrder: 2 },
  { slug: "2", label: "Level 2", enabled: true, displayOrder: 3 },
  { slug: "3", label: "Level 3 Medium", enabled: true, displayOrder: 4 },
  { slug: "4", label: "Level 4 Hot", enabled: true, displayOrder: 5 },
  { slug: "5", label: "Level 5 Extra hot", enabled: true, displayOrder: 6 },
];

/** Retrieve the singleton RestaurantSetting row, creating defaults if absent. */
export async function getRestaurantSettings() {
  return prisma.restaurantSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

/** Merge persisted customer filter configuration with live taxonomy records and usage counts. */
export async function getResolvedFilterConfig(): Promise<CustomerFilterConfig> {
  const [settings, courses, cuisineRegions, moodTags, dietaryTags, spiceGroups] =
    await Promise.all([
      getRestaurantSettings(),
      prisma.course.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { menuItems: true } } },
      }),
      prisma.cuisineRegion.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { menuItems: true } } },
      }),
      prisma.moodTag.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { menuItems: true } } },
      }),
      prisma.dietaryTag.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { menuItems: true } } },
      }),
      prisma.menuItem.groupBy({
        by: ["spiceLevel"],
        _count: { _all: true },
      }),
    ]);

  const saved = (settings.customerFilterConfig ?? {}) as Partial<CustomerFilterConfig>;
  const spiceCountMap = new Map<string, number>();
  for (const row of spiceGroups) {
    if (row.spiceLevel !== null) {
      spiceCountMap.set(String(row.spiceLevel), row._count._all);
    }
  }

  const mergeTaxonomies = (
    records: { name: string; _count: { menuItems: number } }[],
    configured?: FilterOptionConfig[]
  ): FilterOptionConfig[] => {
    const map = new Map(
      (configured ?? []).map((item) => [item.slug, item])
    );

    const merged = records.map((rec, index) => {
      const existing = map.get(rec.name);
      return {
        slug: rec.name,
        label: existing?.label || rec.name,
        enabled: existing ? existing.enabled !== false : true,
        displayOrder: existing?.displayOrder ?? index + 1,
        createdAt: existing?.createdAt,
        itemCount: rec._count.menuItems,
      };
    });

    return merged.sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const baseSpice =
    saved.spice && saved.spice.length > 0
      ? [...saved.spice].sort((a, b) => a.displayOrder - b.displayOrder)
      : DEFAULT_SPICE_OPTIONS;

  return {
    cuisine: mergeTaxonomies(cuisineRegions, saved.cuisine),
    courses: mergeTaxonomies(courses, saved.courses),
    spice: baseSpice.map((s) => ({
      ...s,
      itemCount: spiceCountMap.get(s.slug) ?? 0,
    })),
    moods: mergeTaxonomies(moodTags, saved.moods),
    dietary: mergeTaxonomies(dietaryTags, saved.dietary),
  };
}

/** Extract configured dining duration & seating preference dropdown lists with safe fallbacks. */
export function getResolvedDiningDropdowns(rawConfig?: unknown): {
  diningDurations: string[];
  seatingPreferences: string[];
} {
  const cfg = (rawConfig ?? {}) as {
    diningDurations?: unknown;
    seatingPreferences?: unknown;
  };

  const normalizeList = (val: unknown, fallback: string[]) => {
    if (!Array.isArray(val)) return fallback;
    const cleaned = val
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallback;
  };

  return {
    diningDurations: normalizeList(cfg.diningDurations, DEFAULT_DINING_DURATIONS),
    seatingPreferences: normalizeList(
      cfg.seatingPreferences,
      DEFAULT_SEATING_PREFERENCES
    ),
  };
}
