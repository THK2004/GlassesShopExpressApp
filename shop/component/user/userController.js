const passport = require('passport'); 
const bcrypt = require('bcryptjs'); // For password hashing
const userService = require('./userService');
// Render the registration page
const getRegister = (req, res) => {
  res.render('register/register', { register: true });
};

// Handle registration form submission
const postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if the email already exists
    const user = await userService.findUserByEmail(email);
    if (user) {
      return res.status(400).render('register/register', {
        register: true,
        errorMessage: 'Email already exists.'
      });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).render('register/register', {
        register: true,
        errorMessage: 'Passwords do not match.'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    await userService.saveUser(username, email, hashedPassword);

    // Redirect to home page or login page
    res.redirect('/user/login'); // Adjust the route as needed
  } catch (error) {
    console.error(error);
    // Handle any unexpected errors
    res.status(500).render('register/register', {
      errorMessage: 'An error occurred during registration. Please try again.'
    });
  }
};

const getLogin = (req, res) => {
  res.render('login/login', {login: true});
}

// Handle login form submission
// const postLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("this email", email);

//     // Find the user by email
//     const user = await userService.findUserByEmail(email);

//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     // Compare the password with the hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     // Save user details in the session
//     req.session.user = { id: user._id, email: user.email }; // This line should work now

//     // Respond with success
//     res.status(200).json({ success: true, message: 'Login successful!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Render login page with error message
      return res.status(500).render('login/login', { 
        errorMessage: 'An error occurred' 
      });
    }
    if (!user) {
      // Render login page with invalid credentials message
      return res.status(400).render('login/login', { 
        errorMessage: info.message 
      });
    }
    req.login(user, (err) => {
      if (err) {
        // Render login page with login failed message
        return res.status(500).render('login/login', { 
          errorMessage: 'Login failed' 
        });
      }
      // Redirect to dashboard or homepage after successful login
      return res.redirect('/home/about');
    });
  })(req, res, next);
};

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

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getlogout
};