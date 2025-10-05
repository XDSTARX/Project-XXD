const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

router.get('/dashboard', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  db.get('SELECT points FROM users WHERE id = ?', [userId], (err, row) => {
    const points = row ? row.points : 0;
    res.render('dashboard/index', { title: 'Dashboard - Super Surveys in the World', points });
  });
});

module.exports = { router };
