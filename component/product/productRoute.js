var express = require('express');
var { getGlasses, getProductDetail, getPaginatedAndFilteredProduct } = require("./productController");
var router = express.Router();

/* GET glasses (product list) page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

/* Route for API call */
router.get('/api/products', getPaginatedAndFilteredProduct);

module.exports = router;