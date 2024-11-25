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

async function saveUser(username, email, hashedPassword) {
    try {
        const newUser = await user.create({
            username, 
            email, 
            password: hashedPassword
        });
        newUser.save();
    } catch (error) {
      console.error('Error saving user:', error);
    }
}


async function findUserByEmail(email) {
    try {
        console.log('Searching for email:', email);
        const database = client.db("test");
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

module.exports = { saveUser, findUserByEmail, };