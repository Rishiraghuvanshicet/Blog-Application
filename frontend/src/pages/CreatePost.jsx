import { useEffect, useState } from "react";
import axios from "axios"; // Make sure axios is imported
import Header from "../components/Header";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "", // Image will initially hold the file or URL
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
            image: file, // Store the file object in formData initially
        }));

        // Optionally, upload the image to Cloudinary here
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
                image: uploadImageUrl, // Set URL after successful upload
            }));
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }
};


const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title || !formData.content || !formData.image) {
      alert("Please fill out all fields including image.");
      return;
  }

  // const data = new FormData();
  // data.append("title", formData.title);
  // data.append("content", formData.content);

  // if (formData.image && typeof formData.image !== "string") {
  //     // If image is a file (before upload)
  //     data.append("image", formData.image);
  // } else if (formData.image && typeof formData.image === "string") {
  //     // If image is a URL (after upload)
  //     data.append("image", formData.image);
  // }

  // Log FormData entries to ensure it's populated correctly
  // for (let [key, value] of formData.entries()) {
  //     console.log(key, value);
  // }

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
      console.log("Post created successfully", response.data);

      // Reset form after success
      setFormData({
          title: "",
          content: "",
          image: "",
      });
  } catch (error) {
      console.error("Error creating post:", error);
  }
};


  return (
    <>
      <Header />
      <Container sx={{ mt: 20 }}>
        <Box sx={{ margin: 10 }}>
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
                    border: "2px dashed",
                    borderRadius: "10px",
                    padding: "10px 20px",
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
                  sx={{ borderRadius: "20% 20% 20% 20%" }}
                >
                  Post
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default CreatePost;
