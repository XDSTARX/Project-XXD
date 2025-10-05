import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const status = (body as any).status as "processing" | "paid" | "failed" | "canceled";
  const w = await prisma.withdrawal.update({ where: { id }, data: { status, processedAt: status === "paid" ? new Date() : null } });
  return NextResponse.json({ withdrawal: w });
}
