const passport = require('passport'); 
// const path = require('path');
// var express = require('express');
// const imgur = require('imgur');
// const fs = require('fs');
// const fileUpload = require('express-fileupload')
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

    // Check if the email format is correct
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).render('register/register', {
        register: true,
        errorMessage: 'Please enter a valid email address.'
      });
    }
    // Check if the email already exists
    const user = await User.findOne({ email: email });
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
    const { username,avatar } = req.body;
    console.log('Updating profile:', req.body);
    console.log(req.files)
    const update = { username: username };


    await User.findByIdAndUpdate(req.user._id, update);
    res.redirect('/user/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the profile.');
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // Fetch the user from the database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send('User not found.');
    }
    if (!user.password) {
      return res.status(400).render('profile/profile', {
        user,
        errorMessage: 'You cannot update your password as you signed up with Google. Please contact support.',
      });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).render('profile/profile', {
        user,
        errorMessage: 'Incorrect old password.',
      });
    }
    

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Redirect with a success message
    res.render('profile/profile', {
      user,
      successMessage: 'Password updated successfully!',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('An error occurred while updating the password.');
  }
};

// Ensure the uploads directory exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const updateProfile = async (req, res) => {
//   try {
//     const { username } = req.body;
//     console.log('Updating profile:', req.body);

//     const update = { username };

//     if (req.files && req.files.avatar) {
//       const avatarFile = req.files.avatar;
//       const uploadPath = path.join(uploadDir, avatarFile.name);

//       // // Move the file to the upload directory
//       // await new Promise((resolve, reject) => {
//       //   avatarFile.mv(uploadPath, (err) => {
//       //     if (err) return reject(err);
//       //     resolve();
//       //   });
//       // });
      

//       // Upload the file to Imgur
//       try {
//         const response = await imgur.uploadFile(uploadPath);
//         update.avatar = response.link; // Store the Imgur URL in the update object
//         fs.unlinkSync(uploadPath); // Delete the local file after upload
//       } catch (error) {
//         console.error('Error uploading to Imgur:', error);
//         fs.unlinkSync(uploadPath); // Ensure the temporary file is deleted
//         return res.status(500).send('An error occurred while uploading the avatar.');
//       }
//     }

//     // Update the user profile in the database
//     await User.findByIdAndUpdate(req.user._id, update);
//     res.redirect('/user/profile');
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).send('An error occurred while updating the profile.');
//   }
// };
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