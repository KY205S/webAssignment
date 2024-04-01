import React from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { Email } from "@mui/icons-material";
import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Grid } from "@mui/material";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ToggleButton, ToggleButtonGroup, Stack } from "@mui/material";
import { Paper } from "@mui/material";
import { useEffect } from "react";

function getFormattedDateRange() {
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Note: January is 0, not 1
  const currentYear = currentDate.getFullYear();

  // Assuming the week starts from the current day + 7
  const startDate = new Date(currentYear, currentMonth, currentDayOfMonth + 1);
  const endDate = new Date(currentYear, currentMonth, currentDayOfMonth + 7);

  const options = { year: "numeric", month: "short", day: "numeric" };
  const startDateFormatted = startDate.toLocaleDateString("en-US", options);
  const endDateFormatted = endDate.toLocaleDateString("en-US", options);

  return `${startDateFormatted} - ${endDateFormatted}`;
}

const Booking = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3001/bookingM")
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

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toLocaleDateString("en-US");
  });
  const times = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
  ];

  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };
  const handleSelect = (department) => {
    setSelectedDepartment(department);
  };
  const [step, setStep] = useState(1);
  //Save data

  const [otherCondition, setOther] = useState("");

  const handleNext = () => {
    setStep((prevStep) => (prevStep < 2 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleOtherText = (event) => {
    setOther(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      selectedDepartment,
      otherCondition,
      selectedTime,
    };

    // Here you can call an API or perform other actions with the formData
    console.log(formData);
    console.log("Form submitted");
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
                    Booking Page
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
                  <Stack spacing={3} alignItems="center">
                    <Typography variant="h6">Select the Department</Typography>
                  </Stack>

                  <Stack direction="column" spacing={2}>
                    <Button
                      variant={
                        selectedDepartment === "Internal Medicine"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Internal Medicine")}
                    >
                      Internal Medicine
                    </Button>
                    <Button
                      variant={
                        selectedDepartment === "Urology"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Urology")}
                    >
                      Urology
                    </Button>
                    <Button
                      variant={
                        selectedDepartment === "Digestive Disease Center"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Digestive Disease Center")}
                    >
                      Digestive Disease Center
                    </Button>

                    <Button
                      variant={
                        selectedDepartment === "Pediatrics"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Pediatrics")}
                    >
                      Pediatrics
                    </Button>

                    <Button
                      variant={
                        selectedDepartment === "Eye Clinic"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Eye Clinic")}
                    >
                      Eye Clinic
                    </Button>

                    <Button
                      variant={
                        selectedDepartment === "Neurosurgery"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Neurosurgery")}
                    >
                      Neurosurgery
                    </Button>

                    <Button
                      variant={
                        selectedDepartment === "Dermatology"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleSelect("Dermatology")}
                    >
                      Dermatology{" "}
                    </Button>

                    <Button
                      variant={
                        selectedDepartment === "Sports Medicine and Orthopedics"
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() =>
                        handleSelect("Sports Medicine and Orthopedics")
                      }
                    >
                      Sports Medicine and Orthopedics{" "}
                    </Button>
                  </Stack>
                  <TextField
                    fullWidth
                    id="firstName"
                    label="Describe Your conditions"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={otherCondition}
                    onChange={handleOtherText}
                    sx={{
                      width: "80%",
                      boxSizing: 4,
                      marginTop: 6,
                      marginLeft: 4,
                    }}
                  />

                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "60%" }}
                  >
                    Next
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
        <Box>
          {step === 2 && (
            <Box
              marginLeft={35}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                p: 2,
              }}
            >
              <Card sx={{ maxWidth: 2000, minWidth: 800, width: "100%", m: 2 }}>
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
                    Personal Information
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
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                      {getFormattedDateRange()}
                    </Typography>
                    <Grid container spacing={2}>
                      {dates.map((day, index) => (
                        <Grid item xs={12} sm key={day}>
                          <Typography variant="subtitle2" gutterBottom>
                            {day}
                          </Typography>
                          {times.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time + day
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() => handleSelectTime(time + day)}
                              sx={{ margin: "4px", width: "64px" }}
                            >
                              {time}
                            </Button>
                          ))}
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 1, width: "100%" }}
                  >
                    Submit
                  </Button>

                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 0, width: "100%" }}
                  >
                    Back
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </form>
    </div>
  );
};

export default Booking;
