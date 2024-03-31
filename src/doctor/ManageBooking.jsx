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

function getFormattedDateRange2() {
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Note: January is 0, not 1
  const currentYear = currentDate.getFullYear();

  // Assuming the week starts from the current day + 7
  const startDate = new Date(currentYear, currentMonth, currentDayOfMonth + 8);
  const endDate = new Date(currentYear, currentMonth, currentDayOfMonth + 14);

  const options = { year: "numeric", month: "short", day: "numeric" };
  const startDateFormatted = startDate.toLocaleDateString("en-US", options);
  const endDateFormatted = endDate.toLocaleDateString("en-US", options);

  return `${startDateFormatted} - ${endDateFormatted}`;
}

const ManageBooking = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toLocaleDateString("en-US");
  });

  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 8); // Start from 8 days later, which is the same day next week
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
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleSelectTime = (time) => {
    setSelectedTimes((prevState) => {
      if (prevState.includes(time)) {
        return prevState.filter((value) => value !== time);
      } else {
        return [...prevState, time];
      }
    });
  };
  const handleSelect = (department) => {
    setSelectedDepartment(department);
  };
  const [step, setStep] = useState(1);
  //Save data

  const [otherCondition, setOther] = useState("");

  const handleNext = () => {
    setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep));
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
      selectedTimes, // Add this line
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
                                selectedTimes.includes(time + day)
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
                    sx={{ mt: 1, width: "50%" }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "50%" }}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 0, width: "50%" }}
                  >
                    Back
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        <Box>
          {step === 3 && (
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
                    Manage Booking
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
                      {getFormattedDateRange2()}
                    </Typography>
                    <Grid container spacing={2}>
                      {nextDates.map((day, index) => (
                        <Grid item xs={12} sm key={day}>
                          <Typography variant="subtitle2" gutterBottom>
                            {day}
                          </Typography>
                          {times.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTimes.includes(time + day)
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
                    sx={{ mt: 1, width: "50%" }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "50%" }}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 0, width: "50%" }}
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

export default ManageBooking;