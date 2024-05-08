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
      .post("http://10.14.150.220:8000/login/", formData)
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
          <img
            src={
              "data:image/png;base64,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"
            }
            alt="NHS Logo"
            style={{ maxWidth: "100px", marginTop: "20px" }}
          />
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            NHS Help
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
