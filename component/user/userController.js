const passport = require('passport'); 
const bcrypt = require('bcryptjs'); // For password hashing
const userService = require('./userService');
const User = require('../../models/userModel');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
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

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const initiatePayment = async (req, res) => {
  const { receiver, address, phone, cart, amount } = req.body;

  const embed_data = JSON.stringify({ receiver, address, phone, cart, totalPrice: amount
    ,redirecturl: "https://glassesshopexpressapp-userside.onrender.com/home", });

  const items = []; // Optionally add items for ZaloPay receipt

  const transID = Math.floor(Math.random() * 1000000);
  const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: "user123", // You can associate this with a user ID
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data,
      amount,
      description: `Payment for the order #${transID}`,
      bank_code: "",
      callback_url: "https://glassesshopexpressapp-userside.onrender.com/user/callback",
  };

  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log('ZaloPay response:', result.data);

      res.status(200).json(result.data); // Return payment details to the frontend
  } catch (err) {
      console.error('Payment initiation error:', err.message);
      res.status(500).json({ message: 'Payment initiation failed' });
  }
};

const handleCallback = (req, res) => {
  let result = {};
  console.log(req.body);

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log('mac =', mac);

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = 'mac not equal';
    } else {
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id']);

      result.return_code = 1;
      result.return_message = 'success';
    }
  } catch (ex) {
    console.log('Error:', ex.message);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  res.json(result);
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
  updatePassword,
  initiatePayment,
  handleCallback
};