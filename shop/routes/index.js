var express = require('express');
var { getIndex } = require("../controllers/indexController");
var router = express.Router();

/* GET home page. */
router.get('/', getIndex);

module.exports = router;
