import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
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
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
