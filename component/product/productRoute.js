const express = require('express');
const { getGlasses, getProductDetail, getPaginatedAndFilteredProduct, getPaginatedProductReviews, sendReviews, sendOrders, update } = require("./productController");
const router = express.Router();

/* Route for API call */
router.get('/api/products', getPaginatedAndFilteredProduct);

/* GET glasses (product list) page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

// GET product reviews
router.get('/api/reviews/:productId', getPaginatedProductReviews);

// POST comment
router.post('/api/comments', sendReviews);

router.post('/api/orders', sendOrders);

router.patch('/api/stockUpdate', update);

module.exports = router;