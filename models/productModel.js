// module.exports = {
//   createProductDocument(productData) {
//     return {
//       id: productData._id,
//       name: productData.name || 'Unknown Product',
//       description: productData.description || 'No description available',
//       price: productData.price ? productData.price.toString() : '0',
//       brand: productData.brand || 'Unknown Brand',
//       material: productData.material || 'Unknown Material',
//       image: productData.image || 'images/default.png',
//       sex: productData.sex || 'Unknown',
//       stock: productData.stock,
//       sales: productData.sales,
//       rating: productData.rating,
//       status: productData.status, 
//     };
//   },
// };

const mongoose = require('mongoose');
mongoose.pluralize(null);

const productModel = new mongoose.Schema({
  'productid': {
    type: String,
    required: true,
    unique: true,
  },
  'name': {
    type: String,
    required: true,
  },
  'description': {
    type: String,
    required: false,
  },
  'price': {
    type: Number,
    required: true,
  },
  'brand': {
    type: String,
    required: true,
  },
  'material': {
    type: String,
    required: true,
  },
  'sex': {
    type: String,
    enum: ['Men', 'women', 'Unisex'],
    required: true,
  },
  'stock': {
    type: Number,
    required: true,
  },
  'sales': {
    type: Number,
    required: true,
  },
  'status': {
    type: String,
    required: true,
    enum: ['Available', 'Unavailable'],
  }
},
{
  timestamps: true,
}
);
module.exports = mongoose.model('products', productModel, 'products');
