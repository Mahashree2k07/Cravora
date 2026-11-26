import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image file to upload." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES[file.type.toLowerCase()];
    if (!ext) {
      return NextResponse.json(
        { message: "Only JPG, PNG, or WebP images are supported." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image size must be 5 MB or less." },
        { status: 400 }
      );
    }

    const rawBase = path.basename(file.name, path.extname(file.name));
    const slug =
      rawBase
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) || "menu-item";

    const filename = `${slug}-${randomBytes(3).toString("hex")}${ext}`;
    const menuDir = path.join(process.cwd(), "public", "images", "menu");
    await mkdir(menuDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(menuDir, filename), buffer);

    return NextResponse.json(
      { imageUrl: `/images/menu/${filename}` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Menu image upload error:", error);
    return NextResponse.json(
      { message: "Unable to upload image." },
      { status: 500 }
    );
  }
}
