var express = require('express');
var { getRegister, postRegister, getLogin  } = require("./userController");
var router = express.Router();

/* GET login page. */
router.get('/', getLogin);
router.get('/login', getLogin);

/* GET register page. */
router.get('/register', getRegister);

// POST form submission
router.post('/register', postRegister);

module.exports = router;