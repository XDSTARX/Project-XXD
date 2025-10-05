"use client";
import { useEffect, useState } from "react";

interface Check { id: string; date: string; pointsAwarded: number }

export default function CheckinPage() {
  const [list, setList] = useState<Check[]>([]);
  const [msg, setMsg] = useState<string>("");

  async function refresh() {
    const res = await fetch("/api/checkin");
    const data = await res.json();
    setList(data.checkins ?? []);
  }

  useEffect(() => { refresh(); }, []);

  async function doCheckin() {
    setMsg("");
    const res = await fetch("/api/checkin", { method: "POST" });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Erro de check-in");
    if (data.already) setMsg("Check-in de hoje já realizado.");
    else setMsg(`Check-in realizado! +${data.points} pontos`);
    await refresh();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Check-in Diário</h1>
      <p className="opacity-80 mt-2">Volte todos os dias e ganhe pontos.</p>
      <button onClick={doCheckin} className="mt-4 bg-white text-purple-700 font-semibold px-5 py-2 rounded shadow">Fazer check-in</button>
      {msg && <div className="mt-2 text-sm">{msg}</div>}

      <h2 className="text-xl font-semibold mt-8">Últimos check-ins</h2>
      <div className="mt-2 grid gap-2">
        {list.map(c => (
          <div key={c.id} className="border border-white/20 rounded p-3 bg-white/5">
            <div className="font-medium">{new Date(c.date).toLocaleDateString()}</div>
            <div className="text-sm opacity-80">+{c.pointsAwarded} pontos</div>
          </div>
        ))}
        {list.length === 0 && <div className="opacity-70">Nenhum check-in registrado.</div>}
      </div>
    </div>
  );
}
