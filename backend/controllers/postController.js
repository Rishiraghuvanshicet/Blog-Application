const { cloudinary } = require("../config/cloudinary");
const Post = require("../models/postSchema");

const addImagePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const imageUrl = req.body.image;

    if (!title || !content || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Title and Content are required." });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required." });
    }

    // Create a new post
    const newPost = new Post({
      title,
      content,
      imageUrl,
      author: req.userId,
    });

    // Save the post to DB
    await newPost.save();
    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllPost = async (req, res) => {
  try {
    const postArray = await Post.find().populate("author", "name email");

    if (!postArray) {
      return res.status(401).json({ message: "Problem in finding Posts" });
    }
    return res
      .status(200)
      .json({ posts: postArray, message: "Post Fetched Successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getSinglePostDetail = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
    .populate("comments.author", "name _id") 
    .populate("author", "name _id");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    console.error("Error fetching post details:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("likes", "name _id"); //

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error("Error getting likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("comments.author", "name")  

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res
      .status(200)
      .json({ message: liked ? "Unliked" : "Liked", likes: post.likes.length });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.userId;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      text,
      author: userId,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate comments' author after saving
    const populatedPost = await Post.findById(postId)
      .populate("comments.author", "userName");  // Populate 'userName' for comment authors

    res.status(201).json({
      message: "Comment added",
      comments: populatedPost.comments,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the comment
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check permissions
    const isCommentAuthor = comment.author.toString() === userId;
    const isPostAuthor = post.author.toString() === userId;

    if (!isCommentAuthor && !isPostAuthor) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    // Remove the comment safely
    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);

    await post.save();

    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost: post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addImagePost,
  getAllPost,
  getSinglePostDetail,
  getLikes,
  getComments,
  toggleLikePost,
  addCommentToPost,
  deleteComment,
  updatePost
};
