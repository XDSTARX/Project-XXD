"use client";
import { useEffect, useState } from "react";

type Mission = { id: string; title: string; description: string; pointsReward: number; difficulty: string };

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [msg, setMsg] = useState("");

  async function refresh() {
    const res = await fetch("/api/missions");
    const data = await res.json();
    setMissions(data.missions ?? []);
  }
  useEffect(() => { refresh(); }, []);

  async function start(missionId: string) {
    setMsg("");
    const res = await fetch("/api/missions/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ missionId }) });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Erro ao iniciar missão");
    else setMsg("Missão iniciada!");
  }
  async function submit(missionId: string) {
    setMsg("");
    const res = await fetch("/api/missions/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ missionId }) });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Erro ao concluir missão");
    else setMsg(`Missão concluída! +${data.reward} pontos`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Missões</h1>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
      <ul className="mt-6 grid gap-3">
        {missions.map(m => (
          <li key={m.id} className="bg-white/5 border border-white/20 rounded p-4">
            <div className="font-semibold">{m.title}</div>
            <div className="text-sm opacity-80">{m.description}</div>
            <div className="text-xs opacity-70">Dificuldade: {m.difficulty} · Recompensa: {m.pointsReward} pts</div>
            <div className="mt-3 flex gap-3">
              <button onClick={()=>start(m.id)} className="bg-white text-purple-700 px-4 py-1 rounded">Iniciar</button>
              <button onClick={()=>submit(m.id)} className="bg-purple-500 px-4 py-1 rounded">Enviar</button>
            </div>
          </li>
        ))}
        {missions.length === 0 && <div>Nenhuma missão ativa.</div>}
      </ul>
    </div>
  );
}
