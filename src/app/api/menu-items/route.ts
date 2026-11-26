import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResolvedFilterConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [menuItems, filterConfig, allergens] = await Promise.all([
      prisma.menuItem.findMany({
        where: { isAvailable: true },
        include: {
          course: { select: { name: true } },
          cuisineRegion: { select: { name: true } },
          moods: {
            include: {
              moodTag: { select: { name: true } },
            },
          },
          dietary: {
            include: {
              dietaryTag: { select: { name: true } },
            },
          },
          allergens: {
            include: {
              allergen: { select: { name: true } },
            },
          },
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
      getResolvedFilterConfig(),
      prisma.allergen.findMany({ orderBy: { name: "asc" } }),
    ]);

    const items = menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      course: item.course?.name ?? null,
      cuisineRegion: item.cuisineRegion?.name ?? null,
      spiceLevel: item.spiceLevel,
      retailPriceInr:
        item.retailPriceInr === null ? null : Number(item.retailPriceInr),
      retailPriceUsd:
        item.retailPriceUsd === null ? null : Number(item.retailPriceUsd),
      moodTags: item.moods.map((entry) => entry.moodTag.name),
      dietaryCompatible: item.dietary.map((entry) => entry.dietaryTag.name),
      allergens: item.allergens.map((entry) => entry.allergen.name),
      isSignature: item.isSignature,
      imageUrl: item.imageUrl,
    }));

    const toEnabledTaxonomy = (
      entries: { slug: string; label: string; enabled: boolean }[]
    ) =>
      entries
        .filter((entry) => entry.enabled)
        .map((entry) => ({
          slug: entry.slug,
          name: entry.label,
        }));

    return NextResponse.json({
      items,
      taxonomies: {
        courses: toEnabledTaxonomy(filterConfig.courses),
        cuisineRegions: toEnabledTaxonomy(filterConfig.cuisine),
        moodTags: toEnabledTaxonomy(filterConfig.moods),
        spiceLevels: toEnabledTaxonomy(filterConfig.spice),
        dietaryTags: toEnabledTaxonomy(filterConfig.dietary),
        allergens: allergens.map((record) => ({
          slug: record.name,
          name: record.name,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch menu items:", error);

    return NextResponse.json(
      { error: "Unable to fetch menu items." },
      { status: 500 }
    );
  }
}
