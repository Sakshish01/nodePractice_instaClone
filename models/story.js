const mongoose = require("mongoose");

const storySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  files: [
    {
      type: String,
    },
  ],
  text: {
    type: String,
  },
  shareWith: {
    type: String,
    enum: ["closeFriends", "followers"],
    default: "followers",
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  location: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reactions: {
    thumbsUp: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  avatars: {
    happy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  deleteStatus: {
    type: Boolean,
    default: false
  },
  deletedAt:{
    type: Date
  }, 
  draft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }
});

module.exports = mongoose.model("Story", storySchema);
