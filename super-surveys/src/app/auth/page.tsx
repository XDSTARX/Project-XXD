"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login"|"register">("login");
  const [msg, setMsg] = useState("");

  async function onLogin() {
    setMsg("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setMsg(res.error);
    else window.location.href = "/";
  }

  async function onRegister() {
    setMsg("");
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Erro ao registrar");
    else setMode("login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 via-fuchsia-600 to-pink-600 text-white p-6">
      <div className="w-full max-w-md bg-black/30 p-6 rounded-xl border border-white/20">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
        <div className="mt-4 grid gap-3">
          {mode === "register" && (
            <label className="block">
              <span className="text-sm">Nome</span>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/90 text-black" />
            </label>
          )}
          <label className="block">
            <span className="text-sm">Email</span>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/90 text-black" />
          </label>
          <label className="block">
            <span className="text-sm">Senha</span>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/90 text-black" />
          </label>
          <button onClick={mode === "login" ? onLogin : onRegister} className="mt-2 bg-white text-purple-700 font-semibold px-5 py-2 rounded shadow">
            {mode === "login" ? "Entrar" : "Registrar"}
          </button>
          {msg && <div className="text-sm mt-1">{msg}</div>}
        </div>
        <div className="mt-4 text-sm">
          {mode === "login" ? (
            <button onClick={()=>setMode("register")} className="underline">Criar uma conta</button>
          ) : (
            <button onClick={()=>setMode("login")} className="underline">Já tenho conta</button>
          )}
        </div>
      </div>
    </div>
  );
}
