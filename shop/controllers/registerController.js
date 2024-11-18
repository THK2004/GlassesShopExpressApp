// const getRegister = (req, res) => {
//     res.render('register/register', {register: true});
// }

// module.exports = {
//     getRegister
// }

const bcrypt = require('bcryptjs'); // For password hashing
const Customer = require('../models/Customer'); // Path to your Customer.js file

// Render the registration page
const getRegister = (req, res) => {
  res.render('register/register', { register: true });
};

// Handle registration form submission
const postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({
      username,
      email,
      password: hashedPassword,
    });

    // Save the customer to the database
    await newCustomer.save();

    // Redirect or respond with success
    res.status(201).redirect('/login'); // Adjust the route as needed
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

module.exports = {
  getRegister,
  postRegister,
};