const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

router.get('/', requireAuth, (req, res) => {
  db.all('SELECT * FROM missions WHERE is_active = 1', [], (err, missions) => {
    db.get('SELECT multiplier FROM events WHERE is_active = 1 ORDER BY id DESC LIMIT 1', [], (e2, ev) => {
      const multiplier = ev ? ev.multiplier : 1.0;
      const boosted = missions.map((m) => ({ ...m, reward_points: Math.round(m.reward_points * multiplier) }));
      res.render('missions/list', { title: 'Missões', missions: boosted });
    });
  });
});

// Simulated offer wall callback
router.post('/offerwall/callback', (req, res) => {
  const { user_id, mission_key } = req.body;
  if (!user_id || !mission_key) return res.status(400).json({ ok: false });
  db.get('SELECT id, reward_points FROM missions WHERE key = ?', [mission_key], (err, mission) => {
    if (!mission) return res.status(404).json({ ok: false });
    // apply event multiplier if any
    db.get('SELECT multiplier FROM events WHERE is_active = 1 ORDER BY id DESC LIMIT 1', [], (e2, ev) => {
      const multiplier = ev ? ev.multiplier : 1.0;
      const reward = Math.round(mission.reward_points * multiplier);
      db.run('UPDATE users SET points = points + ? WHERE id = ?', [reward, user_id], function (err2) {
      if (err2) return res.status(500).json({ ok: false });
        db.run(
          'INSERT INTO user_missions (user_id, mission_id, status, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [user_id, mission.id, 'completed', 100, new Date().toISOString(), new Date().toISOString()],
          () => {
            // check 10 missions achievement
            db.get('SELECT COUNT(*) as c FROM user_missions WHERE user_id = ? AND status = ?',[user_id, 'completed'], (e3, rowC) => {
              const count = rowC ? rowC.c : 0;
              if (count >= 10) {
                db.get('SELECT id FROM achievements WHERE key = ? LIMIT 1', ['ten_missions'], (e4, ach) => {
                  if (ach) {
                    db.get('SELECT 1 FROM user_achievements WHERE user_id = ? AND achievement_id = ? LIMIT 1', [user_id, ach.id], (e5, rowA) => {
                      if (!rowA) db.run('INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)', [user_id, ach.id, new Date().toISOString()]);
                    });
                  }
                });
              }
            });
            res.json({ ok: true });
          }
        );
      });
    });
  });
});

module.exports = { router };
