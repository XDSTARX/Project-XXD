import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).user?.id) redirect("/auth");
  const userId = (session as any).user.id as string;

  const [txs, withdrawals] = await Promise.all([
    prisma.pointsTransaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.withdrawal.findMany({ where: { userId }, orderBy: { requestedAt: "desc" }, take: 20 }),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-8">
      <div>
        <h2 className="text-2xl font-bold">Histórico de Pontos</h2>
        <ul className="mt-3 grid gap-2">
          {txs.map(t => (
            <li key={t.id} className="bg-white/5 border border-white/20 rounded p-3 flex items-center justify-between">
              <div>
                <div className="text-sm opacity-80">{t.type}</div>
                <div className="text-xs opacity-60">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className={`font-mono ${t.points >= 0 ? 'text-green-300' : 'text-red-300'}`}>{t.points > 0 ? `+${t.points}` : t.points}</div>
            </li>
          ))}
          {txs.length === 0 && <div>Nenhum registro.</div>}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Histórico de Saques</h2>
        <ul className="mt-3 grid gap-2">
          {withdrawals.map(w => (
            <li key={w.id} className="bg-white/5 border border-white/20 rounded p-3">
              <div className="font-semibold">R${(w.amountCents/100).toFixed(2)} · {w.bank}</div>
              <div className="text-sm opacity-80">{w.status} · Ref: {w.providerRef ?? '-'}</div>
              <div className="text-xs opacity-60">{new Date(w.requestedAt).toLocaleString()} {w.processedAt && ` · ${new Date(w.processedAt).toLocaleString()}`}</div>
            </li>
          ))}
          {withdrawals.length === 0 && <div>Nenhum saque realizado.</div>}
        </ul>
      </div>
    </div>
  );
}
