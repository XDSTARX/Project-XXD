Super Surveys in the World
==========================

Ganhe dinheiro no Pix completando missões, surveys e check-ins diários. Saques grátis, sem limite, com exigência de pontos baixa.

Stack: Next.js App Router + Prisma (SQLite) + NextAuth + Tailwind.

Getting Started
---------------

1) Copie env e instale deps:
```bash
cp .env.example .env
npm install
```
2) Migre o banco e gere client:
```bash
npx prisma migrate dev
```
3) Rode o dev server:
```bash
npm run dev
```

Rotas principais
----------------
- Home: `/`
- Offer Walls: `/offerwalls` (postbacks: `/api/postbacks/{adgate,ayet,cpx}`)
- Check-in diário: `/checkin`
- Saques Pix: `/withdraw` e `/api/withdrawals`
- Histórico: `/history`
- Ranking: `/ranking`
- Conquistas: `/achievements`

Notas
-----
- O provedor Pix atual é mock (não paga de verdade). Para pagamentos reais, implemente um `PixProvider` conectado ao PSP/banco (PicPay, Nubank, PagBank, InfinitePay, etc.) em `src/lib/pix/provider.ts` e adicione chaves/credenciais no `.env`.
- Ajuste a conversão pontos→valor e regras conforme seu modelo de negócio.
