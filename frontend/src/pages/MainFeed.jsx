import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import SlideBar from "../components/SlideBar";
import BlogPostCard from "../components/BlogPostCard";
import SpinningLoader from "../components/SpinningLoader";

const MainFeed = () => {
  const [allPost, setAllPost] = useState([]);
  const [filteredPost, setFilteredPost] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:2000/API/V1/POST/getAllPost",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const posts = response.data.posts;
        setAllPost(posts);
        setFilteredPost(posts);
      } catch (error) {
        console.log(`There is an error in fetching all posts:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPost();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmitSearch = () => {
    const trimmedSearch = search.trim().toLowerCase();

    if (trimmedSearch === "") {
      setFilteredPost(allPost);
      return;
    }

    const filtered = allPost.filter((post) =>
      post.title.toLowerCase().includes(trimmedSearch)
    );
    setFilteredPost(filtered);
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "row", padding: 2, mt: 7 }}>
        <Box sx={{ width: "20%", pr: 2 }}>
          <SlideBar />
        </Box>

        <Box sx={{ width: "80%" }}>
          {/* Search Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Search blog by title..."
              value={search}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitSearch}
            >
              Search
            </Button>
          </Box>

          {/* Blog Cards */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {loading ? (
              <SpinningLoader />
            ) : filteredPost.length > 0 ? (
              filteredPost.map((post) => (
                <Box
                  key={post._id}
                  sx={{ flex: "1 1 calc(20% - 16px)", minWidth: 220 }}
                >
                  <BlogPostCard post={post} />
                </Box>
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 2 }}>
                No blog matched your search.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MainFeed;
