import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

const createMenuItemSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  course: z.string().trim().min(1).max(100),
  cuisineRegion: z.string().trim().max(100).optional().nullable(),
  spiceLevel: z.number().int().min(0).max(20).optional().nullable(),
  retailPriceInr: z.number().nonnegative().optional().nullable(),
  retailPriceUsd: z.number().nonnegative().optional().nullable(),
  isSignature: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  imageUrl: z.string().trim().max(2000).optional().nullable(),
  moodTags: z.array(z.string().trim().min(1)).optional(),
  dietaryCompatible: z.array(z.string().trim().min(1)).optional(),
  allergens: z.array(z.string().trim().min(1)).optional(),
});

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const [items, courses, cuisineRegions, moodTags, dietaryTags, allergens] =
      await Promise.all([
        prisma.menuItem.findMany({
          include: {
            course: { select: { name: true } },
            cuisineRegion: { select: { name: true } },
            moods: { include: { moodTag: { select: { name: true } } } },
            dietary: { include: { dietaryTag: { select: { name: true } } } },
            allergens: { include: { allergen: { select: { name: true } } } },
          },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        }),
        prisma.course.findMany({ orderBy: { name: "asc" } }),
        prisma.cuisineRegion.findMany({ orderBy: { name: "asc" } }),
        prisma.moodTag.findMany({ orderBy: { name: "asc" } }),
        prisma.dietaryTag.findMany({ orderBy: { name: "asc" } }),
        prisma.allergen.findMany({ orderBy: { name: "asc" } }),
      ]);

    const formatted = items.map((item) => ({
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
      isSignature: item.isSignature,
      isAvailable: item.isAvailable,
      displayOrder: item.displayOrder,
      imageUrl: item.imageUrl,
      moodTags: item.moods.map((m) => m.moodTag.name),
      dietaryCompatible: item.dietary.map((d) => d.dietaryTag.name),
      allergens: item.allergens.map((a) => a.allergen.name),
    }));

    const availableCount = formatted.filter((i) => i.isAvailable).length;

    return NextResponse.json({
      stats: {
        total: formatted.length,
        available: availableCount,
        unavailable: formatted.length - availableCount,
      },
      items: formatted,
      taxonomies: {
        courses: courses.map((c) => c.name),
        cuisineRegions: cuisineRegions.map((c) => c.name),
        moodTags: moodTags.map((m) => m.name),
        dietaryTags: dietaryTags.map((d) => d.name),
        allergens: allergens.map((a) => a.name),
      },
    });
  } catch (error) {
    console.error("Ops menu list error:", error);
    return NextResponse.json(
      { message: "Unable to load menu items." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = createMenuItemSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid menu item data." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const course = await prisma.course.upsert({
      where: { name: data.course },
      update: {},
      create: { name: data.course },
    });

    const cuisineRegion = data.cuisineRegion
      ? await prisma.cuisineRegion.upsert({
          where: { name: data.cuisineRegion },
          update: {},
          create: { name: data.cuisineRegion },
        })
      : null;

    const moodRecords = await Promise.all(
      (data.moodTags ?? []).map((name) =>
        prisma.moodTag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    const dietaryRecords = await Promise.all(
      (data.dietaryCompatible ?? []).map((name) =>
        prisma.dietaryTag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    const allergenRecords = await Promise.all(
      (data.allergens ?? []).map((name) =>
        prisma.allergen.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    const created = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        courseId: course.id,
        cuisineRegionId: cuisineRegion?.id ?? null,
        spiceLevel: data.spiceLevel ?? null,
        retailPriceInr: data.retailPriceInr ?? null,
        retailPriceUsd: data.retailPriceUsd ?? null,
        isSignature: data.isSignature ?? false,
        isAvailable: data.isAvailable ?? true,
        imageUrl: data.imageUrl || null,
        moods: {
          create: moodRecords.map((m) => ({ moodTagId: m.id })),
        },
        dietary: {
          create: dietaryRecords.map((d) => ({ dietaryTagId: d.id })),
        },
        allergens: {
          create: allergenRecords.map((a) => ({ allergenId: a.id })),
        },
      },
      include: {
        course: { select: { name: true } },
        cuisineRegion: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: "Menu item created.",
        item: {
          id: created.id,
          name: created.name,
          description: created.description,
          course: created.course?.name ?? null,
          cuisineRegion: created.cuisineRegion?.name ?? null,
          spiceLevel: created.spiceLevel,
          retailPriceInr:
            created.retailPriceInr === null
              ? null
              : Number(created.retailPriceInr),
          retailPriceUsd:
            created.retailPriceUsd === null
              ? null
              : Number(created.retailPriceUsd),
          isSignature: created.isSignature,
          isAvailable: created.isAvailable,
          imageUrl: created.imageUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ops menu create error:", error);
    return NextResponse.json(
      { message: "Unable to create menu item." },
      { status: 500 }
    );
  }
}
