var express = require('express');
var { getRegister,postRegister  } = require("../controllers/registerController");
var router = express.Router();

/* GET register page. */
router.get('/', getRegister);
// POST form submission
router.post('/', postRegister);

module.exports = router;