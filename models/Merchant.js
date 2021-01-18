const mongoose = require('mongoose')

const MerchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    inventory: {
        type: Number,
        required: false
    },
    isPublic: {
        type: Boolean,
        required: true
    }
})

const Merchant = mongoose.model('Merchant', MerchantSchema)
module.exports = Merchant