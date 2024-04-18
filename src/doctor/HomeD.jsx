import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Welcome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3001/profileD")
      .then((response) => {
        console.log("Fetched profile data:", response.data);
        setUsers(response.data); // Set the array of users
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);
  const dob =
    users.length > 0
      ? `${users[0].birthDay}/${users[0].birthMonth}/${users[0].birthYear}`
      : "Date of birth not provided";

  return (
    <Box flex={9} p={2}>
      <Card sx={{ marginLeft: 15 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "skyblue" }} aria-label="recipe">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="NHS Help"
        />
        <CardMedia
          component="img"
          sx={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "50%", // Set width as desired
            height: "auto", // Set height to 'auto' to maintain aspect ratio
          }}
          style={{
            width: "50%",
            height: "50%",
          }}
          image="https://cdn-icons-png.flaticon.com/512/822/822118.png"
          alt="Paella dish"
        />
        <CardContent>
          {users.length > 0 ? (
            <>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ textAlign: "center", marginBottom: "15px" }}
              >
                {`Hello ${users[0].firstName || ""} ${users[0].lastName || ""}`}
              </Typography>
              <Box>
                <Typography
                  sx={{
                    marginLeft: "220px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Identity Number : </strong> {users[0].identityNumber}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "220px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Email : </strong> {users[0].email}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "220px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Phone Number : </strong> {users[0].phoneNumber}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "220px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Department : </strong> {users[0].department}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "220px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Gender : </strong> {users[0].gender}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography
              sx={{ textAlign: "center", margin: "20px" }}
              variant="h6"
            >
              Loading user data...
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          <Stack spacing={2} justifyContent={"space-between"}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1, ml: 2 }} // Increase padding and font size, add margin left for spacing
              onClick={() => navigate("/upcomingBooking")}
            >
              Check Upcoming Booking
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/manageBooking")}
            >
              Management Booking
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/DoctorAppointmentList")}
            >
              Appointment List
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/EditMedicalResult")}
            >
              Edit Medical Result
            </Button>

          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Welcome;
