import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import SlideBar from "../components/SlideBar";
import BlogPostCard from "../components/BlogPostCard";
import SpinningLoader from "../components/SpinningLoader";

const UserBlogOnly = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Extract userId from token
  const getUserIdFromToken = () => {
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = atob(base64Payload);
      const payloadObj = JSON.parse(decodedPayload);
      return payloadObj.id || payloadObj.userId || payloadObj._id;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/API/V1/POST/getAllPost",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allPosts = response.data.posts;

        const filteredPosts = allPosts.filter(
          (post) => post.author?._id === userId
        );

        setUserPosts(filteredPosts);
      } catch (error) {
        console.log("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserPosts();
  }, [token, userId]);

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "row", padding: 2, mt: 7 }}>
        <Box sx={{ width: "20%", pr: 2 }}>
          <SlideBar />
        </Box>

        <Box sx={{ width: "80%" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Your Blog Posts
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 50,
                }}
              >
                <SpinningLoader />
              </Box>
            ) : userPosts.length > 0 ? (
              userPosts.map((post) => (
                <Box key={post._id} sx={{ minWidth: 220 }}>
                  <BlogPostCard post={post} />
                </Box>
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 2 }}>
                You haven’t posted any blogs yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserBlogOnly;
