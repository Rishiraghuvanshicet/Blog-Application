import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const menuItems = [
    { text: "Create Post", link: "/create-post" },
    { text: "Search Friend", link: "/search-friend" },
    { text: "Notifications", link: "/notifications" },
    { text: "Settings", link: "/settings" },
  ];

  return (
    <div>
      <AppBar position="absolute">
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog-Application
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/main-feed">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/main-feed/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/main-feed/contact">
              Contact
            </Button>
          </Box>
          <Box>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Side Menu) */}
      {/* <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.link}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer> */}
    </div>
  );
};

export default Header;
