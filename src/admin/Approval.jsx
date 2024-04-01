import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import { Margin } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import App from "../App";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const cellStyle = {
  textAlign: "left", // Adjust text alignment as needed
  padding: "10px", // Adjust padding as needed
  // Increase font size
  // Add any other style properties to align header and value
};

const Approval = () => {
  const navigate = useNavigate();

  const handleApprove = (userId) => {
    // Approval logic here
  };

  const handleDeny = (userId) => {
    // Deny logic here
  };

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3001/approval")
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

  return (
    <Box flex={9} p={2}>
      <Card sx={{ marginLeft: 5 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">User ID</TableCell>

                <TableCell align="left">Identity</TableCell>
                <TableCell align="center">E-mail</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.userID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.userID}
                  </TableCell>
                  <TableCell align="right">{user.identity}</TableCell>

                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.lastName}</TableCell>
                  <TableCell align="right">{user.firstName}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="success">
                      Approve
                    </Button>
                    <Button variant="contained" color="error" sx={{ ml: 1 }}>
                      Deny
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontSize: "1.1rem",
          px: 3,
          py: 1,
          marginLeft: 50,
          marginTop: 10,
        }} // Increase padding and font size
        onClick={() => navigate("/admin")}
      >
        Back
      </Button>
    </Box>
  );
};

export default Approval;
