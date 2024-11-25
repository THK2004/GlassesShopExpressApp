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

        const sameProductsBrand = products.filter(p => p.brand === product.brand && p.id !== product.id);
        const randomProduct = getRandomProducts(products, [product.id, ...sameProductsBrand.map(p => p.id)], 4);

        res.render('products/product', { glasses: true, product, sameProductsBrand, randomProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

function getRandomProducts(allProducts, excludedIds, count) {
    const filteredProducts = allProducts.filter(p => !excludedIds.includes(p.id));
    return shuffleArray(filteredProducts).slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {
    getGlasses,
    getProductDetail
}