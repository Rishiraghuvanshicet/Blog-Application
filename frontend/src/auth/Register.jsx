import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔗 Background Image URL
const backgroundImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLv_CRZ3dZRJ5WhOgFWiSQiyBwlgdLVTXQDA&s";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginToggle = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }

    setError("");
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:2000/API/V1/USER/register",
        {
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      setError("An error occurred while registering. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <Typography variant="h4" gutterBottom align="center" color="black">
            Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                backgroundColor: "#2e2e2e",
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                mt: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography color="black">Have an Account:</Typography>
              <Button
                variant="contained"
                onClick={handleLoginToggle}
                sx={{ borderRadius: 3, backgroundColor: "#2e2e2e" }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
};

export default Register;
