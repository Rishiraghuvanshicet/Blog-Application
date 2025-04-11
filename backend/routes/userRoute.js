const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../authControllers/userAuthController");
const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

//auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
//userControllers Routes
router.get("/:userId/profile", getUserProfile);
router.put("/:userId/profile", updateUserProfile);
router.post("/:userId/follow/:followUserId", followUser);
router.post("/:userId/unfollow/:unfollowUserId", unfollowUser);

module.exports = router;
