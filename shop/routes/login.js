var express = require('express');
var { getLogin } = require("../controllers/loginController");
var router = express.Router();

/* GET login page. */
router.get('/', getLogin);

module.exports = router;
