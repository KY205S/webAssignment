import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import AuthService from "../components/AuthService";

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAppointmentNumber, setCurrentAppointmentNumber] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setIsLoading(true);
    AuthService.makeAuthRequest("http://10.14.150.220:8000/doctorappointmentlist", {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const getStatusStyles = (status) => {
    const statusColors = {
      "pending confirmation": "#FFD700", // gold
      accepted: "#008000", // green
      refused: "#FF0000", // red
      cancelled: "#FF0000", // red
      "currently consulting": "#0000FF", // blue
      completed: "#A9A9A9", // dark grey
    };
    return { color: statusColors[status.toLowerCase()] || "inherit" };
  };

  const handleOpenDialog = (appointmentNumber, status) => {
    setCurrentAppointmentNumber(appointmentNumber);
    setCurrentStatus(status);
    setReason("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleStatusChange = (appointmentNumber, newStatus) => {
    AuthService.makeAuthRequest(`http://10.14.150.220:8000/doctorappointmentlist/${appointmentNumber}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        advice: reason || "No reason provided",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((updatedAppointment) => {
        setAppointments((currentAppointments) =>
          currentAppointments.map((appointment) =>
            appointment.appointment_number === appointmentNumber
              ? { ...appointment, status: newStatus, advice: reason }
              : appointment
          )
        );
      })
      .catch((error) => {
        console.error("Error updating appointment status:", error);
      });
  };

  const handleDialogSubmit = () => {
    handleStatusChange(currentAppointmentNumber, currentStatus);
    handleCloseDialog();
  };

  const renderStatusButtons = (status, appointmentNumber) => {
    switch (status.toLowerCase()) {
      case "pending confirmation":
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(appointmentNumber, "Accepted")}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleOpenDialog(appointmentNumber, "Refused")}
              sx={{ ml: 1 }}
            >
              Refuse
            </Button>
          </>
        );
      case "accepted":
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(appointmentNumber, "Currently consulting")}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleOpenDialog(appointmentNumber, "Cancelled")}
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          </>
        );
      case "currently consulting":
        return (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleStatusChange(appointmentNumber, "Completed")}
          >
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  const renderReasonIcon = (status, advice) => {
    if (status.toLowerCase() === "refused" || status.toLowerCase() === "cancelled") {
      return (
        <Tooltip title={`Advice: ${advice}`} arrow>
          <IconButton size="small" color="error">
            <ErrorOutline />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Box flex={4} p={2}>
      <Card>
        <Typography variant="h5" sx={{ m: 2 }}>
          Appointment List
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="appointment table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Appointment Number</TableCell>
                <TableCell align="center">Patient Name</TableCell>
                <TableCell align="center">Consultation Time</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.appointment_number}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{appointment.appointment_number}</TableCell>
                  <TableCell align="center">{appointment.patient_name}</TableCell>
                  <TableCell align="center">{appointment.time}</TableCell>
                  <TableCell align="center">{appointment.location}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={appointment.description} arrow>
                      <Typography
                        sx={{
                          maxWidth: "200px",
                          display: "-webkit-box",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {appointment.description}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" style={getStatusStyles(appointment.status)}>
                    {appointment.status}
                    {renderReasonIcon(appointment.status, appointment.advice)}
                  </TableCell>
                  <TableCell align="center">
                    {renderStatusButtons(appointment.status, appointment.appointment_number)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && <Typography sx={{ m: 2 }}>Loading...</Typography>}
          {error && (
            <Typography sx={{ m: 2 }} color="error">
              {error}
            </Typography>
          )}
        </TableContainer>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Provide a Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for this action:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={reason}
            onChange={handleReasonChange}
            sx={{ width: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentListPage;
