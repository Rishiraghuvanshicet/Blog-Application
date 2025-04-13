import React from "react";
import Header from "../components/Header";
import { Box, Container, Typography, Paper } from "@mui/material";

function About() {
  return (
    <>
      <Header />
      <Container sx={{ mt: 20 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Paper elevation={3} sx={{ width: "100%", maxWidth: 800, padding: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              About Us
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to our Blog Application! Our platform provides users with
              a seamless experience for sharing thoughts, stories, and ideas
              through blog posts. Whether you're an aspiring writer or a seasoned
              blogger, this application is designed to empower you to create,
              manage, and share content with the world.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Key Features:
            </Typography>
            <Typography variant="body1" paragraph>
              - **Create Posts**: Write and share blog posts on various topics.
            </Typography>
            
            <Typography variant="body1" paragraph>
              - **View Posts**: Stay updated with new posts and comments.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Our Mission:
            </Typography>
            <Typography variant="body1" paragraph>
              Our mission is to provide a platform where individuals can
              express themselves freely, share their passions, and create
              meaningful connections with others who share similar interests.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Contact Us:
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions or suggestions, feel free to contact us
              through our Contact page. We're always open to feedback and are
              committed to improving your experience.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default About;
