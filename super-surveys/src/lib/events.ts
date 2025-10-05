import { prisma } from "@/lib/prisma";

export async function getActivePointsMultiplier(): Promise<number> {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      active: true,
      startAt: { lte: now },
      OR: [{ endAt: null }, { endAt: { gte: now } }],
    },
    select: { pointsMultiplier: true },
  });
  if (events.length === 0) return 1;
  return events.reduce((max, e) => (e.pointsMultiplier > max ? e.pointsMultiplier : max), 1);
}
