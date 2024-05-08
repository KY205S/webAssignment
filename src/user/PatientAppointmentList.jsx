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
import axios from "axios";

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3001/patientappointmentslist")
      .then((response) => {
        setAppointments(response.data);
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

  const handleDialogOpen = (appointmentId, newStatus) => {
    setCurrentAppointmentId(appointmentId);
    setCurrentStatus(newStatus);
    setReason("");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    axios
      .patch(`http://localhost:3001/patientappointmentslist/${currentAppointmentId}`, {
        status: currentStatus,
        reason: reason,
      })
      .then(() => {
        setAppointments((currentAppointments) =>
          currentAppointments.map((appointment) =>
            appointment.id === currentAppointmentId
              ? { ...appointment, status: currentStatus, reason: reason }
              : appointment
          )
        );
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error updating appointment status:", error);
      });
  };

  const renderStatusButtons = (status, id) => {
    switch (status.toLowerCase()) {
      case "pending confirmation":
      case "accepted":
        return (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDialogOpen(id, "Cancelled")}
          >
            Cancel
          </Button>
        );
      default:
        return null;
    }
  };

  const renderReasonIcon = (status, reason) => {
    if (status.toLowerCase() === "refused" || status.toLowerCase() === "cancelled") {
      return (
        <Tooltip title={`Reason: ${reason}`} arrow>
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
                <TableCell align="center">Appointed Doctor</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{appointment.number}</TableCell>
                  <TableCell align="center">{appointment.patientName}</TableCell>
                  <TableCell align="center">{appointment.time}</TableCell>
                  <TableCell align="center">{appointment.doctor}</TableCell>
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
                    {renderReasonIcon(appointment.status, appointment.reason)}
                  </TableCell>
                  <TableCell align="center">
                    {renderStatusButtons(appointment.status, appointment.id)}
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

      {/* Dialog for inputting the reason */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Provide a Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the appointment status to `{currentStatus}`? Please provide a reason.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ width: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentListPage;
