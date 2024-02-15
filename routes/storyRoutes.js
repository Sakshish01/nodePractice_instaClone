const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {storyUpload, highlightCoverUpload} = require("../extras/multer");
const {addStory, deleteStory, viewStory, likeStory, UnlikeStory, addComment, addReaction, addHighlight,  deleteHighlight, viewHighlight, removeStoryfromHighlight, editHighlight} = require("../controller/ActivityController");

//story rotes
router.post("/add", protect, storyUpload.array('files'), addStory);
router.post("/delete/:id", protect, deleteStory);
router.get("/view/:id", protect, viewStory);
router.post("/like/:id", protect, likeStory);
router.post("/dislike/:id", protect, UnlikeStory);
router.post("/comment/add/:id", protect, addComment);
router.post("/reaction/add/:id", protect, addReaction);


//story highlights routes
router.post("/highlight/add", protect, highlightCoverUpload.single('cover'), addHighlight);
router.delete("/highlight/delete/:id", protect, deleteHighlight);
router.get("/highlight/view/:id", protect, viewHighlight);
router.post("/highlight/removeStory/:id", protect, removeStoryfromHighlight);
router.post("/highlight/edit/:id", protect, highlightCoverUpload.single('cover'), editHighlight);


module.exports = router;