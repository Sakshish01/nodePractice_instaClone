const mongoose = require("mongoose");

const highlightSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    storyIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }],
    coverImage: {
        type: String,
        default: null
    },
    name: {
        type: String
    }

});

module.exports = mongoose.model('StoryHighlights', highlightSchema);