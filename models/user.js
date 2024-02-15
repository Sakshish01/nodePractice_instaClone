const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : {
        type: String,
        unique: true
    },
    email : { type: String, unique: true},
    name:  String,
    password:  String,
    profileImage: {
        type: String
      },
    bio: { type: String, default: null},
    followRequests: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    followers : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    following : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    posts : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'
    }],
    RefreshToken: String,
    closeFriends: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],

    is_public : {
        type: Number,
        default: 1, //public account
        enum: [0,1]
    },
});

module.exports = mongoose.model("User", userSchema);