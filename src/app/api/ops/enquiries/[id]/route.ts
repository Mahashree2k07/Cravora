import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

const updateEnquirySchema = z.object({
  status: z.enum(["new", "in_progress", "resolved"]),
});

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getOpsSessionFromRequest(request);
  if (!session) return opsUnauthorizedResponse();

  try {
    const json = await request.json();
    const parsed = updateEnquirySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid status." },
        { status: 400 }
      );
    }

    const updated = await prisma.contactEnquiry.update({
      where: { id: context.params.id },
      data: { status: parsed.data.status },
      select: { id: true, enquiryNumber: true, status: true },
    });

    return NextResponse.json({
      message: "Enquiry status updated.",
      enquiry: updated,
    });
  } catch (error) {
    console.error("Ops enquiry update error:", error);
    return NextResponse.json(
      { message: "Unable to update enquiry." },
      { status: 500 }
    );
  }
}
