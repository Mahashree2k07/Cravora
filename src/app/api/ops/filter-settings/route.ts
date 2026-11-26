import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";
import { getResolvedFilterConfig, getRestaurantSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const optionSchema = z.object({
  slug: z.string().trim().min(1).max(100),
  label: z.string().trim().min(1).max(120),
  enabled: z.boolean(),
  displayOrder: z.number().int().min(1),
  createdAt: z.string().optional(),
});

const updateFilterConfigSchema = z.object({
  config: z.object({
    cuisine: z.array(optionSchema),
    courses: z.array(optionSchema),
    spice: z.array(optionSchema),
    moods: z.array(optionSchema),
    dietary: z.array(optionSchema),
  }),
  newOption: z
    .object({
      category: z.enum(["cuisine", "courses", "moods", "dietary", "spice"]),
      name: z.string().trim().min(1).max(100),
    })
    .optional(),
  deleteOption: z
    .object({
      category: z.enum(["cuisine", "courses", "moods", "dietary", "spice"]),
      slug: z.string().trim().min(1).max(100),
    })
    .optional(),
  renameOption: z
    .object({
      category: z.enum(["cuisine", "courses", "moods", "dietary", "spice"]),
      oldSlug: z.string().trim().min(1).max(100),
      newLabel: z.string().trim().min(1).max(120),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const config = await getResolvedFilterConfig();
    return NextResponse.json({ config });
  } catch (error) {
    console.error("Ops filter settings get error:", error);
    return NextResponse.json(
      { message: "Unable to load filter settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = updateFilterConfigSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid filter configuration." },
        { status: 400 }
      );
    }

    if (parsed.data.newOption) {
      const { category, name } = parsed.data.newOption;
      const slug = name.toLowerCase().replace(/\s+/g, "_");
      if (category === "cuisine") {
        await prisma.cuisineRegion.upsert({
          where: { name: slug },
          update: {},
          create: { name: slug },
        });
      } else if (category === "courses") {
        await prisma.course.upsert({
          where: { name: slug },
          update: {},
          create: { name: slug },
        });
      } else if (category === "moods") {
        await prisma.moodTag.upsert({
          where: { name: slug },
          update: {},
          create: { name: slug },
        });
      } else if (category === "dietary") {
        await prisma.dietaryTag.upsert({
          where: { name: slug },
          update: {},
          create: { name: slug },
        });
      }
    }

    if (parsed.data.deleteOption) {
      const { category, slug } = parsed.data.deleteOption;
      let usageCount = 0;

      if (category === "cuisine") {
        usageCount = await prisma.menuItem.count({
          where: { cuisineRegion: { name: slug } },
        });
        if (usageCount === 0) {
          await prisma.cuisineRegion.deleteMany({ where: { name: slug } });
        }
      } else if (category === "courses") {
        usageCount = await prisma.menuItem.count({
          where: { course: { name: slug } },
        });
        if (usageCount === 0) {
          await prisma.course.deleteMany({ where: { name: slug } });
        }
      } else if (category === "moods") {
        usageCount = await prisma.menuItemMood.count({
          where: { moodTag: { name: slug } },
        });
        if (usageCount === 0) {
          await prisma.moodTag.deleteMany({ where: { name: slug } });
        }
      } else if (category === "dietary") {
        usageCount = await prisma.menuItemDietary.count({
          where: { dietaryTag: { name: slug } },
        });
        if (usageCount === 0) {
          await prisma.dietaryTag.deleteMany({ where: { name: slug } });
        }
      } else if (category === "spice") {
        const numeric = Number(slug);
        if (Number.isInteger(numeric)) {
          usageCount = await prisma.menuItem.count({
            where: { spiceLevel: numeric },
          });
        }
      }

      if (usageCount > 0) {
        return NextResponse.json(
          {
            message: `Cannot delete "${slug}" because ${usageCount} ${
              usageCount === 1 ? "dish uses" : "dishes use"
            } it. Turn Customer Visibility off instead.`,
          },
          { status: 409 }
        );
      }
    }

    let nextConfigToSave = parsed.data.config;

    if (parsed.data.renameOption) {
      const { category, oldSlug, newLabel } = parsed.data.renameOption;
      const cleanLabel = newLabel.trim();
      const nextSlug =
        category === "spice"
          ? oldSlug
          : cleanLabel.toLowerCase().replace(/\s+/g, "_");

      if (!nextSlug) {
        return NextResponse.json(
          { message: "Please provide a valid option name." },
          { status: 400 }
        );
      }

      if (category !== "spice" && nextSlug !== oldSlug) {
        if (category === "cuisine") {
          const dup = await prisma.cuisineRegion.findUnique({
            where: { name: nextSlug },
          });
          if (dup) {
            return NextResponse.json(
              {
                message: `Cannot rename: "${cleanLabel}" (${nextSlug}) already exists.`,
              },
              { status: 409 }
            );
          }
          await prisma.cuisineRegion.updateMany({
            where: { name: oldSlug },
            data: { name: nextSlug },
          });
        } else if (category === "courses") {
          const dup = await prisma.course.findUnique({
            where: { name: nextSlug },
          });
          if (dup) {
            return NextResponse.json(
              {
                message: `Cannot rename: "${cleanLabel}" (${nextSlug}) already exists.`,
              },
              { status: 409 }
            );
          }
          await prisma.course.updateMany({
            where: { name: oldSlug },
            data: { name: nextSlug },
          });
        } else if (category === "moods") {
          const dup = await prisma.moodTag.findUnique({
            where: { name: nextSlug },
          });
          if (dup) {
            return NextResponse.json(
              {
                message: `Cannot rename: "${cleanLabel}" (${nextSlug}) already exists.`,
              },
              { status: 409 }
            );
          }
          await prisma.moodTag.updateMany({
            where: { name: oldSlug },
            data: { name: nextSlug },
          });
        } else if (category === "dietary") {
          const dup = await prisma.dietaryTag.findUnique({
            where: { name: nextSlug },
          });
          if (dup) {
            return NextResponse.json(
              {
                message: `Cannot rename: "${cleanLabel}" (${nextSlug}) already exists.`,
              },
              { status: 409 }
            );
          }
          await prisma.dietaryTag.updateMany({
            where: { name: oldSlug },
            data: { name: nextSlug },
          });
        }
      }

      nextConfigToSave = {
        ...nextConfigToSave,
        [category]: nextConfigToSave[category].map((item) =>
          item.slug === oldSlug
            ? { ...item, slug: nextSlug, label: cleanLabel }
            : item
        ),
      };
    }

    const currentSettings = await getRestaurantSettings();
    const existingJson = (currentSettings.customerFilterConfig ?? {}) as Record<
      string,
      unknown
    >;
    await prisma.restaurantSetting.update({
      where: { id: 1 },
      data: {
        customerFilterConfig: {
          ...existingJson,
          ...nextConfigToSave,
        },
      },
    });

    const config = await getResolvedFilterConfig();
    return NextResponse.json({
      message: "Customer filter settings saved.",
      config,
    });
  } catch (error) {
    console.error("Ops filter settings update error:", error);
    return NextResponse.json(
      { message: "Unable to save filter settings." },
      { status: 500 }
    );
  }
}
