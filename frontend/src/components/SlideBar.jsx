// Sidebar.jsx
import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const SlideBar = () => {
  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 5,
        backgroundColor: "#f4f4f4",
        padding: "16px",
        boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
        overflowY: "auto",
      }}
    >
      <Box sx={{ mt: 6 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: "12px",backgroundColor: "#2e2e2e" }}
          component={Link}
          to="/main-feed/create-post"
        >
          Create Post
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: "12px",backgroundColor: "#2e2e2e" }}
          component={Link}
          to="/main-feed/user-Blog-Only"
        >
          My Blogs
        </Button>
      </Box>
    </Box>
  );
};

export default SlideBar;
