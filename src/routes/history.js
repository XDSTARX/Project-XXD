const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

router.get('/', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  db.all(
    `SELECT um.id, m.title, um.status, um.created_at FROM user_missions um
     JOIN missions m ON m.id = um.mission_id
     WHERE um.user_id = ? ORDER BY um.created_at DESC LIMIT 100`,
    [userId],
    (err, missionHistory) => {
      db.all(
        'SELECT id, amount_cents, bank, status, created_at FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
        [userId],
        (err2, withdrawals) => {
          res.render('history/index', { title: 'Histórico', missionHistory: missionHistory || [], withdrawals: withdrawals || [] });
        }
      );
    }
  );
});

module.exports = { router };
