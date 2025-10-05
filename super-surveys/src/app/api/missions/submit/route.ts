import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getActivePointsMultiplier } from "@/lib/events";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).user.id as string;
  const { missionId } = await req.json();

  const mp = await prisma.missionProgress.findUnique({ where: { userId_missionId: { userId, missionId } }, include: { mission: true } });
  if (!mp || mp.status !== "in_progress") return NextResponse.json({ error: "Missão não iniciada" }, { status: 400 });

  const mult = await getActivePointsMultiplier();
  const reward = Math.round(mp.mission.pointsReward * mult);
  await prisma.$transaction([
    prisma.missionProgress.update({ where: { userId_missionId: { userId, missionId } }, data: { status: "approved", completedAt: new Date() } }),
    prisma.user.update({ where: { id: userId }, data: { points: { increment: reward } } }),
    prisma.pointsTransaction.create({ data: { userId, type: "mission_reward", points: reward, missionId } }),
  ]);

  return NextResponse.json({ ok: true, reward });
}
