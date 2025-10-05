const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

router.get('/', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const today = new Date().toISOString().slice(0, 10);
  db.get('SELECT streak FROM checkins WHERE user_id = ? AND date = ?', [userId, today], (err, row) => {
    res.render('dashboard/checkin', { title: 'Check-in Diário', today, alreadyChecked: !!row });
  });
});

router.post('/', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);

  db.get('SELECT streak FROM checkins WHERE user_id = ? AND date = ?', [userId, todayStr], (err, existing) => {
    if (existing) return res.redirect('/checkin');

    db.get('SELECT streak FROM checkins WHERE user_id = ? AND date = ?', [userId, yesterdayStr], (err2, yest) => {
      const newStreak = yest ? yest.streak + 1 : 1;
      const reward = 2 + Math.min(newStreak, 5); // small increasing reward

      db.run(
        'INSERT INTO checkins (user_id, date, streak, reward_points) VALUES (?, ?, ?, ?)',
        [userId, todayStr, newStreak, reward],
        (e3) => {
          if (e3) return res.redirect('/checkin');
          db.run('UPDATE users SET points = points + ? WHERE id = ?', [reward, userId]);

          // unlock simple achievement on 7-day streak
          if (newStreak === 7) {
            db.get('SELECT id FROM achievements WHERE key = ? LIMIT 1', ['seven_day_streak'], (e4, ach) => {
              if (ach) {
                db.run('INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)', [userId, ach.id, new Date().toISOString()]);
              }
            });
          }

          res.redirect('/checkin');
        }
      );
    });
  });
});

module.exports = { router };
