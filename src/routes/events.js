const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAdmin(req, res, next) {
  // Simplified: anyone can toggle in dev; in production, protect this.
  next();
}

router.get('/', (req, res) => {
  db.all('SELECT * FROM events', [], (err, events) => {
    res.json({ events: events || [] });
  });
});

router.post('/:key/toggle', requireAdmin, (req, res) => {
  const key = req.params.key;
  db.get('SELECT id, is_active FROM events WHERE key = ?', [key], (err, ev) => {
    if (!ev) return res.status(404).json({ ok: false });
    const newActive = ev.is_active ? 0 : 1;
    db.run('UPDATE events SET is_active = ? WHERE id = ?', [newActive, ev.id], (e2) => {
      res.json({ ok: true, is_active: newActive });
    });
  });
});

module.exports = { router };
