import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import SlideBar from "../components/SlideBar";
import BlogPostCard from "../components/BlogPostCard";
import SpinningLoader from "../components/SpinningLoader";
import { IoSearchOutline } from "react-icons/io5";

const MainFeed = () => {
  const [allPost, setAllPost] = useState([]);
  const [filteredPost, setFilteredPost] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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
        const shuffledPosts = shuffleArray(posts);
        setAllPost(shuffledPosts);
        setFilteredPost(shuffledPosts);
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
      setFilteredPost(shuffleArray(allPost));
      return;
    }

    const filtered = allPost.filter((post) =>
      post.title.toLowerCase().includes(trimmedSearch)
    );
    setFilteredPost(shuffleArray(filtered));
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "row", padding: 2, mt: 7 }}>
        <Box sx={{ width: "20%", pr: 2 }}>
          <SlideBar />
        </Box>

        <Box sx={{ width: "80%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 1,
              mt: 2,
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
              sx={{ backgroundColor: "#2e2e2e", borderRadius: "60%" }}
              onClick={handleSubmitSearch}
            >
              <IoSearchOutline />
            </Button>
          </Box>
          <Box sx={{display:'flex', justifyContent:'right'}}>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    "http://localhost:2000/API/V1/EXPORT/excel",
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "All_Blog_Posts.xlsx";
                  a.click();
                } catch (err) {
                  console.error("Excel download failed", err);
                }
              }}
              sx={{ mb: 2, backgroundColor: "#2e2e2e" }}
            >
              Download All Posts (Excel)
            </Button>
          </Box>
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
            ) : filteredPost.length > 0 ? (
              filteredPost.map((post) => (
                <Box key={post._id} sx={{ minWidth: 220 }}>
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
