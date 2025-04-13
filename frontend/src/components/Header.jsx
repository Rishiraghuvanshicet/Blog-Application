import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#2e2e2e" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#f5f5f5", fontWeight: "bold" }}
          >
            Blog-Application
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/main-feed"
              sx={{ color: "#f5f5f5", textTransform: "none" }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/main-feed/about"
              sx={{ color: "#f5f5f5", textTransform: "none" }}
            >
              About
            </Button>
            <Button
              component={Link}
              to="/main-feed/contact"
              sx={{ color: "#f5f5f5", textTransform: "none" }}
            >
              Contact
            </Button>
          </Box>
        </Box>

        <Box>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: "#444",
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#555",
                opacity:0.85
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
