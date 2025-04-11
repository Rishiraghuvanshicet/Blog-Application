const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate("posts")
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, userName, email } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.userName = userName || user.userName;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const followUser = async (req, res) => {
  const { userId, followUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followUserId);

    if (!user || !followUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(followUserId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    user.following.push(followUserId);
    followUser.followers.push(userId);

    await user.save();
    await followUser.save();

    res
      .status(200)
      .json({ message: `You are now following ${followUser.userName}` });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const unfollowUser = async (req, res) => {
  const { userId, unfollowUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowUserId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!user.following.includes(unfollowUserId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    // Remove from following list of the user
    user.following = user.following.filter(
      (id) => id.toString() !== unfollowUserId
    );
    // Remove from followers list of the unfollowUser
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    res
      .status(200)
      .json({ message: `You have unfollowed ${unfollowUser.userName}` });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
};
