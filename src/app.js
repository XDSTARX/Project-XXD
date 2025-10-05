const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const { router: authRouter } = require('./routes/auth');
const { router: dashboardRouter } = require('./routes/dashboard');
const { router: missionsRouter } = require('./routes/missions');
const { router: withdrawalsRouter } = require('./routes/withdrawals');
const { router: leaderboardRouter } = require('./routes/leaderboard');
const { router: achievementsRouter } = require('./routes/achievements');
const { router: checkinRouter } = require('./routes/checkin');
const { router: historyRouter } = require('./routes/history');
const { router: eventsRouter } = require('./routes/events');
const { attachUserToLocals } = require('./middleware/locals');
const { seed } = require('./models/seed');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.set('layout', 'layouts/base');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

// CSRF protection except for API endpoints that simulate offer wall callbacks
const csrfProtection = csrf({ cookie: false });
app.use((req, res, next) => {
  if (req.path.startsWith('/offerwall/callback') || req.path.startsWith('/api/')) {
    return next();
  }
  return csrfProtection(req, res, next);
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(attachUserToLocals);

// Seed initial data (idempotent)
seed();

app.use('/', authRouter);
app.use('/', dashboardRouter);
app.use('/missions', missionsRouter);
app.use('/withdrawals', withdrawalsRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/achievements', achievementsRouter);
app.use('/history', historyRouter);
app.use('/checkin', checkinRouter);
app.use('/api/events', eventsRouter);

app.get('/healthz', (req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => {
  res.status(404).render('layouts/error', { title: 'Not Found', message: 'Página não encontrada.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const message = process.env.NODE_ENV === 'production' ? 'Algo deu errado.' : err.message;
  res.status(500).render('layouts/error', { title: 'Erro', message });
});

module.exports = app;
