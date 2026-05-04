const User = require('../models/user');

module.exports.renderSignup = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already taken');
      return res.redirect('/signup');
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash('error', 'Email already registered');
      return res.redirect('/signup');
    }
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect('/listings');
    });
  } catch (e) {
    console.error(e);
    req.flash('error', e && e.message ? e.message : 'Something went wrong');
    res.redirect('/signup');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Logged you out!');
    res.redirect('/listings');
  });
};
