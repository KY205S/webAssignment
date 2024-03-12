import React from "react";
import Box from "@mui/material/Box";

const Rightbar = () => {
  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      This is right bar
    </Box>
  );
};

export default Rightbar;
