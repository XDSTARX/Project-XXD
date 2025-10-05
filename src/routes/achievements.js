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
    `SELECT a.title, a.description, a.points, ua.unlocked_at
     FROM achievements a
     LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
     ORDER BY a.points DESC`,
    [userId],
    (err, rows) => {
      res.render('achievements/index', { title: 'Conquistas', achievements: rows || [] });
    }
  );
});

module.exports = { router };
