// userRoutes.js
const express = require("express");
const router = express.Router();
const { add, edit, deletePost, likePost, postComment, viewPost, unlikePost, deleteComment, savePost, feed,  archivePost} = require("../controller/PostController");
const protect = require("../middleware/authMiddleware");
const {postUpload} = require("../extras/multer");


router.post("/add", postUpload.array('post', 10), protect, add);
router.patch("/edit/:id", protect, edit);
router.delete("/delete/:id", protect, deletePost);
router.post("/like/:id", protect, likePost);
router.post("/comment/:id", protect, postComment);
router.post("/view/:id", protect, viewPost);
router.post("/unlike/:id", protect, unlikePost);
router.delete("/comment/:postId/:id", protect, deleteComment);
router.post("/save/:postId", protect, savePost);
router.get("/feed", protect, feed);
router.post("/archive", protect, archivePost);


module.exports = router;
