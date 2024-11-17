const getContact = (req, res) => {
    res.render('contact/contact', {contact: true});
}

module.exports = {
    getContact
}