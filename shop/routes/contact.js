var express = require('express');
var { getContact } = require("../controllers/contactController");
var router = express.Router();

/* GET contact page. */
router.get('/', getContact);

module.exports = router;
