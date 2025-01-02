module.exports = {
    createReviewDocument(reviewData){
        return{
            rid: reviewData.id,
            uid: reviewData.userid,
            pid: reviewData.productid,
            rating: reviewData.rating,
            content: reviewData.content,
        };
    },
};