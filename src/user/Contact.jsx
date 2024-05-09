import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { useNavigate } from "react-router-dom";
import group13Logo from "../components/Group13-logo.jpg";

const UpdateContact = () => {
  const navigate = useNavigate();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [email, setEmail] = useState("");
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    const maxDigits = 11;

    if (value.length > maxDigits) {
      event.target.value = value.slice(0, maxDigits);
    }

    setPhoneNumber(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted values:", formData);
    // Here you would typically handle the form submission, like sending it to a backend server
  };

  const formData = {
    email: email,
    phoneNumber: phoneNumber,
  };
  return (
    <Box
      marginLeft={35}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", m: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
          <Typography variant="h5" component="h1" sx={{mt: 2}}>
            Update Contact{" "}
          </Typography>
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            id="input-email"
            label="New Email Address"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            InputProps={{
              startAdornment: <Email sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <TextField
            fullWidth
            id="phoneNumber"
            label="New Phone Number"
            type="Number"
            variant="outlined"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            InputProps={{
              startAdornment: (
                <PhoneAndroidIcon sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, bgcolor: "grey" }}
            onClick={handleSubmit}
            type="submit"
          >
            Save changes
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, width: "100%" }}
            onClick={() => navigate("/home")}
          >
            Back
          </Button>
          <Button color="primary" sx={{ mt: 1 }}>
            Forgot password?
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateContact;
