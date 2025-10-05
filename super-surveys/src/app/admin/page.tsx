"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [multiplier, setMultiplier] = useState(1);

  async function load() {
    const [e, w] = await Promise.all([
      fetch("/api/admin/events").then(r=>r.json()),
      fetch("/api/admin/withdrawals").then(r=>r.json()),
    ]);
    setEvents(e.events ?? []);
    setWithdrawals(w.withdrawals ?? []);
  }

  useEffect(() => { load(); }, []);

  async function createEvent() {
    await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, pointsMultiplier: multiplier, startAt: new Date(), active: true }) });
    setTitle("");
    setMultiplier(1);
    await load();
  }

  async function updateWithdrawal(id: string, status: string) {
    await fetch(`/api/admin/withdrawals/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    await load();
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid gap-10">
      <section>
        <h2 className="text-2xl font-bold">Eventos</h2>
        <div className="mt-3 flex gap-2">
          <input placeholder="Título" value={title} onChange={(e)=>setTitle(e.target.value)} className="p-2 rounded bg-white/90 text-black" />
          <input type="number" min={0.5} step={0.1} value={multiplier} onChange={(e)=>setMultiplier(Number(e.target.value))} className="p-2 rounded bg-white/90 text-black w-32" />
          <button onClick={createEvent} className="bg-white text-purple-700 px-4 py-2 rounded">Criar</button>
        </div>
        <ul className="mt-3 grid gap-2">
          {events.map(e => (
            <li key={e.id} className="bg-white/5 border border-white/20 rounded p-3">
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm opacity-80">x{e.pointsMultiplier} · {new Date(e.startAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Saques</h2>
        <ul className="mt-3 grid gap-2">
          {withdrawals.map(w => (
            <li key={w.id} className="bg-white/5 border border-white/20 rounded p-3">
              <div className="font-semibold">R${(w.amountCents/100).toFixed(2)} · {w.bank} · {w.status}</div>
              <div className="text-sm opacity-80">{w.pixKey} · {w.providerRef}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>updateWithdrawal(w.id, "processing")} className="bg-purple-500 px-3 py-1 rounded">Processando</button>
                <button onClick={()=>updateWithdrawal(w.id, "paid")} className="bg-green-600 px-3 py-1 rounded">Pago</button>
                <button onClick={()=>updateWithdrawal(w.id, "failed")} className="bg-red-600 px-3 py-1 rounded">Falhou</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
