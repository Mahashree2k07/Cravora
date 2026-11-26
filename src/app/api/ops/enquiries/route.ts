import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const status = (searchParams.get("status") || "all").trim();
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (from || to) {
      const range: Record<string, Date> = {};
      if (from) range.gte = new Date(`${from}T00:00:00.000Z`);
      if (to) range.lte = new Date(`${to}T23:59:59.999Z`);
      where.createdAt = range;
    }
    if (search) {
      where.OR = [
        { enquiryNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [enquiries, total, newCount, inProgressCount, resolvedCount] =
      await Promise.all([
        prisma.contactEnquiry.findMany({
          where,
          orderBy: { createdAt: "desc" },
        }),
        prisma.contactEnquiry.count(),
        prisma.contactEnquiry.count({ where: { status: "new" } }),
        prisma.contactEnquiry.count({ where: { status: "in_progress" } }),
        prisma.contactEnquiry.count({ where: { status: "resolved" } }),
      ]);

    return NextResponse.json({
      stats: {
        total,
        new: newCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
      },
      enquiries: enquiries.map((e) => ({
        id: e.id,
        enquiryNumber: e.enquiryNumber,
        customerName: e.customerName,
        email: e.email,
        subject: e.subject,
        message: e.message,
        status: e.status,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Ops enquiries error:", error);
    return NextResponse.json(
      { message: "Unable to load enquiries." },
      { status: 500 }
    );
  }
}
