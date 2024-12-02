const bcrypt = require('bcryptjs'); // For password hashing
const userService = require('./userService');
const passport = require('passport');
// Render the registration page
const getRegister = (req, res) => {
  res.render('register/register', { register: true });
};

// Handle registration form submission
const postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log("this email",req.body);
    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    await userService.saveUser(username, email, hashedPassword);

    // Redirect or respond with success
    res.status(201).redirect('/user/login'); // Adjust the route as needed
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Handle duplicate username or email
      res.status(400).send({ message: 'Username or email already exists' });
    } else {
      res.status(500).send({ message: 'An error occurred' });
    }
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

// const getCart = (req, res) => {
//   res.render('cart/cart', {cart: true});
// }
const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err); // Forward the error
    }

    if (!user) {
      // Authentication failed
      return res.status(400).json({ success: false, message: info.message });
    }

    // Establish session for the user
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return next(err);
      }

      // Login successful, respond with success
      return res.status(200).json({ success: true, message: 'Login successful!', user });
    });
  })(req, res, next); // Invoke the Passport middleware
};


module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getCart
};