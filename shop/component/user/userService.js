const user = require('../../models/userModel'); // Path to your user.js file

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

module.exports = { saveUser };