import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { GrUpdate } from "react-icons/gr";

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  const token = localStorage.getItem("token");

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
        setUpdatedTitle(post.title);
        setUpdatedContent(post.content);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:2000/API/V1/POST/updatePost/${id}`,
        {
          title: updatedTitle,
          content: updatedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate(`/main-feed/blog/${id}`); 
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <Box maxWidth="800px" mx="auto" mt={10} px={2}>
      <Typography variant="h4">Edit Blog Post</Typography>
      <TextField
        label="Title"
        fullWidth
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Content"
        multiline
        rows={6}
        fullWidth
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 2,backgroundColor: "#2e2e2e",gap:1 }} onClick={handleUpdate}>
      <GrUpdate />Update Post
      </Button>
    </Box>
  );
};

export default EditBlogPage;
