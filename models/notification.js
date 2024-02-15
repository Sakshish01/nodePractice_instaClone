const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow']
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: unread
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);