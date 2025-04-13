import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import SlideBar from "../components/SlideBar";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const data = new FormData();
      data.append("file", file);
      const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      const cloudinaryBaseUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;

      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloudName);

      try {
        const response = await axios.post(cloudinaryBaseUrl, data);
        const uploadImageUrl = response.data.url;
        console.log("Uploaded Image URL:", uploadImageUrl);

        setFormData((prev) => ({
          ...prev,
          image: uploadImageUrl,
        }));

        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.image) {
      toast.error("Please fill out all fields including the image.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:2000/API/V1/POST/createPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Post created successfully!");

      setFormData({
        title: "",
        content: "",
        image: "",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "row", padding: 2, mt: 7 }}>
        <Box sx={{ width: "20%", pr: 2 }}>
          <SlideBar />
        </Box>

        <Box sx={{ width: "80%", mt: 8 }}>
          <Paper elevation={3} sx={{ mt: 2, padding: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              Create a Post
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleInput}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Content"
                variant="outlined"
                fullWidth
                name="content"
                multiline
                rows={4}
                value={formData.content}
                onChange={handleInput}
                sx={{ marginBottom: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    border: "2px #2e2e2e dashed",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    color: "#2e2e2e"
                  }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>

              {formData.image && typeof formData.image === "string" && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="Uploaded"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </Box>
              )}

              {formData.image && typeof formData.image !== "string" && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Image selected but not yet uploaded. Please wait.
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "30% 10% 30% 10%",backgroundColor: "#2e2e2e" }}
                >
                  Post
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CreatePost;
