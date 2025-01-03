const passport = require('passport'); 
var express = require('express');

var { getRegister, postRegister, getLogin, postLogin, getCart, getlogout, checkAvailability } = require("./userController");
const { ensureAuthenticated } = require('../../middleware/auth');

var router = express.Router();

/* GET login page. */
router.get('/', getLogin); // userxc
router.get('/login', getLogin);

/* GET register page. */
router.get('/register', getRegister);

// POST form submission
router.post('/register', postRegister);

router.post('/login', postLogin);

// GET cart page
router.get('/cart', ensureAuthenticated, getCart);

router.get('/logout', getlogout);

router.post('/check-availability', checkAvailability);

// Route to initiate Google authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google to redirect to
router.get(
    '/auth/google/callback',
    (req, res, next) => {
      console.log('Google callback route hit!');
      next();
    },
    passport.authenticate('google', { failureRedirect: '/user/login' }),
    (req, res) => {
      console.log('Authentication successful');
      res.redirect('/home/about');
    }
  );

module.exports = router;