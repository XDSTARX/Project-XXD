import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.withdrawal.findMany({ orderBy: { requestedAt: "desc" }, take: 100 });
  return NextResponse.json({ withdrawals: items });
}
