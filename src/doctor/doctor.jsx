import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../components/AuthService";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    AuthService.makeAuthRequest("http://10.14.149.222:8000/profile/", {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched profile data:", data);
        setUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <Box
      margin="auto"
      width="80%"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: 2,
        paddingLeft: 2,
        height: "100vh",
      }}
    >
      <Card sx={{ width: "100%", padding: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginRight: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
              <Avatar sx={{ bgcolor: "skyblue", marginRight: 1 }} aria-label="recipe">
                G13
              </Avatar>
              <Typography variant="h6">G13 Medical</Typography>
            </Box>
            <CardMedia
              component="img"
              sx={{
                width: "80%", // Set width as desired
                height: "auto", // Set height to 'auto' to maintain aspect ratio
                marginBottom: 2,
                alignSelf: "center" // Center the image
              }}
              image="https://cdn-icons-png.flaticon.com/512/822/822118.png"
              alt="Profile"
            />
          </Box>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent sx={{ paddingLeft: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
  {user ? (
    <>
      <Typography
        gutterBottom
        variant="h4"
        component="div"
        sx={{ textAlign: "left", marginBottom: "15px", marginTop: "100px" }}
      >
        {`Hello, ${user.user.first_name} ${user.user.last_name} !`}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "40px" }}>
        <Typography sx={{ fontSize: "1.2rem", marginBottom: "3px" }}>
          <strong>Department: </strong> {user.department}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", marginBottom: "3px" }}>
          <strong>Identity Number: </strong> {user.identify_number}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", marginBottom: "3px" }}>
          <strong>Email: </strong> {user.user.email}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", marginBottom: "3px" }}>
          <strong>Phone Number: </strong> {user.phone_number}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", marginBottom: "3px" }}>
          <strong>Gender: </strong> {user.gender}
        </Typography>
      </Box>
    </>
  ) : (
    <Typography sx={{ textAlign: "center", margin: "20px" }} variant="h6">
      No user data available.
    </Typography>
  )}
</CardContent>
          </Box>
        </Box>
        {user && (
          <Box sx={{ marginTop: "15px", padding: "0 15px" }}>
            <Typography sx={{ fontSize: "1.1rem", marginBottom: "3px" }}>
              <strong>Description: </strong> {user.description}
            </Typography>
            {user.extra_information && (
              <Typography sx={{ fontSize: "1.1rem", marginBottom: "3px" }}>
                <strong>Extra information: </strong> {user.extra_information}
              </Typography>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Welcome;
