const mongoose = require('mongoose')

const CustomerCartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const CustomerCart = mongoose.model('CustomerCart', CustomerCartSchema)
module.exports = CustomerCart