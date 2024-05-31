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
import group13Logo from '../components/Group13-logo.jpg';


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
      .post("http://10.14.150.155:8000/register/", formData)
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
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
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
