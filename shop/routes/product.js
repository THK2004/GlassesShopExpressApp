var express = require('express');
var { getGlasses, getProductDetail } = require("../controllers/productController");
var router = express.Router();

/* GET glasses (product list) page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

module.exports = router;