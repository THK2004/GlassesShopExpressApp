const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
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

  // Google Strategy for social sign-in/sign-up
  passport.use(
    new GoogleStrategy(
      {
        // clientID: process.env.GOOGLE_CLIENT_ID,
        // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientID: "717459030999-ifv6e1jf38jcl322bg9q83ll660752e6.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: '/auth/google/callback', // Adjust as needed
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });
  
          if (!user) {
            // Create a new user
            user = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
            await user.save();
          }
  
          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
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