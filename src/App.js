import "./App.css";
import * as React from "react";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Rightbar from "./components/Rightbar";
import Navbar from "./components/Navbar";
import { Box, Stack } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import History from "./user/History";

function App() {
  return (
    <div>
      <Router>
        <Box>
          <Navbar />

          <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
            <Sidebar />
            <Box flex={9} p={2}>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </Box>
            <Rightbar />
          </Stack>
        </Box>
      </Router>
    </div>
  );
}

export default App;
