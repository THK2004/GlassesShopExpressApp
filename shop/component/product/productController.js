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
            searchQuery: search || ''  // Add search query if exists
        };

        // Log the filter parameters to see what is being passed
        console.log('Filter Params:', filterParams);

        // Get the filtered products from the service
        const products = await productsService.filterProducts(filterParams);

        // Log the filtered products
        console.log('Filtered Products:', products);

        // Pass both the filtered products and the filterParams back to the view
        res.render('glasses/glasses', { glasses: true, products, filterParams });
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        res.status(500).send('Internal Server Error');
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