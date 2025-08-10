const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin.js');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) return done(null, false, { message: 'No admin found' });
      if (admin.password !== password) return done(null, false, { message: 'Wrong password' });
      return done(null, admin);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id);
      done(null, admin);
    } catch (err) {
      done(err);
    }
  });
};
