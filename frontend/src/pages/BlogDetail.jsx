import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import SpinningLoader from "../components/SpinningLoader";

// MUI imports
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/API/V1/POST/getSinglePost/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { post } = response.data;
        setBlog(post);
        setLikes(post.likes.length || 0);
        setComments(post.comments || []);
        setIsLiked(post.likes.some((likeId) => likeId.toString() === userId));
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id, token, userId,comments, likes]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:2000/API/V1/POST/addLike/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedLikes = response.data.likes;
        setLikes(updatedLikes.length);
        setIsLiked(updatedLikes.some((likeId) => likeId.toString() === userId));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:2000/API/V1/POST/addComment/${id}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setComments((prev) => [...prev, response.data.comments.at(-1)]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:2000/API/V1/POST/deleteComment/${id}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (!blog) {
    return <SpinningLoader />;
  }

  return (
    <>
      <Header />
      <Box maxWidth="800px" mx="auto" mt={10} px={2}>
        <Card>
          {blog.imageUrl && (
            <CardMedia
              component="img"
              height="300"
              image={blog.imageUrl}
              alt={blog.title}
              sx={{ objectFit: "contain" }}
            />
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {blog.title}
            </Typography>
            <Box maxHeight="400px" overflow="auto" mb={2}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {blog.content}
              </Typography>
            </Box>

            {/* Likes */}
            <Box display="flex" alignItems="center" mt={2}>
              <Button
                variant="contained"
                onClick={handleLike}
                sx={{
                  backgroundColor: isLiked ? "green" : "red",
                  "&:hover": {
                    backgroundColor: isLiked ? "darkgreen" : "darkred",
                  },
                }}
              >
                {isLiked ? "Unlike" : "Like"}
              </Button>
              <Typography ml={2}>{likes} Likes</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Comments */}
            <Typography variant="h6">Comments</Typography>
            <Box display="flex" gap={2} my={2}>
              <TextField
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                label='Add a New Comment'
              />
              <Button variant="outlined" onClick={handleAddComment}>
                Post 
              </Button>
            </Box>

            <Box maxHeight="200px" overflow="auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box key={comment._id} mb={2}>
                    <Typography variant="body2">• {comment.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                    {(comment.author?._id === userId || blog.author?._id === userId) && (
                      <Box>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No comments yet.</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default BlogDetails;
