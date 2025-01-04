var express = require('express');
var { getGlasses, getProductDetail, getPaginatedAndFilteredProduct, getPaginatedProductReviews } = require("./productController");
var router = express.Router();

/* Route for API call */
router.get('/api/products', getPaginatedAndFilteredProduct);

/* GET glasses (product list) page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

//GET product reviews
router.get('/api/reviews/:productId', getPaginatedProductReviews);

router.post('/api/comments', (req, res) => {
    const { productId, userId, content } = req.body;

    // Here, you would typically insert the comment into your database.
    console.log('Received review data:', { productId, userId, content });

    // Sending a response back to the client
    res.status(201).json({
        message: 'Comment submitted successfully',
        comment: { productId, userId, content }
    });
});

module.exports = router;