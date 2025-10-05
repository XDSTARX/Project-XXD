import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getActivePointsMultiplier } from "@/lib/events";

function normalizeDate(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session as any).user.id as string;

  const today = normalizeDate();
  const existing = await prisma.checkin.findUnique({ where: { userId_date: { userId, date: today } } });
  if (existing) {
    return NextResponse.json({ ok: true, already: true });
  }

  const base = 25; // daily reward
  const mult = await getActivePointsMultiplier();
  const points = Math.round(base * mult);
  await prisma.$transaction([
    prisma.checkin.create({ data: { userId, date: today, pointsAwarded: points } }),
    prisma.user.update({ where: { id: userId }, data: { points: { increment: points } } }),
    prisma.pointsTransaction.create({ data: { userId, type: "checkin_reward", points, note: "Daily check-in" } }),
  ]);

  return NextResponse.json({ ok: true, points });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session as any).user.id as string;
  const list = await prisma.checkin.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 30 });
  return NextResponse.json({ checkins: list });
}
