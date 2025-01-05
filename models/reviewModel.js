const mongoose = require('mongoose');
mongoose.pluralize(null);

const reviewModel = new mongoose.Schema({

    'userid':{
        type: String,
        required: true,
    },
    'productid':{
        type: String,
        required: true,
    },
    'ratings':{
        type: Number,
        required: true,
    },
    'content':{
        type: String,
        required: true,
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('reviews', reviewModel, 'reviews');