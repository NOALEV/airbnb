const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment }