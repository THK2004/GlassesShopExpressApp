module.exports = {
    createReviewDocument(reviewData){
        return{
            id: reviewData.id,
            content: reviewData.content,
            userid: reviewData.userid,
            product: reviewData.productid,
            rating: reviewData.rating,
        }
    }
}