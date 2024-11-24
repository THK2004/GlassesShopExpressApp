const productsModel = require('../../models/productModel');
const productsService = require('./productService');

const getGlasses = async (req, res) => {
    try {
        const products = await productsService.getProduct();
        res.render('glasses/glasses', { glasses: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};
  
const getProductDetail = async (req, res) => {
    try {
        const products = await productsService.getProduct();
        const product = products.find(p => p.id === req.params.id);
        res.render('products/product', { glasses: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

module.exports = {
    getGlasses,
    getProductDetail
}