import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken'); // Remove JWT from sessionStorage
    setOpen(false); // Close the menu
    navigate('/login'); // Navigate to the login page
  };

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MedicalServicesIcon />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            NHS Help
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ marginRight: "10px" }} color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon fontSize="large" />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={(e) => setOpen(true)}>
            <AccountCircle fontSize="large" />
          </IconButton>
        </Box>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => {setOpen(false); navigate('/profile');}}>Profile</MenuItem>
        <MenuItem onClick={() => {setOpen(false); navigate('/account');}}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;