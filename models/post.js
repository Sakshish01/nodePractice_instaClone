const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  // image: String,
  // video: String, // Video field
  // views: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Views field (defaulted to 0)
  post: [
    {
      type: String,
      required: true,
    },
  ],
  caption: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  taggedUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdPostAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
