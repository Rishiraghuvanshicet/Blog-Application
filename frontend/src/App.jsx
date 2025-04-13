import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import MainFeed from "./pages/MainFeed";
import CreatePost from "./pages/CreatePost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BlogDetails from "./pages/BlogDetail";
import UserBlogOnly from "./pages/UserBlogOnly";
import EditBlogPage from "./pages/EditBlogPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/main-feed" element={<MainFeed />} />
        <Route path="/main-feed/about" element={<About />} />
        <Route path="/main-feed/contact" element={<Contact />} />
        <Route path="/main-feed/user-Blog-Only" element={<UserBlogOnly />} />
        <Route path="/main-feed/create-post" element={<CreatePost />} />
        <Route path="/main-feed/blog/:id" element={<BlogDetails />} />
        <Route path="/main-feed/blog/edit-post/:id" element={<EditBlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;
