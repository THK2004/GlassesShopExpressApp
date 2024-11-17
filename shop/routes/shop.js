var express = require('express');
var { getShop } = require("../controllers/shopController");
var router = express.Router();

/* GET shop page. */
router.get('/', getShop);

module.exports = router;
