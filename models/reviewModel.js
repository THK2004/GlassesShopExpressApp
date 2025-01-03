// module.exports = {
//     createReviewDocument(reviewData){
//         return{
//             rid: reviewData.id,
//             uid: reviewData.userid,
//             pid: reviewData.productid,
//             rating: reviewData.rating,
//             content: reviewData.content,
//         };
//     },
// };
const mongoose = require('mongoose');
const { applyTimestamps } = require('./usersModel');
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