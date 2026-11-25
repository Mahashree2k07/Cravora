
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      menuItems,
      courses,
      cuisineRegions,
      moodTags,
      dietaryTags,
      allergens,
    ] = await Promise.all([
      prisma.menuItem.findMany({
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
        orderBy: { name: "asc" },
      }),
      prisma.course.findMany({ orderBy: { name: "asc" } }),
      prisma.cuisineRegion.findMany({ orderBy: { name: "asc" } }),
      prisma.moodTag.findMany({ orderBy: { name: "asc" } }),
      prisma.dietaryTag.findMany({ orderBy: { name: "asc" } }),
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
        item.retailPriceInr === null
          ? null
          : Number(item.retailPriceInr),
      retailPriceUsd:
        item.retailPriceUsd === null
          ? null
          : Number(item.retailPriceUsd),
      moodTags: item.moods.map((entry) => entry.moodTag.name),
      dietaryCompatible: item.dietary.map(
        (entry) => entry.dietaryTag.name
      ),
      allergens: item.allergens.map(
        (entry) => entry.allergen.name
      ),
      isSignature: item.isSignature,
      imageUrl: item.imageUrl,
    }));

    const toTaxonomy = (records: { name: string }[]) =>
      records.map((record) => ({
        slug: record.name,
        name: record.name,
      }));

    return NextResponse.json({
      items,
      taxonomies: {
        courses: toTaxonomy(courses),
        cuisineRegions: toTaxonomy(cuisineRegions),
        moodTags: toTaxonomy(moodTags),
        dietaryTags: toTaxonomy(dietaryTags),
        allergens: toTaxonomy(allergens),
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
