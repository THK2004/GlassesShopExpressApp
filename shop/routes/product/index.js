//product router

var express = require('express');
var { getGlasses, getProductDetail } = require("../../component/product/productController");
var router = express.Router();

/* GET glasses (product list) page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

module.exports = router;