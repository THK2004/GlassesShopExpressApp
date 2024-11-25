var express = require('express');
var { getRegister, postRegister, getLogin,postLogin  } = require("./userController");
var router = express.Router();

/* GET login page. */
router.get('/', getLogin);
router.get('/login', getLogin);

/* GET register page. */
router.get('/register', getRegister);

// POST form submission
router.post('/register', postRegister);

router.post('/login', postLogin);
module.exports = router;