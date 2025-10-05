"use client";
import { useEffect, useState } from "react";

interface Withdrawal {
  id: string;
  amountCents: number;
  bank: string;
  pixKey: string;
  status: string;
  providerRef: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export default function WithdrawPage() {
  const [list, setList] = useState<Withdrawal[]>([]);
  const [amountCents, setAmountCents] = useState<number>(1000);
  const [bank, setBank] = useState<string>("Nubank");
  const [pixKey, setPixKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  async function refresh() {
    const res = await fetch("/api/withdrawals");
    const data = await res.json();
    setList(data.withdrawals ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents, bank, pixKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao solicitar saque");
      setMessage("Saque solicitado e processado rapidamente!");
      await refresh();
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Saque PIX grátis</h1>
      <p className="opacity-80 mt-2">Sem limite de saques. Processamento rápido.</p>

      <div className="mt-6 grid gap-4 bg-purple-600/10 p-4 rounded border border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm">Valor (R$)</span>
            <input type="number" min={0.1} step={0.1} value={amountCents/100} onChange={(e)=>setAmountCents(Math.round(Number(e.target.value)*100))} className="w-full mt-1 p-2 rounded bg-white/90 text-black" />
          </label>
          <label className="block">
            <span className="text-sm">Banco</span>
            <select value={bank} onChange={(e)=>setBank(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/90 text-black">
              {["PicPay","Nubank","Recargapay","PagBank","InfinitePay","Itaú","Bradesco","Banco do Brasil","Caixa","Santander","Inter","C6","Sicoob","Sicredi"].map(b=>
                <option key={b} value={b}>{b}</option>
              )}
            </select>
          </label>
          <label className="block">
            <span className="text-sm">Chave Pix</span>
            <input value={pixKey} onChange={(e)=>setPixKey(e.target.value)} placeholder="email/telefone/cpf/chave" className="w-full mt-1 p-2 rounded bg-white/90 text-black" />
          </label>
        </div>
        <button onClick={submit} disabled={loading} className="bg-white text-purple-700 font-semibold px-5 py-2 rounded shadow w-fit">
          {loading ? "Processando..." : "Solicitar saque"}
        </button>
        {message && <div className="text-sm">{message}</div>}
      </div>

      <h2 className="text-xl font-semibold mt-10">Acompanhar processamento</h2>
      <div className="mt-3 grid gap-2">
        {list.map(w => (
          <div key={w.id} className="border border-white/20 rounded p-3 bg-white/5">
            <div className="font-semibold">R${(w.amountCents/100).toFixed(2)} · {w.bank}</div>
            <div className="text-sm opacity-80">Status: {w.status} · Ref: {w.providerRef ?? "-"}</div>
            <div className="text-xs opacity-60">Solicitado: {new Date(w.requestedAt).toLocaleString()} {w.processedAt && ` · Conclusão: ${new Date(w.processedAt).toLocaleString()}`}</div>
          </div>
        ))}
        {list.length === 0 && <div className="opacity-70">Nenhum saque ainda.</div>}
      </div>
    </div>
  );
}
