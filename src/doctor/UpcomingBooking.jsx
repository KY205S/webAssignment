import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const UpcomingBooking = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://10.14.149.222:8000/upcoming")
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

  const handleApprovalChange = (id, status) => {
    const approvalValue = status === "Approved" ? 1 : 0; // Assuming '1' for approved and '0' for declined
    const postData = {
      id: id,
      approved: approvalValue,
    };

    // Log the postData to the console before sending it
    console.log("Posting to backend:", postData);

    // Send the data to the backend
    axios
      .post("http://10.14.149.222:8000/approval", postData)
      .then((response) => {
        console.log("Response from backend:", response.data);

        // Update the UI by setting the user's approvalState
        setUsers(
          users.map((user) => {
            if (user.id === id) {
              return { ...user, status: status };
            }
            return user;
          })
        );
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
    <Box flex={11} p={3}>
      <Card sx={{ marginLeft: 5 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>

                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Time</TableCell>

                <TableCell align="center">Phone Number</TableCell>
                <TableCell align="center">Symptom</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.client}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.client}
                  </TableCell>
                  <TableCell align="right">{user.date}</TableCell>

                  <TableCell align="right">{user.time}</TableCell>
                  <TableCell align="right">{user.phone}</TableCell>
                  <TableCell align="right" style={{ maxWidth: "300px" }}>
                    <Tooltip title={user.symptom}>
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.symptom}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
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

export default UpcomingBooking;
