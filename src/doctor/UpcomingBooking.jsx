import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Margin } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import App from "../App";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

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

const UpcomingBooking = () => {
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
    fetch("http://localhost:3001/upcoming")
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
                    <Button variant="contained" color="success">
                      Confrim
                    </Button>
                    <Button variant="contained" color="error" sx={{ ml: 1 }}>
                      Decline
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

export default UpcomingBooking;
