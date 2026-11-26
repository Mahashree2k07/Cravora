import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

const updateMenuItemSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  course: z.string().trim().min(1).max(100).optional(),
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

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = updateMenuItemSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid menu update." },
        { status: 400 }
      );
    }

    const existing = await prisma.menuItem.findUnique({
      where: { id: context.params.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Menu item not found." },
        { status: 404 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.spiceLevel !== undefined) updateData.spiceLevel = data.spiceLevel;
    if (data.retailPriceInr !== undefined)
      updateData.retailPriceInr = data.retailPriceInr;
    if (data.retailPriceUsd !== undefined)
      updateData.retailPriceUsd = data.retailPriceUsd;
    if (data.isSignature !== undefined) updateData.isSignature = data.isSignature;
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    if (data.course !== undefined) {
      const course = await prisma.course.upsert({
        where: { name: data.course },
        update: {},
        create: { name: data.course },
      });
      updateData.courseId = course.id;
    }

    if (data.cuisineRegion !== undefined) {
      if (data.cuisineRegion === null || data.cuisineRegion === "") {
        updateData.cuisineRegionId = null;
      } else {
        const region = await prisma.cuisineRegion.upsert({
          where: { name: data.cuisineRegion },
          update: {},
          create: { name: data.cuisineRegion },
        });
        updateData.cuisineRegionId = region.id;
      }
    }

    if (data.moodTags !== undefined) {
      const moodRecords = await Promise.all(
        data.moodTags.map((name) =>
          prisma.moodTag.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );
      updateData.moods = {
        deleteMany: {},
        create: moodRecords.map((m) => ({ moodTagId: m.id })),
      };
    }

    if (data.dietaryCompatible !== undefined) {
      const dietaryRecords = await Promise.all(
        data.dietaryCompatible.map((name) =>
          prisma.dietaryTag.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );
      updateData.dietary = {
        deleteMany: {},
        create: dietaryRecords.map((d) => ({ dietaryTagId: d.id })),
      };
    }

    if (data.allergens !== undefined) {
      const allergenRecords = await Promise.all(
        data.allergens.map((name) =>
          prisma.allergen.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );
      updateData.allergens = {
        deleteMany: {},
        create: allergenRecords.map((a) => ({ allergenId: a.id })),
      };
    }

    const updated = await prisma.menuItem.update({
      where: { id: context.params.id },
      data: updateData,
      include: {
        course: { select: { name: true } },
        cuisineRegion: { select: { name: true } },
        moods: { include: { moodTag: { select: { name: true } } } },
        dietary: { include: { dietaryTag: { select: { name: true } } } },
        allergens: { include: { allergen: { select: { name: true } } } },
      },
    });

    return NextResponse.json({
      message: "Menu item updated.",
      item: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        course: updated.course?.name ?? null,
        cuisineRegion: updated.cuisineRegion?.name ?? null,
        spiceLevel: updated.spiceLevel,
        retailPriceInr:
          updated.retailPriceInr === null ? null : Number(updated.retailPriceInr),
        retailPriceUsd:
          updated.retailPriceUsd === null ? null : Number(updated.retailPriceUsd),
        isSignature: updated.isSignature,
        isAvailable: updated.isAvailable,
        imageUrl: updated.imageUrl,
      },
    });
  } catch (error) {
    console.error("Ops menu update error:", error);
    return NextResponse.json(
      { message: "Unable to update menu item." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    await prisma.menuItem.delete({
      where: { id: context.params.id },
    });

    return NextResponse.json({ message: "Menu item deleted." });
  } catch (error) {
    console.error("Ops menu delete error:", error);
    return NextResponse.json(
      { message: "Unable to delete menu item." },
      { status: 500 }
    );
  }
}
