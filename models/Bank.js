const mongoose = require('mongoose')

const BankSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const Bank = mongoose.model('Bank', BankSchema)
module.exports = Bank