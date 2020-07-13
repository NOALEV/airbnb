const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    // with auth
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }

})

const Apartment = mongoose.model('Apartment', ApartmentSchema);

module.exports = { Apartment }