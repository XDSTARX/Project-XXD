export default function OfferwallsPage() {
  const items = [
    { name: "AdGateMedia", href: "https://wall.adgaterewards.com/..." },
    { name: "AyET", href: "https://offers.example.com/ayet" },
    { name: "CPX Research", href: "https://offers.example.com/cpx" },
  ];
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Offer Walls</h1>
      <p className="opacity-80 mt-2">Conclua ofertas e receba pontos automaticamente.</p>
      <ul className="mt-6 grid gap-3">
        {items.map((i) => (
          <li key={i.name}>
            <a href={i.href} className="block bg-purple-600/10 border border-purple-400/30 rounded p-4 hover:bg-purple-600/20">
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm opacity-80">Abrir parede de ofertas</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
