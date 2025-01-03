const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.pluralize(null);

const usersModel = new mongoose.Schema({
    'username': {
        type: String,
        required: true,
    },
    'userid':{
        type: String,
        required: true,
        unique,
    },
    'email': {
        type: String,
        required: true,
        unique,
    },
    'password': {
        type: String,
        required: true,
    },
    'role':{
        type: String,
        required: false,
        enum: ['admin', 'user'],
    },
    'permission':{
        type: String,
        required: true,
        enum: ['accounts','orders','products'],
    },
    'status':{
        type: String,
        required: true,
        enum: ['banned','active'],
    },
    'cart':{
        type: Object,
        required: false,
    }
})

module.exports = mongoose.model('users', usersModel, 'users');