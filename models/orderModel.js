const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.pluralize(null);

const order = new schema({
    'userid': {
     type: String,
     required: true,
    },
    'address': {
     type: String,
     required: true,
    },
    'status': {
     type: String,
     required: true,
     enum: ['pending', 'shipped', 'delivered'],
    },
    'products': {
     type: Object,
     required: true,
    },
});