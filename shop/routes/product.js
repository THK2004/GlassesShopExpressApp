var express = require('express');
var router = express.Router();
var products = require('../models/product');

/* GET product page. */
router.get('/', function(req, res, next) {
  res.render('products/product', {shop: true, products});
});

module.exports = router;
