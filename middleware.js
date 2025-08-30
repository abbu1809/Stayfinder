module.exports.isloggedin = (req, res, next) => {

  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}