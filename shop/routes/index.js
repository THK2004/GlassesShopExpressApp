//Main router

const express = require('express')
const router = express.Router()

// var homeRouter = require('../component/home/homeRoute');
// var userRouter = require('../component/user/userRoute');
// var productRouter = require('../component/product/productRoute');

router.use('/user', require('./user'));

router.use('/glasses', require('./product'));
router.use('/', require('./home'));
module.exports = router;