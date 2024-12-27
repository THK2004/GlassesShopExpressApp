module.exports = {
    createReviewDocument(reviewData){
        return{
            id: reviewData._id,
            content: reviewData.content,
            userid: reviewData.userid,
            product: reviewData.productid,
            rating: reviewData.rating,
        }
    }
}