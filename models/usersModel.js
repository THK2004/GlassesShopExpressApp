const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.pluralize(null);

const usersModel = new mongoose.Schema({
    'username': {
        type: String,
        required: true,
    },

    'email': {
        type: String,
        required: true,
        unique: true,
    },
    'password': {
        type: String,
        required: function(){
            return !this.googleId;
        
        },
    },
    'googleId': {
        type: String,
    },
    'role':{
        type: String,
        required: false,
        enum: ['admin', 'user'],
    },
    'permission':{
        type: String,
        required: false,
        enum: ['accounts','orders','products'],
    },
    'status':{
        type: String,
        required: false,
        enum: ['banned','active'],
    },
    'cart':{
        type: Object,
        required: false,
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('users', usersModel, 'users');
