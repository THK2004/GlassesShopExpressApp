var express = require('express');

var { getRegister, postRegister, getLogin, postLogin, getCart,getlogout  } = require("./userController");

// var { getRegister, postRegister, getLogin,postLogin,getlogout  } = require("./userController");
var router = express.Router();

/* GET login page. */
router.get('/', getLogin); // /user
router.get('/login', getLogin);

/* GET register page. */
router.get('/register', getRegister);

// POST form submission
router.post('/register', postRegister);

router.post('/login', postLogin);


// GET cart page
router.get('/cart', getCart);

router.get('/logout', getlogout);
module.exports = router;