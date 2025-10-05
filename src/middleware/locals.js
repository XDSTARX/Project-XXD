function attachUserToLocals(req, res, next) {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  res.locals.currentUser = req.session.user || null;
  res.locals.title = 'Super Surveys in the World';
  next();
}

module.exports = { attachUserToLocals };
