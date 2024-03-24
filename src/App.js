import "./App.css";
import * as React from "react";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import Navbar from "./components/Navbar";
import { Box, Stack } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import History from "./user/History";
import Welcome from "./components/Welcome";
import { useState } from "react";
import MyContext from "./components/Context1";
import HomeD from "./user/HomeU";
import HomeU from "./doctor/HomeD";

function App() {
  const [isDoctor, setIsDoctor] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Router>
        <MyContext.Provider
          value={{
            isDoctor,
            setIsDoctor,
            isLoggedIn,
            setIsLoggedIn,
          }}
        >
          <Box>
            <Navbar />

            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"space-between"}
            >
              <Sidebar />
              <Box flex={9} p={2}>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/user" element={<HomeD />} />
                  <Route path="/doctor" element={<HomeU />} />
                </Routes>
              </Box>
              <Rightbar />
            </Stack>
          </Box>
        </MyContext.Provider>
      </Router>
    </div>
  );
}

export default App;
