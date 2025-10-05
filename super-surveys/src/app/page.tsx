export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-fuchsia-600 to-pink-600 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold">Super Surveys in the World</h1>
        <p className="mt-4 text-lg md:text-xl opacity-90">
          Complete missões fáceis, ganhe dinheiro no Pix: R$0,10 até R$20 por saque.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="/auth" className="bg-white text-purple-700 font-semibold px-5 py-3 rounded-lg shadow hover:opacity-90">Entrar / Criar conta</a>
          <a href="/missions" className="bg-black/20 backdrop-blur px-5 py-3 rounded-lg border border-white/30">Explorar missões</a>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature title="Saque Pix grátis" desc="Sem taxas, sem limite de saques." />
          <Feature title="Pontos baixos" desc="Valores mínimos de pontos para liberar saque." />
          <Feature title="Offer Walls" desc="Ganhos altos com parceiros confiáveis." />
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-5 border border-white/20">
      <div className="text-xl font-bold">{title}</div>
      <div className="opacity-90 mt-2">{desc}</div>
    </div>
  );
}
