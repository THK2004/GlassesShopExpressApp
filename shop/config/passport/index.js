const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');

module.exports = (passport) => {
  // Local Strategy for authentication
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Password incorrect' });
        }

        // Success
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize user (store user ID in session)
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserialize user (retrieve user by ID from session)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
