const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    id: {
        type: Number,     
    },
    listing_url: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    summary: {
        type: String,
        required: false,
    },
    picture_url: {
        type: String,
        required: false,
    },
    property_type: {
        type: String,
        required: false,
    },
    bedrooms: {
        type: String,
        required: false,
    },
    beds: {
        type: Number,
        required: false,
    },
    weekly_price: {
        type: String,
        required: false,
    },
    monthly_price: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: false,
    },
})

const AirbnbProperty = mongoose.model('AirbnbProperty', PropertySchema, 'airbnbProperty');

module.exports = { AirbnbProperty };