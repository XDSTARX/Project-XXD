const db = require('../db');

function seed() {
  db.serialize(() => {
    db.run(`INSERT OR IGNORE INTO missions (key, title, description, reward_points, is_active) VALUES
      ('signup_newsletter', 'Assine uma newsletter', 'Inscreva-se e confirme seu e-mail', 5, 1),
      ('watch_video', 'Assista a um vídeo', 'Assista a um vídeo curto', 3, 1),
      ('answer_survey', 'Responda uma pesquisa', 'Complete uma pesquisa simples', 10, 1)
    `);

    db.run(`INSERT OR IGNORE INTO achievements (key, title, description, points) VALUES
      ('first_withdraw', 'Primeiro saque', 'Realize seu primeiro saque', 10),
      ('ten_missions', 'Fã de missões', 'Complete 10 missões', 20),
      ('seven_day_streak', 'Firme e forte', 'Faça 7 check-ins seguidos', 15)
    `);
  });

  // Create a simple admin/test user if none exists
  db.get('SELECT id FROM users WHERE email = ? LIMIT 1', ['admin@example.com'], (err, row) => {
    if (!row) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('admin123', 10);
      db.run(
        'INSERT INTO users (email, password_hash, display_name, points, created_at) VALUES (?, ?, ?, ?, ?)',
        ['admin@example.com', hash, 'Admin', 100, new Date().toISOString()]
      );
    }
  });
}

module.exports = { seed };
