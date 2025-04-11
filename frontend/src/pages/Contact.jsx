import React, { useState } from 'react';
import Header from '../components/Header';
import { Box, Container, Paper, TextField, Button, Typography } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 20 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, padding: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Contact Us
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Your Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Your Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Your Message"
                variant="outlined"
                fullWidth
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ marginBottom: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" color="primary">
                  Send Message
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Contact;
