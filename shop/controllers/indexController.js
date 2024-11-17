const getIndex = (req, res) => {
    res.render('index', {index: true});
}

module.exports = {
    getIndex
}