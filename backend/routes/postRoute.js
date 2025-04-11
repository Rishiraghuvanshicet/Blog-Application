const express = require("express");
const router = express.Router();
const upload = require("../config/multer")
const { addImagePost, getAllPost, getSinglePostDetail, getLikes, getComments, toggleLikePost, addCommentToPost, deleteComment } = require("../controllers/postController");

//image upload
router.post("/createPost", upload.single("image"),addImagePost);

//get Post Details
router.get("/getAllPost", getAllPost);
router.get("/getSinglePost/:postId", getSinglePostDetail);
router.get("/getLikes", getLikes);
router.get("/getComments", getComments);

//Add Comments And likes
router.post("/addLike/:postId", toggleLikePost);
router.post("/addComment/:postId", addCommentToPost);

//delete Comment

router.delete("/deleteComment",deleteComment)


module.exports = router;