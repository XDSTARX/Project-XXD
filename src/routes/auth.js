const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Entrar - Super Surveys in the World' });
});

router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/register', { title: 'Registrar - Super Surveys in the World' });
});

router.post('/register', (req, res) => {
  const { email, password, display_name } = req.body;
  if (!email || !password || !display_name) return res.status(400).send('Dados inválidos');
  const password_hash = bcrypt.hashSync(password, 10);
  const created_at = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO users (email, password_hash, display_name, points, created_at) VALUES (?, ?, ?, 0, ?)');
  stmt.run(email, password_hash, display_name, created_at, function (err) {
    if (err) {
      return res.status(400).render('layouts/error', { title: 'Erro', message: 'Email já registrado ou dados inválidos.' });
    }
    req.session.user = { id: this.lastID, email, display_name, points: 0 };
    res.redirect('/dashboard');
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).render('layouts/error', { title: 'Erro', message: 'Credenciais inválidas' });
    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).render('layouts/error', { title: 'Erro', message: 'Credenciais inválidas' });
    }
    req.session.user = { id: user.id, email: user.email, display_name: user.display_name, points: user.points };
    res.redirect('/dashboard');
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = { router };
