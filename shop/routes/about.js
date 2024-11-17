var express = require('express');
var { getAbout } = require("../controllers/aboutController");
var router = express.Router();

/* GET about page. */
router.get('/', getAbout);

module.exports = router;