import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import AuthService from "../components/AuthService";
import { baseUrl } from '../components/Ipconfig';
import { Typography } from '@mui/material';

const Approval = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    AuthService.makeAuthRequest(`http://10.14.149.222:8000/approval`, {
      method: 'GET'
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Get data:", data);
      setUsers(data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log("Error:", error);
      setError(error.message);
      setIsLoading(false);
    });
  }, []);


  const handleApprovalChange = (id, status) => {
    const approvalValue = status === "Approved" ? 1 : 0; // Assuming '1' for approved and '0' for declined
    const postData = {
      id: id,
      approved: approvalValue,
    };

    // Log the postData to the console before sending it
    console.log("Posting to backend:", postData);

    // Send the data to the backend
    AuthService.makeAuthRequest(`http://10.14.149.222:8000/confirm-registration/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error posting approval status");
      }
      return response.json();
    })
    .then((response) => {
      console.log("Response from backend:", response);
      // Update the UI by setting the user's approvalState
      setUsers(users.map(user => {
        if (user.id === id) {
          return { ...user, status: status };
        }
        return user;
      }));
    })
    .catch((error) => {
      console.error("Error posting approval status:", error);
    });
  };


  const handleApprove = (id) => {
    const confirmApproval = window.confirm(
      "Are you sure to approve the application?"
    );
    if (confirmApproval) {
      handleApprovalChange(id, "Approved");
    }
  };

  const handleDecline = (id) => {
    const confirmDecline = window.confirm(
      "Are you sure to decline the application?"
    );
    if (confirmDecline) {
      handleApprovalChange(id, "Declined");
    }
  };

  return (
  <Box flex={9} p={2} sx={{ position: 'relative' }}>
    <Typography variant="h4" sx={{ marginBottom: 2, marginLeft: 5 }}>
      Registration Approval
    </Typography>
    <Card sx={{ margin: 5 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">User ID</TableCell>
              <TableCell align="center">Identity</TableCell>
              <TableCell align="center">E-mail</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">First Name</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {users.length > 0 ? (
    users.map((user) => (
      <TableRow
        key={user.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row" align="center">
          {user.id}
        </TableCell>
        <TableCell align="center">{user.identity}</TableCell>
        <TableCell align="center">{user.email}</TableCell>
        <TableCell align="center">{user.lastName}</TableCell>
        <TableCell align="center">{user.firstName}</TableCell>
        <TableCell align="center">
          {user.status === "Approved" ? (
            <span>Approved</span>
          ) : user.status === "Declined" ? (
            <span>Declined</span>
          ) : (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(user.id)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDecline(user.id)}
                sx={{ ml: 1 }}
              >
                Decline
              </Button>
            </>
          )}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">
        All registration applications have been processed.
      </TableCell>
    </TableRow>
  )}
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
        position: 'absolute',
        bottom: 0,
        right: 80,
      }}
      onClick={() => navigate("/ConsultService")}
    >
      Back
    </Button>
  </Box>
);

};

export default Approval;
