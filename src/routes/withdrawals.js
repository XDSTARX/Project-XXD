const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

const SUPPORTED_BANKS = [
  'Pix',
  'PicPay',
  'Nubank',
  'Recargapay',
  'PagBank',
  'InfinitePay',
  'Itaú',
  'Bradesco',
  'Caixa',
  'Banco do Brasil',
  'Santander',
  'Inter',
];

router.get('/', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  db.all('SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, withdrawals) => {
    res.render('withdrawals/index', { title: 'Saques Pix', withdrawals, banks: SUPPORTED_BANKS });
  });
});

// Very low thresholds as requested
const thresholds = [
  { amount_cents: 10, required_points: 1 }, // R$0,10 por 1 ponto
  { amount_cents: 100, required_points: 5 }, // R$1,00 por 5 pontos
  { amount_cents: 2000, required_points: 50 }, // R$20,00 por 50 pontos
];

router.get('/thresholds', requireAuth, (req, res) => {
  res.json({ thresholds });
});

router.post('/', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const { amount_cents, bank, pix_key } = req.body;
  const threshold = thresholds.find((t) => Number(t.amount_cents) === Number(amount_cents));
  if (!threshold) return res.status(400).render('layouts/error', { title: 'Erro', message: 'Valor de saque inválido' });
  if (!SUPPORTED_BANKS.includes(bank)) return res.status(400).render('layouts/error', { title: 'Erro', message: 'Banco não suportado' });
  if (!pix_key) return res.status(400).render('layouts/error', { title: 'Erro', message: 'Chave Pix obrigatória' });

  db.get('SELECT points FROM users WHERE id = ?', [userId], (err, row) => {
    const currentPoints = row ? row.points : 0;
    if (currentPoints < threshold.required_points) {
      return res.status(400).render('layouts/error', { title: 'Erro', message: 'Pontos insuficientes para este saque' });
    }

    const now = new Date().toISOString();
    db.run('UPDATE users SET points = points - ? WHERE id = ?', [threshold.required_points, userId], (e2) => {
      if (e2) return res.status(500).render('layouts/error', { title: 'Erro', message: 'Falha ao debitar pontos' });

      db.run(
        'INSERT INTO withdrawals (user_id, amount_cents, bank, pix_key, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, amount_cents, bank, pix_key, 'processing', now, now],
        function (e3) {
          if (e3) return res.status(500).render('layouts/error', { title: 'Erro', message: 'Falha ao criar saque' });
          // Simulate fast processing: mark completed after a short delay (server-side)
          setTimeout(() => {
            db.run('UPDATE withdrawals SET status = ?, updated_at = ? WHERE id = ?', ['completed', new Date().toISOString(), this.lastID], () => {
              // unlock 'first_withdraw' achievement if not already
              db.get('SELECT id FROM achievements WHERE key = ? LIMIT 1', ['first_withdraw'], (errA, ach) => {
                if (ach) {
                  db.get('SELECT 1 FROM user_achievements WHERE user_id = ? AND achievement_id = ? LIMIT 1', [userId, ach.id], (errB, rowA) => {
                    if (!rowA) {
                      db.run('INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)', [userId, ach.id, new Date().toISOString()]);
                    }
                  });
                }
              });
            });
          }, 2000);
          res.redirect('/withdrawals');
        }
      );
    });
  });
});

router.get('/:id/status', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const id = req.params.id;
  db.get('SELECT id, status FROM withdrawals WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
    if (!row) return res.status(404).json({ ok: false });
    res.json({ ok: true, status: row.status });
  });
});

module.exports = { router };
