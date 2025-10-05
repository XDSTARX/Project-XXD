import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.event.findMany({ orderBy: { startAt: "desc" } });
  return NextResponse.json({ events: items });
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await prisma.event.create({ data: body });
  return NextResponse.json({ event: item });
}
