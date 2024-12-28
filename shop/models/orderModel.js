const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productId: {
        type: Schema.Types.Mixed, // Allows any data type for productId
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // ensures at least one item
    },
    price: {
        type: Number,
        required: true,
    }
}, { _id: false }); // _id is not required for the product subdocument

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        products: [productSchema], // Array of products
        status: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
