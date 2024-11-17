const getAbout = (req, res) => {
    res.render('about/about', {about: true});
}

module.exports = {
    getAbout
}