const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
postSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 