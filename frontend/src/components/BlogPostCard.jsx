import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router";

const BlogPostCard = ({ post }) => {
  const navigate = useNavigate();

  function navigateToBlog() {
    navigate(`/main-feed/blog/${post._id}`);
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Box
      onClick={navigateToBlog}
      sx={{
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 250,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {post.imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={post.imageUrl}
            alt={post.title}
          />
        )}

        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {formattedDate}
            </Typography>
          </Box>
          <Typography variant="h6" noWrap gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle1">by: {post.author.name}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogPostCard;
