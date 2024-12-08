const productsService = require('./productService');

const getGlasses = async (req, res) => {
    try {
        // Get the filter parameters from the query string
        const { brand, material, price, sex, search } = req.query;

        // Build filterParams object to pass to the service
        const filterParams = {
            brand: brand || null,
            material: material || null,
            priceRange: price || null,
            sex: sex || null,
            search: search||null,
        };

        const areAllParamsNull = Object.values(filterParams).every(value => value === null);

        // Get the filtered products from the service

        const products = areAllParamsNull
            ? await productsService.getProduct() // No filters
            : await productsService.filterProducts(filterParams); // With filters

        // Pass the products back to the view to display
        res.render('glasses/glasses', { glasses: true, products});
    } catch (error) {
        console.error('Error fetching filtered products:', error);
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

const getPaginatedProduct = async (req, res) =>{
    try {
        const { page = 1, limit = 4 } = req.query;
    
        // Fetch the paginated products
        const { products, totalProducts } = await productsService.getPaginatedProducts(parseInt(page), parseInt(limit));

        res.json({ glasses: true, products, totalProducts });
    } catch (error) {
        console.error('Error fetching paginated products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getGlasses,
    getProductDetail,
    getPaginatedProduct
}