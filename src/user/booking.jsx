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
    const url = `http://10.14.149.222:8000/available-times/${selectedDepartment.toLowerCase()}/`;

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
    const url = "http://10.14.149.222:8000/make-appointment/";

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
    subdepartments: ["Obstetrics", "Gynecology"]
  },
  {
    category: "",
    subdepartments: ["Neonatology", "Pediatric Internal Medicine", "Pediatric Neurology", "Pediatric Oncology"]
  },
  {
    category: "Ophthalmology and Otorhinolaryngology",
    subdepartments: ["Eye", "Retina", "Cataract and Refractive Surgery", "Ocular Trauma and Orbit Surgery"]
  },
  {
    category: "",
    subdepartments: ["Otology", "Rhinology", "Laryngology"]
  },
  {
    category: "Mental Health",
    subdepartments: ["Adult Psychiatry", "Child and Adolescent Psychiatry", "Geriatric Psychiatry"]
  },
  {
    category: "",
    subdepartments: ["Clinical Psychology", "Psychotherapy", "Rehabilitation Psychology"]
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
              onClick={() => handleSelectDepartment(subdepartment)}
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
      {step === 1 && (
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 2
        }}>
          <Card sx={{ width: "100%", maxWidth: "none" }}>
            <CardContent>
              <Typography variant="h4" component="h1" sx={{ textAlign: "center", marginBottom: 2 }}>
                Select the Department
              </Typography>
              {renderDepartments()}
              {/*<Grid container spacing={2}>*/}
              {/*  {departmentStructure.map((section) => (*/}
              {/*    <React.Fragment key={section.category}>*/}
              {/*      <Grid item xs={12}>*/}
              {/*        <Typography variant="h5" sx={{ mt: 2 }}>{section.category}</Typography>*/}
              {/*      </Grid>*/}
              {/*      {section.departments.map((department) => (*/}
              {/*        <Grid item xs={12} sm={4} md={3} key={department}>*/}
              {/*          <Button*/}
              {/*            fullWidth*/}
              {/*            variant={selectedDepartment === department ? "contained" : "outlined"}*/}
              {/*            onClick={() => handleSelect(department)}*/}
              {/*            sx={{ height: "56px", height: "36px" }} // Ensures buttons are taller*/}
              {/*          >*/}
              {/*            {department}*/}
              {/*          </Button>*/}
              {/*        </Grid>*/}
              {/*      ))}*/}
              {/*    </React.Fragment>*/}
              {/*  ))}*/}
              {/*</Grid>*/}
              <TextField
                fullWidth
                label="Describe Your Conditions"
                multiline
                rows={4}
                margin="normal"
                value={otherCondition}
                onChange={(e) => setOther(e.target.value)}
                sx={{ mt: 4 }}
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!selectedDepartment || isLoading}
                  sx={{ minWidth: "150px" }}
                >
                  {isLoading ? "Loading..." : "Next >>"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 2
        }}>
          <Card sx={{ width: "100%", maxWidth: "none" }}>
            <CardContent>
              <Typography variant="h4" component="h1" sx={{ textAlign: "center", marginBottom: 2 }}>
                Select Your Preferred Date and Time
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(appointments).map(([date, times]) => (
                  <Grid item xs={12} key={date}>
                    <Typography variant="subtitle1">{date}</Typography>
                    {times.map((time) => (
                      <Button
                        key={time}
                        variant={isTimeSelected(date, time) ? "contained" : "outlined"}
                        onClick={() => handleSelectTime(date, time)}
                        sx={{ margin: "4px", minWidth: "100px" }} // Ensures buttons have uniform size
                      >
                        {time}
                      </Button>
                    ))}
                  </Grid>
                ))}
              </Grid>
              <TextField
                fullWidth
                label="Describe Your Conditions"
                multiline
                rows={4}
                variant="outlined"
                value={otherCondition}
                onChange={(e) => setOther(e.target.value)}
                sx={{ mt: 4 }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button variant="outlined" color="primary" onClick={handleBack} sx={{ minWidth: "120px" }}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!selectedTime}
                  sx={{ minWidth: "120px" }}
                >
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </form>
  </div>
);

};

export default Booking;
