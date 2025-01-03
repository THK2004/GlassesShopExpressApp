const { MongoClient, ServerApiVersion } = require('mongodb');
const user = require('../../models/userModel'); // Path to your user.js file
const users = require('../../models/usersModel'); // Path to your user.js file
require('dotenv').config({ path: 'dbconfig.env' })
const dbconfig = {
  url: process.env.DB_URL || ""
}

// MongoDB connection URI
const uri = dbconfig.url;

// Create a MongoClient with options for the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function saveUser(username, email, hashedPassword, options = {}) {
  try {
    // Create a new user object
    const newUser = new user({
      username,
      email,
      password: hashedPassword, // Will be null for Google users
      googleId: options.googleId || null, // Optional: Google ID for Google users
      role: options.role || 'user', // Default to 'user' if not provided
      permission: options.permission || null, // Optional: Permission level
      status: options.status || 'active', // Default to 'active' if not provided
      cart: options.cart || {}, // Default to an empty object if not provided
    });

    // Save the user to the database
    await newUser.save();

    console.log('User saved successfully:', newUser);
    return newUser; // Return the saved user object
  } catch (error) {
    console.error('Error saving user:', error);

    // If it's a validation error, log details
    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        console.error(`Validation error in ${field}:`, error.errors[field].message);
      }
    }
    throw error; // Propagate the error for handling elsewhere
  }
}

async function findUserByEmail(email) {
    try {
        console.log('Searching for email:', email);
        const database = client.db("shop");
        const users = database.collection("users");
        const foundUser = await users.findOne({ email }); // Search for a user by email
        if (foundUser) {
            console.log('User found:', foundUser);
          } else {
            console.log('No user found with the email:',email);
          }
        return foundUser; // Return the found user document or null if not found
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error; // Propagate the error for handling in the controller
    }
  }
  async function findUserByUsername(username) {
    try {
      const database = client.db("shop");
      const users = database.collection("users");
      const foundUser = await users.findOne({ username });
      return foundUser; // Return the user document or null
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }
module.exports = { saveUser, findUserByEmail,findUserByUsername };