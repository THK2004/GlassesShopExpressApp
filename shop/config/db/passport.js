const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userService = require('../../component/user/userService'); // Import your user service

// Configure Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' }, // Use 'email' as the username field
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await userService.findUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Authentication successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user._id); // Only store the user ID in the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.findUserByEmail(id); // Retrieve the full user object
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
