const mongoose = require('mongoose');
const schema = mongoose.Schema;

const order = new schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    productId: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    }
});