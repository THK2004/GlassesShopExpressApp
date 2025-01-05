const productsService = require('./productService');

const getGlasses = async (req, res) => {
    try {
        const { page = 1, limit = 4, brand, material, price, sex, search } = req.query;

        // Build filters from query parameters
        const filters = {
            brand,
            material,
            priceRange: price,
            sex,
            search,
        };

        // Fetch products for the requested page and filters
        const { products, totalProducts } = await productsService.getPaginatedAndFilterProducts(
            parseInt(page),
            parseInt(limit),
            filters
        );

        const totalPages = Math.ceil(totalProducts / limit);

        // Render the page with the initial product data
        res.render('glasses/glasses', {
            glasses: true,
            products,
            currentPage: parseInt(page),
            totalPages,
            filters, // Pass filters to retain filter state in the form
        });
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
        const excludedIds = [productId, ...sameProductsBrand.map(p => p.productId)];
        const randomProduct = await productsService.getRandomProducts(excludedIds, 4);

        res.render('products/product', { glasses: true, product, sameProductsBrand, randomProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
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


const getPaginatedProductReviews =async (req, res) =>{
    const productId = req.params.productId;
    const {page = 1, limit = 3} = req.query;
    try {
        const {reviews, totalReviews} = await productsService.getProductReviews(page,limit,productId);
        console.log('reviews:', reviews);
        res.json({
            reviews,
            totalReviews,
        });
    }catch(error){
        console.error('Error fetching product reviews:', error);
        res.status(500).json({messgae: 'Internal Server Error'});
    }
}

const sendReviews = async (req, res) => {
    const { productId, userId, content } = req.body;
    console.log('Received review data:', { productId, userId, content });
    try {
        const review = await productsService.sendReviewData(productId, userId, content);
        res.status(201).json({ message: "Comment submitted successfully!", review });
    } catch (error) {
        console.error('Error saving review data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const sendOrders = async (req, res) => {
    const { userId, receiver, address, phone,cart,status,totalPrice} = req.body;
    console.log('Received order data:', { userId, receiver, address, phone,cart,status,totalPrice });
    try {
        const order = await productsService.sendOrderData(userId, receiver, address, phone, cart, status, totalPrice);
        res.status(201).json({ message: "Order submitted successfully!", order });
    }catch (error){
        console.error('Error saving order data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const update= async (req,res)=>{
    const {productId, newSales, newStock} = req.body;
    console.log('Received stock update:', {productId, newSales, newStock});
    try{
        const updatedProduct = await productsService.updateStockSales(productId, newSales, newStock);
        res.status(200).json({message: 'Stock updated successfully!', updatedProduct});
    }catch(error){
        console.error('Error updating stock:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = {
    getGlasses,
    getProductDetail,
    getPaginatedAndFilteredProduct,
    getPaginatedProductReviews,
    sendReviews,
    sendOrders,
    update
};