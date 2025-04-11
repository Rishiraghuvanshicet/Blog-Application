import React, { useState } from "react";
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
import axios from "axios"; // Don't forget to import axios

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  function handleRegisterToggle() {
    navigate("/signup"); // Navigate to signup page
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:2000/API/V1/USER/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response.data);

      // Set the token to localStorage
      localStorage.setItem("token", response.data.token);

      // Navigate to the main feed after successful login
      navigate("/main-feed");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
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
            sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"}
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
            <label>Don't have an Account?</label>
            <Button
              variant="contained"
              onClick={handleRegisterToggle}
              sx={{ borderRadius: 3 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
