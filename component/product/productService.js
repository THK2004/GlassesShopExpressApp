const Product = require('../../models/productModel');
const Review = require('../../models/reviewModel');
const Order = require('../../models/orderModel');

async function getProductById(productId) {
  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      console.warn(`Product with id ${productId} not found`);
      return null;
    }
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

async function getSameBranchProduct(brand, excludeProductId) {
  try {
    const products = await Product.find({ 
      brand, 
      productId: { $ne: excludeProductId } 
    });
    return products;
  } catch (error) {
    console.error("Error fetching same brand products:", error);
    return [];
  }
}

async function getRandomProducts(excludedIds, count) {
  try {
    const products = await Product.aggregate([
      { $match: { productId: { $nin: excludedIds } } },
      { $sample: { size: count } }
    ]);
    return products;
  } catch (error) {
    console.error("Error fetching random products:", error);
    return [];
  }
}

async function getPaginatedAndFilterProducts(page = 1, limit = 4, filters = {}) {
  try {
    const filterCriteria = {};

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      filterCriteria.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
    }

    if (filters.brand) filterCriteria.brand = filters.brand;
    if (filters.material) filterCriteria.material = filters.material;
    if (filters.sex) filterCriteria.sex = filters.sex;

    if (filters.priceRange) {
      if (filters.priceRange === 'under500') {
        filterCriteria.price = { $lt: 500 };
      } else if (filters.priceRange === 'over500') {
        filterCriteria.price = { $gte: 500 };
      }
    }

    const skip = (page - 1) * limit;
    
    const products = await Product.find(filterCriteria)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filterCriteria);

    return { products, totalProducts };
  } catch (error) {
    console.error("Error fetching paginated and filtered products:", error);
    return { products: [], totalProducts: 0 };
  }
}

async function getProductReviews(page =1, limit = 3, productId){
  console.log('productId:', productId);
  try{
    
    const skip = (page-1)*limit;
    const reviews = await Review.find({ productid: String(productId) }).skip(skip).limit(limit);
    const totalReviews = await Review.countDocuments({productid: String(productId)});
    return {reviews,totalReviews};
    
  }catch(error){
    console.error("error fetching product reviews:", error);
    return {reviews:[], totalReviews:0};

  }
}

async function sendReviewData(productId, userId, content) {
  try {
    const review = new Review ({
      productid: productId,
      userid: userId,
      content: content
    });
    await review.save();
    return review;
  }catch(error){
    console.error("Error saving review data to db:", error);
    throw error;
  }
}


async function sendOrderData (userId,receiver,address,phone,cart,status,totalPrice){
  try{
    const order = new Order({
      userid: userId,
      receiver: receiver,
      address: address,
      phone: phone,
      products: cart,
      status: status,
      totalPrice: totalPrice,
    }); 
    await order.save();
    return order;
  }catch(error){
    console.error("Error saving order data to db:", error);
    throw error;
  };
}


async function updateMultipleStockSales(products) {
  try {
      const updateResults = [];
      for (const product of products) {
          const { productId, newSales, newStock } = product;
          const updated = await Product.updateOne(
              { productId },
              { sales: newSales, stock: newStock }
          );
          updateResults.push({ productId, updated });
      }
      return updateResults;
  } catch (error) {
      console.error("Error updating multiple stocks and sales:", error);
      throw error;
  }
}


module.exports = {
  getProductById,
  getSameBranchProduct,
  getRandomProducts,
  getPaginatedAndFilterProducts,
  getProductReviews,
  sendReviewData,
  sendOrderData,
  updateMultipleStockSales
};