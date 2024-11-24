const getHome = (req, res) => {
    res.render('index', {index: true});
}

const getAbout = (req, res) => {
    res.render('about/about', {about: true});
}

const getContact = (req, res) => {
    res.render('contact/contact', {contact: true});
}

const getShop = (req, res) => {
    res.render('shop/shop', {shop: true});
}

module.exports = {
    getHome,
    getAbout,
    getContact,
    getShop
}