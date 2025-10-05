import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { MockPixProvider } from "@/lib/pix/provider";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session as any).user.id as string;
  const body = await req.json();
  const amountCents = Math.round(Number(body.amountCents));
  const bank = String(body.bank);
  const pixKey = String(body.pixKey);

  if (!amountCents || amountCents < 10) {
    return NextResponse.json({ error: "Valor mínimo R$0,10" }, { status: 400 });
  }

  // Check points requirement - extremely low thresholds as requested
  // Map points needed = ceil(amountCents * 0.2) e.g., 100 cents -> 20 points
  const pointsNeeded = Math.max(1, Math.ceil(amountCents * 0.2));
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.points < pointsNeeded) {
    return NextResponse.json({ error: "Pontos insuficientes", pointsNeeded }, { status: 400 });
  }

  const provider = new MockPixProvider();
  const result = await provider.payout({ amountCents, bank, pixKey });

  const withdrawal = await prisma.$transaction(async (tx) => {
    const w = await tx.withdrawal.create({
      data: {
        userId,
        amountCents,
        bank,
        pixKey,
        status: "processing",
        providerName: result.providerName,
        providerRef: result.providerRef,
      },
    });

    await tx.user.update({ where: { id: userId }, data: { points: { decrement: pointsNeeded } } });
    await tx.pointsTransaction.create({
      data: {
        userId,
        type: "withdrawal_deduction",
        points: -pointsNeeded,
        note: `Saque PIX ${result.providerRef}`,
        withdrawalId: w.id,
      },
    });

    return w;
  });

  // Simule pagamento instantâneo
  await prisma.withdrawal.update({ where: { id: withdrawal.id }, data: { status: "paid", processedAt: new Date() } });

  return NextResponse.json({ ok: true, withdrawal, etaSeconds: result.estimatedSeconds });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session as any).user.id as string;
  const list = await prisma.withdrawal.findMany({ where: { userId }, orderBy: { requestedAt: "desc" } });
  return NextResponse.json({ withdrawals: list });
}
