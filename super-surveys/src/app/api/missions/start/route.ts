import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).user.id as string;
  const { missionId } = await req.json();
  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission || !mission.active) return NextResponse.json({ error: "Missão inválida" }, { status: 404 });
  const mp = await prisma.missionProgress.upsert({
    where: { userId_missionId: { userId, missionId } },
    update: { status: "in_progress", startedAt: new Date() },
    create: { userId, missionId, status: "in_progress", startedAt: new Date() },
  });
  return NextResponse.json({ ok: true, progress: mp });
}
