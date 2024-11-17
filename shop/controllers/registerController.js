const getRegister = (req, res) => {
    res.render('register/register', {register: true});
}

module.exports = {
    getRegister
}