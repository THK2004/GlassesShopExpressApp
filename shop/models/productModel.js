module.exports = {
  createProductDocument(productData) {
    return {
      id: productData._id,
      name: productData.name || 'Unknown Product',
      description: productData.description || 'No description available',
      price: productData.price ? productData.price.toString() : '0',
      brand: productData.brand || 'Unknown Brand',
      material: productData.material || 'Unknown Material',
      image: productData.image || 'images/default.png',
      sex: productData.sex || 'Unknown',
      status: productData.status,
      stock: productData.stock,
      date: productData.createDate,
      sales: productData.sales,
    };
  },
};

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the product schema
// const productSchema = new Schema(
//   {
//     name: {
//       type: String,
//       default: 'Unknown Product', // Default value if not provided
//     },
//     description: {
//       type: String,
//       default: 'No description available', // Default value if not provided
//     },
//     price: {
//       type: Number,
//       default: 0, // Default value if not provided
//     },
//     brand: {
//       type: String,
//       default: 'Unknown Brand', // Default value if not provided
//     },
//     material: {
//       type: String,
//       default: 'Unknown Material', // Default value if not provided
//     },
//     image: {
//       type: String,
//       default: 'images/default.png', // Default value if not provided
//     },
//     sex: {
//       type: String,
//       default: 'Unknown', // Default value if not provided
//     },
//     status: {
//       type: String,
//       required: true, // This field is required
//     },
//     stock: {
//       type: Number,
//       required: true, // This field is required
//     },
//     createDate: {
//       type: Date,
//       default: Date.now, // Default to current date if not provided
//     },
//     sales: {
//       type: Number,
//       default: 0, // Default value if not provided
//     },
//   },
//   {
//     timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
//   }
// );

// // Export the product model
// module.exports = mongoose.model('Product', productSchema);
