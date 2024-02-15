const Post = require("../models/post");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const postedTime = require("../extras/functions");
const Archive = require("../models/archive");

// const Post = require("../models/post");

const postAdd = asyncHandler(async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption) {
      return res.status(400).json({ message: "Caption is required." });
    }

    // console.log(req.files);

    if (!req.files) {
      return res.status(400).json({ message: "File is required." });
    }

    let file;
    req.files.forEach((item) => {
      file = item;
    });

    const isImageValid =
      req.files &&
      (file.mimetype.startsWith("image/jpeg") ||
        file.mimetype.startsWith("image/jpg") ||
        file.mimetype.startsWith("image/gif") ||
        file.mimetype.startsWith("image/png"));

    const isVideoValid =
      req.files &&
      (file.mimetype.startsWith("video/mp4") ||
        file.mimetype.startsWith("video/mp3"));

    if (isImageValid || isVideoValid) {
      const taggedUserIds = req.body.taggedUser;

      const post = await Post.create({
        post: req.files.map((file) => file.path),
        caption: req.body.caption,
        user: req.user.userId,
      });
      // console.log(hello);

      if (taggedUserIds) {
        // console.log("Hell");
        const taggedUser = await User.find({ _id: { $in: taggedUserIds } });
        if (taggedUser.length > 0) {
          post.taggedUser.push(...taggedUser.map((user) => user._id));
        }
      }

      await post.save();
      const user = await User.findById(req.user.userId);
      user.posts.push(post._id);
      await user.save();

      // console.log(post);
      res.status(200).json({
        message: "Post created successfully.",
      });
    } else {
      res.status(400).json({
        message: "Please send valid files",
      });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Post not created." });
  }
});

const editPost = asyncHandler(async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);
    if (post) {
      if (caption) post.caption = caption;
      await post.save();
      res.status(200).json({
        message: "Post updated",
      });
    } else {
      res.status(400).json({
        message: "Post id not found",
      });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Post not created." });
  }
});

const deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      // await post.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Post deleted",
      });
    } else {
      res.status(400).json({
        message: "Post id not found",
      });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const likePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.likes.push(req.user.userId);
      await post.save();
      res.status(200).json({
        message: "Post liked",
      });
    } else {
      res.status(400).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const comment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      const postComment = {
        user: req.user.userId,
        text: req.body.comment,
      };
      post.comments.push(postComment);
      await post.save();
      res.status(200).json({
        message: "Done",
      });
    } else {
      res.status(400).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    console.error("Error commenting post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const viewPost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    if (post && !Archive.postIds.includes(post._id)) {
      let likesCount = post.likes.length;
      let commentsCount = post.comments ? post.comments.length : 0;
      let postedAgoTime = postedTime(post.createdPostAt);
      // let viewsCount = 0;
      // if (post.video) {
      //   if (!post.views.includes(req.user.userId)) {
      //     post.views.push(req.user.userId);
      //     await post.save();
      //   }
      //   viewsCount = post.views.length;
      // }
      // console.log(viewsCount);
      res.status(200).json({
        message: "Post found",
        data: {
          post,
          likesCount,
          commentsCount,
          postedAgoTime
          // viewsCount,
        },
      });
    } else {
      res.status(400).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    console.error("Error viewing post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const unlikePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.likes.remove(req.user.userId);
      await post.save();
      res.status(200).json({
        message: "Post unliked",
      });
    } else {
      res.status(400).json({
        message: "Post not found",
      });
    }
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.id);
    if (comment) {
      if (
        comment.user.toString() === req.user.userId ||
        comment.user.toString() === post.user
      ) {
        comment.remove();
        await post.save();
        res.status(200).json({ message: "Comment deleted" });
      }
      res.status(400).json({
        message: "Unauthorized to delete comment",
      });
    } else {
      res.status(404).json({
        message: "Comment not exists",
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment." });
  }
});

const savePost = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (user) {
      user.savedPosts.push(req.params.postId);
      await user.save();
      res.status(200).json({
        message: "Post saved",
      });
    } else {
      res.status(404).json({
        message: "User doesn't exists",
      });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Post not saved." });
  }
});

const feed = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      //if user exists
      let following = user.following;
      const followingsUser = await User.find({ _id: { $in: following } });
      const posts = await Post.find({
        user: { $in: followingsUser.map((u) => u._id) },
      }).populate("comments");
      if (posts) {
        res.status(200).json({
          message: "Post feed",
          data: posts,
        });
      }
      res.status(400).json({
        message: "No feed",
      });
    } else {
      res.status(404).json({
        message: "No user found",
      });
    }
  } catch (error) {
    console.error("Error feeding post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const archivePost = asyncHandler(async(req, res) => {
  const post = await Post.findById(req.params.id);
  if(!post){
    res.status(404).json({
      message: "Post not found"
    });

    const archiveData = {
      user: req.user.userId,
      postIds: [post._id]
    }

    const archiveInstance = new Archive(archiveData);
    await archiveInstance.save();

    res.status(200).json({
      message: "Post archived"
    });
    
  }
});

module.exports = {
  add: postAdd,
  edit: editPost,
  deletePost,
  likePost,
  postComment: comment,
  viewPost,
  unlikePost,
  deleteComment,
  savePost,
  feed,
  archivePost
};
