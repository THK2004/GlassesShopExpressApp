const productsModel = require('../../models/productModel');
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
        res.render('products/product', { glasses: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

module.exports = {
    getGlasses,
    getProductDetail
}