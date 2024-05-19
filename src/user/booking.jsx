import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Grid, Stack, Paper } from "@mui/material";
import AuthService from "../components/AuthService";
import { useNavigate } from "react-router-dom";
import group13Logo from '../components/Group13-logo.jpg';

const Booking = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1);
  const [otherCondition, setOther] = useState("");
  const navigate = useNavigate();

  // 选择预约时间
  const handleSelectTime = (date, time) => {
    setSelectedTime({ date, time });
  };

  // 选择科室
  const handleSelect = (department) => {
    setSelectedDepartment(department);
  };

  // 点击 Next 按钮
  const handleNext = () => {
    if (!selectedDepartment) {
      alert("Please select a department first.");
      return;
    }

    setIsLoading(true);
    // 使用指定科室名称请求可用时间段
    const url = `http://10.14.150.66:8000/available-times/${selectedDepartment.toLowerCase()}/`;

    AuthService.makeAuthRequest(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // 将数据按日期归类为一个对象
        const organizedData = data.reduce((acc, { date, time }) => {
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(time);
          return acc;
        }, {});

        setAppointments(organizedData);
        setStep(2);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 返回上一步
  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  // 获取用户输入的其他症状描述
  const handleOtherText = (event) => {
    setOther(event.target.value);
  };


  // 处理表单提交
  const handleSubmit = (event) => {
    event.preventDefault();

    // 确保选择了时间和科室
    if (!selectedTime || !selectedDepartment) {
      alert("Please select a department and a time slot.");
      return;
    }

    const formData = {
      department: selectedDepartment.toLowerCase(),
      date: selectedTime.date,
      time: selectedTime.time.slice(0, 5), // 截取至分钟
      description: otherCondition,
    };

    // 使用 AuthService 发起 POST 请求
    const url = "http://10.14.150.66:8000/make-appointment/";

    AuthService.makeAuthRequest(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit booking.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking submitted:", data);
        alert("Booking successfully submitted!");
        navigate('/user');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // 判断特定时间是否被选择
  const isTimeSelected = (date, time) => {
    return (
      selectedTime && selectedTime.date === date && selectedTime.time === time
    );
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
                  <Stack spacing={3} alignItems="center">
                    <Typography variant="h6">Select the Department</Typography>
                  </Stack>

                  <Stack direction="column" spacing={2}>
                    {[
                      "Internal",
                      "Urology",
                      "Digestive",
                      "Pediatrics",
                      "Eye",
                      "Neurosurgery",
                      "Dermatology",
                      "Orthopedics",
                    ].map((department) => (
                      <Button
                        key={department}
                        variant={
                          selectedDepartment === department
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => handleSelect(department)}
                      >
                        {department}
                      </Button>
                    ))}
                  </Stack>

                  <TextField
                    fullWidth
                    id="condition"
                    label="Describe Your conditions"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={otherCondition}
                    onChange={handleOtherText}
                    sx={{
                      width: "80%",
                      marginTop: 6,
                      marginLeft: 4,
                    }}
                  />

                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "60%" }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Next"}
                  </Button>

                  <Button color="primary" sx={{ mt: 1 }}>
                    Back to login
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

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
                  Available Booking Time
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
                    Select Your Preferred Date and Time
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(appointments).map(([date, times]) => (
                      <Grid item xs={12} sm={2} key={date}>
                        <Typography variant="h6">{date}</Typography>
                        {times.map((time) => (
                          <Button
                            key={time}
                            variant={
                              isTimeSelected(date, time)
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => handleSelectTime(date, time)}
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
      </form>
    </div>
  );
};

export default Booking;
