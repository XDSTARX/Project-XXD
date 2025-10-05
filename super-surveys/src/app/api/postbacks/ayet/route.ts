import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("uid");
  const txId = searchParams.get("trans_id") ?? undefined;
  const points = Number(searchParams.get("p") ?? "0");

  await prisma.offerwallPostback.create({
    data: {
      providerName: "ayet",
      userId: userId ?? undefined,
      externalUserId: userId ?? undefined,
      txId,
      points,
      raw: Object.fromEntries(searchParams.entries()),
    },
  });

  if (userId && points > 0) {
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { points: { increment: points } } }),
      prisma.pointsTransaction.create({
        data: {
          userId,
          type: "offerwall_reward",
          points,
          note: `AyET tx ${txId ?? "n/a"}`,
        },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
