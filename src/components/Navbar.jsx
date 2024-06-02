import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import styled from "styled-components";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useNavigate } from "react-router-dom";
import PrivacyModal from './PrivacyModal';  // 确保正确导入 PrivacyModal 组件

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false); // 控制隐私政策弹窗
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    setOpen(false);
    navigate('/login');
  };

  const handlePrivacyPolicy = () => {
    console.log("Trying to open Privacy Modal");
    setPrivacyOpen(true);  // 这里设置为 true，以显示 PrivacyModal
  };

  return (
    <>
      <AppBar position="sticky">
        <StyledToolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MedicalServicesIcon />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              G13 Medical
            </Typography>
          </Box>
          {/*<IconButton color="inherit" onClick={handlePrivacyPolicy}>*/}
          {/*  <Typography>Privacy Policy</Typography>*/}
          {/*</IconButton>*/}
        </StyledToolbar>
      </AppBar>
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </>
  );
};

export default Navbar;
