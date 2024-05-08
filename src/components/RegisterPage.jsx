import React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { useState, useEffect } from "react";
import { Email } from "@mui/icons-material";
import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { baseUrl } from '../components/Ipconfig';


const dates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 1);
  return date.toLocaleDateString("en-US");
});
const RegisterPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  //Save data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleIdentityChange = (event) => {
    setIdentityNumber(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    const maxDigits = 11;

    if (value.length > maxDigits) {
      event.target.value = value.slice(0, maxDigits);
    }

    setPhoneNumber(event.target.value);
  };

  const handleDayChange = (event) => {
    setBirthDay(event.target.value);
  };

  const handleMonthChange = (event) => {
    setBirthMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setBirthYear(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // If confirmPassword is not empty, check if both passwords are the same
    if (confirmPassword) {
      setError(event.target.value !== confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setError(password !== event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://10.14.150.90:8000/register/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      identityNumber,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      birthDay,
      birthMonth,
      birthYear,
      gender,
    };

    const allFieldsFilled = Object.values(formData).every(
      (field) => field !== ""
    );

    if (!allFieldsFilled) {
      alert("You have to fill up all register boxes");
      return;
    }

    axios
      .post("http://10.14.150.220:8000/register/", formData)
      .then((response) => {
        console.log(response.data);
        console.log(response);

        if (response.status === 201) {
          // Status code 201 means creation was successful
          alert("You have successfully registered");
          navigate("/login"); // Make sure navigate is correctly imported from your routing library
        } else {
          // If status code is not 201, log and show the message
          console.log("Unexpected status code:", response.status);
          alert(response.data.message || "Unexpected status code received.");
        }
      })
      .catch((error) => {
        if (error.response) {
          // When the response status is 400, it means Bad Request
          // And the error message is handled here
          console.log("Error response data:", error.response.data);
          alert(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request);
          alert("The server did not respond.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message);
          alert("An error occurred: " + error.message);
        }
      });
  };

  // if (
  //   error.response.data.message.includes(
  //     "Please check your email format"
  //   )
  // ) {
  //   alert("Duplicate email. Please use a different email.");
  // }
  // if (
  //   error.response.data.message.includes(
  //     "Please check your identify number format"
  //   )
  // ) {
  //   alert("Invalid identity number. Please check your input.");
  // }
  // axios
  //     .post("http://localhost:3001/approval", formData)
  //     .then((response) => {
  //       console.log(response.data);

  //       // Check the response data for specific fields and alert if any are invalid (0)
  //       if (response.data.identityNumber === "0") {
  //         alert("Please input a valid identity number");
  //       }

  //       if (response.data.email === "") {
  //         alert("Please input a valid email address");
  //       }
  //       if (response.data.password === "0") {
  //         alert("Please input a valid password");
  //       }
  //       if (response.data.phoneNumber === "0") {
  //         alert("Please input a valid phone number");
  //       }
  //       if (
  //         response.data.identityNumber === "1" &&
  //         response.data.email === "1" &&
  //         response.data.password === "1" &&
  //         response.data.phoneNumber === "1"
  //       ) {
  //         // If all fields are valid, display success and navigate to the login page
  //         alert("You have successfully registered");
  //         navigate("/login"); // replace "/login" with your login route
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error posting data:", error);
  //       alert("An error occurred while submitting your registration.");
  //     });
  // axios
  //   .post("http://10.14.150.90:8000/register/", formData)
  //   .then((response) => {
  //     console.log(response.data);
  //     alert("You have successfully registered");
  //     navigate("/login");
  //   })
  //   .catch((error) => {
  //     console.error("Error posting data:", error);
  //   });
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box>
          {step === 1 && (
            <Box
              marginLeft={45}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                p: 2,
              }}
            >
              <Card sx={{ maxWidth: 500, width: "100%", m: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      "data:image/png;base64,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"
                    }
                    alt="NHS Logo"
                    style={{ maxWidth: "100px", marginTop: "20px" }}
                  />
                  <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
                    Patient Register
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
                    id="IdentityNumber"
                    label="Identity Number"
                    variant="outlined"
                    value={identityNumber}
                    onChange={handleIdentityChange}
                    InputProps={{
                      inputProps: {
                        maxLength: 11,
                      },
                      startAdornment: (
                        <FingerprintIcon
                          sx={{ color: "action.active", mr: 1 }}
                        />
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    id="input-email"
                    label="Email Address"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ color: "action.active", mr: 1 }} />
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    id="input-password"
                    label="Set Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    id="input-password2"
                    label="Confirm Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={error}
                    helperText={error ? "Passwords don't match" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ color: "action.active", mr: 1 }} />
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={handleLastNameChange}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ color: "action.active", mr: 1 }} />
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    type="Number"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    InputProps={{
                      startAdornment: (
                        <PhoneAndroidIcon
                          sx={{ color: "action.active", mr: 1 }}
                        />
                      ),
                    }}
                  />
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Date of Birth
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Day"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={birthDay}
                        onChange={handleDayChange}
                        inputProps={{ min: 1, max: 31 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Month"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={birthMonth}
                        onChange={handleMonthChange}
                        inputProps={{ min: 1, max: 12 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Year"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={birthYear}
                        onChange={handleYearChange}
                        inputProps={{
                          min: 1900,
                          max: new Date().getFullYear(),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      row
                      aria-label="gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        sx={{ marginLeft: 5 }}
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        sx={{ marginLeft: 5 }}
                        value="neutral"
                        control={<Radio />}
                        label="Neutral"
                      />
                    </RadioGroup>
                  </FormControl>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "100%" }}
                    type="submit"
                  >
                    Submit
                  </Button>

                  <Button color="primary" sx={{ mt: 1 }}>
                    Back to login
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Personal information register box */}
      </form>
    </div>
  );
};

export default RegisterPage;
