import React from "react";
import {
  Box, Card, CardContent, Grid, Button, Typography, TextField, Stack,
  FormControl, FormLabel, Radio, RadioGroup, FormControlLabel,
  IconButton, InputAdornment
} from '@mui/material';
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { useState, useEffect } from "react";
import { Email } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AuthService from "../components/AuthService";
import group13Logo from '../components/Group13-logo.jpg';

const dates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 1);
  return date.toLocaleDateString("en-US");
});
const RegisterDoctor = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identityNumber, setIdentityNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);


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

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const handleSelect = (department) => {
    setSelectedDepartment(department);
  };

  const [description, setDescription] = useState("");

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const [extraInformation, setExtraInformation] = useState("");

  const handleExtraInformation = (event) => {
    setExtraInformation(event.target.value);
  };

  const handleNext = () => {
    setStep((prevStep) => (prevStep < 2 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      identityNumber,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      gender,
      selectedDepartment,
      description,
      extraInformation,
    };

    // const allFieldsFilled = Object.values(formData).every(
    //   (field) => field !== ""
    // );

    // if (!allFieldsFilled) {
    //   alert("You have to fill up all register boxes");
    //   return;
    // }

    // axios
    //   .post("http://10.14.149.222:8000/doctor/register/", formData)
       AuthService.makeAuthRequest("http://10.14.149.222:8000/doctor/register/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
})
      .then((response) => {
        console.log(response.data);
        console.log(response);

        if (response.status === 201) {
          // Status code 201 means creation was successful
          alert("You have successfully registered");
          navigate("/ConsultService"); // Make sure navigate is correctly imported from your routing library
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
          alert(
            error.response.data.message ||
              "An error occurred during registration."
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request);
          alert("The server did not respond.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message);
          //alert("An error occurred: " + error.message);
        }
      });
  };


  const departmentStructure = [
  {
    category: "Internal Medicine",
    subdepartments: ["Cardiology", "Gastroenterology", "Endocrinology", "Nephrology"]
  },
  {
    category: "Surgery",
    subdepartments: ["General Surgery", "Cardiac Surgery", "Plastic Surgery", "Orthopedic Surgery"]
  },
  {
    category: "Maternal and Child Health",
    subdepartments: ["Obstetrics", "Gynecology", "Neonatology", "Pediatric Internal Medicine", "Pediatric Neurology", "Pediatric Oncology"]
  },
  {
    category: "Ophthalmology and Otorhinolaryngology",
    subdepartments: ["Eye", "Retina", "Cataract and Refractive Surgery", "Ocular Trauma and Orbit Surgery", "Otology", "Rhinology", "Laryngology"]
  },
  {
    category: "Mental Health",
    subdepartments: ["Adult Psychiatry", "Child and Adolescent Psychiatry", "Geriatric Psychiatry", "Clinical Psychology", "Psychotherapy", "Rehabilitation Psychology"]
  }
];

const handleSelectDepartment = (department) => {
  setSelectedDepartment(department);
};

const renderDepartments = () => {
    return departmentStructure.map((department) => (
      <div key={department.category}>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{department.category}</Typography>
        <Grid container spacing={2}>
          {department.subdepartments.map((subdepartment) => (
            <Grid item xs={12} sm={6} md={3} key={subdepartment}>
              <Button
                fullWidth
                variant={selectedDepartment === subdepartment ? "contained" : "outlined"}
                onClick={() => handleSelect(subdepartment)}
              >
                {subdepartment}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
    ));
  };


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
              <Card sx={{ maxWidth: 600, width: "100%", m: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
                  Register Doctor
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
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "60%" }}
                  >
                    Next
                  </Button>
                  {/*<Button color="primary" sx={{ mt: 1 }}>*/}
                  {/*  Back to login*/}
                  {/*</Button>*/}
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
        <Box>
          {step === 2 && (
             <Box sx={{
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              p: 2,
              marginLeft: 0, marginRight: 2,
              marginTop: -3,
              marginBottom: -6
            }}>
              <Card sx={{ maxWidth: "140%", width: "100%", m: 2 }}>
                <CardContent sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "left",
                }}>
                  <Typography variant="h4" align="center">
                    Assign Department
                  </Typography>
                  {renderDepartments()}
                  <TextField
                    fullWidth
                    id="doctorDescription"
                    label="Doctor Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    minRows={4}
                    sx={{ marginTop: 2, width: "100%" }}
                  />
                  <TextField
                    fullWidth
                    id="extraInformation"
                    label="Extra Information"
                    variant="outlined"
                    value={extraInformation}
                    onChange={(e) => setExtraInformation(e.target.value)}
                    multiline
                    minRows={4}
                    sx={{ width: "100%" }}
                  />
                  <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1, // 间距
  }}
>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "50%" }}
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => setStep(1)}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 0, width: "50%" }}
                  >
                    Back
                  </Button>
                    </Box>
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

export default RegisterDoctor;
