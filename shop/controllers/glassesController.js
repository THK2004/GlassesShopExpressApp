var products = require('../models/product');

const getGlasses = (req, res) => {
    res.render('glasses/glasses', {glasses: true, products});
}

const getProductDetail = (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    res.render('products/product', {glasses: true, product});
}

module.exports = {
    getGlasses,
    getProductDetail
}
