import React from "react";

import { Box, Card, CardContent, Button, Typography } from "@mui/material";

import { useState } from "react";
import { Grid } from "@mui/material";
import axios from "axios";

import { Paper } from "@mui/material";
import AuthService from "../components/AuthService";
import group13Logo from '../components/Group13-logo.jpg';

function getFormattedDateRange() {
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Note: January is 0, not 1
  const currentYear = currentDate.getFullYear();

  // Assuming the week starts from the current day + 7
  const startDate = new Date(currentYear, currentMonth, currentDayOfMonth + 1);
  const endDate = new Date(currentYear, currentMonth, currentDayOfMonth + 7);

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
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

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const startDateFormatted = startDate.toLocaleDateString("en-US", options);
  const endDateFormatted = endDate.toLocaleDateString("en-US", options);

  return `${startDateFormatted} - ${endDateFormatted}`;
}

const ManageBooking = () => {
  const dates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 1);
  return date.toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric' });
});

const nextDates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 8); // Start from 8 days later, which is the same day next week
  return date.toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  const handleSelectTime = (time, day) => {
    const selectedDateTime = { date: day, time: time };
    // Check if the selectedDateTime is already in the selectedTimes array
    const isSelected = selectedTimes.some(
      (selected) => selected.date === day && selected.time === time
    );

    if (isSelected) {
      // If already selected, remove it from the array
      setSelectedTimes(
        selectedTimes.filter(
          (selected) => !(selected.date === day && selected.time === time)
        )
      );
    } else {
      // Otherwise, add it to the array
      setSelectedTimes([...selectedTimes, selectedDateTime]);
    }
  };

  const [step, setStep] = useState(1);
  //Save data

  const handleNext = () => {
    setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Transform selectedTimes into an object with dates as keys and times as values
    const groupedByDate = selectedTimes.reduce((acc, currentTime) => {
      // Destructure date and time from the current item
      const { date, time } = currentTime;

      // If the date doesn't exist in the accumulator, initialize it with an empty array
      if (!acc[date]) {
        acc[date] = [];
      }

      // Append the current time to the array for the current date
      acc[date].push(time);
      return acc;
    }, {});

    // Now transform this object into an array of objects with date and times properties
    const formattedSelectedTimes = Object.entries(groupedByDate).map(
      ([date, times]) => ({
        date: date.split('/').reverse().join('-'),
        times,
      })
    );

    const formData = {
      // This now represents your data as an array of objects with date and times properties
      selectedTimes: formattedSelectedTimes,
    };

    AuthService.makeAuthRequest("http://10.14.150.155:8000/schedule/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
})
.then(async (response) => {
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  const responseData = await response.json();
  console.log(responseData);
  alert("You have successfully registered");

  // 检查响应数据中特定字段，并在发现无效字段时弹出警告
  if (responseData.someField === "Invalid") {
    alert("Invalid data detected!");
  }
})
.catch((error) => {
  console.error("Error posting data:", error);
  alert("An error occurred while submitting your registration.");
});

console.log("Transformed formData", formData);
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
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
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
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
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
                                selectedTimes.some(
                                  (selected) =>
                                    selected.time === time &&
                                    selected.date === day
                                )
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() => handleSelectTime(time, day)}
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
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
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
                                selectedTimes.some(
                                  (selected) =>
                                    selected.time === time &&
                                    selected.date === day
                                )
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() => handleSelectTime(time, day)}
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
