var express = require('express');
var { getHome, getAbout, getContact, getShop } = require("./homeController");
var router = express.Router();
const { ensureAuthenticated } = require('../../middleware/auth');
/* GET home page. */
router.get('/', getHome);

// router.get('/home',ensureAuthenticated, getHome);
router.get('/home',ensureAuthenticated, getHome);
/* GET about page. */
router.get('/home/about', getAbout);

/* GET contact page. */
router.get('/home/contact', getContact);

/* GET shop page. */
router.get('/home/shop', getShop);

module.exports = router;
