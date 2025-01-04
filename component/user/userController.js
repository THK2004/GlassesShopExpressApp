const passport = require('passport'); 
const bcrypt = require('bcryptjs'); // For password hashing
const userService = require('./userService');
const User = require('../../models/userModel');

// Render the registration page
const getRegister = (req, res) => {
  res.render('register/register', { register: true });
};

// Handle registration form submission
const postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const errors = [];

    // Validate username (full name format)
    const fullNamePattern = /^[A-Z][a-z]+( [A-Z][a-z]+)+$/; // At least two words, each starting with an uppercase letter
    if (!fullNamePattern.test(username)) {
      errors.push('Username must be a full name with at least two words, starting with uppercase letters (e.g., John Doe).');
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push('Please enter a valid email address.');
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push('Email already exists.');
    }

    // Validate password complexity
    const passwordComplexityPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordComplexityPattern.test(password)) {
      errors.push(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }

    // If there are validation errors, render the form with error messages
    if (errors.length > 0) {
      return res.status(400).render('register/register', {
        register: true,
        errorMessage: errors.join('<br>'), // Display multiple errors in the frontend
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    await userService.saveUser(username, email, hashedPassword);

    // Redirect to the login page after successful registration
    res.redirect('/user/login');
  } catch (error) {
    console.error('Error during registration:', error);
    // Render error message in case of unexpected errors
    res.status(500).render('register/register', {
      register: true,
      errorMessage: 'An unexpected error occurred during registration. Please try again.',
    });
  }
};

const getLogin = (req, res) => {
  res.render('login/login', {login: true});
}

const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).render('login/login', { 
        login: true, 
        errorMessage: 'An unexpected error occurred. Please try again.' 
      });
    }
    if (!user) {
      return res.status(400).render('login/login', { 
        login: true, 
        errorMessage: info.message || 'Invalid email or password.' 
      });
    }
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).render('login/login', { 
          login: true, 
          errorMessage: 'Login failed. Please try again.' 
        });
      }
      return res.redirect('/home/about');
    });
  })(req, res, next);
};


const getCart = (req, res) => {
  res.render('cart/cart', {cart: true});
}

const getlogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).render('about/about', { errorMessage: 'Failed to log out.' });
    }
    // Optional: Destroy the session manually
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('about/about', { errorMessage: 'Error clearing session.' });
      }
      // Redirect to login or home page after logout
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.redirect('/user/login'); // Adjust redirect as per your app
    });
  });
};
// AJAX endpoint for checking username/email availability
const checkAvailability = async (req, res) => {
  const { username, email } = req.body;
  try {
    let usernameExists = false;
    let emailExists = false;

    if (username) {
      usernameExists = await userService.findUserByUsername(username);
    }

    if (email) {
      emailExists = await userService.findUserByEmail(email);
    }

    res.json({
      usernameAvailable: !usernameExists,
      emailAvailable: !emailExists,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.render('profile/profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the profile.');
  }
};

// Handle profile update form submission
const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;

    await userService.updateProfile(req.user._id, username);
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.message === 'Invalid username format.') {
      return res.status(400).render('profile/profile', {
        user: req.user,
        errorMessage: error.message,
      });
    }
    res.status(500).send('An error occurred while updating the profile.');
  }
};


const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    await userService.updatePasswordsv(req.user._id, oldPassword, newPassword);
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Error updating password:', error);
    if (error.message === 'Incorrect old password.') {
      return res.status(400).render('profile/profile', {
        user: req.user,
        errorMessage: error.message,
      });
    }
    res.status(500).send('An error occurred while updating the password.');
  }
};

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getCart,
  getlogout,
  checkAvailability,
  getProfile,
  updateProfile,
  updatePassword
};