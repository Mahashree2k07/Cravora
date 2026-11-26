import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpsSessionFromRequest, opsUnauthorizedResponse } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = getOpsSessionFromRequest(request);
  if (!session) {
    return opsUnauthorizedResponse();
  }

  const staff = await prisma.staffUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return NextResponse.json({
    user: staff ?? {
      id: session.userId,
      username: session.username,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
