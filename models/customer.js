const mongoose = require('mongoose')


const customerSchema = new mongoose.Schema({
    name: String,
    age: Number,
})


const customer = mongoose.model('customer', customerSchema)

module.exports = customer