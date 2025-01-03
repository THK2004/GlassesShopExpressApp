const mongoose = require('mongoose');
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
        default: 'user',
    },
    'permission':{
        type: [String],
        required: false,
       
    },
    'status':{
        type: String,
        required: false,
        enum: ['banned','active'],
        default: 'active',
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
