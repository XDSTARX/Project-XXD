import { prisma } from "@/lib/prisma";

export default async function RankingPage() {
  const top = await prisma.user.findMany({
    orderBy: { points: "desc" },
    select: { id: true, name: true, email: true, points: true },
    take: 50,
  });
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Ranking</h1>
      <ol className="mt-6 grid gap-2">
        {top.map((u, i) => (
          <li key={u.id} className="bg-white/5 border border-white/20 rounded p-3 flex items-center justify-between">
            <div>
              <span className="font-semibold mr-3">#{i + 1}</span>
              <span>{u.name ?? u.email}</span>
            </div>
            <div className="font-mono">{u.points} pts</div>
          </li>
        ))}
        {top.length === 0 && <div>Nenhum usuário ainda.</div>}
      </ol>
    </div>
  );
}
