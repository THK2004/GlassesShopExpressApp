const getLogin = (req, res) => {
    res.render('login/login', {login: true});
}

module.exports = {
    getLogin
}