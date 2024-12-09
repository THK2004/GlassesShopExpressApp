const productsService = require('./productService');

const getGlasses = async (req, res) => {
    try {
        const { products, totalProducts } = await productsService.getPaginatedAndFilterProducts(1, 4, {});
        // Render view to display
        res.render('glasses/glasses', { glasses: true, products });
    } catch (error) {
        console.error('Error rendering products:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productsService.getProductById(productId);
        const sameProductsBrand = await productsService.getSameBranchProduct(product.brand, productId);
        const excludedIds = [productId, ...sameProductsBrand.map(p => p.id)];
        const randomProduct = await productsService.getRandomProducts(excludedIds, 4);

        res.render('products/product', { glasses: true, product, sameProductsBrand, randomProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

const getPaginatedAndFilteredProduct = async (req, res) => {
    const { page = 1, limit = 4, brand, material, price, sex, search } = req.query;

    // Build filters from query parameters
    const filters = {brand, material, priceRange: price, sex, search};

    try {
        const { products, totalProducts } = await productsService.getPaginatedAndFilterProducts(parseInt(page), parseInt(limit), filters);

        res.json({
            products,
            totalProducts,
        });
    } catch (error) {
        console.error('Error fetching paginated products:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getGlasses,
    getProductDetail,
    getPaginatedAndFilteredProduct
}