const productsModel = require('../models/product');

const getGlasses = async (req, res) => {
    try {
      const products = await productsModel.run();
      res.render('glasses/glasses', { glasses: true, products });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
};
  
  const getProductDetail = async (req, res) => {
    try {
      const products = await productsModel.run();
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