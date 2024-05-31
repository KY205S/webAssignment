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
  // const user = [
  //   {
  //     id: 1,
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "johndoe@example.com",
  //     phoneNumber: "123-456-7890",
  //     birthDay: "10",
  //     birthMonth: "01",
  //     birthYear: "1990",
  //     gender: "Male",
  //     identityNumber: "AB1234567",
  //   },
  //   {
  //     id: 2,
  //     firstName: "Jane",
  //     lastName: "Smith",
  //     email: "janesmith@example.com",
  //     phoneNumber: "098-765-4321",
  //     birthDay: "24",
  //     birthMonth: "12",
  //     birthYear: "1985",
  //     gender: "Female",
  //     identityNumber: "CD8901234",
  //   },
  //   {
  //     id: 3,
  //     firstName: "Alex",
  //     lastName: "Johnson",
  //     email: "alexjohnson@example.com",
  //     phoneNumber: "555-123-4567",
  //     birthDay: "03",
  //     birthMonth: "07",
  //     birthYear: "1992",
  //     gender: "Non-binary",
  //     identityNumber: "EF4567890",
  //   },
  // ];

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3001/profile")
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
    // Box flex={9} p={2}>
      <Box
      margin="auto"
      width="50%" // 设置一个固定的宽度，可以根据需要调整
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ maxWidth: 550, marginLeft: 30 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "skyblue" }} aria-label="recipe">
              G13
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="G13 Medical"
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
          image="data:image/png;base64,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"
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
                    marginLeft: "150px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Identity Number : </strong> {users[0].identityNumber}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "150px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Email : </strong> {users[0].email}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "150px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Phone Number : </strong> {users[0].phoneNumber}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "150px",
                    fontSize: "1.1rem",
                    marginBottom: "3px",
                  }}
                  component="div"
                >
                  <strong>Date of Birth : </strong> {dob}
                </Typography>
                <Typography
                  sx={{
                    marginLeft: "150px",
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
              onClick={() => navigate("/booking")}
            >
              Booking Appointment
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/changePassword")}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1, ml: 2 }} // Increase padding and font size, add margin left for spacing
              onClick={() => navigate("/updateContact")}
            >
              Update Contact
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/History")}
            >
              History
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/PatientAppointmentList")}
            >
              Appointment List
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/ViewMedicalResult")}
            >
              ViewMedicalResult
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/OnlineConsult")}
            >
              OnlineConsult
            </Button>


          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Welcome;
