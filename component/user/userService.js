const bcrypt = require('bcryptjs'); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const user = require('../../models/userModel'); // Path to your user.js file
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
    // Check if email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      throw new Error(`Duplicate email: ${email} is already in use.`);
    }

    // Create a new user object
    const newUser = new user({
      username,
      email,
      password: hashedPassword,
      googleId: options.googleId || null,
      role: options.role || 'user',
      permission: options.permission || null,
      status: options.status || 'active',
      cart: options.cart || {},
      avatar: options.avatar || null,
    });

    // Save the user to the database
    await newUser.save();

    console.log('User saved successfully:', newUser);
    return newUser; // Return the saved user object
  } catch (error) {
    console.error('Error saving user:', error.message);
    throw error; // Propagate the error for handling elsewhere
  }
}

async function findUserByEmail(email) {
    try {
        //console.log('Searching for email:', email);
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
async function updateProfile(userId, username) {
    try {
      // Validate username
      const fullNamePattern = /^[A-Z][a-z]+( [A-Z][a-z]+)+$/;
      if (!fullNamePattern.test(username)) {
        throw new Error('Invalid username format.');
      }
  
      const updateData = { username };
      await user.findByIdAndUpdate(userId, updateData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
async function updatePasswordsv(userId, oldPassword, newPassword) {
    try {
      // Fetch the user from the database
      const User = await user.findById(userId);
  
      if (!User) {
        throw new Error('User not found.');
      }
  
      // Check if the old password is correct
      const isMatch = await bcrypt.compare(oldPassword, User.password);
      if (!isMatch) {
        throw new Error('Incorrect old password.');
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      await user.findByIdAndUpdate(userId, { password: hashedPassword });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }


module.exports = { saveUser, findUserByEmail,findUserByUsername,updateProfile,updatePasswordsv };