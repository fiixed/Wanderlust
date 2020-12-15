const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    userId: String
});

module.exports = new mongoose.model('Post', postSchema);