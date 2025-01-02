var express = require('express');
var { getHome, getAbout, getContact, getShop } = require("./homeController");
var router = express.Router();

/* GET home page. */
router.get('/', getHome);

/* GET home page. */
router.get('/home', getHome);

/* GET about page. */
router.get('/home/about', getAbout);

/* GET contact page. */
router.get('/home/contact', getContact);

/* GET shop page. */
router.get('/home/shop', getShop);

module.exports = router;
