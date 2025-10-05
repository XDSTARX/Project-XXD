const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT display_name, points FROM users ORDER BY points DESC LIMIT 100', [], (err, rows) => {
    res.render('leaderboard/index', { title: 'Ranking', leaders: rows || [] });
  });
});

module.exports = { router };
