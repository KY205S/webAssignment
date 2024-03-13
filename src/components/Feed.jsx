import React from "react";
import Box from "@mui/material/Box";

import Welcome from "./Welcome";
import LoginPage from "./LoginPage";
import { Router } from "@mui/icons-material";
import { Routes } from "react-router-dom";

const Feed = () => {
  return (
    <Box flex={9} p={2}>
      <Welcome />
    </Box>
  );
};

export default Feed;
