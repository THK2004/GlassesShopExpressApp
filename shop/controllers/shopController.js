const getShop = (req, res) => {
    res.render('shop/shop', {shop: true});
}

module.exports = {
    getShop
}