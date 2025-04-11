// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the To-Do App!
      </Typography>
      <Box mt={4}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/register")} 
          sx={{ margin: "10px" }}
        >
          Sign Up
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate("/login")} 
          sx={{ margin: "10px" }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
