import React from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Stack,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import MyContext from "./Context1";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Email } from "@mui/icons-material";
import AuthService from "./AuthService";
import group13Logo from '../components/Group13-logo.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    // setIsLoggedIn(false);
  }, []);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3001/login")
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
  const handleLogin = () => {
    // Simulate server-side data fetching
    new Promise((resolve, reject) => {
      // Simulate a delay of 1 second
      setTimeout(() => {
        // Check if the username and password are valid
        if (email === "yang" && password === "abc") {
          // Simulate a successful login response
          console.log("Login successful:", email);
          resolve({
            status: 200,
            data: {
              user: {
                username: email,
              },
            },
          });
          setIsLoggedIn(true);
          navigate("/user");
        } else {
          console.log(email, password);
          // Simulate a failed login response
          resolve({
            status: 401,
            message: "Invalid username or password",
          });
        }
      }, 1000);
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Login successful:", response.data.user);
          // Here you can handle the successful login, e.g. redirect the user to another page
        } else {
          console.log("Login failed:", response.message);
          // Here you can handle the failed login, e.g. show an error message
        }
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        // Here you can handle any errors that occurred during the login
      });

    const formData = {
      email: email,
      password: password,
    };

    // axios
    //   .post("http://10.14.150.90:8000/login/", formData)
    //   .then((response) => {
    //     console.log(response.data);
    //     alert("You have successfully registered");

    //     // Check the response data for specific fields and alert if any are invalid (0)
    //   })
    //   .catch((error) => {
    //     console.error("Error posting data:", error);
    //     alert("An error occurred while submitting your registration.");
    //   });

    axios
      .post("http://10.14.149.222:8000/login/", formData)
      .then((response) => {
        console.log(response.data);
        // alert("You have successfully registered");
        // Check the response status and data for user roles to navigate accordingly
        if (response.status === 200 ) {
          AuthService.setToken(response.data.access_token); // JWT
          //alert("You have successfully logged in");

          const role = response.data.role; // Assuming role is directly available in response.data
          setIsLoggedIn(true);

          if (role === "patient") {
            setIsLoggedIn(true);

            navigate("/user");
          } else if (role === "doctor") {
            navigate("/doctor");
          } else if (role === "admin") {
            navigate("/admin");
          } else {
            alert("Your role is undefined or not recognized.");
          }

          setIsLoggedIn(true); // Assuming setIsLoggedIn updates the state that tracks login status
        }
      })
      .catch((error) => {
        if (error.response) {
          // If the error response has specific messages
          if (error.response.data.message.includes("duplicate email")) {
            alert("Duplicate email. Please use a different email.");
          } else if (
            error.response.data.message.includes("invalid identity number")
          ) {
            alert("Invalid identity number. Please check your input.");
          } else {
            // For other errors not specifically handled above
            alert(
              error.response.data.message || "An error occurred during login."
            );
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          alert("The server did not respond.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          alert("An error occurred: " + error.message);
        }
      });

    // another example
    // axios
    //   .post("http://10.14.150.90:8000/patient/login/", formData)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log(response.data);
    //       console.log(response.data.role);

    //       // Here you can handle the successful login, e.g. redirect the user to another page
    //     } else {
    //       console.log("Login failed:", response.message);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error posting data:", error);
    //   });
  };

  return (
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
      <Card sx={{ maxWidth: 400, width: "100%", m: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            G13 Medical
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
            id="input-emial"
            label="Email Address"
            variant="outlined"
            value={email} // Add this line
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <Email sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <TextField
            fullWidth
            id="input-password"
            label="Password"
            type="password"
            variant="outlined"
            value={password} // Add this line
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <LockIcon sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
          />
          <Stack direction={"row"} sx={{ marginLeft: -6 }} spacing={10}>
            <FormControlLabel
              control={<Checkbox name="remember" color="primary" />}
              label="Remember me"
              sx={{ alignSelf: "flex-start" }}
            />
            <FormControlLabel
              control={<Checkbox name="remember" color="primary" />}
              label="Doctor"
              sx={{ alignSelf: "flex-start" }}
            />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, width: "100%" }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>

          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 0, width: "100%" }}
            onClick={() => navigate("/register")}
          >
            REGISTER
          </Button>

          <Button color="primary" sx={{ mt: 1 }}>
            Forgot password?
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
