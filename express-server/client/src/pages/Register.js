import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper
} from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Error registering");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            name="username"
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            type="email"
            label="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 3 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
