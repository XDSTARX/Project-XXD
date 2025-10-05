import { prisma } from "@/lib/prisma";

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Conquistas</h1>
      <ul className="mt-6 grid gap-3">
        {achievements.map(a => (
          <li key={a.id} className="bg-white/5 border border-white/20 rounded p-3">
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm opacity-80">{a.description}</div>
            <div className="text-xs opacity-70">Recompensa: {a.pointsReward} pontos</div>
          </li>
        ))}
        {achievements.length === 0 && <div>Nenhuma conquista cadastrada.</div>}
      </ul>
    </div>
  );
}
