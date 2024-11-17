var express = require('express');
var { getRegister } = require("../controllers/registerController");
var router = express.Router();

/* GET register page. */
router.get('/', getRegister);

module.exports = router;