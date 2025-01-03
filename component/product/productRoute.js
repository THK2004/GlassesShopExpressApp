var express = require('express');
var { getGlasses, getProductDetail, getPaginatedAndFilteredProduct } = require("./productController");
var router = express.Router();

/* Route for API call */
router.get('/api/products', getPaginatedAndFilteredProduct);

/* GET glasses (product list) page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

module.exports = router;