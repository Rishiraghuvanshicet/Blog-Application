import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import SpinningLoader from "../components/SpinningLoader";
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
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa6";
import { RiAddLargeFill } from "react-icons/ri";
import { CgEditBlackPoint } from "react-icons/cg";
import { FaRegHandPointRight } from "react-icons/fa";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded._id || decoded.userId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!userId) return;

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
  }, [id, token, userId, likes, newComment]);

  const handleEdit = () => {
    navigate(`/main-feed/blog/edit-post/${id}`);
  };
  const handleDownloadWord = async () => {
    try {
      const res = await fetch(
        `http://localhost:2000/API/V1/EXPORT/word/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${blog.title.replace(/\s+/g, "_")}.docx`;
      a.click();
    } catch (err) {
      console.error("Error downloading Word file:", err);
    }
  };

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
      }
      setNewComment("");
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
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (err) {
      console.error(
        "Error deleting comment:",
        err.response?.data || err.message
      );
    }
  };

  if (!blog) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 30,
        }}
      >
        <SpinningLoader />
      </Box>
    );
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
            <Box sx={{ display:'flex' , justifyContent:'left', padding:0}}>
            <Button
              variant="contained"
              sx={{ mb: 2, mt: 2,backgroundColor: "#2e2e2e", }}
              onClick={handleDownloadWord}
            >
              Download as Word
            </Button>
            </Box>
            {userId === blog?.author?._id && (
              <Button
                variant="contained"
                sx={{ mt: 1, mb: 2, backgroundColor: "#2e2e2e", gap: 1 }}
                onClick={handleEdit}
              >
                <RiAddLargeFill /> Edit
              </Button>
            )}
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Button
                variant="contained"
                onClick={handleLike}
                sx={{
                  width: 56,
                  height: 56,
                  minWidth: 0,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {isLiked ? (
                  <FcLike style={{ fontSize: "24px" }} />
                ) : (
                  <FaRegHeart style={{ fontSize: "22px", color: "#d32f2f" }} />
                )}
              </Button>
              <Typography fontWeight="bold" fontSize={18}>
                {likes} {likes === 1 ? "Like" : "Likes"}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">Comments</Typography>
            <Box display="flex" gap={2} my={2}>
              <TextField
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                label="Add a New Comment"
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{ backgroundColor: "#2e2e2e" }}
              >
                Post
              </Button>
            </Box>

            <Box maxHeight="200px" overflow="auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box key={comment._id} mb={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        <CgEditBlackPoint />{" "}
                        {comment.author?.name || "Anonymous"} ·{" "}
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>

                      {(comment.author?._id === userId ||
                        blog.author?._id === userId) && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <MdDelete />
                          Delete
                        </Button>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ mt: 0.5, ml: 0.5 }}
                    >
                      <FaRegHandPointRight /> {comment.text}
                    </Typography>
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
