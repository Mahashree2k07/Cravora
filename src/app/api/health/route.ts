
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      application: "Cravora",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
      },
      { status: 500 }
    );
  }
}
