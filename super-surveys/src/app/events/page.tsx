import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const now = new Date();
  const items = await prisma.event.findMany({ orderBy: { startAt: "desc" } });
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Eventos</h1>
      <ul className="mt-6 grid gap-3">
        {items.map(e => (
          <li key={e.id} className={`p-4 rounded border ${e.active && (!e.endAt || new Date(e.endAt) >= now) ? 'border-green-400/50 bg-green-400/10' : 'border-white/20 bg-white/5'}`}>
            <div className="font-semibold">{e.title}</div>
            <div className="text-sm opacity-80">Multiplicador: x{e.pointsMultiplier}</div>
            <div className="text-xs opacity-70">Início: {new Date(e.startAt).toLocaleString()} {e.endAt && `· Fim: ${new Date(e.endAt).toLocaleString()}`}</div>
          </li>
        ))}
        {items.length === 0 && <div>Nenhum evento.</div>}
      </ul>
    </div>
  );
}
